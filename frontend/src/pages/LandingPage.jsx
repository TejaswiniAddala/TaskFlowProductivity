import React from 'react';
import { CheckSquare, Zap, Clock, Shield, Calendar, Users, BarChart3, BellRing } from 'lucide-react';

export default function LandingPage({ setRoute }) {
  const features = [
    { icon: <CheckSquare className="text-cyan-400" size={24} style={{ color: 'var(--accent-cyan)' }} />, title: "Agile Task Management", desc: "Create, schedule, prioritize and progress tasks seamlessly with our drag-and-drop Kanban flow." },
    { icon: <Clock className="text-indigo-400" size={24} style={{ color: 'var(--accent-indigo)' }} />, title: "Pomodoro Focus Engine", desc: "Lock in deep work with our integrated countdown timer directly mapped to your active workflows." },
    { icon: <Users className="text-purple-400" size={24} style={{ color: 'var(--accent-purple)' }} />, title: "Real-time Team Workspace", desc: "Invite collaborators, delegate issues, leave feedback, and track statuses in synchronized channels." },
    { icon: <Calendar className="text-pink-400" size={24} style={{ color: 'var(--accent-pink)' }} />, title: "Deadline Calendar", desc: "Keep deadlines visible in our full calendar layout synced with optional two-way integrations." },
    { icon: <BarChart3 className="text-emerald-400" size={24} style={{ color: '#10b981' }} />, title: "Productivity Metrics", desc: "Generate visual chart trend reports, complete tasks, track weekly completion progress and build hot streaks." },
    { icon: <BellRing className="text-amber-400" size={24} style={{ color: '#f59e0b' }} />, title: "Interactive Alerts", desc: "Stay informed about comment responses, team task assignments, and imminent milestone due dates." }
  ];

  return (
    <div className="landing-container animate-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'radial-gradient(ellipse at top, #0f172a, var(--bg-primary))',
      overflow: 'hidden',
      padding: '2rem 1rem'
    }}>
      {/* Top Header Navigation */}
      <header style={{
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid var(--card-border)',
        marginBottom: '4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent-indigo), var(--accent-purple))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            color: '#fff',
            fontSize: '1.25rem',
            fontFamily: 'var(--font-display)',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}>TF</div>
          <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', fontWeight: '800', background: 'linear-gradient(to right, #ffffff, var(--accent-cyan))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>TaskFlow</span>
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginLeft: 'auto' }}>
          <button onClick={() => setRoute('login')} className="btn btn-secondary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Log In</button>
          <button onClick={() => setRoute('register')} className="btn btn-primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem', animation: 'pulse-glowing 2s infinite' }}>Register Free</button>
        </div>
      </header>

      {/* Main Hero Section */}
      <main style={{
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem'
      }}>
        <div className="badge animate-fade-in" style={{
          background: 'rgba(99, 102, 241, 0.15)',
          color: 'var(--accent-cyan)',
          border: '1px solid rgba(0, 240, 255, 0.3)',
          padding: '0.4rem 1rem',
          fontSize: '0.85rem',
          letterSpacing: '0.05em',
          marginBottom: '0.5rem'
        }}>
          🚀 REVOLUTIONIZE YOUR WORKFLOW
        </div>

        <h1 style={{
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          lineHeight: '1.1',
          fontFamily: 'var(--font-display)',
          fontWeight: '800',
          maxWidth: '850px',
          background: 'linear-gradient(to bottom, #ffffff 60%, #9ca3af)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          Plan Better. Stay Focused.<br />
          <span style={{ background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-indigo))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Get More Done.</span>
        </h1>

        <p style={{
          fontSize: 'clamp(1rem, 2vw, 1.2rem)',
          color: 'var(--text-secondary)',
          maxWidth: '650px',
          lineHeight: '1.6',
          marginBottom: '2rem'
        }}>
          The ultimate multi-dimensional task dashboard combining collaborative agile cards, Pomodoro focus trackers, calendar views, and deep metric charting in one premium, high-speed ecosystem.
        </p>

        <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '4rem' }}>
          <button onClick={() => setRoute('register')} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem', display: 'flex', gap: '0.75rem' }}>
            <span>Get Started Immediately</span>
            <Zap size={18} />
          </button>
          <button onClick={() => setRoute('login')} className="btn btn-secondary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
            Live Interactive Demo
          </button>
        </div>

        {/* Feature Grid Section */}
        <section style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          textAlign: 'left',
          marginBottom: '6rem'
        }}>
          {features.map((feat, idx) => (
            <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--card-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '0.5rem'
              }}>
                {feat.icon}
              </div>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>{feat.title}</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>{feat.desc}</p>
            </div>
          ))}
        </section>

        {/* Visual Callout / Glass Card */}
        <section className="glass" style={{
          width: '100%',
          borderRadius: '24px',
          padding: '3rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1rem',
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(0, 240, 255, 0.05))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '4rem'
        }}>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-display)', color: '#fff' }}>Stop juggling apps. Consolidate your productivity.</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', fontSize: '0.95rem' }}>
            Ready to experience flow state? Connect your calendar, synchronize comments with your teammates, and visually chart your weekly achievements in one premium dark dashboard.
          </p>
          <button onClick={() => setRoute('register')} className="btn btn-primary" style={{ marginTop: '1rem', padding: '0.75rem 2rem' }}>
            Create Account & Save First Task
          </button>
        </section>
      </main>

      <footer style={{
        marginTop: 'auto',
        textAlign: 'center',
        padding: '2rem 1rem',
        borderTop: '1px solid var(--card-border)',
        color: 'var(--text-muted)',
        fontSize: '0.85rem'
      }}>
        © 2026 TaskFlow Productivity Platform. Plan Better. Stay Focused. Get More Done.
      </footer>
    </div>
  );
}
