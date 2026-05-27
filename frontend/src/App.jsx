import React, { useState, useEffect } from 'react';
import { apiRequest, initWebSocket, closeWebSocket } from './api';
import Sidebar from './components/Sidebar';
import TaskModal from './components/TaskModal';

// Pages & Components
import LandingPage from './pages/LandingPage';
import AuthPages from './pages/AuthPages';
import OnboardingScreen from './pages/OnboardingScreen';
import RoleDashboard from './pages/RoleDashboard';
import TasksPage from './pages/TasksPage';
import DailyPlanner from './components/DailyPlanner';
import CalendarView from './components/CalendarView';
import RoleAnalytics from './components/RoleAnalytics';
import TeamWorkspace from './components/TeamWorkspace';
import SettingsView from './components/SettingsView';
import AICoachPage from './components/AICoachPage';
import RoleSubPage from './components/RoleSubPage';

export default function App() {
  const [route, setRoute] = useState('landing');
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [theme, setTheme] = useState('dark');

  const [tasks, setTasks] = useState([]);
  const [teams, setTeams] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [pomodoroStats, setPomodoroStats] = useState({ totalCount: 0, totalMinutes: 0, sessions: [] });

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTask, setModalTask] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('taskflow_token');
    const savedUser = localStorage.getItem('taskflow_user');
    if (savedToken && savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setToken(savedToken);
      setUser(parsedUser);
      setRoute(parsedUser.onboarding_completed ? 'dashboard' : 'onboarding');
      bootstrapApp(savedToken, parsedUser);
    }
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem('taskflow_theme') || 'dark';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('light', savedTheme === 'light');
  }, []);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    localStorage.setItem('taskflow_theme', next);
    document.documentElement.classList.toggle('light', next === 'light');
  };

  const bootstrapApp = () => {
    syncGlobalLists();
    initWebSocket((msg) => handleWS(msg));
  };

  const syncGlobalLists = async () => {
    try {
      const [t, tm, n, p] = await Promise.all([
        apiRequest('/tasks', 'GET'), apiRequest('/teams', 'GET'),
        apiRequest('/notifications', 'GET'), apiRequest('/pomodoro/stats', 'GET'),
      ]);
      setTasks(t); setTeams(tm); setNotifications(n); setPomodoroStats(p);
    } catch (err) { console.error('Sync error:', err); }
  };

  const handleWS = (data) => {
    switch (data.type) {
      case 'NOTIFICATION_RECEIVED': setNotifications(p => [data.notification, ...p]); break;
      case 'TASK_CREATED': setTasks(p => p.some(t => t.id === data.task.id) ? p : [data.task, ...p]); break;
      case 'TASK_UPDATED': setTasks(p => p.map(t => t.id === data.task.id ? data.task : t)); break;
      case 'TASK_DELETED': setTasks(p => p.filter(t => t.id !== data.taskId)); break;
      default: break;
    }
  };

  const handleLoginSuccess = (authToken, loggedUser) => {
    localStorage.setItem('taskflow_token', authToken);
    localStorage.setItem('taskflow_user', JSON.stringify(loggedUser));
    setToken(authToken); setUser(loggedUser);
    setRoute(loggedUser.onboarding_completed ? 'dashboard' : 'onboarding');
    bootstrapApp();
  };

  const handleOnboardingComplete = (updatedUser) => {
    const merged = { ...user, ...updatedUser, onboarding_completed: 1 };
    setUser(merged);
    localStorage.setItem('taskflow_user', JSON.stringify(merged));
    syncGlobalLists();
    setRoute('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('taskflow_token');
    localStorage.removeItem('taskflow_user');
    setToken(null); setUser(null); setTasks([]); setTeams([]); setNotifications([]);
    setRoute('landing'); closeWebSocket();
  };

  // CRUD
  const handleAddTask = async (payload) => {
    try { const t = await apiRequest('/tasks', 'POST', payload); setTasks(p => [t, ...p]); setModalOpen(false); }
    catch { alert('Failed to save task.'); }
  };
  const handleUpdateTask = async (payload) => {
    try { const t = await apiRequest(`/tasks/${payload.id}`, 'PUT', payload); setTasks(p => p.map(x => x.id === t.id ? t : x)); setModalOpen(false); }
    catch { alert('Failed to update task.'); }
  };
  const handleDeleteTask = async (id) => {
    try { await apiRequest(`/tasks/${id}`, 'DELETE'); setTasks(p => p.filter(t => t.id !== id)); setModalOpen(false); }
    catch { alert('Failed to delete task.'); }
  };
  const handleOpenTaskModal = (task = null) => { setModalTask(task); setModalOpen(true); };
  const handleSaveModal = (d) => { d.id ? handleUpdateTask(d) : handleAddTask(d); };

  // Role-specific sub-page routes
  const roleSubPages = ['exams', 'revision', 'meetings', 'clients', 'invoices', 'bugs', 'reviews', 'social', 'ideas', 'roadmap'];

  const renderActiveView = () => {
    // Role sub-page routes
    if (roleSubPages.includes(route)) {
      return <RoleSubPage pageKey={route} tasks={tasks} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onOpenTaskModal={handleOpenTaskModal} user={user} />;
    }

    switch (route) {
      case 'dashboard':
        return <RoleDashboard tasks={tasks} setRoute={setRoute} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onOpenTaskModal={handleOpenTaskModal} notifications={notifications} setNotifications={setNotifications} pomodoroStats={pomodoroStats} user={user} />;
      case 'tasks':
        return <TasksPage tasks={tasks} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onOpenTaskModal={handleOpenTaskModal} teams={teams} />;
      case 'planner':
        return <DailyPlanner tasks={tasks} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onOpenTaskModal={handleOpenTaskModal} user={user} setPomodoroStats={setPomodoroStats} />;
      case 'calendar':
        return <CalendarView tasks={tasks} onOpenTaskModal={handleOpenTaskModal} />;
      case 'analytics':
        return <RoleAnalytics tasks={tasks} pomodoroStats={pomodoroStats} user={user} />;
      case 'team':
        return <TeamWorkspace teams={teams} setTeams={setTeams} tasks={tasks} setTasks={setTasks} currentUser={user} onOpenTaskModal={handleOpenTaskModal} />;
      case 'ai_coach':
        return <AICoachPage tasks={tasks} user={user} pomodoroStats={pomodoroStats} />;
      case 'settings':
        return <SettingsView user={user} theme={theme} toggleTheme={toggleTheme} />;
      default:
        return <RoleDashboard tasks={tasks} setRoute={setRoute} onAddTask={handleAddTask} onUpdateTask={handleUpdateTask} onOpenTaskModal={handleOpenTaskModal} notifications={notifications} setNotifications={setNotifications} pomodoroStats={pomodoroStats} user={user} />;
    }
  };

  // Non-auth screens
  if (route === 'landing') return <LandingPage setRoute={setRoute} />;
  if (route === 'login') return <AuthPages isRegisterInitial={false} setRoute={setRoute} onLoginSuccess={handleLoginSuccess} />;
  if (route === 'register') return <AuthPages isRegisterInitial={true} setRoute={setRoute} onLoginSuccess={handleLoginSuccess} />;
  if (route === 'onboarding') return <OnboardingScreen user={user} onComplete={handleOnboardingComplete} />;

  // Authenticated layout
  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)' }}>
      <Sidebar currentRoute={route} setRoute={setRoute} user={user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} />
      <main className="main-content-layout" style={{ flex: 1, marginLeft: 'var(--sidebar-width)', minHeight: '100vh', overflowX: 'hidden' }}>
        {renderActiveView()}
      </main>
      {modalOpen && <TaskModal task={modalTask} onClose={() => setModalOpen(false)} onSave={handleSaveModal} onDelete={handleDeleteTask} teams={teams} currentUser={user} />}
      <style>{`
        .main-content-layout { margin-left: var(--sidebar-width) !important; }
        @media (max-width: 768px) { .main-content-layout { margin-left: 0 !important; padding-top: var(--header-height) !important; } }
      `}</style>
    </div>
  );
}
