import React, { useState } from 'react';
import { Plus, CheckCircle2, Clock, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { getRoleConfig } from '../config/roleConfig';

// Role-specific sub-page definitions
const SUB_PAGE_CONFIG = {
  exams: { title: 'Exam Planner', subtitle: 'Track exam dates, preparation progress, and revision status.', filterKey: 'exam', emptyMsg: 'No exams scheduled. Add your upcoming exams to start tracking.' },
  revision: { title: 'Revision Tracker', subtitle: 'Monitor your revision cycles across all subjects.', filterKey: 'revision', emptyMsg: 'No revision tasks yet. Create revision items to track progress.' },
  meetings: { title: 'Meetings', subtitle: 'View and manage all your scheduled meetings.', filterKey: 'meeting', emptyMsg: 'No meetings scheduled. Your calendar is clear!' },
  clients: { title: 'Client Management', subtitle: 'Track client projects, deadlines, and communication.', filterKey: 'client', emptyMsg: 'No client tasks. Add client projects to get started.' },
  invoices: { title: 'Invoice Tracker', subtitle: 'Manage invoices, payments, and billing status.', filterKey: 'invoice', emptyMsg: 'No invoices tracked. Create invoice tasks to monitor payments.' },
  bugs: { title: 'Bug Tracker', subtitle: 'Track, prioritize, and squash bugs across your codebase.', filterKey: 'bug', emptyMsg: 'No bugs reported! Your code is looking clean. 🎉' },
  reviews: { title: 'Code Reviews', subtitle: 'Manage pull request reviews and code quality checks.', filterKey: 'review', emptyMsg: 'No pending reviews. Your review queue is clear!' },
  social: { title: 'Social Media Scheduler', subtitle: 'Plan and schedule your social media posts.', filterKey: 'social', emptyMsg: 'No social posts scheduled. Plan your content strategy!' },
  ideas: { title: 'Idea Generator', subtitle: 'Brainstorm, capture, and develop content ideas.', filterKey: 'idea', emptyMsg: 'Your idea board is empty. Start brainstorming!' },
  roadmap: { title: 'Product Roadmap', subtitle: 'Plan milestones, features, and launch timelines.', filterKey: 'roadmap', emptyMsg: 'No roadmap items. Define your product milestones!' },
};

export default function RoleSubPage({ pageKey, tasks, onAddTask, onUpdateTask, onOpenTaskModal, user }) {
  const role = user?.role || 'student';
  const config = getRoleConfig(role);
  const pageConfig = SUB_PAGE_CONFIG[pageKey] || { title: pageKey, subtitle: '', filterKey: pageKey, emptyMsg: 'No items found.' };
  const [quickTitle, setQuickTitle] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const todayStr = new Date().toISOString().split('T')[0];

  // Filter tasks relevant to this sub-page
  let filteredTasks = tasks.filter(t => {
    const text = (t.title + ' ' + (t.description || '')).toLowerCase();
    return text.includes(pageConfig.filterKey.toLowerCase());
  });

  // If no tasks match the keyword filter, show all tasks as fallback for usability
  if (filteredTasks.length === 0) {
    filteredTasks = tasks;
  }

  if (filterStatus) {
    filteredTasks = filteredTasks.filter(t => t.status === filterStatus);
  }

  const completedCount = filteredTasks.filter(t => t.status === 'done').length;
  const totalCount = filteredTasks.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    onAddTask({
      title: quickTitle,
      description: `Created from ${pageConfig.title} sub-page.`,
      status: 'todo', priority: 'medium', due_date: todayStr,
      team_id: null, user_id: user.id,
    });
    setQuickTitle('');
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <span style={{ fontSize: '1.3rem' }}>{config.icon}</span>
            <span style={{ fontSize: '0.7rem', background: `rgba(${config.accentRgb}, 0.1)`, color: config.accent, padding: '0.15rem 0.5rem', borderRadius: '12px', fontWeight: 600 }}>{config.label}</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{pageConfig.title}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{pageConfig.subtitle}</p>
        </div>
        <button onClick={() => onOpenTaskModal(null)} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: config.gradient }}>
          <Plus size={16} /><span>Add Item</span>
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `rgba(${config.accentRgb}, 0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={20} style={{ color: '#10b981' }} />
          </div>
          <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Completed</div><div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{completedCount}</div></div>
        </div>
        <div className="glass-card" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'rgba(245,158,11,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Clock size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Pending</div><div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{totalCount - completedCount}</div></div>
        </div>
        <div className="glass-card" style={{ flex: 1, minWidth: '160px', display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.25rem' }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: `rgba(${config.accentRgb}, 0.12)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={20} style={{ color: config.accent }} />
          </div>
          <div><div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Progress</div><div style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>{progressPct}%</div></div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar-container" style={{ height: '10px' }}>
        <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: config.gradient }} />
      </div>

      {/* Filter + Quick Add */}
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '0.5rem', flex: 1, minWidth: '250px' }}>
          <input type="text" required placeholder={`Quick add to ${pageConfig.title}...`} value={quickTitle} onChange={(e) => setQuickTitle(e.target.value)} className="form-input" style={{ flex: 1 }} />
          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1rem', background: config.gradient }}><Plus size={16} /></button>
        </form>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="form-input" style={{ width: 'auto', minWidth: '140px' }}>
          <option value="">All Statuses</option>
          <option value="todo">To-Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Completed</option>
        </select>
      </div>

      {/* Task List */}
      <div className="glass" style={{ padding: '1.25rem', borderRadius: '16px', border: '1px solid var(--card-border)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', maxHeight: '450px', overflowY: 'auto' }}>
          {filteredTasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem', opacity: 0.3 }}>{config.icon}</div>
              {pageConfig.emptyMsg}
            </div>
          ) : (
            filteredTasks.map(task => {
              const isOverdue = task.due_date && task.status !== 'done' && new Date(task.due_date) < new Date();
              return (
                <div key={task.id} style={{
                  display: 'flex', alignItems: 'center', padding: '0.75rem 1rem',
                  background: 'var(--bg-tertiary)', borderRadius: '12px',
                  border: `1px solid ${isOverdue ? 'rgba(239,68,68,0.3)' : 'var(--card-border)'}`,
                  gap: '0.75rem', transition: 'all 0.15s'
                }}>
                  <button onClick={() => onUpdateTask({ ...task, status: task.status === 'done' ? 'todo' : 'done' })}
                    style={{ background: 'none', border: 'none', color: task.status === 'done' ? '#10b981' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', padding: 0 }}>
                    <CheckCircle2 size={20} />
                  </button>
                  <div onClick={() => onOpenTaskModal(task)} style={{ flex: 1, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 500, fontSize: '0.9rem', textDecoration: task.status === 'done' ? 'line-through' : 'none', color: isOverdue ? '#ef4444' : task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)' }}>{task.title}</span>
                      {isOverdue && <AlertTriangle size={13} style={{ color: '#ef4444' }} />}
                    </div>
                    {task.description && <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '400px' }}>{task.description}</p>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#10b981' }} />
                    {task.due_date && <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{task.due_date}</span>}
                    <select value={task.status} onChange={(e) => onUpdateTask({ ...task, status: e.target.value })}
                      style={{ background: 'var(--bg-primary)', border: '1px solid var(--card-border)', borderRadius: '6px', fontSize: '0.7rem', padding: '0.15rem 0.3rem', color: 'var(--text-secondary)' }}>
                      <option value="todo">To-Do</option>
                      <option value="in_progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
