import React, { useState, useEffect } from 'react';
import { X, Calendar, Trash2, ShieldAlert } from 'lucide-react';

export default function TaskModal({ task, onClose, onSave, onDelete, teams = [], currentUser }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('todo');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [teamId, setTeamId] = useState('');
  const [userId, setUserId] = useState('');
  const [members, setMembers] = useState([]);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setDueDate(task.due_date || '');
      setTeamId(task.team_id || '');
      setUserId(task.user_id || currentUser.id);
    } else {
      setTitle('');
      setDescription('');
      setStatus('todo');
      setPriority('medium');
      // Default due date to today
      setDueDate(new Date().toISOString().split('T')[0]);
      setTeamId('');
      setUserId(currentUser.id);
    }
  }, [task, currentUser]);

  // Dynamically update available assignees based on selected team members
  useEffect(() => {
    if (teamId) {
      const selectedTeam = teams.find(t => t.id === parseInt(teamId));
      if (selectedTeam) {
        setMembers(selectedTeam.members || []);
      } else {
        setMembers([currentUser]);
      }
    } else {
      setMembers([currentUser]);
    }
  }, [teamId, teams, currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: task ? task.id : undefined,
      title,
      description,
      status,
      priority,
      due_date: dueDate || null,
      team_id: teamId ? parseInt(teamId) : null,
      user_id: userId ? parseInt(userId) : currentUser.id
    });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-scale-up" style={{ maxWidth: '550px', position: 'relative' }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#fff'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
        >
          <X size={20} />
        </button>

        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>{task ? 'Edit Task Settings' : 'Create New Task'}</span>
        </h2>

        {showConfirmDelete ? (
          <div className="animate-fade-in" style={{
            padding: '1.5rem',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            alignItems: 'center',
            textAlign: 'center',
            marginBottom: '1rem'
          }}>
            <ShieldAlert size={48} style={{ color: 'var(--error)' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Are you absolutely sure?</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              Deleting this task will permanently remove all linked updates, comment threads, and session records. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center' }}>
              <button onClick={() => setShowConfirmDelete(false)} className="btn btn-secondary" style={{ flex: 1, padding: '0.50rem' }}>Cancel</button>
              <button onClick={() => onDelete(task.id)} className="btn btn-danger" style={{ flex: 1, padding: '0.50rem' }}>Confirm Delete</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Task Title</label>
              <input
                type="text"
                required
                placeholder="Finish calendar integration..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Detailed Description</label>
              <textarea
                placeholder="Briefly describe subtasks, prerequisites or notes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Task Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="form-input"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <option value="todo">To-Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Completed</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Priority Level</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="form-input"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Due Date</label>
                <div style={{ position: 'relative' }}>
                  <Calendar size={16} style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Team Workspace</label>
                <select
                  value={teamId}
                  onChange={(e) => {
                    setTeamId(e.target.value);
                    setUserId(currentUser.id); // reset assignee to user when changing team
                  }}
                  className="form-input"
                >
                  <option value="">Personal (No Team)</option>
                  {teams.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {teamId && (
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Assign Task To</label>
                <select
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="form-input"
                >
                  {members.map(m => (
                    <option key={m.id} value={m.id}>{m.name} ({m.email})</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{
              display: 'flex',
              gap: '1rem',
              marginTop: '1rem',
              justifyContent: 'between',
              borderTop: '1px solid var(--card-border)',
              paddingTop: '1.25rem'
            }}>
              {task && (
                <button
                  type="button"
                  onClick={() => setShowConfirmDelete(true)}
                  className="btn btn-secondary"
                  style={{
                    color: 'var(--error)',
                    borderColor: 'rgba(239, 68, 68, 0.2)',
                    background: 'rgba(239, 68, 68, 0.05)',
                    padding: '0.75rem 1.25rem'
                  }}
                >
                  <Trash2 size={16} />
                  <span>Delete Task</span>
                </button>
              )}
              
              <div style={{ display: 'flex', gap: '0.75rem', marginLeft: 'auto' }}>
                <button type="button" onClick={onClose} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" style={{ minWidth: '120px' }}>
                  {task ? 'Update Task' : 'Create Task'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
