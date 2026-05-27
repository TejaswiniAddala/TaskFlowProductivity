import React, { useState } from 'react';
import { Bell, Check, Trash2, MailOpen } from 'lucide-react';
import { apiRequest } from '../api';

export default function Notifications({ notifications, setNotifications }) {
  const [open, setOpen] = useState(false);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      await apiRequest(`/notifications/${id}/read`, 'PUT');
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: 1 } : n));
    } catch (err) {
      console.error('Failed to mark read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await apiRequest('/notifications/read-all', 'PUT');
      setNotifications(prev => prev.map(n => ({ ...n, read: 1 })));
    } catch (err) {
      console.error('Failed to mark all read:', err);
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Bell Button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--card-border)',
          borderRadius: '12px',
          width: '42px',
          height: '42px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          position: 'relative',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--accent-indigo)'; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'var(--card-border)'; }}
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-4px',
            right: '-4px',
            background: 'var(--error)',
            color: '#fff',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            borderRadius: '50%',
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            border: '2px solid var(--bg-primary)',
            animation: 'pulse-glowing 2s infinite'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Card */}
      {open && (
        <>
          {/* Overlay to close */}
          <div
            onClick={() => setOpen(false)}
            style={{
              position: 'fixed',
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 998
            }}
          />

          <div className="glass animate-scale-up" style={{
            position: 'absolute',
            top: '50px',
            right: 0,
            width: '320px',
            borderRadius: '16px',
            border: '1px solid var(--card-border)',
            padding: '1rem',
            zIndex: 999,
            maxHeight: '400px',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
            background: 'var(--card-bg-solid)',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Alert Notifications</span>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--accent-indigo)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <MailOpen size={12} />
                  <span>Read All</span>
                </button>
              )}
            </div>

            {/* List */}
            <div style={{
              overflowY: 'auto',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              flex: 1
            }}>
              {notifications.length === 0 ? (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem'
                }}>
                  No notifications recorded. You're completely up to date!
                </div>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '10px',
                      background: notif.read ? 'transparent' : 'rgba(99, 102, 241, 0.06)',
                      border: `1px solid ${notif.read ? 'transparent' : 'rgba(99, 102, 241, 0.15)'}`,
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'start',
                      gap: '0.5rem',
                      position: 'relative',
                      transition: 'background 0.2s'
                    }}
                  >
                    {/* Unread circle */}
                    {!notif.read && (
                      <span style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: 'var(--accent-cyan)',
                        marginTop: '5px',
                        flexShrink: 0
                      }} />
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1, paddingRight: '1.25rem' }}>
                      <span style={{ color: notif.read ? 'var(--text-secondary)' : 'var(--text-primary)', lineHeight: '1.4' }}>
                        {notif.message}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    {!notif.read && (
                      <button
                        onClick={() => markAsRead(notif.id)}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'none',
                          border: 'none',
                          color: 'var(--text-muted)',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '0.15rem',
                          borderRadius: '4px'
                        }}
                        onMouseEnter={(e) => { e.currentTarget.style.color = '#10b981'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; }}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
