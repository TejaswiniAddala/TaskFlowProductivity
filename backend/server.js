const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { initDatabase, dbRun, dbGet, dbAll } = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'taskflow-super-secure-secret-key';

// Middleware
const { GoogleGenerativeAI } = require('@google/generative-ai');

app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      'http://localhost:3000', 
      'http://localhost:5173',
      process.env.FRONTEND_URL
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
app.use(express.json());

// Initialize Database
initDatabase();

// Create HTTP server & WebSocket Server
const server = http.createServer(app);
const wss = new WebSocket.Server({ noServer: true });

// Track connected WebSocket clients with user IDs
const clients = new Map();

// Authentication Middleware for Express
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token missing' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
    req.user = user;
    next();
  });
};

// WebSocket connection handling with authorization
server.on('upgrade', (request, socket, head) => {
  const url = new URL(request.url, `http://${request.headers.host}`);
  const token = url.searchParams.get('token');

  if (!token) {
    socket.write('HTTP/1.1 401 Unauthorized\r\n\r\n');
    socket.destroy();
    return;
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
      socket.destroy();
      return;
    }
    wss.handleUpgrade(request, socket, head, (ws) => {
      ws.user = decoded;
      wss.emit('connection', ws, request);
    });
  });
});

wss.on('connection', (ws) => {
  const userId = ws.user.id;
  console.log(`User connected via WebSocket: ${ws.user.name} (ID: ${userId})`);

  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId).add(ws);

  ws.on('close', () => {
    const userConnections = clients.get(userId);
    if (userConnections) {
      userConnections.delete(ws);
      if (userConnections.size === 0) {
        clients.delete(userId);
      }
    }
  });
});

// Helper: Broadcast WebSocket message to specific users
function broadcastToUsers(userIds, data) {
  userIds.forEach(userId => {
    const userConnections = clients.get(parseInt(userId));
    if (userConnections) {
      userConnections.forEach(ws => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify(data));
        }
      });
    }
  });
}

// Helper: Send live notification
async function createAndSendNotification(userId, message, type) {
  try {
    const result = await dbRun(
      'INSERT INTO notifications (user_id, message, type, read) VALUES (?, ?, ?, 0)',
      [userId, message, type]
    );
    const notification = await dbGet('SELECT * FROM notifications WHERE id = ?', [result.id]);
    broadcastToUsers([userId], { type: 'NOTIFICATION_RECEIVED', notification });
  } catch (err) {
    console.error('Failed to create/send notification:', err);
  }
}

// ==========================================
// 1. AUTHENTICATION & ONBOARDING ROUTES
// ==========================================

// Register
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password, avatar } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email and password are required.' });
  }

  try {
    const existing = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (existing) {
      return res.status(400).json({ error: 'Email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const defaultAvatar = avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name)}`;

    const result = await dbRun(
      `INSERT INTO users (name, email, password_hash, avatar, role, productivity_preferences, onboarding_completed) 
       VALUES (?, ?, ?, ?, NULL, NULL, 0)`,
      [name, email, passwordHash, defaultAvatar]
    );

    const token = jwt.sign({ id: result.id, name, email }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({
      token,
      user: {
        id: result.id,
        name,
        email,
        avatar: defaultAvatar,
        role: null,
        productivity_preferences: null,
        onboarding_completed: 0
      }
    });
  } catch (err) {
    console.error('Registration failed:', err);
    res.status(500).json({ error: 'Server error during registration.' });
  }
});

// Login
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        productivity_preferences: user.productivity_preferences,
        onboarding_completed: user.onboarding_completed
      }
    });
  } catch (err) {
    console.error('Login failed:', err);
    res.status(500).json({ error: 'Server error during login.' });
  }
});



// Update User Onboarding Preferences (Active Role Adaptive Workflow)
app.put('/api/auth/onboarding', authenticateToken, async (req, res) => {
  const { role, preferences } = req.body;
  if (!role) {
    return res.status(400).json({ error: 'Selected profile role is required for onboarding.' });
  }

  try {
    const preferencesString = JSON.stringify(preferences || {});
    await dbRun(
      'UPDATE users SET role = ?, productivity_preferences = ?, onboarding_completed = 1 WHERE id = ?',
      [role, preferencesString, req.user.id]
    );

    const updatedUser = await dbGet(
      'SELECT id, name, email, avatar, role, productivity_preferences, onboarding_completed FROM users WHERE id = ?',
      [req.user.id]
    );

    // Seed role-appropriate default checklist tasks to give a wow onboarding experience!
    const defaultTasks = {
      student: [
        { title: 'Revise notes for upcoming exams', description: 'Study coach: Summarize high-yield concepts.', priority: 'high', due: 2 },
        { title: 'Finish lab task assignments', description: 'Schedule deadline review.', priority: 'medium', due: 1 }
      ],
      employee: [
        { title: 'Draft weekly KPI presentation', description: 'Workspace: Include team milestone updates.', priority: 'high', due: 1 },
        { title: 'Conduct code quality standard audits', description: 'Focus session review.', priority: 'low', due: 3 }
      ],
      freelancer: [
        { title: 'Draft proposal estimate for client', description: 'Business: Review scope and timing bounds.', priority: 'high', due: 2 },
        { title: 'Confirm pending transaction invoices', description: 'Verify payment accounts.', priority: 'medium', due: 1 }
      ],
      startup: [
        { title: 'Design investor pitches roadmap deck', description: 'Sprint: Outline product velocity targets.', priority: 'high', due: 3 },
        { title: 'Refine launch preparation specs', description: 'Prepare beta releases.', priority: 'medium', due: 1 }
      ],
      manager: [
        { title: 'Conduct team workload reviews', description: 'Align sprint velocity with resource limits.', priority: 'high', due: 1 },
        { title: 'Schedule investor sync meetings', description: 'Discuss roadmap progress.', priority: 'medium', due: 2 }
      ],
      developer: [
        { title: 'Debug WebSocket disconnection issues', description: 'Git Coach: Fix network recovery heartbeats.', priority: 'high', due: 1 },
        { title: 'Review pull request deliverables', description: 'Approve sprint features.', priority: 'medium', due: 2 }
      ],
      creator: [
        { title: 'Storyboard viral ideas script', description: 'Content: Brainstorm title hooks and thumbnails.', priority: 'high', due: 2 },
        { title: 'Record video editing session clips', description: 'Film core workflows.', priority: 'medium', due: 1 }
      ]
    };

    const rolesKey = role.toLowerCase();
    const tasksToInsert = defaultTasks[rolesKey] || defaultTasks.student;

    for (const task of tasksToInsert) {
      const dueDate = new Date(Date.now() + task.due * 86400000).toISOString().split('T')[0];
      await dbRun(
        'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date) VALUES (?, NULL, ?, ?, ?, ?, ?)',
        [req.user.id, task.title, task.description, 'todo', task.priority, dueDate]
      );
    }

    // Trigger welcoming system notification
    await createAndSendNotification(
      req.user.id,
      `Welcome to TaskFlow, ${updatedUser.name}! Your workspace is now custom tailored as an adaptive ${role.toUpperCase()} Focus Space.`,
      'system'
    );

    res.json(updatedUser);
  } catch (err) {
    console.error('Onboarding preference save failed:', err);
    res.status(500).json({ error: 'Server error during onboarding save.' });
  }
});

// Get Current User Profile
app.get('/api/auth/me', authenticateToken, async (req, res) => {
  try {
    const user = await dbGet('SELECT id, name, email, avatar, role, productivity_preferences, onboarding_completed, created_at FROM users WHERE id = ?', [req.user.id]);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile data.' });
  }
});

// ==========================================
// 2. TASK ROUTES
// ==========================================

// Get Tasks (with optional filtering)
app.get('/api/tasks', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userTeams = await dbAll('SELECT id FROM teams WHERE members LIKE ?', [`%${userId}%`]);
    const teamIds = userTeams.map(t => t.id);

    let query = 'SELECT tasks.*, users.name as assignee_name, users.avatar as assignee_avatar FROM tasks LEFT JOIN users ON tasks.user_id = users.id WHERE (tasks.user_id = ?';
    const params = [userId];

    if (teamIds.length > 0) {
      query += ` OR tasks.team_id IN (${teamIds.map(() => '?').join(',')})`;
      params.push(...teamIds);
    }
    query += ')';

    const { status, priority, due_date, search } = req.query;
    if (status) {
      query += ' AND tasks.status = ?';
      params.push(status);
    }
    if (priority) {
      query += ' AND tasks.priority = ?';
      params.push(priority);
    }
    if (due_date) {
      query += ' AND tasks.due_date = ?';
      params.push(due_date);
    }
    if (search) {
      query += ' AND (tasks.title LIKE ? OR tasks.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY tasks.due_date ASC, tasks.created_at DESC';

    const tasks = await dbAll(query, params);
    res.json(tasks);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ error: 'Failed to retrieve tasks.' });
  }
});

// Create Task
app.post('/api/tasks', authenticateToken, async (req, res) => {
  const { title, description, status, priority, due_date, team_id, user_id } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  const assignedUser = user_id || req.user.id;
  const taskStatus = status || 'todo';
  const taskPriority = priority || 'medium';

  try {
    const result = await dbRun(
      'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)',
      [assignedUser, team_id || null, title, description || '', taskStatus, taskPriority, due_date || null]
    );

    const newTask = await dbGet(
      'SELECT tasks.*, users.name as assignee_name, users.avatar as assignee_avatar FROM tasks LEFT JOIN users ON tasks.user_id = users.id WHERE tasks.id = ?',
      [result.id]
    );

    if (assignedUser !== req.user.id) {
      await createAndSendNotification(
        assignedUser,
        `${req.user.name} assigned you a task: "${title}"`,
        'task_assignment'
      );
    }

    if (team_id) {
      const team = await dbGet('SELECT members FROM teams WHERE id = ?', [team_id]);
      if (team) {
        const memberIds = JSON.parse(team.members);
        const notificationReceivers = memberIds.filter(id => id !== req.user.id);
        broadcastToUsers(notificationReceivers, { type: 'TASK_CREATED', task: newTask });
      }
    }

    res.status(201).json(newTask);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

// Update Task
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { title, description, status, priority, due_date, team_id, user_id } = req.body;

  try {
    const existingTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    const updatedTitle = title !== undefined ? title : existingTask.title;
    const updatedDescription = description !== undefined ? description : existingTask.description;
    const updatedStatus = status !== undefined ? status : existingTask.status;
    const updatedPriority = priority !== undefined ? priority : existingTask.priority;
    const updatedDueDate = due_date !== undefined ? due_date : existingTask.due_date;
    const updatedTeamId = team_id !== undefined ? team_id : existingTask.team_id;
    const updatedUserId = user_id !== undefined ? user_id : existingTask.user_id;

    await dbRun(
      `UPDATE tasks 
       SET title = ?, description = ?, status = ?, priority = ?, due_date = ?, team_id = ?, user_id = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [updatedTitle, updatedDescription, updatedStatus, updatedPriority, updatedDueDate, updatedTeamId, updatedUserId, id]
    );

    const updatedTask = await dbGet(
      'SELECT tasks.*, users.name as assignee_name, users.avatar as assignee_avatar FROM tasks LEFT JOIN users ON tasks.user_id = users.id WHERE tasks.id = ?',
      [id]
    );

    const notifyUserIds = new Set();
    notifyUserIds.add(existingTask.user_id);
    notifyUserIds.add(updatedUserId);

    if (existingTask.team_id) {
      const team = await dbGet('SELECT members FROM teams WHERE id = ?', [existingTask.team_id]);
      if (team) {
        const members = JSON.parse(team.members);
        members.forEach(m => notifyUserIds.add(m));
      }
    }

    notifyUserIds.delete(req.user.id);
    broadcastToUsers(Array.from(notifyUserIds), { type: 'TASK_UPDATED', task: updatedTask });

    res.json(updatedTask);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

// Delete Task
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  try {
    const existingTask = await dbGet('SELECT * FROM tasks WHERE id = ?', [id]);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found.' });
    }

    await dbRun('DELETE FROM tasks WHERE id = ?', [id]);
    await dbRun('DELETE FROM comments WHERE task_id = ?', [id]);

    if (existingTask.team_id) {
      const team = await dbGet('SELECT members FROM teams WHERE id = ?', [existingTask.team_id]);
      if (team) {
        const members = JSON.parse(team.members);
        const notifyMembers = members.filter(m => m !== req.user.id);
        broadcastToUsers(notifyMembers, { type: 'TASK_DELETED', taskId: parseInt(id) });
      }
    }

    res.json({ message: 'Task deleted successfully.', taskId: parseInt(id) });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

// ==========================================
// 3. TEAM ROUTES
// ==========================================
app.get('/api/teams', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const teams = await dbAll('SELECT * FROM teams WHERE members LIKE ? OR owner_id = ?', [`%${userId}%`, userId]);

    const detailedTeams = await Promise.all(teams.map(async (team) => {
      const memberIds = JSON.parse(team.members);
      const memberPlaceholders = memberIds.map(() => '?').join(',');
      const members = await dbAll(`SELECT id, name, email, avatar FROM users WHERE id IN (${memberPlaceholders})`, memberIds);
      return {
        ...team,
        members,
        memberIds
      };
    }));

    res.json(detailedTeams);
  } catch (err) {
    console.error('Fetch teams error:', err);
    res.status(500).json({ error: 'Failed to retrieve teams.' });
  }
});

app.post('/api/teams', authenticateToken, async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Team name is required.' });

  try {
    const userId = req.user.id;
    const members = JSON.stringify([userId]);
    const result = await dbRun(
      'INSERT INTO teams (name, owner_id, members) VALUES (?, ?, ?)',
      [name, userId, members]
    );

    const team = await dbGet('SELECT * FROM teams WHERE id = ?', [result.id]);
    const creator = await dbGet('SELECT id, name, email, avatar FROM users WHERE id = ?', [userId]);

    res.status(201).json({
      ...team,
      members: [creator],
      memberIds: [userId]
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create team.' });
  }
});

app.post('/api/teams/:id/join', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const team = await dbGet('SELECT * FROM teams WHERE id = ?', [id]);
    if (!team) return res.status(404).json({ error: 'Team not found.' });

    const members = JSON.parse(team.members);
    if (members.includes(userId)) {
      return res.status(400).json({ error: 'Already a member of this team.' });
    }

    members.push(userId);
    const updatedMembers = JSON.stringify(members);

    await dbRun('UPDATE teams SET members = ? WHERE id = ?', [updatedMembers, id]);

    const joinedUser = await dbGet('SELECT name FROM users WHERE id = ?', [userId]);
    for (const memberId of members) {
      if (memberId !== userId) {
        await createAndSendNotification(
          memberId,
          `${joinedUser.name} joined your team: "${team.name}"`,
          'system'
        );
      }
    }

    res.json({ message: 'Joined team successfully!', teamId: parseInt(id) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to join team.' });
  }
});

app.post('/api/teams/:id/leave', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const team = await dbGet('SELECT * FROM teams WHERE id = ?', [id]);
    if (!team) return res.status(404).json({ error: 'Team not found.' });

    let members = JSON.parse(team.members);
    if (!members.includes(userId)) {
      return res.status(400).json({ error: 'Not a member of this team.' });
    }

    if (team.owner_id === userId) {
      return res.status(400).json({ error: 'Owner cannot leave team.' });
    }

    members = members.filter(m => m !== userId);
    const updatedMembers = JSON.stringify(members);

    await dbRun('UPDATE teams SET members = ? WHERE id = ?', [updatedMembers, id]);

    const leavingUser = await dbGet('SELECT name FROM users WHERE id = ?', [userId]);
    for (const memberId of members) {
      await createAndSendNotification(
        memberId,
        `${leavingUser.name} left the team: "${team.name}"`,
        'system'
      );
    }

    res.json({ message: 'Left team successfully!', teamId: parseInt(id) });
  } catch (err) {
    res.status(500).json({ error: 'Failed to leave team.' });
  }
});

// ==========================================
// 4. COMMENT ROUTES
// ==========================================
app.get('/api/comments/task/:taskId', authenticateToken, async (req, res) => {
  try {
    const comments = await dbAll(
      `SELECT comments.*, users.name as user_name, users.avatar as user_avatar 
       FROM comments 
       LEFT JOIN users ON comments.user_id = users.id 
       WHERE comments.task_id = ? 
       ORDER BY comments.created_at ASC`,
      [req.params.taskId]
    );
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve comments.' });
  }
});

app.post('/api/comments', authenticateToken, async (req, res) => {
  const { task_id, content } = req.body;
  if (!task_id || !content) {
    return res.status(400).json({ error: 'Task ID and content are required.' });
  }

  try {
    const result = await dbRun(
      'INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)',
      [task_id, req.user.id, content]
    );

    const comment = await dbGet(
      `SELECT comments.*, users.name as user_name, users.avatar as user_avatar 
       FROM comments 
       LEFT JOIN users ON comments.user_id = users.id 
       WHERE comments.id = ?`,
      [result.id]
    );

    const task = await dbGet('SELECT * FROM tasks WHERE id = ?', [task_id]);
    if (task) {
      const receivers = new Set();
      receivers.add(task.user_id);

      if (task.team_id) {
        const team = await dbGet('SELECT members FROM teams WHERE id = ?', [task.team_id]);
        if (team) {
          const members = JSON.parse(team.members);
          members.forEach(m => receivers.add(m));
        }
      }

      receivers.delete(req.user.id);

      for (const receiverId of receivers) {
        await createAndSendNotification(
          receiverId,
          `${req.user.name} commented on task "${task.title}": "${content.slice(0, 30)}${content.length > 30 ? '...' : ''}"`,
          'comment'
        );
      }

      broadcastToUsers(Array.from(receivers), { type: 'COMMENT_ADDED', comment });
    }

    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post comment.' });
  }
});

// ==========================================
// 5. NOTIFICATION ROUTES
// ==========================================
app.get('/api/notifications', authenticateToken, async (req, res) => {
  try {
    const notifications = await dbAll(
      'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50',
      [req.user.id]
    );
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve notifications.' });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, async (req, res) => {
  try {
    await dbRun(
      'UPDATE notifications SET read = 1 WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification.' });
  }
});

app.put('/api/notifications/read-all', authenticateToken, async (req, res) => {
  try {
    await dbRun('UPDATE notifications SET read = 1 WHERE user_id = ?', [req.user.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Failed to mark all as read.' });
  }
});

// ==========================================
// 6. POMODORO SESSION ROUTES
// ==========================================
app.post('/api/pomodoro/session', authenticateToken, async (req, res) => {
  const { task_id, duration } = req.body;
  if (!duration) return res.status(400).json({ error: 'Duration is required.' });

  try {
    const result = await dbRun(
      'INSERT INTO pomodoro_sessions (user_id, task_id, duration) VALUES (?, ?, ?)',
      [req.user.id, task_id || null, duration]
    );

    res.status(201).json({
      id: result.id,
      user_id: req.user.id,
      task_id: task_id || null,
      duration,
      completed_at: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record Pomodoro session.' });
  }
});

app.get('/api/pomodoro/stats', authenticateToken, async (req, res) => {
  try {
    const sessions = await dbAll(
      `SELECT ps.*, tasks.title as task_title 
       FROM pomodoro_sessions ps
       LEFT JOIN tasks ON ps.task_id = tasks.id 
       WHERE ps.user_id = ? 
       ORDER BY ps.completed_at DESC`,
      [req.user.id]
    );

    const totalMinutes = sessions.reduce((acc, curr) => acc + Math.round(curr.duration / 60), 0);
    res.json({
      sessions,
      totalCount: sessions.length,
      totalMinutes
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch Pomodoro analytics.' });
  }
});

// Start listening
// AI Chatbot Route
app.post('/api/ai/chat', authenticateToken, async (req, res) => {
  try {
    const { message, role, persona, contextTasks } = req.body;
    
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Gemini API key is not configured.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    let systemPrompt = `You are a highly intelligent TaskFlow Productivity AI Coach. Your persona is a ${persona} tailored for a ${role}. 
    Keep your responses extremely concise, encouraging, and actionable (maximum 2-3 sentences). 
    Do not use markdown formatting like **bold** or asterisks. `;

    if (contextTasks && contextTasks.length > 0) {
      systemPrompt += `The user currently has ${contextTasks.length} pending tasks.`;
    }

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}\nCoach:`;
    
    const result = await model.generateContent(fullPrompt);
    const responseText = result.response.text();

    res.json({ reply: responseText.trim() });
  } catch (error) {
    console.error('AI Chat Error:', error);
    res.status(500).json({ error: 'Failed to generate AI response.' });
  }
});

// Simple health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start listening
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

