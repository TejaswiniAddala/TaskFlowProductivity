import React, { useState } from 'react';
import { LogOut, Sun, Moon, Menu, X } from 'lucide-react';
import { getRoleConfig, getSidebarMenu } from '../config/roleConfig';

export default function Sidebar({ currentRoute, setRoute, user, onLogout, theme, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const role = user?.role || 'student';
  const config = getRoleConfig(role);
  const menuItems = getSidebarMenu(role);

  const sidebarContent = (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '1.5rem', gap: '1.25rem' }}>
      {/* Brand + Role Badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '10px',
          background: config.gradient,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 'bold', color: '#fff', fontSize: '0.85rem',
          boxShadow: `0 4px 12px rgba(${config.accentRgb}, 0.35)`
        }}>TF</div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>TaskFlow</span>
          <span style={{ fontSize: '0.65rem', color: config.accent, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {config.label} Mode
          </span>
        </div>
      </div>

      {/* User Card with role indicator */}
      {user && (
        <div className="glass" style={{
          display: 'flex', alignItems: 'center', gap: '0.75rem',
          padding: '0.75rem', borderRadius: '14px',
          border: `1px solid rgba(${config.accentRgb}, 0.15)`,
          background: `linear-gradient(135deg, rgba(${config.accentRgb}, 0.04) 0%, transparent 100%)`
        }}>
          <img
            src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`}
            alt={user.name}
            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: `2px solid rgba(${config.accentRgb}, 0.25)` }}
          />
          <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', flex: 1 }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</span>
            <span style={{
              fontSize: '0.65rem', fontWeight: 600, color: config.accent,
              background: `rgba(${config.accentRgb}, 0.1)`,
              padding: '0.1rem 0.35rem', borderRadius: '4px',
              display: 'inline-block', width: 'fit-content'
            }}>
              {config.icon} {config.aiPersona}
            </span>
          </div>
        </div>
      )}

      {/* Role-Specific Navigation */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {menuItems.map(item => {
          const isActive = currentRoute === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { setRoute(item.id); setMobileOpen(false); }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                width: '100%', padding: '0.7rem 0.85rem', borderRadius: '10px',
                border: 'none', cursor: 'pointer', fontSize: '0.875rem',
                fontWeight: isActive ? 600 : 500,
                color: isActive ? '#fff' : 'var(--text-secondary)',
                background: isActive
                  ? `linear-gradient(90deg, rgba(${config.accentRgb}, 0.2) 0%, rgba(${config.accentRgb}, 0.04) 100%)`
                  : 'transparent',
                borderLeft: isActive ? `3px solid ${config.accent}` : '3px solid transparent',
                transition: 'all 0.2s ease', textAlign: 'left'
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              <span style={{ fontSize: '1.05rem', width: '24px', textAlign: 'center', filter: isActive ? 'none' : 'grayscale(0.4)' }}>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Bottom: Theme + Logout */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', borderTop: '1px solid var(--card-border)', paddingTop: '1rem' }}>
        <button
          onClick={toggleTheme}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            width: '100%', padding: '0.6rem 0.75rem', borderRadius: '10px',
            background: 'var(--bg-tertiary)', border: '1px solid var(--card-border)',
            cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500
          }}
        >
          {theme === 'dark' ? <Moon size={15} /> : <Sun size={15} />}
          <span>{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
          <span style={{ fontSize: '0.65rem', color: config.accent, marginLeft: 'auto', background: `rgba(${config.accentRgb}, 0.08)`, padding: '0.1rem 0.3rem', borderRadius: '4px' }}>Active</span>
        </button>

        <button
          onClick={onLogout}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.6rem',
            width: '100%', padding: '0.6rem 0.75rem', borderRadius: '10px',
            background: 'rgba(239, 68, 68, 0.04)', border: '1px solid rgba(239, 68, 68, 0.1)',
            color: '#ef4444', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500,
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.04)'; }}
        >
          <LogOut size={15} />
          <span>Exit Workspace</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="glass-panel desktop-sidebar" style={{
        width: 'var(--sidebar-width)', position: 'fixed',
        top: 0, bottom: 0, left: 0, zIndex: 950,
        height: '100vh', overflowY: 'auto'
      }}>
        {sidebarContent}
      </aside>

      {/* Mobile Header */}
      <header className="glass mobile-header" style={{
        height: 'var(--header-height)', padding: '0 1.25rem',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900,
        borderBottom: '1px solid var(--card-border)', display: 'none'
      }}>
        <button onClick={() => setMobileOpen(!mobileOpen)} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <div style={{ width: '26px', height: '26px', borderRadius: '6px', background: config.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: '#fff', fontSize: '0.75rem' }}>TF</div>
          <span style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>TaskFlow</span>
        </div>
        {user && <img src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${user.name}`} alt="" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />}
      </header>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div onClick={() => setMobileOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(3px)', zIndex: 980 }} />
      )}

      {/* Mobile Drawer */}
      <aside className="glass mobile-drawer" style={{
        width: 'var(--sidebar-width)', position: 'fixed',
        top: 0, bottom: 0, left: 0, zIndex: 990, height: '100vh',
        transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        overflowY: 'auto', background: 'var(--bg-secondary)',
        borderRight: '1px solid var(--card-border)', display: 'none'
      }}>
        {sidebarContent}
      </aside>

      <style>{`
        .desktop-sidebar { display: block; }
        .mobile-header, .mobile-drawer { display: none !important; }
        @media (max-width: 768px) {
          .desktop-sidebar { display: none !important; }
          .mobile-header { display: flex !important; }
          .mobile-drawer { display: block !important; }
        }
      `}</style>
    </>
  );
}
