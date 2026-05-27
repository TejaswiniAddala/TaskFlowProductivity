import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar, AlertCircle } from 'lucide-react';

export default function CalendarView({ tasks, onOpenTaskModal }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get months list
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Helper date calculations
  const getDaysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y, m) => new Date(y, m, 1).getDay(); // 0 is Sunday, 6 is Saturday

  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  // Previous month details for filling grid pads
  const prevMonthIndex = month === 0 ? 11 : month - 1;
  const prevYearIndex = month === 0 ? year - 1 : year;
  const daysInPrevMonth = getDaysInMonth(prevYearIndex, prevMonthIndex);

  // Generate complete grid entries
  const cells = [];

  // 1. Pad previous month days
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    const day = daysInPrevMonth - i;
    const dateStr = `${prevYearIndex}-${(prevMonthIndex + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    cells.push({ day, currentMonth: false, dateStr });
  }

  // 2. Add current month days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${(month + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    cells.push({ day, currentMonth: true, dateStr });
  }

  // 3. Pad next month days to make complete multiples of 7 (weekly rows)
  const remainingCells = 42 - cells.length; // standard 6-row layout is 42 cells
  const nextMonthIndex = month === 11 ? 0 : month + 1;
  const nextYearIndex = month === 11 ? year + 1 : year;
  for (let day = 1; day <= remainingCells; day++) {
    const dateStr = `${nextYearIndex}-${(nextMonthIndex + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
    cells.push({ day, currentMonth: false, dateStr });
  }

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'var(--error)';
      case 'medium': return 'var(--warning)';
      default: return 'var(--success)';
    }
  };

  const getTasksForDate = (dateString) => {
    return tasks.filter(t => t.due_date === dateString);
  };

  const isToday = (dateString) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  const isOverdue = (task) => {
    if (task.status === 'done' || !task.due_date) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const taskDate = new Date(task.due_date);
    taskDate.setHours(0, 0, 0, 0);
    return taskDate < today;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Calendar Header Options */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>Calendar Workspace</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Sync and trace deadline milestones. Click cells to instantly schedule tasks.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleToday}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Today
          </button>
          
          <div style={{
            display: 'flex',
            alignItems: 'center',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--card-border)',
            borderRadius: '12px',
            padding: '0.2rem'
          }}>
            <button
              onClick={handlePrevMonth}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.35rem', borderRadius: '8px' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.9rem', fontWeight: 600, padding: '0 0.75rem', minWidth: '130px', textAlign: 'center' }}>
              {monthNames[month]} {year}
            </span>
            <button
              onClick={handleNextMonth}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: '0.35rem', borderRadius: '8px' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; }}
            >
              <ChevronRight size={16} />
            </button>
          </div>

          <button
            onClick={() => onOpenTaskModal({ due_date: currentDate.toISOString().split('T')[0] })}
            className="btn btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <Plus size={16} />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Main Calendar Body Container */}
      <div className="glass" style={{
        padding: '1.5rem',
        borderRadius: '24px',
        border: '1px solid var(--card-border)',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {/* Days of Week Row */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem',
          textAlign: 'center',
          fontWeight: 600,
          color: 'var(--text-secondary)',
          fontSize: '0.85rem',
          borderBottom: '1px solid var(--card-border)',
          paddingBottom: '0.75rem'
        }}>
          {weekDays.map(day => (
            <div key={day}>{day}</div>
          ))}
        </div>

        {/* Calendar Day Grid cells */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: '0.5rem'
        }}>
          {cells.map((cell, idx) => {
            const dayTasks = getTasksForDate(cell.dateStr);
            const cellToday = isToday(cell.dateStr);

            return (
              <div
                key={idx}
                onClick={() => onOpenTaskModal({ due_date: cell.dateStr })}
                className={`calendar-cell ${cellToday ? 'today' : ''} ${!cell.currentMonth ? 'other-month' : ''}`}
                style={{
                  minHeight: '100px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  overflow: 'hidden'
                }}
              >
                {/* Cell date header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    fontSize: '0.85rem',
                    fontWeight: cellToday ? 'bold' : 500,
                    color: cellToday ? 'var(--accent-cyan)' : 'inherit',
                    background: cellToday ? 'rgba(0, 240, 255, 0.1)' : 'transparent',
                    padding: cellToday ? '0.1rem 0.35rem' : 0,
                    borderRadius: '4px'
                  }}>{cell.day}</span>
                  {dayTasks.length > 0 && (
                    <span style={{
                      fontSize: '0.65rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600
                    }}>{dayTasks.length} Tasks</span>
                  )}
                </div>

                {/* Due Tasks List inside cell */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                  overflowY: 'auto',
                  flex: 1
                }}>
                  {dayTasks.map(task => {
                    const taskOverdue = isOverdue(task);
                    return (
                      <div
                        key={task.id}
                        onClick={(e) => {
                          e.stopPropagation(); // prevent opening empty date modal
                          onOpenTaskModal(task);
                        }}
                        style={{
                          fontSize: '0.7rem',
                          padding: '0.25rem 0.4rem',
                          background: task.status === 'done' ? 'rgba(16,185,129,0.05)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${taskOverdue ? 'var(--error)' : 'var(--card-border)'}`,
                          borderLeft: `3px solid ${task.status === 'done' ? '#10b981' : getPriorityColor(task.priority)}`,
                          borderRadius: '4px',
                          color: task.status === 'done' ? 'var(--text-muted)' : taskOverdue ? 'var(--error)' : 'var(--text-primary)',
                          textDecoration: task.status === 'done' ? 'line-through' : 'none',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          fontWeight: 500,
                          cursor: 'pointer'
                        }}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Calendar Legend indicators */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap',
        fontSize: '0.8rem',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)' }} />
          <span>Low Priority</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--warning)' }} />
          <span>Medium Priority</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--error)' }} />
          <span>High Priority</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981' }} />
          <span>Completed Task</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--error)', fontWeight: 'bold' }}>
          <AlertCircle size={12} />
          <span>Overdue Milestone</span>
        </div>
      </div>
    </div>
  );
}
