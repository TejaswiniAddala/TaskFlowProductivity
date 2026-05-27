import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, AlertTriangle, CheckSquare, Plus, CheckCircle2, Award, Zap, Volume2 } from 'lucide-react';
import { apiRequest } from '../api';

export default function DailyPlanner({
  tasks,
  onAddTask,
  onUpdateTask,
  onOpenTaskModal,
  user,
  setPomodoroStats
}) {
  // Today's Date Formatting
  const todayStr = new Date().toISOString().split('T')[0];
  const formattedDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  // Today's Tasks
  const todayTasks = tasks.filter(t => t.due_date === todayStr);
  const completedToday = todayTasks.filter(t => t.status === 'done').length;
  const progressPct = todayTasks.length > 0 ? Math.round((completedToday / todayTasks.length) * 100) : 0;

  // Planner States
  const [quickTitle, setQuickTitle] = useState('');

  // Pomodoro States
  const [sessionType, setSessionType] = useState('work'); // 'work' or 'break'
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [sessionsLoggedCount, setSessionsLoggedCount] = useState(0);

  // Audio Beep generator using Web Audio API (zero dependency, zero file loading required)
  const playAlertSound = () => {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      
      // Beep 1
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(880, audioCtx.currentTime); // A5 note
      gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.15);

      // Beep 2 (delayed slightly)
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1200, audioCtx.currentTime); // Higher beep
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.25);
      }, 200);

    } catch (e) {
      console.error("Web Audio beep failure", e);
    }
  };

  // Timer Countdown Logic
  useEffect(() => {
    let interval = null;
    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0) {
      // Alarm Beep Sound
      playAlertSound();
      setIsActive(false);

      if (sessionType === 'work') {
        handleLogSession();
      } else {
        // Break done -> return to work
        setSessionType('work');
        setSecondsLeft(25 * 60);
        alert("Break ended! Ready to focus on the next task?");
      }
    }
    return () => clearInterval(interval);
  }, [isActive, secondsLeft, sessionType]);

  // Handle logging Pomodoro
  const handleLogSession = async () => {
    try {
      const duration = 25 * 60; // 25 mins
      const payload = {
        task_id: selectedTaskId ? parseInt(selectedTaskId) : null,
        duration
      };

      const newSession = await apiRequest('/pomodoro/session', 'POST', payload);
      setSessionsLoggedCount(prev => prev + 1);

      // Sync user stats
      const stats = await apiRequest('/pomodoro/stats', 'GET');
      setPomodoroStats(stats);

      // Auto update task if one was mapped to done or progress
      if (selectedTaskId) {
        const activeTask = todayTasks.find(t => t.id === parseInt(selectedTaskId));
        if (activeTask && activeTask.status === 'todo') {
          onUpdateTask({ ...activeTask, status: 'in_progress' });
        }
      }

      alert("🎉 Focus session completed! Seeding metrics inside database. Enjoy a 5-minute break.");
      
      // Auto toggle to break
      setSessionType('break');
      setSecondsLeft(5 * 60);
    } catch (err) {
      console.error('Failed to log Pomodoro:', err);
    }
  };

  // Timer controls
  const handleToggleTimer = () => {
    setIsActive(!isActive);
  };

  const handleResetTimer = () => {
    setIsActive(false);
    setSecondsLeft(sessionType === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleSetSessionType = (type) => {
    setIsActive(false);
    setSessionType(type);
    setSecondsLeft(type === 'work' ? 25 * 60 : 5 * 60);
  };

  const handleQuickAdd = (e) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onAddTask({
      title: quickTitle,
      description: 'Added directly from Today\'s Plan Focus Station.',
      status: 'todo',
      priority: 'medium',
      due_date: todayStr,
      team_id: null,
      user_id: user.id
    });
    setQuickTitle('');
  };

  // Format MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Pomodoro circular progression calculations
  const totalDuration = sessionType === 'work' ? 25 * 60 : 5 * 60;
  const progressRatio = secondsLeft / totalDuration;
  const strokeDashoffset = 565.48 * (1 - progressRatio); // circumference of radius 90 is ~565.48

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Date Header Title */}
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>Today's Focus Station</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Schedule and lock in on today's goals. Today is <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{formattedDate}</span>.
        </p>
      </div>

      {/* Grid: Planner vs Pomodoro Timer */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }} className="dashboard-grid">
        
        {/* Left column: Daily planner task manager */}
        <div className="glass" style={{
          padding: '1.75rem',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          gridColumn: 'span 7'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)' }}>Focus Target List</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Finish these tasks to hit your target.</p>
          </div>

          {/* Completion Progress Bar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--card-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600 }}>
              <span>Daily Target Completion</span>
              <span style={{ color: 'var(--accent-cyan)' }}>{progressPct}% Completed</span>
            </div>
            <div className="progress-bar-container" style={{ height: '12px' }}>
              <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
            </div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Completed {completedToday} of {todayTasks.length} total scheduled tasks.
            </span>
          </div>

          {/* Add task form */}
          <form onSubmit={handleQuickAdd} style={{ display: 'flex', gap: '0.75rem' }}>
            <input
              type="text"
              required
              placeholder="What task needs processing today?..."
              value={quickTitle}
              onChange={(e) => setQuickTitle(e.target.value)}
              className="form-input"
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
              <Plus size={18} />
              <span>Add to Plan</span>
            </button>
          </form>

          {/* Tasks List */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {todayTasks.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '4rem 1rem',
                color: 'var(--text-muted)',
                border: '1px dashed var(--card-border)',
                borderRadius: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem'
              }}>
                <CheckSquare size={48} style={{ color: 'rgba(255,255,255,0.06)' }} />
                <div>
                  <h4 style={{ color: '#fff', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Your Board is Empty</h4>
                  <p style={{ fontSize: '0.8rem' }}>Add or schedule tasks here to initialize today's planning schedule.</p>
                </div>
              </div>
            ) : (
              todayTasks.map(task => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'between',
                    padding: '0.85rem 1.25rem',
                    background: 'var(--bg-tertiary)',
                    borderRadius: '14px',
                    border: '1px solid var(--card-border)',
                    gap: '1rem',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <button
                    onClick={() => onUpdateTask({ ...task, status: task.status === 'done' ? 'todo' : 'done' })}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: task.status === 'done' ? 'var(--success)' : 'var(--text-muted)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <CheckCircle2 size={22} style={{ fill: task.status === 'done' ? 'rgba(16,185,129,0.1)' : 'none' }} />
                  </button>

                  <div
                    onClick={() => onOpenTaskModal(task)}
                    style={{ flex: 1, cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '0.15rem' }}
                  >
                    <span style={{
                      fontWeight: 600,
                      fontSize: '0.925rem',
                      textDecoration: task.status === 'done' ? 'line-through' : 'none',
                      color: task.status === 'done' ? 'var(--text-muted)' : 'var(--text-primary)'
                    }}>{task.title}</span>
                    {task.description && (
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '350px' }}>
                        {task.description}
                      </span>
                    )}
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    fontWeight: 'bold',
                    color: task.priority === 'high' ? 'var(--error)' : task.priority === 'medium' ? 'var(--warning)' : '#10b981',
                    background: 'rgba(255,255,255,0.03)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    border: '1px solid var(--card-border)'
                  }}>{task.priority}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right column: Circular Pomodoro focus timer ring */}
        <div className="glass" style={{
          padding: '1.75rem',
          borderRadius: '20px',
          border: '1px solid var(--card-border)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
          gridColumn: 'span 5',
          textAlign: 'center'
        }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-display)' }}>Focus Pomodoro</h2>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Maximize your efficiency in deep cycles.</p>
          </div>

          {/* Session Switch buttons */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--card-border)',
            borderRadius: '10px',
            padding: '0.25rem'
          }}>
            <button
              onClick={() => handleSetSessionType('work')}
              style={{
                background: sessionType === 'work' ? 'var(--accent-indigo)' : 'none',
                border: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Deep Work (25m)
            </button>
            <button
              onClick={() => handleSetSessionType('break')}
              style={{
                background: sessionType === 'break' ? 'var(--accent-indigo)' : 'none',
                border: 'none',
                color: '#fff',
                fontSize: '0.8rem',
                fontWeight: 600,
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              Short Break (5m)
            </button>
          </div>

          {/* Circular SVG Ring Countdown */}
          <div className="pomodoro-ring">
            <svg width="200" height="200" className="pomodoro-circle-svg">
              <circle cx="100" cy="100" r="90" className="pomodoro-circle-bg" />
              <circle
                cx="100"
                cy="100"
                r="90"
                className="pomodoro-circle-progress"
                style={{
                  stroke: sessionType === 'work' ? 'var(--accent-indigo)' : '#10b981',
                  strokeDasharray: '565.48',
                  strokeDashoffset: strokeDashoffset
                }}
              />
            </svg>
            <div style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center'
            }}>
              <span style={{ fontSize: '2.25rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>
                {formatTime(secondsLeft)}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {sessionType === 'work' ? '🧠 Focused Work' : '☕ Rest Period'}
              </span>
            </div>
          </div>

          {/* Connect Task Selector */}
          {sessionType === 'work' && (
            <div style={{ width: '100%' }}>
              <label className="form-label" style={{ textAlign: 'left' }}>Map focus to active task:</label>
              <select
                value={selectedTaskId}
                onChange={(e) => setSelectedTaskId(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              >
                <option value="">Personal Focus (No Task Linked)</option>
                {todayTasks.filter(t => t.status !== 'done').map(t => (
                  <option key={t.id} value={t.id}>{t.title}</option>
                ))}
              </select>
            </div>
          )}

          {/* Action Trigger Buttons */}
          <div style={{ display: 'flex', gap: '0.75rem', width: '100%' }}>
            <button
              onClick={handleToggleTimer}
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '0.75rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                background: isActive ? '#dc2626' : 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))'
              }}
            >
              {isActive ? <Pause size={18} /> : <Play size={18} />}
              <span>{isActive ? 'Pause Interval' : 'Start Focus'}</span>
            </button>

            <button
              onClick={handleResetTimer}
              className="btn btn-secondary"
              style={{ padding: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RotateCcw size={18} />
            </button>
          </div>

          {/* Web Audio Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Volume2 size={12} />
            <span>Smart audio oscillator notifications enabled.</span>
          </div>

          {/* Metric sessions counts */}
          {sessionsLoggedCount > 0 && (
            <div className="animate-fade-in" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(16,185,129,0.06)',
              border: '1px solid rgba(16,185,129,0.15)',
              padding: '0.5rem 0.75rem',
              borderRadius: '8px',
              color: '#10b981',
              fontSize: '0.75rem',
              fontWeight: 600,
              width: '100%',
              justifyContent: 'center'
            }}>
              <Award size={14} />
              <span>You logged {sessionsLoggedCount} Focus Cycles today!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
