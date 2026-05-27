import React, { useState, useEffect } from 'react';
import { Users, Plus, UserPlus, LogOut, CheckSquare, MessageSquare, Send, Award, Sparkles, Hash } from 'lucide-react';
import { apiRequest } from '../api';

export default function TeamWorkspace({
  teams,
  setTeams,
  tasks,
  setTasks,
  currentUser,
  onOpenTaskModal
}) {
  const [selectedTeamId, setSelectedTeamId] = useState('');
  const [teamNameInput, setTeamNameInput] = useState('');
  const [joinIdInput, setJoinIdInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Comments states
  const [selectedTaskId, setSelectedTaskId] = useState('');
  const [comments, setComments] = useState([]);
  const [newCommentInput, setNewCommentInput] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);

  // Pick first team automatically if available
  useEffect(() => {
    if (teams.length > 0 && !selectedTeamId) {
      setSelectedTeamId(teams[0].id);
    }
  }, [teams, selectedTeamId]);

  // Load comments when active task selection changes
  useEffect(() => {
    if (selectedTaskId) {
      loadComments(selectedTaskId);
    } else {
      setComments([]);
    }
  }, [selectedTaskId]);

  const loadComments = async (taskId) => {
    setCommentsLoading(true);
    try {
      const data = await apiRequest(`/comments/task/${taskId}`, 'GET');
      setComments(data);
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!teamNameInput.trim()) return;

    setLoading(true);
    setError('');
    try {
      const newTeam = await apiRequest('/teams', 'POST', { name: teamNameInput });
      setTeams(prev => [...prev, newTeam]);
      setSelectedTeamId(newTeam.id);
      setTeamNameInput('');
      alert(`🎉 Team "${newTeam.name}" successfully created!`);
    } catch (err) {
      setError(err.message || 'Failed to create team.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinTeam = async (e) => {
    e.preventDefault();
    if (!joinIdInput.trim()) return;

    setLoading(true);
    setError('');
    try {
      const targetId = parseInt(joinIdInput);
      await apiRequest(`/teams/${targetId}/join`, 'POST');
      
      // Reload teams completely to get fresh member list
      const freshTeams = await apiRequest('/teams', 'GET');
      setTeams(freshTeams);
      setSelectedTeamId(targetId);
      setJoinIdInput('');
      alert('🎉 Joined the team successfully! Workspace loaded.');
    } catch (err) {
      setError(err.message || 'Failed to join team. Check team code ID.');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveTeam = async (teamId) => {
    if (!window.confirm('Are you sure you want to leave this team workspace?')) return;

    setLoading(true);
    try {
      await apiRequest(`/teams/${teamId}/leave`, 'POST');
      setTeams(prev => prev.filter(t => t.id !== teamId));
      setSelectedTeamId('');
      alert('Left the team workspace.');
    } catch (err) {
      alert(err.message || 'Failed to leave team.');
    } finally {
      setLoading(false);
    }
  };

  const handlePostComment = async (e) => {
    e.preventDefault();
    if (!newCommentInput.trim() || !selectedTaskId) return;

    try {
      const payload = {
        task_id: parseInt(selectedTaskId),
        content: newCommentInput
      };
      const postedComment = await apiRequest('/comments', 'POST', payload);
      setComments(prev => [...prev, postedComment]);
      setNewCommentInput('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    }
  };

  // Filter tasks belonging specifically to the selected team
  const activeTeam = teams.find(t => t.id === parseInt(selectedTeamId));
  const teamTasks = activeTeam 
    ? tasks.filter(t => t.team_id === activeTeam.id)
    : [];

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Title Header */}
      <div>
        <h1 style={{ fontSize: '2rem', fontFamily: 'var(--font-display)', fontWeight: '800' }}>Team Workspace Space</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Collaborate in real-time, delegate team issues, and write comment threads.
        </p>
      </div>

      {/* Grid: Create/Join Side Panel vs Main Board Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '4fr 8fr', gap: '2rem' }} className="dashboard-grid">
        
        {/* Left Column panel: Teams registration */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 4' }}>
          
          {/* Active Teams Selector List */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users size={18} style={{ color: 'var(--accent-indigo)' }} />
              <span>Workspace Channels</span>
            </h3>

            {error && (
              <div style={{ padding: '0.5rem 0.75rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', color: '#f87171', fontSize: '0.8rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto' }}>
              {teams.length === 0 ? (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', padding: '1rem 0' }}>
                  No channels joined yet. Register or join a team code below.
                </div>
              ) : (
                teams.map(team => (
                  <button
                    key={team.id}
                    onClick={() => {
                      setSelectedTeamId(team.id);
                      setSelectedTaskId('');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'between',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      background: selectedTeamId === team.id ? 'rgba(99,102,241,0.1)' : 'var(--bg-tertiary)',
                      border: `1px solid ${selectedTeamId === team.id ? 'var(--accent-indigo)' : 'var(--card-border)'}`,
                      borderRadius: '10px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      fontSize: '0.875rem',
                      color: selectedTeamId === team.id ? '#fff' : 'var(--text-secondary)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Hash size={16} style={{ color: selectedTeamId === team.id ? 'var(--accent-cyan)' : 'var(--text-muted)' }} />
                      <span style={{ fontWeight: selectedTeamId === team.id ? 600 : 500 }}>{team.name}</span>
                    </div>
                    {selectedTeamId === team.id && team.owner_id !== currentUser.id && (
                      <span
                        onClick={(e) => { e.stopPropagation(); handleLeaveTeam(team.id); }}
                        style={{ fontSize: '0.7rem', color: 'var(--error)', marginLeft: 'auto', background: 'rgba(239,68,68,0.08)', padding: '0.1rem 0.35rem', borderRadius: '4px' }}
                      >
                        Leave
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Creation Form Panel */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} style={{ color: 'var(--accent-cyan)' }} />
              <span>Create New Workspace</span>
            </h3>

            <form onSubmit={handleCreateTeam} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="text"
                required
                placeholder="Marketing Launch, Dev Team..."
                value={teamNameInput}
                onChange={(e) => setTeamNameInput(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              />
              <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.65rem', fontSize: '0.85rem' }}>
                Register Workspace
              </button>
            </form>
          </div>

          {/* Join Invite Form Panel */}
          <div className="glass" style={{ padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--card-border)' }}>
            <h3 style={{ fontSize: '1.1rem', fontFamily: 'var(--font-display)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <UserPlus size={18} style={{ color: 'var(--accent-purple)' }} />
              <span>Join via Team ID Code</span>
            </h3>

            <form onSubmit={handleJoinTeam} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <input
                type="number"
                required
                placeholder="Enter unique team numeric code..."
                value={joinIdInput}
                onChange={(e) => setJoinIdInput(e.target.value)}
                className="form-input"
                style={{ fontSize: '0.85rem' }}
              />
              <button type="submit" disabled={loading} className="btn btn-secondary" style={{ padding: '0.65rem', fontSize: '0.85rem' }}>
                Join Workspace
              </button>
            </form>
          </div>

        </div>

        {/* Right Column: Dynamic Workspace detail */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', gridColumn: 'span 8' }}>
          
          {activeTeam ? (
            <div className="glass animate-fade-in" style={{
              padding: '1.75rem',
              borderRadius: '24px',
              border: '1px solid var(--card-border)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem'
            }}>
              
              {/* Active Team Header info */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontFamily: 'var(--font-display)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{activeTeam.name}</span>
                  </h2>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Unique Team Invitation ID Code: <strong style={{ color: 'var(--accent-cyan)' }}>{activeTeam.id}</strong> (Share this to invite teammates!)
                  </span>
                </div>
                <button
                  onClick={() => onOpenTaskModal({ team_id: activeTeam.id })}
                  className="btn btn-primary"
                  style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  <Plus size={16} />
                  <span>Workspace Task</span>
                </button>
              </div>

              {/* Members panel list */}
              <div>
                <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 600 }}>Active Collaborators ({activeTeam.members?.length || 0})</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                  {activeTeam.members?.map(member => (
                    <div
                      key={member.id}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--bg-tertiary)',
                        border: '1px solid var(--card-border)',
                        padding: '0.4rem 0.75rem',
                        borderRadius: '30px',
                        fontSize: '0.8rem'
                      }}
                    >
                      <img
                        src={member.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${member.name}`}
                        alt={member.name}
                        style={{ width: '22px', height: '22px', borderRadius: '50%' }}
                      />
                      <span>{member.name}</span>
                      {member.id === activeTeam.owner_id && (
                        <span style={{ fontSize: '0.65rem', background: 'rgba(99,102,241,0.15)', color: 'var(--accent-cyan)', padding: '0.05rem 0.3rem', borderRadius: '4px', fontWeight: 'bold' }}>Owner</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid: Task delegates list vs Task discussion comments */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="dashboard-grid">
                
                {/* Team tasks delegates */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Collaborative Workflow</h4>
                  <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    border: '1px solid var(--card-border)',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    background: 'rgba(255,255,255,0.01)'
                  }}>
                    {teamTasks.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: '2rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        No issues scheduled inside this team space yet.
                      </div>
                    ) : (
                      teamTasks.map(task => (
                        <button
                          key={task.id}
                          onClick={() => setSelectedTaskId(task.id)}
                          style={{
                            width: '100%',
                            padding: '0.75rem',
                            background: selectedTaskId === task.id ? 'rgba(99,102,241,0.08)' : 'transparent',
                            border: `1px solid ${selectedTaskId === task.id ? 'var(--accent-indigo)' : 'transparent'}`,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.25rem',
                            color: selectedTaskId === task.id ? '#fff' : 'var(--text-primary)',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => { if (selectedTaskId !== task.id) e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                          onMouseLeave={(e) => { if (selectedTaskId !== task.id) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{task.title}</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            <span>Assignee: {task.assignee_name || 'Unassigned'}</span>
                            <span style={{ textTransform: 'capitalize' }}>{task.status}</span>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>

                {/* Team Tasks discussion comments threads */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <h4 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Discussion Threads</h4>
                  
                  {selectedTaskId ? (
                    <div className="glass" style={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '300px',
                      borderRadius: '12px',
                      border: '1px solid var(--card-border)',
                      overflow: 'hidden',
                      background: 'rgba(255,255,255,0.01)'
                    }}>
                      
                      {/* Comments Scroller */}
                      <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.75rem'
                      }}>
                        {commentsLoading ? (
                          <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.8rem' }}>Loading threads...</div>
                        ) : comments.length === 0 ? (
                          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--text-muted)', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                            <MessageSquare size={24} style={{ opacity: 0.2 }} />
                            <span>No comments logged on this task yet. Type below to initialize discussion!</span>
                          </div>
                        ) : (
                          comments.map(c => (
                            <div
                              key={c.id}
                              style={{
                                display: 'flex',
                                gap: '0.5rem',
                                background: c.user_id === currentUser.id ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.02)',
                                padding: '0.5rem 0.75rem',
                                borderRadius: '8px',
                                border: '1px solid var(--card-border)',
                                fontSize: '0.85rem'
                              }}
                            >
                              <img
                                src={c.user_avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${c.user_name}`}
                                alt=""
                                style={{ width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '2px' }}
                              />
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                  <span style={{ fontWeight: 600, fontSize: '0.75rem' }}>{c.user_name}</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                    {new Date(c.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                </div>
                                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.4' }}>{c.content}</p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      {/* Comments Form */}
                      <form onSubmit={handlePostComment} style={{
                        display: 'flex',
                        borderTop: '1px solid var(--card-border)',
                        padding: '0.5rem',
                        background: 'var(--bg-tertiary)',
                        gap: '0.5rem'
                      }}>
                        <input
                          type="text"
                          required
                          placeholder="Type discussion comment..."
                          value={newCommentInput}
                          onChange={(e) => setNewCommentInput(e.target.value)}
                          className="form-input"
                          style={{ flex: 1, padding: '0.5rem 0.75rem', fontSize: '0.85rem', borderRadius: '8px' }}
                        />
                        <button type="submit" className="btn btn-primary" style={{ padding: '0.5rem', borderRadius: '8px' }}>
                          <Send size={16} />
                        </button>
                      </form>

                    </div>
                  ) : (
                    <div style={{
                      height: '300px',
                      border: '1px dashed var(--card-border)',
                      borderRadius: '12px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      textAlign: 'center',
                      color: 'var(--text-muted)',
                      padding: '1.5rem',
                      gap: '0.5rem',
                      background: 'rgba(255,255,255,0.01)'
                    }}>
                      <MessageSquare size={32} />
                      <span style={{ fontSize: '0.85rem' }}>Select a Collaborative Task from the list to view its comment threads.</span>
                    </div>
                  )}

                </div>

              </div>

            </div>
          ) : (
            <div className="glass" style={{
              padding: '4rem 2rem',
              borderRadius: '24px',
              border: '1px solid var(--card-border)',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}>
              <Users size={64} style={{ color: 'var(--text-muted)', opacity: 0.3 }} />
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: '0.25rem' }}>Workspace Inactive</h2>
                <p style={{ color: 'var(--text-secondary)', maxWidth: '400px', fontSize: '0.9rem' }}>
                  You are not currently active in any team channels. Register a new workspace or join an invitation code in the side panels to start real-time sync discussions!
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
