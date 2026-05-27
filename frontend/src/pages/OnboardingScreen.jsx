import React, { useState } from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Check, Zap } from 'lucide-react';
import { ROLES, getAllRoleKeys } from '../config/roleConfig';
import { apiRequest } from '../api';

export default function OnboardingScreen({ user, onComplete }) {
  const [step, setStep] = useState(1); // 1 = role selection, 2 = questions
  const [selectedRole, setSelectedRole] = useState(null);
  const [answers, setAnswers] = useState({});
  const [saving, setSaving] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);

  const roleKeys = getAllRoleKeys();

  const handleRoleSelect = (roleKey) => {
    setSelectedRole(roleKey);
    setAnswers({});
  };

  const handleNext = () => {
    if (!selectedRole) return;
    setStep(2);
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async () => {
    if (!selectedRole) return;
    setSaving(true);
    try {
      const updatedUser = await apiRequest('/auth/onboarding', 'PUT', {
        role: selectedRole,
        preferences: answers,
      });
      onComplete(updatedUser);
    } catch (err) {
      console.error('Onboarding save failed:', err);
      alert('Failed to save preferences. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const roleConfig = selectedRole ? ROLES[selectedRole] : null;

  return (
    <div className="onboarding-screen">
      {/* Animated background orbs */}
      <div className="onboarding-orb onboarding-orb-1" />
      <div className="onboarding-orb onboarding-orb-2" />
      <div className="onboarding-orb onboarding-orb-3" />

      <div className="onboarding-content">
        {/* Header */}
        <div className="onboarding-header animate-fade-in">
          <div className="onboarding-ai-badge">
            <Sparkles size={16} />
            <span>AI-Powered Onboarding</span>
          </div>
          <h1 className="onboarding-title">
            {step === 1 ? 'What best describes your productivity workflow?' : `Setting up your ${roleConfig?.label} workspace`}
          </h1>
          <p className="onboarding-subtitle">
            {step === 1
              ? 'TaskFlow adapts its entire experience — dashboard, AI assistant, analytics, and workflows — based on who you are.'
              : `Answer a few quick questions so your ${roleConfig?.aiPersona} can personalize everything for you.`}
          </p>
        </div>

        {/* Step 1: Role Selection Cards */}
        {step === 1 && (
          <div className="onboarding-roles-grid animate-fade-in">
            {roleKeys.map((key, idx) => {
              const role = ROLES[key];
              const isSelected = selectedRole === key;
              const isHovered = hoveredCard === key;
              return (
                <button
                  key={key}
                  className={`onboarding-role-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => handleRoleSelect(key)}
                  onMouseEnter={() => setHoveredCard(key)}
                  onMouseLeave={() => setHoveredCard(null)}
                  style={{
                    '--role-accent': role.accent,
                    '--role-accent-rgb': role.accentRgb,
                    animationDelay: `${idx * 0.06}s`,
                  }}
                >
                  {isSelected && (
                    <div className="onboarding-card-check">
                      <Check size={14} />
                    </div>
                  )}
                  <div className="onboarding-card-icon">
                    <span>{role.icon}</span>
                  </div>
                  <h3 className="onboarding-card-title">{role.label}</h3>
                  <p className="onboarding-card-desc">{role.tagline}</p>
                  {(isSelected || isHovered) && (
                    <div className="onboarding-card-glow" style={{ background: role.gradient }} />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Role-Specific Questions */}
        {step === 2 && roleConfig && (
          <div className="onboarding-questions animate-fade-in">
            <div className="onboarding-questions-card" style={{ '--role-accent': roleConfig.accent, '--role-accent-rgb': roleConfig.accentRgb }}>
              <div className="onboarding-questions-header">
                <span className="onboarding-questions-icon">{roleConfig.icon}</span>
                <div>
                  <h3>{roleConfig.aiPersona}</h3>
                  <p>{roleConfig.aiGreeting}</p>
                </div>
              </div>

              <div className="onboarding-questions-list">
                {roleConfig.onboardingQuestions.map((q) => (
                  <div key={q.key} className="onboarding-question-field">
                    <label className="form-label">{q.label}</label>
                    <input
                      type={q.type}
                      placeholder={q.placeholder}
                      value={answers[q.key] || ''}
                      onChange={(e) => setAnswers(prev => ({ ...prev, [q.key]: e.target.value }))}
                      className="form-input"
                    />
                  </div>
                ))}
              </div>

              {/* AI preview card */}
              <div className="onboarding-preview-card">
                <Zap size={16} style={{ color: roleConfig.accent, flexShrink: 0 }} />
                <div>
                  <strong>Your workspace will include:</strong>
                  <p>{roleConfig.taskCategories.map(c => c.label).join(' · ')}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="onboarding-actions animate-fade-in">
          {step === 2 && (
            <button className="btn btn-secondary" onClick={handleBack} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          )}

          {step === 1 ? (
            <button
              className="btn btn-primary onboarding-cta"
              disabled={!selectedRole}
              onClick={handleNext}
              style={selectedRole ? { background: ROLES[selectedRole].gradient } : {}}
            >
              <span>Continue as {selectedRole ? ROLES[selectedRole].label : '...'}</span>
              <ArrowRight size={18} />
            </button>
          ) : (
            <button
              className="btn btn-primary onboarding-cta"
              disabled={saving}
              onClick={handleSubmit}
              style={{ background: roleConfig.gradient }}
            >
              {saving ? (
                <span>Initializing your workspace...</span>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Launch My {roleConfig.label} Workspace</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Step indicators */}
        <div className="onboarding-steps-indicator">
          <span className={`onboarding-step-dot ${step >= 1 ? 'active' : ''}`} />
          <span className={`onboarding-step-dot ${step >= 2 ? 'active' : ''}`} />
        </div>
      </div>
    </div>
  );
}
