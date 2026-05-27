import React, { useState } from 'react';
import { Plus, ListTodo, Flame, BarChart4, Play, CheckCircle2, ChevronRight, AlertCircle, Clock } from 'lucide-react';
import Notifications from '../components/Notifications';

export default function Dashboard({
  tasks,
  setRoute,
  onAddTask,
  onUpdateTask,
  onOpenTaskModal,
  notifications,
  setNotifications,
  pomodoroStats,
  user
}) {
  const [quickTitle, setQuickTitle] = useState('');

  // Calculations
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const todayTasks = tasks.filter(t => t.due_date === todayStr);
  const todayCompleted = todayTasks.filter(t => t.status === 'done').length;
  
  const todayCompletionPct = todayTasks.length > 0 
    ? Math.round((todayCompleted / todayTasks.length) * 100) 
    : 0;

  // Streak Tracker logic: simple calculation based on completed tasks
  const streakCount = Math.min(Math.max(Math.floor(completedTasks / 2), 1), 7); 

  const handleQuickAddSubmit = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle,
      description: 'Quickly added from Dashboard planner.',
      status: 'todo',
      priority: 'medium',
      due_date: todayStr,
      team_id: null,
      user_id: user.id
    });
    setQuickTitle('');
  };

  const handleToggleComplete = async (task) => {
    const nextStatus = task.status === 'done' ? 'todo' : 'done';
    onUpdateTask({ ...task, status: nextStatus });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error)';
      case 'medium': return 'var(--warning)';
      default: return 'var(--success)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Top dashboard header bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>
            Hello, {user ? user.name.split(' ')[0] : 'Innovator'}!
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Here is a snapshot of your workspace metrics for today.
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Notifications notifications={notifications} setNotifications={setNotifications} />
          <button
            onClick={() => onOpenTaskModal(null)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--pulse-glow)' }}
          >
            <Plus size={18} />
            <span>Create New Task</span>
          </button>
        </div>
      </div>

      {/* Grid statistics metrics panel */}
      <div className="dashboard-grid">
        {/* Stat 1: Total Tasks */}
        <div className="glass-card" style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(99, 102, 241, 0.15)',
            border: '1px solid rgba(99, 102, 241, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-indigo)'
          }}>
            <ListTodo size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Global Workflow</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {completedTasks}<span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/{totalTasks} done</span>
            </span>
          </div>
        </div>

        {/* Stat 2: Productivity Streak */}
        <div className="glass-card" style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(249, 115, 22, 0.15)',
            border: '1px solid rgba(249, 115, 22, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f97316'
          }}>
            <Flame size={24} className="pulse-glow" style={{ animationDuration: '1.5s' }} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Focus Streak</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>{streakCount} Days</span>
              <span style={{ fontSize: '0.9rem', color: '#10b981', fontWeight: 600 }}>🔥</span>
            </span>
          </div>
        </div>

        {/* Stat 3: Pomodoro Tracking */}
        <div className="glass-card" style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(168, 85, 247, 0.15)',
            border: '1px solid rgba(168, 85, 247, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-purple)'
          }}>
            <Clock size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Focus Minutes</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {pomodoroStats ? pomodoroStats.totalMinutes : 0}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}> min</span>
            </span>
          </div>
        </div>

        {/* Stat 4: Daily Progress */}
        <div className="glass-card" style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          <div style={{
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <BarChart4 size={24} />
          </div>
          <div>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Today's Target</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
              {todayCompletionPct}%<span style={{ fontSize: '0.85rem', color: '#10b981', fontWeight: 500 }}> met</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Grid Area: Today's Tasks vs Focus Timer Quick access */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '7fr 5fr',
        gap: '1.5rem'
      }} className="dashboard-grid">
        {/* Today's Tasks List Card */}
        <div className="glass" style={{
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.25rem',
          gridColumn: 'span 7'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: '700' }}>Today's Plan</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Items scheduled for target due date {todayStr}</p>
            </div>
            <button
              onClick={() => setRoute('planner')}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--accent-indigo)',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                fontWeight: 600
              }}
            >
              <span>Daily Planner</span>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Today's Completion Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', fontWeight: 600 }}>
              <span style={{ color: 'var(--text-secondary)' }}>Daily Target Progress</span>
              <span>{todayCompleted}/{todayTasks.length} Completed ({todayCompletionPct}%)</span>
            </div>
            <div className="progress-bar-container">
              <div className="progress-bar-fill" style={{ width: `${todayCompletionPct}%` }} />
            </div>
          </div>

          {/* Quick Add Form */}
          <form onSubmit={handleQuickAddSubmit} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              required
              placeholder="Quick Add: What is absolute priority for today?..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', borderRadius: '12px' }}>
              <Plus size={18} />
              <span style={{ display: 'none' }} className="btn-label-desktop">Add</span>
            </button>
          </form>

          {/* List items */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: '300px',
            overflowY: 'auto',
            paddingRight: '4px'
          }}>
            {todayTasks.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 1rem',
                color: 'var(--text-muted)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.75rem',
                border: '1px dashed var(--card-border)',
                borderRadius: '12px'
              }}>
                <CheckCircle2 size={36} style={{ color: 'rgba(255,255,255,0.1)' }} />
                <span style={{ fontSize: '0.9rem' }}>No tasks scheduled for today. Have a relaxed day!</span>
              </div>
            ) : (
              todayTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between',
                    padding: '0.85rem 1rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '12px',
                    border: '1px solid var(--card-border)',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => handleToggleComplete(task)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: task.status === 'done' ? 'var(--success)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: 0
                    }}
                  >
                    <CheckCircle2 size={20} style={{ fill: task.status === 'done' ? 'rgba(16,185,129,0.1)' : 'none' }} />
                  </button>

                  <div
                    onClick={() => onOpenTaskModal(task)}
                    style={{
                      flex: 1,
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.15rem'
                    }}
                  >
                    <span style={{
                      fontWeight: 500,
                      fontSize: '0.9rem',
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                      color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>{task.title}</span>
                    {task.description && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '300px' }}>
                        {task.description}
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {/* Priority dot indicator */}
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: getPriorityColor(task.priority)
                      }}
                      title={`Priority: ${task.priority}`}
                    />
                    <span style={{
                      fontSize: '0.75rem',
                      color: task.status === 'done' ? 'var(--success)' : task.status === 'in_progress' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                      textTransform: 'capitalize',
                      background: 'rgba(255,255,255,0.03)',
                      padding: '0.15rem 0.4rem',
                      borderRadius: '4px',
                      border: '1px solid var(--card-border)'
                    }}>{task.status.replace('_', ' ')}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Pomodoro Focus Launchpad Card */}
        <div className="glass" style={{
          padding: '1.5rem',
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'between',
          gap: '1.25rem',
          gridColumn: 'span 5'
        }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: '700' }}>Pomodoro Launchpad</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Focus your brain in 25-minute deep cycles.</p>
          </div>

          <div style={{
            background: 'radial-gradient(circle, var(--bg-tertiary) 0%, rgba(17,22,37,0.5) 100%)',
            border: '1px solid var(--card-border)',
            borderRadius: '16px',
            padding: '1.5rem 1rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1rem',
            position: 'relative'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              border: '2px solid rgba(99, 102, 241, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-indigo)',
              boxShadow: '0 0 20px rgba(99,102,241,0.1)'
            }}>
              <Clock size={36} className="pulse-glow" style={{ animationDuration: '3s' }} />
            </div>

            <div>
              <span style={{ fontSize: '1.75rem', fontFamily: 'var(--font-display)', fontWeight: '800', letterSpacing: '0.05em' }}>25:00</span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Classic Work Interval</p>
            </div>

            <button
              onClick={() => setRoute('planner')}
              className="btn btn-primary"
              style={{
                width: '100%',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              <Play size={16} />
              <span>Launch Focus Station</span>
            </button>
          </div>

          {/* Quick Stats Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.01)',
            borderTop: '1px solid var(--card-border)',
            paddingTop: '1rem'
          }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Focus sessions logged</span>
            <span style={{ fontWeight: 700, color: 'var(--accent-cyan)' }}>
              {pomodoroStats ? pomodoroStats.totalCount : 0} Cycles
            </span>
          </div>
        </div>
      </div>
      
      {/* Inject custom styling selector */}
      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
          .dashboard-grid > div {
            grid-column: span 12 !important;
          }
        }
      `}</style>
    </div>
  );
}
