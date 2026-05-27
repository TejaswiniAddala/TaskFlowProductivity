import React, { useState } from 'react';
import { apiRequest } from '../api';
import { Mail, Lock, User, Image, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthPages({ isRegisterInitial = false, setRoute, onLoginSuccess }) {
  const [isRegister, setIsRegister] = useState(isRegisterInitial);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister ? { name, email, password, avatar } : { email, password };

    try {
      const data = await apiRequest(endpoint, 'POST', payload);
      onLoginSuccess(data.token, data.user);
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(circle at center, #2e1005 0%, #030712 100%)',
      padding: '1.5rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background neon glows */}
      <div style={{
        position: 'absolute',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'rgba(249, 115, 22, 0.15)',
        filter: 'blur(80px)',
        top: '20%',
        left: '20%',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        width: '350px',
        height: '350px',
        borderRadius: '50%',
        background: 'rgba(234, 88, 12, 0.15)',
        filter: 'blur(90px)',
        bottom: '20%',
        right: '20%',
        zIndex: 0
      }} />

      <div className="glass-card animate-scale-up" style={{
        maxWidth: '450px',
        width: '100%',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        zIndex: 1,
        padding: '2.5rem 2rem',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            display: 'inline-flex',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 'bold',
            fontSize: '1.5rem',
            color: '#fff',
            marginBottom: '0.75rem',
            boxShadow: '0 4px 15px rgba(99, 102, 241, 0.4)'
          }}>TF</div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.25rem' }}>
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            {isRegister ? 'Join TaskFlow and supercharge your focus.' : 'Log in to continue planning your day.'}
          </p>
        </div>

        {error && (
          <div className="animate-fade-in" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#f87171',
            fontSize: '0.85rem',
            marginBottom: '1.5rem'
          }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isRegister && (
            <>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Full Name</label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    required
                    placeholder="Sarah Jenkins"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Avatar URL (Optional)</label>
                <div style={{ position: 'relative' }}>
                  <Image size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '2.5rem' }}
                  />
                </div>
              </div>
            </>
          )}

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="email"
                required
                placeholder="sarah@taskflow.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}>
            {loading ? 'Authenticating...' : isRegister ? 'Create Free Account' : 'Log In to System'}
          </button>
        </form>


        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'Already have an account? ' : 'New to TaskFlow? '}
          </span>
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-indigo)',
            fontWeight: '600',
            cursor: 'pointer',
            padding: 0
          }}>
            {isRegister ? 'Log In Instead' : 'Create Free Account'}
          </button>
        </div>

        {/* Back Link */}
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button onClick={() => setRoute('landing')} style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '0.8rem',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}>
            ← Return to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}
