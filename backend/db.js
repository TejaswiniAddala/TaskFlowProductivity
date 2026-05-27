const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'taskflow.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Failed to connect to SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database taskflow.db');
  }
});

// Helper functions wrapping sqlite3 callbacks with Promises
const dbRun = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function (err) {
      if (err) reject(err);
      else resolve({ id: this.lastID, changes: this.changes });
    });
  });
};

const dbGet = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) reject(err);
      else resolve(row);
    });
  });
};

const dbAll = (sql, params = []) => {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) reject(err);
      else resolve(rows);
    });
  });
};

// Initialize database schema
async function initDatabase() {
  try {
    // 1. Users Table (Updated with role columns for the adaptive workflows)
    await dbRun(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar TEXT,
        role TEXT DEFAULT NULL,
        productivity_preferences TEXT DEFAULT NULL, -- JSON string representation
        onboarding_completed INTEGER DEFAULT 0, -- 0 = false, 1 = true
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Gracefully run migrations: check if role column exists. If not, alter table
    try {
      const checkCol = await dbGet("SELECT role FROM users LIMIT 1").catch(() => null);
      if (checkCol === undefined || checkCol === null) {
        // Table exists but columns do not, run ALTER queries
        await dbRun("ALTER TABLE users ADD COLUMN role TEXT DEFAULT NULL");
        await dbRun("ALTER TABLE users ADD COLUMN productivity_preferences TEXT DEFAULT NULL");
        await dbRun("ALTER TABLE users ADD COLUMN onboarding_completed INTEGER DEFAULT 0");
        console.log("Database migrations for role-based onboarding completed successfully.");
      }
    } catch (colErr) {
      console.log("Onboarding columns already synchronized inside schema.");
    }

    // 2. Teams Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS teams (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        owner_id INTEGER NOT NULL,
        members TEXT NOT NULL, -- JSON string array of user IDs: "[1, 2]"
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users(id)
      )
    `);

    // 3. Tasks Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        team_id INTEGER NULL,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL CHECK(status IN ('todo', 'in_progress', 'done')),
        priority TEXT NOT NULL CHECK(priority IN ('low', 'medium', 'high')),
        due_date TEXT, -- YYYY-MM-DD
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (team_id) REFERENCES teams(id)
      )
    `);

    // 4. Comments Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 5. Notifications Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL, -- 'system', 'task_assignment', 'deadline', 'comment'
        read INTEGER DEFAULT 0, -- 0 = unread, 1 = read
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      )
    `);

    // 6. PomodoroSessions Table
    await dbRun(`
      CREATE TABLE IF NOT EXISTS pomodoro_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        task_id INTEGER NULL,
        duration INTEGER NOT NULL, -- in seconds
        completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE SET NULL
      )
    `);

    console.log('Database tables verified/created successfully.');

    // Seed database if empty
    const userCount = await dbGet('SELECT COUNT(*) as count FROM users');
    if (userCount.count === 0) {
      await seedDatabase();
    } else {
      // Check if existing seed profiles need onboarding_completed status synchronization
      const sampleSeed = await dbGet("SELECT onboarding_completed FROM users WHERE email = 'sarah@taskflow.com'");
      if (sampleSeed && sampleSeed.onboarding_completed === 0) {
        console.log('Updating existing users with preset adaptive onboarding profiles...');
        await dbRun(`
          UPDATE users 
          SET role = 'creator', 
              onboarding_completed = 1,
              productivity_preferences = '{"channelType":"YouTube & Blog","uploadFreq":"2 video drafts / week"}'
          WHERE email = 'sarah@taskflow.com'
        `);
        await dbRun(`
          UPDATE users 
          SET role = 'developer', 
              onboarding_completed = 1,
              productivity_preferences = '{"primaryStack":"React.js, Node.js","mainIde":"VS Code"}'
          WHERE email = 'alex@taskflow.com'
        `);
        await dbRun(`
          UPDATE users 
          SET role = 'student', 
              onboarding_completed = 1,
              productivity_preferences = '{"activeSemester":"Semester 4","subjects":"Advanced Algorithms"}'
          WHERE email = 'elena@taskflow.com'
        `);
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

// Function to seed demo data with adaptive onboarding profiles completed
async function seedDatabase() {
  console.log('Seeding demo database with adaptive profiles...');
  try {
    const salt = await bcrypt.genSalt(10);
    const demoPasswordHash = await bcrypt.hash('password123', salt);

    // Sarah Jenkins = Creator Focus Space
    const user1 = await dbRun(
      `INSERT INTO users (name, email, password_hash, avatar, role, productivity_preferences, onboarding_completed) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'Sarah Jenkins', 
        'sarah@taskflow.com', 
        demoPasswordHash, 
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop',
        'creator',
        JSON.stringify({ channelType: 'YouTube & Blog', uploadFreq: '2 video drafts / week', currentProject: 'TaskFlow Full Walkthrough' }),
        1
      ]
    );
    
    // Alex Rivera = Developer Focus Space
    const user2 = await dbRun(
      `INSERT INTO users (name, email, password_hash, avatar, role, productivity_preferences, onboarding_completed) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'Alex Rivera', 
        'alex@taskflow.com', 
        demoPasswordHash, 
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
        'developer',
        JSON.stringify({ primaryStack: 'React.js, Node.js, WebSockets, SQLite', gitHubSync: 'alex-dev-flow', mainIde: 'VS Code' }),
        1
      ]
    );
    
    // Elena Rostova = Student Focus Space
    const user3 = await dbRun(
      `INSERT INTO users (name, email, password_hash, avatar, role, productivity_preferences, onboarding_completed) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        'Elena Rostova', 
        'elena@taskflow.com', 
        demoPasswordHash, 
        'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop',
        'student',
        JSON.stringify({ activeSemester: 'Semester 4', subjects: 'Advanced Algorithms, Operating Systems, Database Management', nextExamDate: '2026-06-15' }),
        1
      ]
    );

    // 2. Seed Team
    const membersList = JSON.stringify([user1.id, user2.id, user3.id]);
    const team = await dbRun(
      'INSERT INTO teams (name, owner_id, members) VALUES (?, ?, ?)',
      ['Product Launch Team', user1.id, membersList]
    );

    // 3. Seed Tasks
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Sarah's Creator Tasks
    await dbRun(
      'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user1.id, team.id, 'Draft social promo script', 'Draft pricing, onboarding benefits copy for Instagram video.', 'in_progress', 'high', today]
    );
    await dbRun(
      'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user1.id, team.id, 'Edit walkthrough intro scene', 'Render dynamic glassmorphism showcase clips.', 'done', 'medium', yesterday]
    );
    await dbRun(
      'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user1.id, team.id, 'Schedule Creator content launch', 'Synchronize calendar posts for video launch.', 'todo', 'high', tomorrow]
    );

    // Alex's Developer Tasks
    await dbRun(
      'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user2.id, team.id, 'Implement JWT authentication backend', 'Secure authentication routes and manage tokens.', 'done', 'high', yesterday]
    );
    await dbRun(
      'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user2.id, team.id, 'Set up adaptive database schema', 'Migrate SQLite users schema to hold onboarding role flags.', 'done', 'medium', yesterday]
    );

    // Elena's Student Tasks
    await dbRun(
      'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user3.id, team.id, 'Prepare exam revision index notes', 'Summarize algorithms revision points.', 'todo', 'low', tomorrow]
    );
    await dbRun(
      'INSERT INTO tasks (user_id, team_id, title, description, status, priority, due_date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [user3.id, team.id, 'Compile final OS lab report', 'Complete process scheduling lab analysis sheet.', 'in_progress', 'medium', today]
    );

    // 4. Seed Comments
    const taskForComment = await dbGet('SELECT id FROM tasks WHERE title LIKE ?', ['%script%']);
    if (taskForComment) {
      await dbRun(
        'INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)',
        [taskForComment.id, user2.id, 'Hey Sarah, the intro sequence looks stellar! Let me know when scripts are finished.']
      );
      await dbRun(
        'INSERT INTO comments (task_id, user_id, content) VALUES (?, ?, ?)',
        [taskForComment.id, user1.id, 'Revising them now, Alex! Adding interactive code visuals for devs.']
      );
    }

    // 5. Seed Notifications
    await dbRun(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [user1.id, 'Alex Rivera assigned you to a new task: "Schedule Creator content launch".', 'task_assignment']
    );
    await dbRun(
      'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
      [user1.id, 'Your content task "Draft social promo script" is due today!', 'deadline']
    );

    // 6. Seed Pomodoro Sessions
    await dbRun(
      'INSERT INTO pomodoro_sessions (user_id, task_id, duration) VALUES (?, ?, ?)',
      [user1.id, taskForComment ? taskForComment.id : null, 1500]
    );

    console.log('Database successfully seeded with beautiful adaptive demo profiles.');
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}

module.exports = {
  db,
  dbRun,
  dbGet,
  dbAll,
  initDatabase,
};
