import React, { useState, useMemo } from 'react';
import { Sparkles, Send, Bot, User, Lightbulb, Target, Brain, Zap } from 'lucide-react';
import { getRoleConfig, getAISuggestions, getDailySchedule } from '../config/roleConfig';

export default function AICoachPage({ tasks, user, pomodoroStats }) {
  const role = user?.role || 'student';
  const config = getRoleConfig(role);
  const suggestions = useMemo(() => getAISuggestions(role, tasks), [role, tasks]);
  const schedule = getDailySchedule(role);

  const [chatMessages, setChatMessages] = useState([
    { from: 'ai', text: config.aiGreeting }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    
    const userMessage = inputMsg.trim();
    setChatMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setInputMsg('');
    
    try {
      // Show typing indicator
      setChatMessages(prev => [...prev, { from: 'ai', text: '...', isTyping: true }]);
      
      const { apiRequest } = await import('../api.js');
      const response = await apiRequest('/ai/chat', 'POST', {
        message: userMessage,
        role: role,
        persona: config.aiPersona,
        contextTasks: tasks.filter(t => t.status !== 'done')
      });
      
      // Replace typing indicator with actual response
      setChatMessages(prev => {
        const withoutTyping = prev.filter(m => !m.isTyping);
        return [...withoutTyping, { from: 'ai', text: response.reply }];
      });
    } catch (error) {
      console.error(error);
      setChatMessages(prev => {
        const withoutTyping = prev.filter(m => !m.isTyping);
        return [...withoutTyping, { from: 'ai', text: 'I am currently offline or missing my API key. Please check the server connection.' }];
      });
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{config.icon}</span>
          <span style={{ fontSize: '0.75rem', background: `rgba(${config.accentRgb}, 0.12)`, color: config.accent, padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>{config.aiPersona}</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>{config.aiPersona}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Your personalized AI assistant tailored for {config.label.toLowerCase()} workflows.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="dashboard-grid">
        {/* Chat Panel */}
        <div className="glass" style={{ padding: '0', borderRadius: '20px', border: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', height: '500px', overflow: 'hidden', gridColumn: 'span 7' }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Bot size={18} style={{ color: config.accent }} />
            <span style={{ fontWeight: 700, fontFamily: 'var(--font-display)' }}>Chat with {config.aiPersona}</span>
          </div>

          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {chatMessages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.5rem', alignSelf: msg.from === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                {msg.from === 'ai' && <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `rgba(${config.accentRgb}, 0.15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><Sparkles size={14} style={{ color: config.accent }} /></div>}
                <div style={{
                  padding: '0.75rem 1rem', borderRadius: '14px', fontSize: '0.875rem', lineHeight: 1.5,
                  background: msg.from === 'user' ? config.gradient : 'var(--bg-tertiary)',
                  color: msg.from === 'user' ? '#fff' : 'var(--text-secondary)',
                  border: msg.from === 'ai' ? '1px solid var(--card-border)' : 'none'
                }}>{msg.text}</div>
                {msg.from === 'user' && <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}><User size={14} /></div>}
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem', padding: '0.75rem', borderTop: '1px solid var(--card-border)', background: 'var(--bg-tertiary)' }}>
            <input type="text" value={inputMsg} onChange={(e) => setInputMsg(e.target.value)} placeholder={`Ask your ${config.aiPersona}...`} className="form-input" style={{ flex: 1, borderRadius: '10px' }} />
            <button type="submit" className="btn btn-primary" style={{ padding: '0.6rem', borderRadius: '10px', background: config.gradient }}><Send size={16} /></button>
          </form>
        </div>

        {/* Right: Schedule + Suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 5' }}>
          {/* AI Schedule */}
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Zap size={16} style={{ color: config.accent }} /> AI-Optimized Schedule
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {schedule.map((slot, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 0.65rem', borderRadius: '8px', background: slot.type === 'break' ? 'rgba(16,185,129,0.04)' : 'var(--bg-tertiary)', border: '1px solid var(--card-border)', fontSize: '0.82rem' }}>
                  <span style={{ color: config.accent, fontWeight: 700, minWidth: '65px', fontSize: '0.75rem' }}>{slot.time}</span>
                  <span style={{ color: slot.type === 'break' ? '#10b981' : 'var(--text-primary)', fontWeight: 500 }}>{slot.task}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="glass" style={{ padding: '1.25rem', borderRadius: '20px', border: `1px solid rgba(${config.accentRgb}, 0.12)` }}>
            <h3 style={{ fontSize: '1.05rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Brain size={16} style={{ color: config.accent }} /> Smart Insights
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {suggestions.map((s, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', padding: '0.5rem 0.65rem', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', fontSize: '0.8rem' }}>
                  <span style={{ flexShrink: 0 }}>{s.type === 'warning' ? '⚠️' : s.type === 'success' ? '✅' : s.type === 'tip' ? '💡' : s.type === 'insight' ? '🧠' : '🎯'}</span>
                  <span style={{ color: 'var(--text-secondary)' }}>{s.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style>{`@media(max-width:900px){.dashboard-grid{grid-template-columns:1fr!important;}.dashboard-grid>div{grid-column:span 12!important;}}`}</style>
    </div>
  );
}
