import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle2, ChevronRight, Sparkles, AlertTriangle, Lightbulb, TrendingUp, Clock, Target, Brain } from 'lucide-react';
import Notifications from '../components/Notifications';
import { getRoleConfig, getAISuggestions } from '../config/roleConfig';

export default function RoleDashboard({
  tasks, setRoute, onAddTask, onUpdateTask, onOpenTaskModal,
  notifications, setNotifications, pomodoroStats, user
}) {
  const [quickTitle, setQuickTitle] = useState('');
  const [showAI, setShowAI] = useState(true);

  const role = user?.role || 'student';
  const config = getRoleConfig(role);
  const suggestions = useMemo(() => getAISuggestions(role, tasks), [role, tasks]);

  const todayStr = new Date().toISOString().split('T')[0];
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const todayTasks = tasks.filter(t => t.due_date === todayStr);
  const todayCompleted = todayTasks.filter(t => t.status === 'done').length;
  const todayPct = todayTasks.length > 0 ? Math.round((todayCompleted / todayTasks.length) * 100) : 0;
  const overallPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done');

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddTask({
      title: quickTitle,
      description: `Quick-added from ${config.dashboardTitle}.`,
      status: 'todo', priority: 'medium', due_date: todayStr,
      team_id: null, user_id: user.id,
    });
    setQuickTitle('');
  };

  // Simulate role-specific metric values from task data
  const metricValues = useMemo(() => {
    const m = {};
    config.analyticsMetrics.forEach((metric, i) => {
      // Generate plausible values from actual task data
      if (metric.unit === '%') m[metric.key] = Math.min(100, overallPct + (i * 5) + 12);
      else if (metric.unit === 'hrs') m[metric.key] = (pomodoroStats?.totalMinutes || 0) + (i * 3);
      else if (metric.unit === '/10') m[metric.key] = Math.min(10, 6.5 + completedTasks * 0.3);
      else if (metric.unit === '$') m[metric.key] = completedTasks * 450 + 1200;
      else if (metric.unit === 'pts') m[metric.key] = completedTasks * 3 + 8;
      else m[metric.key] = completedTasks + inProgressTasks + (i * 2);
    });
    return m;
  }, [config, overallPct, completedTasks, inProgressTasks, pomodoroStats]);

  const suggestionIcon = (type) => {
    switch (type) {
      case 'warning': return <AlertTriangle size={14} style={{ color: '#ef4444' }} />;
      case 'success': return <TrendingUp size={14} style={{ color: '#10b981' }} />;
      case 'focus': return <Target size={14} style={{ color: config.accent }} />;
      case 'tip': return <Lightbulb size={14} style={{ color: '#f59e0b' }} />;
      case 'insight': return <Brain size={14} style={{ color: '#8b5cf6' }} />;
      default: return <Sparkles size={14} />;
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{config.icon}</span>
            <span style={{ fontSize: '0.75rem', background: `rgba(${config.accentRgb}, 0.12)`, color: config.accent, padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600, border: `1px solid rgba(${config.accentRgb}, 0.2)` }}>
              {config.aiPersona}
            </span>
          </div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>
            {config.dashboardTitle}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{config.tagline}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Notifications notifications={notifications} setNotifications={setNotifications} />
          <button onClick={() => onOpenTaskModal(null)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: config.gradient }}>
            <Plus size={18} /><span>New Task</span>
          </button>
        </div>
      </div>

      {/* AI Coach Card */}
      {showAI && suggestions.length > 0 && (
        <div className="glass animate-fade-in" style={{ padding: '1.25rem 1.5rem', borderRadius: '16px', border: `1px solid rgba(${config.accentRgb}, 0.15)`, background: `linear-gradient(135deg, rgba(${config.accentRgb}, 0.04) 0%, transparent 100%)` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={16} style={{ color: config.accent }} />
              <span style={{ fontWeight: 700, fontSize: '0.95rem', fontFamily: 'var(--font-display)' }}>{config.aiPersona} Insights</span>
            </div>
            <button onClick={() => setShowAI(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.75rem' }}>Dismiss</button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {suggestions.slice(0, 4).map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', padding: '0.4rem 0.6rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)' }}>
                {suggestionIcon(s.type)}
                <span style={{ color: 'var(--text-secondary)' }}>{s.text}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="dashboard-grid">
        {config.analyticsMetrics.map((metric) => (
          <div key={metric.key} className="glass-card" style={{ gridColumn: 'span 3', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: `rgba(${config.accentRgb}, 0.12)`, border: `1px solid rgba(${config.accentRgb}, 0.18)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.35rem' }}>
              {metric.icon}
            </div>
            <div>
              <h4 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{metric.label}</h4>
              <span style={{ fontSize: '1.6rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {metric.unit === '$' ? '$' : ''}{metricValues[metric.key] !== undefined ? (typeof metricValues[metric.key] === 'number' ? (Number.isInteger(metricValues[metric.key]) ? metricValues[metric.key] : metricValues[metric.key].toFixed(1)) : metricValues[metric.key]) : 0}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}>{metric.unit !== '$' ? ` ${metric.unit}` : ''}</span>
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Main: Tasks + Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.5rem' }} className="dashboard-grid">
        {/* Today's List */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '1.25rem', gridColumn: 'span 7' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Today's Focus</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{todayTasks.length} items scheduled · {todayPct}% complete</p>
            </div>
            <button onClick={() => setRoute('planner')} style={{ background: 'none', border: 'none', color: config.accent, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', fontWeight: 600 }}>
              <span>Open Planner</span><ChevronRight size={16} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-container"><div className="progress-bar-fill" style={{ width: `${todayPct}%`, background: config.gradient }} /></div>

          {/* Quick Add */}
          <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '0.75rem' }}>
            <input type="text" required placeholder={`Quick add ${config.taskCategories[0]?.label.toLowerCase() || 'task'}...`} value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} className="form-input" style={{ flex: 1 }} />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem', background: config.gradient }}>
              <Plus size={18} />
            </button>
          </form>

          {/* Task List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', maxHeight: '280px', overflowY: 'auto' }}>
            {todayTasks.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2.5rem 1rem', color: 'var(--text-muted)', border: '1px dashed var(--card-border)', borderRadius: '12px', fontSize: '0.9rem' }}>
                <CheckCircle2 size={32} style={{ opacity: 0.15, marginBottom: '0.5rem' }} /><br />No tasks due today. Use Quick Add above!
              </div>
            ) : todayTasks.map(task => (
              <div key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '0.75rem 1rem', background: 'var(--bg-tertiary)', borderRadius: '12px', border: '1px solid var(--card-border)', gap: '0.75rem' }}>
                <button onClick={() => onUpdateTask({ ...task, status: task.status === 'done' ? 'todo' : 'done' })} style={{ background: 'none', border: 'none', color: task.status === 'done' ? '#10b981' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}>
                  <CheckCircle2 size={20} />
                </button>
                <div onClick={() => onOpenTaskModal(task)} style={{ flex: 1, cursor: 'pointer' }}>
                  <span style={{ fontWeight: 500, fontSize: '0.9rem', textDecoration: task.status === 'done' ? 'line-through' : 'none', color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{task.title}</span>
                </div>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981' }} />
              </div>
            ))}
          </div>
        </div>

        {/* Right: Role Task Categories */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '1rem', gridColumn: 'span 5' }}>
          <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Task Categories</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {config.taskCategories.map((cat) => {
              const catTasks = tasks.filter(t => t.title.toLowerCase().includes(cat.key.replace('_', ' ')) || t.description?.toLowerCase().includes(cat.key.replace('_', ' ')));
              return (
                <div key={cat.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-tertiary)', borderRadius: '10px', border: '1px solid var(--card-border)', borderLeft: `3px solid ${cat.color}`, cursor: 'pointer', transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--bg-tertiary)'}
                  onClick={() => setRoute('tasks')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{cat.label}</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.15rem 0.45rem', borderRadius: '6px' }}>
                    {catTasks.length}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Quick Stats */}
          <div style={{ marginTop: 'auto', borderTop: '1px solid var(--card-border)', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>High Priority</span><span style={{ fontWeight: 700, color: '#ef4444' }}>{highPriority.length}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Overall Completion</span><span style={{ fontWeight: 700, color: '#10b981' }}>{overallPct}%</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Focus Sessions</span><span style={{ fontWeight: 700, color: config.accent }}>{pomodoroStats?.totalCount || 0}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .dashboard-grid { grid-template-columns: 1fr !important; }
          .dashboard-grid > div { grid-column: span 12 !important; }
        }
      `}</style>
    </div>
  );
}
