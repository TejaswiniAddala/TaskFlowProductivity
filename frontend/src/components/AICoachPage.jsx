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

  // Simulated AI responses based on role
  const generateAIResponse = (userMsg) => {
    const lower = userMsg.toLowerCase();
    const responses = {
      student: {
        'schedule': 'Based on your subjects, I recommend: 2 hours DSA in the morning, 1.5 hours DBMS after lunch, and revision before bed. Shall I create this as a plan?',
        'exam': `Your next exam is approaching! Focus on high-yield topics first. I'd suggest starting with revision of weak areas identified in your analytics.`,
        'default': `As your Study Coach, I recommend focusing on your highest-priority assignments first. You have ${tasks.filter(t => t.status !== 'done').length} pending tasks. Want me to create a study plan?`
      },
      employee: {
        'meeting': 'I see you have meetings scheduled. I recommend blocking 2 hours of deep work before your first meeting for maximum productivity.',
        'report': 'I can help structure your report. Start with key metrics, then team updates, and finish with blockers. Want me to outline it?',
        'default': `Your workplace efficiency is looking good! You have ${tasks.filter(t => t.priority === 'high' && t.status !== 'done').length} high-priority items. Shall I help prioritize your day?`
      },
      freelancer: {
        'invoice': 'I notice some invoices may be pending. Sending reminders before noon gets 40% faster responses. Want me to draft a follow-up?',
        'client': 'Managing multiple clients? I recommend time-blocking: dedicate specific hours to each client. This reduces context-switching by 60%.',
        'default': `As your Business Manager, I see ${tasks.filter(t => t.status !== 'done').length} active project items. Let me help optimize your client workflow.`
      },
      startup: {
        'sprint': 'For optimal sprint planning, keep tasks under 8 per sprint. Your current sprint has good velocity. Want me to analyze bottlenecks?',
        'team': 'Team productivity looks healthy! I recommend a quick standup to unblock any pending items. Async updates can save 30% meeting time.',
        'default': `Your startup ops are tracking well! Sprint velocity is stable with ${tasks.filter(t => t.status === 'done').length} completed tasks. Need help with planning?`
      },
      developer: {
        'bug': 'I see critical bugs in the queue. Prioritize production-impacting issues first. Developers who take breaks every 90 mins write 15% fewer bugs.',
        'pr': 'Review open PRs before starting new features — it unblocks teammates and improves code quality. Want me to organize your review queue?',
        'default': `Hey dev! You have ${tasks.filter(t => t.status !== 'done').length} items in your sprint. Shall I help triage by priority and estimate?`
      },
      creator: {
        'content': 'Batch-filming is the most efficient strategy. Film 3 videos in one session, then schedule editing across the week. Want me to plan this?',
        'social': 'Posts between 10-11 AM get 23% higher engagement. I recommend scheduling your next upload for that window. Shall I set it up?',
        'default': `As your Creative Director, let's plan content that resonates! You have ${tasks.filter(t => t.status !== 'done').length} content items in progress.`
      },
      manager: {
        'team': 'Check in with members who haven\'t updated in 48+ hours. A quick async ping is often more effective than scheduling another meeting.',
        'delegate': 'Effective delegation tip: assign tasks with clear outcomes, not just actions. This improves completion rates by 45%.',
        'default': `As your Leadership Advisor, I see ${tasks.filter(t => t.priority === 'high' && t.status !== 'done').length} high-priority items across your team. Let me help prioritize.`
      }
    };

    const roleResponses = responses[role] || responses.student;
    for (const [keyword, response] of Object.entries(roleResponses)) {
      if (keyword !== 'default' && lower.includes(keyword)) return response;
    }
    return roleResponses.default;
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    const userMessage = inputMsg.trim();
    setChatMessages(prev => [...prev, { from: 'user', text: userMessage }]);
    setInputMsg('');
    setTimeout(() => {
      setChatMessages(prev => [...prev, { from: 'ai', text: generateAIResponse(userMessage) }]);
    }, 600);
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
