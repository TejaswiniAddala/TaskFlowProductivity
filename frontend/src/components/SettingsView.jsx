import React, { useState } from 'react';
import { Settings, User, Bell, Shield, Calendar, Sparkles, Check } from 'lucide-react';

export default function SettingsView({ user, theme, toggleTheme }) {
  const [calendarSync, setCalendarSync] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [deadlineReminders, setDeadlineReminders] = useState(true);
  const [assignmentAlerts, setAssignmentAlerts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setLoading(true);
    setSaveSuccess(false);

    // Simulate saving parameters to backend
    setTimeout(() => {
      setLoading(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Option */}
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>Workspace Settings</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Customize your profile, notification bell parameters, and external API sync controls.
        </p>
      </div>

      {/* Grid: Settings Panel Blocks */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '2.0rem' }} className="dashboard-grid">
        
        {/* Left Column: Form settings and Integrations */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 7' }}>
          
          <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Notification settings block */}
            <div className="glass" style={{ padding: '1.75rem', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Bell size={18} style={{ color: 'var(--accent-indigo)' }} />
                <span>Alert Notifications</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Checkbox 1 */}
                <label style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={emailAlerts}
                    onChange={(e) => setEmailAlerts(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: 'var(--accent-indigo)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block' }}>Email Daily Digests</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Receive a summarized digest of items due on your calendar daily.</span>
                  </div>
                </label>

                {/* Checkbox 2 */}
                <label style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={deadlineReminders}
                    onChange={(e) => setDeadlineReminders(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: 'var(--accent-indigo)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block' }}>Upcoming Deadline Reminders</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Get notified 24 hours prior to imminent task milestone expirations.</span>
                  </div>
                </label>

                {/* Checkbox 3 */}
                <label style={{ display: 'flex', alignItems: 'start', gap: '0.75rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={assignmentAlerts}
                    onChange={(e) => setAssignmentAlerts(e.target.checked)}
                    style={{ marginTop: '3px', accentColor: 'var(--accent-indigo)' }}
                  />
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 500, display: 'block' }}>Collaborator Activity Broadcasts</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Get notified when team delegates assign you tasks or comments.</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Google Calendar Sync settings block */}
            <div className="glass" style={{ padding: '1.75rem', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
              <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} style={{ color: 'var(--accent-cyan)' }} />
                <span>Integrations: Google Calendar</span>
              </h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.95rem', fontWeight: 600, display: 'block' }}>Two-way Calendar Synchronization</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Automatically sync task due dates directly into your Google Calendar event streams.
                    </span>
                  </div>

                  {/* Switch button styling */}
                  <button
                    type="button"
                    onClick={() => {
                      setCalendarSync(!calendarSync);
                      if (!calendarSync) alert("🔗 Secure OAuth authorization verified. Real-time Google Calendar deadline streams are active.");
                    }}
                    style={{
                      width: '46px',
                      height: '24px',
                      borderRadius: '15px',
                      background: calendarSync ? 'var(--accent-indigo)' : 'var(--bg-tertiary)',
                      border: '1px solid var(--card-border)',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'background 0.2s',
                      flexShrink: 0
                    }}
                  >
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      left: calendarSync ? '24px' : '2px',
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: '#fff',
                      transition: 'left 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }} />
                  </button>
                </div>

                {calendarSync && (
                  <div className="animate-fade-in" style={{
                    padding: '0.85rem 1rem',
                    borderRadius: '10px',
                    background: 'rgba(0, 240, 255, 0.05)',
                    border: '1px solid rgba(0, 240, 255, 0.15)',
                    fontSize: '0.75rem',
                    color: 'var(--accent-cyan)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <Sparkles size={14} style={{ flexShrink: 0 }} />
                    <span>Sync status: OAuth Token active. Milestones are synchronizing live.</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ minWidth: '150px' }}>
                {loading ? 'Saving Parameters...' : 'Save Configuration'}
              </button>

              {saveSuccess && (
                <div className="animate-fade-in" style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#10b981',
                  fontSize: '0.85rem',
                  fontWeight: 600
                }}>
                  <Check size={16} />
                  <span>Settings updated successfully!</span>
                </div>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: User details block */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 5' }}>
          
          <div className="glass" style={{
            padding: '1.75rem',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.25rem'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'start', width: '100%', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.75rem' }}>
              <User size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span>User Profile Details</span>
            </h3>

            {user && (
              <>
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
                  alt=""
                  style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    border: '3px solid var(--accent-indigo)',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.25)',
                    objectFit: 'cover'
                  }}
                />

                <div>
                  <h4 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', fontWeight: '700' }}>{user.name}</h4>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{user.email}</span>
                </div>

                <div style={{
                  width: '100%',
                  background: 'var(--bg-tertiary)',
                  padding: '0.85rem 1rem',
                  borderRadius: '12px',
                  border: '1px solid var(--card-border)',
                  fontSize: '0.75rem',
                  color: 'var(--text-secondary)',
                  textAlign: 'left',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Account Category:</span>
                    <span style={{ color: '#fff', fontWeight: 600 }}>Developer Premium</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Google Sync Token:</span>
                    <span style={{ color: '#10b981', fontWeight: 600 }}>Connected</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>System Session Expiry:</span>
                    <span style={{ color: 'var(--text-muted)' }}>Never Expiry</span>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick theme shortcut card */}
          <div className="glass" style={{
            padding: '1.75rem',
            borderRadius: '20px',
            border: '1px solid var(--card-border)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem'
          }}>
            <h4 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Workspace Appearance</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Toggle visual colors between default premium dark mode and high-contrast light mode.</p>
            <button onClick={toggleTheme} className="btn btn-secondary" style={{ width: '100%' }}>
              Toggle workspace theme ({theme === 'dark' ? 'Light Theme' : 'Dark Theme'})
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
