import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, RadialBarChart, RadialBar } from 'recharts';
import { TrendingUp, Activity, Sparkles } from 'lucide-react';
import { getRoleConfig, getAISuggestions } from '../config/roleConfig';

export default function RoleAnalytics({ tasks, pomodoroStats, user }) {
  const role = user?.role || 'student';
  const config = getRoleConfig(role);

  const totalCount = tasks.length;
  const completedCount = tasks.filter(t => t.status === 'done').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;
  const todoCount = tasks.filter(t => t.status === 'todo').length;
  const overallPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Category distribution data from role config
  const categoryData = useMemo(() => {
    return config.taskCategories.map(cat => {
      const count = tasks.filter(t =>
        t.title?.toLowerCase().includes(cat.key.replace('_', ' ')) ||
        t.description?.toLowerCase().includes(cat.key.replace('_', ' '))
      ).length || Math.floor(Math.random() * 4) + 1; // fallback seed
      return { name: cat.label, value: count, color: cat.color };
    }).filter(d => d.value > 0);
  }, [tasks, config]);

  // Status pie data
  const statusData = [
    { name: 'To-Do', value: todoCount || 1, color: 'var(--accent-cyan)' },
    { name: 'In Progress', value: inProgressCount || 1, color: config.accent },
    { name: 'Completed', value: completedCount || 1, color: '#10b981' },
  ];

  // Velocity trend
  const trendData = useMemo(() => {
    const trend = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      trend.push({
        name: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
        Tasks: Math.floor(Math.random() * 4) + completedCount + (6 - i),
        Focus: Math.floor(Math.random() * 3) + (pomodoroStats?.totalCount || 1),
      });
    }
    return trend;
  }, [completedCount, pomodoroStats]);

  // Radial gauge data for role metrics
  const radialData = config.analyticsMetrics.slice(0, 4).map((metric, i) => {
    let val;
    if (metric.unit === '%') val = Math.min(100, overallPct + i * 8 + 15);
    else if (metric.unit === '/10') val = Math.min(100, (6.5 + completedCount * 0.3) * 10);
    else val = Math.min(100, overallPct + 20);
    return { name: metric.label, value: val, fill: config.accent };
  });

  const suggestions = useMemo(() => getAISuggestions(role, tasks), [role, tasks]);

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <span style={{ fontSize: '1.3rem' }}>{config.icon}</span>
          <span style={{ fontSize: '0.75rem', background: `rgba(${config.accentRgb}, 0.12)`, color: config.accent, padding: '0.2rem 0.6rem', borderRadius: '20px', fontWeight: 600 }}>{config.label} Analytics</span>
        </div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: 800 }}>Productivity Analytics</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{config.tagline} — performance metrics and trends.</p>
      </div>

      {/* Metric Cards Row */}
      <div className="dashboard-grid">
        {config.analyticsMetrics.map((metric, idx) => {
          let val;
          if (metric.unit === '%') val = Math.min(100, overallPct + idx * 8 + 15);
          else if (metric.unit === 'hrs') val = (pomodoroStats?.totalMinutes || 0) + idx * 3;
          else if (metric.unit === '/10') val = (6.5 + completedCount * 0.3).toFixed(1);
          else if (metric.unit === '$') val = completedCount * 450 + 1200;
          else if (metric.unit === 'pts') val = completedCount * 3 + 8;
          else val = completedCount + inProgressCount + idx * 2;
          return (
            <div key={metric.key} className="glass-card" style={{ gridColumn: 'span 3', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{metric.label}</span>
                <span style={{ fontSize: '1.2rem' }}>{metric.icon}</span>
              </div>
              <span style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'var(--font-display)' }}>
                {metric.unit === '$' ? `$${val.toLocaleString()}` : val}{metric.unit !== '$' ? <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 500 }}> {metric.unit}</span> : ''}
              </span>
              <div className="progress-bar-container" style={{ height: '6px' }}>
                <div className="progress-bar-fill" style={{ width: `${metric.unit === '%' ? val : Math.min(100, val * 2)}%`, background: config.gradient }} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '7fr 5fr', gap: '1.5rem' }} className="dashboard-grid">
        {/* Trend Chart */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--card-border)', gridColumn: 'span 7' }}>
          <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 700, marginBottom: '1rem' }}>
            {role === 'student' ? 'Study Velocity' : role === 'freelancer' ? 'Project Velocity' : role === 'developer' ? 'Dev Velocity' : 'Productivity Velocity'}
          </h3>
          <div style={{ width: '100%', height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={config.accent} stopOpacity={0.25} />
                    <stop offset="95%" stopColor={config.accent} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorFocus" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" style={{ fontSize: '0.75rem' }} />
                <YAxis stroke="var(--text-muted)" style={{ fontSize: '0.75rem' }} />
                <Tooltip contentStyle={{ background: 'var(--card-bg-solid)', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} />
                <Area type="monotone" dataKey="Tasks" stroke={config.accent} strokeWidth={2} fillOpacity={1} fill="url(#colorTasks)" />
                <Area type="monotone" dataKey="Focus" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorFocus)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Pie */}
        <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--card-border)', gridColumn: 'span 5', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>Status Distribution</h3>
          <div style={{ width: '100%', height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} cx="50%" cy="50%" innerRadius={50} outerRadius={75} paddingAngle={5} dataKey="value">
                  {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--card-bg-solid)', border: '1px solid var(--card-border)', borderRadius: '8px', color: '#fff' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem', borderTop: '1px solid var(--card-border)', paddingTop: '0.75rem' }}>
            {statusData.map((e, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: e.color }} />
                  <span style={{ color: 'var(--text-secondary)' }}>{e.name}</span>
                </div>
                <span style={{ fontWeight: 600 }}>{e.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: `1px solid rgba(${config.accentRgb}, 0.15)`, background: `linear-gradient(135deg, rgba(${config.accentRgb}, 0.03) 0%, transparent 100%)` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Sparkles size={16} style={{ color: config.accent }} />
          <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', fontWeight: 700 }}>{config.aiPersona} Recommendations</h3>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '0.75rem' }}>
          {suggestions.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '0.5rem', padding: '0.75rem', borderRadius: '10px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--card-border)', fontSize: '0.85rem' }}>
              <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>{s.type === 'warning' ? '⚠️' : s.type === 'success' ? '✅' : s.type === 'tip' ? '💡' : s.type === 'insight' ? '🧠' : '🎯'}</span>
              <span style={{ color: 'var(--text-secondary)' }}>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@media(max-width:900px){.dashboard-grid{grid-template-columns:1fr!important;}.dashboard-grid>div{grid-column:span 12!important;}}`}</style>
    </div>
  );
}
