import React, { useState } from 'react';
import { Kanban, List, Search, SlidersHorizontal, Plus, Calendar, AlertCircle, RefreshCw } from 'lucide-react';

export default function TasksPage({
  tasks,
  onAddTask,
  onUpdateTask,
  onOpenTaskModal,
  teams = []
}) {
  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' or 'list'
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [teamFilter, setTeamFilter] = useState('');

  // 1. Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          (task.description && task.description.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = statusFilter ? task.status === statusFilter : true;
    const matchesPriority = priorityFilter ? task.priority === priorityFilter : true;
    const matchesTeam = teamFilter ? (teamFilter === 'personal' ? !task.team_id : task.team_id === parseInt(teamFilter)) : true;
    
    return matchesSearch && matchesStatus && matchesPriority && matchesTeam;
  });

  const handleUpdateStatus = (task, newStatus) => {
    onUpdateTask({ ...task, status: newStatus });
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'high': return 'badge-high';
      case 'medium': return 'badge-medium';
      default: return 'badge-low';
    }
  };

  // Helper check if deadline is overdue
  const isOverdue = (task) => {
    if (task.status === 'done' || !task.due_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.due_date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  // Render Kanban Board Columns
  const renderKanbanColumn = (columnTitle, columnStatus, accentColor) => {
    const columnTasks = filteredTasks.filter(t => t.status === columnStatus);

    return (
      <div className="kanban-column animate-fade-in" style={{ flex: 1, minWidth: '280px' }}>
        <div className="kanban-column-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: accentColor }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: '700', textTransform: 'capitalize' }}>
              {columnTitle}
            </h3>
            <span style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              background: 'rgba(255,255,255,0.05)',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px'
            }}>{columnTasks.length}</span>
          </div>
          <button
            onClick={() => onOpenTaskModal({ status: columnStatus })}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-cyan)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
          >
            <Plus size={16} />
          </button>
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          minHeight: '400px',
          overflowY: 'auto'
        }}>
          {columnTasks.length === 0 ? (
            <div style={{
              padding: '2.5rem 1rem',
              textAlign: 'center',
              color: 'var(--text-muted)',
              border: '1px dashed var(--card-border)',
              borderRadius: '12px',
              fontSize: '0.85rem'
            }}>
              No tasks in here.
            </div>
          ) : (
            columnTasks.map(task => {
              const overdue = isOverdue(task);
              return (
                <div key={task.id} className="kanban-card">
                  {/* Overdue alert banner */}
                  {overdue && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                      color: 'var(--error)',
                      fontSize: '0.7rem',
                      fontWeight: 'bold',
                      marginBottom: '0.4rem'
                    }}>
                      <AlertCircle size={12} />
                      <span>OVERDUE DEADLINE</span>
                    </div>
                  )}

                  <div
                    onClick={() => onOpenTaskModal(task)}
                    style={{ cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}
                  >
                    <h4 style={{
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      color: overdue ? 'var(--error)' : 'var(--text-primary)'
                    }}>{task.title}</h4>
                    {task.description && (
                      <p style={{
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        lineHeight: '1.4',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>{task.description}</p>
                    )}
                  </div>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between',
                    marginTop: '0.85rem',
                    paddingTop: '0.6rem',
                    borderTop: '1px solid var(--card-border)',
                    flexWrap: 'wrap',
                    gap: '0.5rem'
                  }}>
                    <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                      {task.priority}
                    </span>

                    {task.due_date && (
                      <span style={{
                        fontSize: '0.7rem',
                        color: overdue ? 'var(--error)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem'
                      }}>
                        <Calendar size={12} />
                        <span>{task.due_date}</span>
                      </span>
                    )}

                    {/* Simple Column Transfer select box for agility */}
                    <select
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task, e.target.value)}
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--card-border)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        padding: '0.1rem 0.25rem',
                        color: 'var(--text-secondary)',
                        marginLeft: 'auto'
                      }}
                    >
                      <option value="todo">To-Do</option>
                      <option value="in_progress">In Prog</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>My Workspace Tasks</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Organize, prioritize, and manage actions across your personal and team channels.
          </p>
        </div>
        
        {/* View Mode Toggle Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '0.25rem',
            display: 'flex',
            gap: '0.25rem'
          }}>
            <button
              onClick={() => setViewMode('kanban')}
              style={{
                background: viewMode === 'kanban' ? 'var(--accent-indigo)' : 'none',
                border: 'none',
                color: viewMode === 'kanban' ? '#fff' : 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Kanban size={16} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              style={{
                background: viewMode === 'list' ? 'var(--accent-indigo)' : 'none',
                border: 'none',
                color: viewMode === 'list' ? '#fff' : 'var(--text-secondary)',
                borderRadius: '8px',
                padding: '0.45rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <List size={16} />
            </button>
          </div>

          <button
            onClick={() => onOpenTaskModal(null)}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={18} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="glass" style={{
        padding: '1.25rem',
        borderRadius: '16px',
        border: '1px solid var(--card-border)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center'
      }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search tasks or contents..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
          />
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          {/* Priority */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '130px' }}
          >
            <option value="">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Teams Filter */}
          <select
            value={teamFilter}
            onChange={(e) => setTeamFilter(e.target.value)}
            className="form-input"
            style={{ width: 'auto', minWidth: '150px' }}
          >
            <option value="">All Workspaces</option>
            <option value="personal">Personal Channel</option>
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>

          {/* Reset Filters */}
          {(search || priorityFilter || teamFilter || statusFilter) && (
            <button
              onClick={() => {
                setSearch('');
                setPriorityFilter('');
                setTeamFilter('');
                setStatusFilter('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                fontSize: '0.85rem'
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--accent-indigo)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
            >
              <RefreshCw size={14} />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main View Area */}
      {viewMode === 'kanban' ? (
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {renderKanbanColumn('To-Do', 'todo', 'var(--accent-cyan)')}
          {renderKanbanColumn('In Progress', 'in_progress', 'var(--accent-indigo)')}
          {renderKanbanColumn('Completed', 'done', '#10b981')}
        </div>
      ) : (
        /* List View fallback */
        <div className="glass animate-fade-in" style={{
          padding: '1rem',
          borderRadius: '16px',
          border: '1px solid var(--card-border)',
          overflowX: 'auto'
        }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '600px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--card-border)', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                <th style={{ padding: '0.75rem 1rem' }}>Task Title</th>
                <th style={{ padding: '0.75rem 1rem' }}>Priority</th>
                <th style={{ padding: '0.75rem 1rem' }}>Due Date</th>
                <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                <th style={{ padding: '0.75rem 1rem' }}>Workspace</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No tasks found matching current active filters.
                  </td>
                </tr>
              ) : (
                filteredTasks.map(task => {
                  const overdue = isOverdue(task);
                  return (
                    <tr
                      key={task.id}
                      style={{
                        borderBottom: '1px solid var(--card-border)',
                        fontSize: '0.9rem',
                        transition: 'background 0.2s',
                        cursor: 'pointer'
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <td onClick={() => onOpenTaskModal(task)} style={{ padding: '1rem', fontWeight: 500, color: overdue ? 'var(--error)' : 'var(--text-primary)' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                          <span>{task.title}</span>
                          {overdue && <span style={{ fontSize: '0.7rem', color: 'var(--error)', fontWeight: 'bold' }}>OVERDUE DEADLINE</span>}
                        </div>
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <span className={`badge ${getPriorityBadgeClass(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', color: overdue ? 'var(--error)' : 'var(--text-secondary)' }}>
                        {task.due_date || 'No Date'}
                      </td>
                      <td style={{ padding: '1rem' }}>
                        <select
                          value={task.status}
                          onChange={(e) => handleUpdateStatus(task, e.target.value)}
                          style={{
                            background: 'var(--bg-tertiary)',
                            border: '1px solid var(--card-border)',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            padding: '0.25rem 0.5rem',
                            color: 'var(--text-primary)'
                          }}
                        >
                          <option value="todo">To-Do</option>
                          <option value="in_progress">In Progress</option>
                          <option value="done">Completed</option>
                        </select>
                      </td>
                      <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>
                        {task.team_id ? 'Team Project' : 'Personal'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
