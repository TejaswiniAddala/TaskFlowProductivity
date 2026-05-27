// ═══════════════════════════════════════════════════════════════
// ROLE CONFIGURATION ENGINE — TaskFlow Adaptive Productivity OS
// ═══════════════════════════════════════════════════════════════
// Every user role maps to a completely unique workspace personality.

export const ROLES = {
  student: {
    key: 'student',
    label: 'Student',
    tagline: 'AI Study & Academic Productivity Platform',
    landingHeadline: 'Boost your academic productivity with AI.',
    icon: '🎓',
    accent: '#8b5cf6',    // violet
    accentRgb: '139,92,246',
    gradient: 'linear-gradient(135deg, #8b5cf6, #6366f1)',
    aiPersona: 'AI Study Coach',
    aiGreeting: "Hey! I'm your AI Study Coach. Let's ace those exams together.",
    dashboardTitle: 'Study Command Center',
    taskCategories: [
      { key: 'assignments', label: 'Assignments', icon: '📝', color: '#f59e0b' },
      { key: 'exams', label: 'Exams', icon: '📋', color: '#ef4444' },
      { key: 'coding_practice', label: 'Coding Practice', icon: '💻', color: '#06b6d4' },
      { key: 'mini_projects', label: 'Mini Projects', icon: '🔬', color: '#10b981' },
      { key: 'labs', label: 'Labs', icon: '🧪', color: '#f97316' },
      { key: 'research', label: 'Research Work', icon: '📚', color: '#8b5cf6' },
      { key: 'revision', label: 'Notes Revision', icon: '🔁', color: '#ec4899' },
    ],
    widgets: ['exam_countdown', 'study_planner', 'subject_tasks', 'focus_score', 'attendance', 'semester_calendar', 'ai_coach'],
    analyticsMetrics: [
      { key: 'study_hours', label: 'Study Hours', icon: '⏱️', unit: 'hrs' },
      { key: 'focus_score', label: 'Focus Score', icon: '🧠', unit: '%' },
      { key: 'revision_completion', label: 'Revision Progress', icon: '🔁', unit: '%' },
      { key: 'exam_readiness', label: 'Exam Readiness', icon: '🎯', unit: '%' },
    ],
    notifications: [
      'AI exam revision session starts in 30 mins.',
      'Assignment deadline tomorrow — prioritize now.',
      'Best time for deep study detected. Start a focus session!',
      'Your revision completion is at 72%. Keep going!',
      'Semester calendar: 3 exams in the next 2 weeks.',
    ],
    onboardingQuestions: [
      { key: 'semester', label: 'Current Semester', placeholder: 'e.g. Semester 4', type: 'text' },
      { key: 'subjects', label: 'Active Subjects', placeholder: 'e.g. Algorithms, OS, DBMS', type: 'text' },
      { key: 'nextExamDate', label: 'Next Exam Date', placeholder: '', type: 'date' },
      { key: 'studyGoal', label: 'Daily Study Goal (hours)', placeholder: 'e.g. 6', type: 'number' },
    ],
  },

  employee: {
    key: 'employee',
    label: 'Employee',
    tagline: 'AI Workplace Productivity System',
    landingHeadline: 'Optimize your workplace performance.',
    icon: '💼',
    accent: '#3b82f6',
    accentRgb: '59,130,246',
    gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    aiPersona: 'AI Workplace Assistant',
    aiGreeting: "Hello! I'm your Workplace Assistant. Let's maximize your efficiency today.",
    dashboardTitle: 'Workplace Command Center',
    taskCategories: [
      { key: 'meetings', label: 'Meetings', icon: '📅', color: '#3b82f6' },
      { key: 'reports', label: 'Reports', icon: '📊', color: '#f59e0b' },
      { key: 'dev_tasks', label: 'Development Tasks', icon: '⚙️', color: '#06b6d4' },
      { key: 'documentation', label: 'Documentation', icon: '📄', color: '#10b981' },
      { key: 'client_comm', label: 'Client Communication', icon: '💬', color: '#8b5cf6' },
      { key: 'presentations', label: 'Presentations', icon: '🎤', color: '#ec4899' },
      { key: 'reviews', label: 'Team Reviews', icon: '👥', color: '#f97316' },
    ],
    widgets: ['kpi_tracker', 'meeting_schedule', 'workload_analysis', 'daily_goals', 'performance_metrics', 'team_collab', 'ai_coach'],
    analyticsMetrics: [
      { key: 'work_efficiency', label: 'Work Efficiency', icon: '⚡', unit: '%' },
      { key: 'productivity_trend', label: 'Productivity Trend', icon: '📈', unit: '%' },
      { key: 'workload_score', label: 'Workload Score', icon: '📦', unit: '/10' },
      { key: 'burnout_risk', label: 'Burnout Prediction', icon: '🔥', unit: '%' },
    ],
    notifications: [
      'Team meeting starts in 15 mins.',
      'Project delivery risk detected — review timeline.',
      'Your productivity drops after 4 PM. Consider a break.',
      'Weekly KPI review due tomorrow.',
      'New task assigned by your manager.',
    ],
    onboardingQuestions: [
      { key: 'companyRole', label: 'Your Role / Title', placeholder: 'e.g. Software Engineer', type: 'text' },
      { key: 'teamSize', label: 'Team Size', placeholder: 'e.g. 8', type: 'number' },
      { key: 'workTimings', label: 'Work Schedule', placeholder: 'e.g. 9 AM - 6 PM', type: 'text' },
      { key: 'responsibilities', label: 'Main Responsibilities', placeholder: 'e.g. Backend development, Code reviews', type: 'text' },
    ],
  },

  freelancer: {
    key: 'freelancer',
    label: 'Freelancer',
    tagline: 'AI Client & Project Management Workspace',
    landingHeadline: 'Manage clients and deadlines smarter.',
    icon: '🚀',
    accent: '#10b981',
    accentRgb: '16,185,129',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    aiPersona: 'AI Business Manager',
    aiGreeting: "Welcome! I'm your Business Manager. Let's optimize your client workflow.",
    dashboardTitle: 'Freelance Command Center',
    taskCategories: [
      { key: 'client_work', label: 'Client Work', icon: '👤', color: '#10b981' },
      { key: 'revisions', label: 'Revisions', icon: '🔄', color: '#f59e0b' },
      { key: 'meetings', label: 'Client Meetings', icon: '📞', color: '#3b82f6' },
      { key: 'design', label: 'Design Tasks', icon: '🎨', color: '#ec4899' },
      { key: 'dev_tasks', label: 'Development', icon: '💻', color: '#06b6d4' },
      { key: 'invoices', label: 'Invoices', icon: '💰', color: '#f97316' },
      { key: 'deliverables', label: 'Deliverables', icon: '📦', color: '#8b5cf6' },
    ],
    widgets: ['client_projects', 'invoice_tracker', 'earnings_chart', 'time_tracking', 'deadline_mgmt', 'proposal_mgmt', 'ai_coach'],
    analyticsMetrics: [
      { key: 'monthly_earnings', label: 'Monthly Earnings', icon: '💰', unit: '$' },
      { key: 'completion_rate', label: 'Project Completion', icon: '✅', unit: '%' },
      { key: 'billable_hours', label: 'Billable Hours', icon: '⏱️', unit: 'hrs' },
      { key: 'client_satisfaction', label: 'Client Satisfaction', icon: '⭐', unit: '/5' },
    ],
    notifications: [
      'Client deadline approaching — 2 days left.',
      'Invoice payment pending from Acme Corp.',
      'High workload detected this week. Reschedule?',
      'New project proposal received.',
      'Billable hours target: 80% reached.',
    ],
    onboardingQuestions: [
      { key: 'services', label: 'Services You Offer', placeholder: 'e.g. Web Development, UI Design', type: 'text' },
      { key: 'clientCount', label: 'Active Clients', placeholder: 'e.g. 5', type: 'number' },
      { key: 'schedule', label: 'Preferred Work Schedule', placeholder: 'e.g. Flexible, 10AM-8PM', type: 'text' },
      { key: 'hourlyRate', label: 'Hourly Rate ($)', placeholder: 'e.g. 75', type: 'number' },
    ],
  },

  startup: {
    key: 'startup',
    label: 'Startup / Team',
    tagline: 'AI Startup Collaboration & Workflow OS',
    landingHeadline: 'Scale team productivity using AI.',
    icon: '🏢',
    accent: '#f59e0b',
    accentRgb: '245,158,11',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    aiPersona: 'AI Operations Manager',
    aiGreeting: "Let's build something great! I'm your Operations Manager for sprint planning.",
    dashboardTitle: 'Startup Command Center',
    taskCategories: [
      { key: 'sprint', label: 'Sprint Tasks', icon: '🏃', color: '#f59e0b' },
      { key: 'product_dev', label: 'Product Development', icon: '🛠️', color: '#3b82f6' },
      { key: 'marketing', label: 'Marketing', icon: '📣', color: '#ec4899' },
      { key: 'investor', label: 'Investor Meetings', icon: '🤝', color: '#10b981' },
      { key: 'design_review', label: 'Design Reviews', icon: '🎨', color: '#8b5cf6' },
      { key: 'qa', label: 'QA Testing', icon: '🧪', color: '#ef4444' },
      { key: 'launch', label: 'Launch Prep', icon: '🚀', color: '#06b6d4' },
    ],
    widgets: ['sprint_board', 'team_productivity', 'roadmap', 'kpi_analytics', 'investor_schedule', 'launch_tracker', 'ai_coach'],
    analyticsMetrics: [
      { key: 'team_productivity', label: 'Team Productivity', icon: '👥', unit: '%' },
      { key: 'sprint_velocity', label: 'Sprint Velocity', icon: '🏃', unit: 'pts' },
      { key: 'burnout_analytics', label: 'Burnout Risk', icon: '🔥', unit: '%' },
      { key: 'collab_score', label: 'Collaboration Score', icon: '🤝', unit: '/10' },
    ],
    notifications: [
      'Sprint delay risk detected — 2 tasks at risk.',
      'Team productivity increased 12% this week!',
      'Launch milestone approaching in 5 days.',
      'Investor pitch deck review tomorrow.',
      'QA found 3 critical bugs — prioritize fixes.',
    ],
    onboardingQuestions: [
      { key: 'stage', label: 'Startup Stage', placeholder: 'e.g. Pre-seed, Series A', type: 'text' },
      { key: 'teamSize', label: 'Team Members', placeholder: 'e.g. 12', type: 'number' },
      { key: 'productType', label: 'Product Type', placeholder: 'e.g. SaaS, Mobile App', type: 'text' },
      { key: 'sprintDuration', label: 'Sprint Duration (weeks)', placeholder: 'e.g. 2', type: 'number' },
    ],
  },

  manager: {
    key: 'manager',
    label: 'Manager',
    tagline: 'AI Team Leadership Dashboard',
    landingHeadline: 'Lead your team with intelligent insights.',
    icon: '👔',
    accent: '#6366f1',
    accentRgb: '99,102,241',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    aiPersona: 'AI Leadership Advisor',
    aiGreeting: "Good day! I'm your Leadership Advisor — let's keep your team performing at peak.",
    dashboardTitle: 'Leadership Command Center',
    taskCategories: [
      { key: 'team_reviews', label: 'Team Reviews', icon: '👥', color: '#6366f1' },
      { key: 'strategy', label: 'Strategy Planning', icon: '🎯', color: '#f59e0b' },
      { key: 'hiring', label: 'Hiring / HR', icon: '📋', color: '#10b981' },
      { key: 'reports', label: 'Reports', icon: '📊', color: '#3b82f6' },
      { key: 'meetings', label: 'Leadership Meetings', icon: '🏛️', color: '#8b5cf6' },
      { key: 'delegation', label: 'Task Delegation', icon: '📤', color: '#ec4899' },
      { key: 'performance', label: 'Performance Reviews', icon: '⭐', color: '#06b6d4' },
    ],
    widgets: ['team_overview', 'delegation_board', 'performance_metrics', 'meeting_planner', 'kpi_dashboard', 'resource_allocation', 'ai_coach'],
    analyticsMetrics: [
      { key: 'team_performance', label: 'Team Performance', icon: '📈', unit: '%' },
      { key: 'delegation_efficiency', label: 'Delegation Efficiency', icon: '📤', unit: '%' },
      { key: 'meeting_effectiveness', label: 'Meeting ROI', icon: '📅', unit: '%' },
      { key: 'team_morale', label: 'Team Morale Index', icon: '😊', unit: '/10' },
    ],
    notifications: [
      'Performance review cycle begins next week.',
      'Team member flagged as at-risk for burnout.',
      '3 tasks overdue across your team.',
      'Leadership sync scheduled for tomorrow.',
      'Quarterly OKR deadline approaching.',
    ],
    onboardingQuestions: [
      { key: 'department', label: 'Department / Division', placeholder: 'e.g. Engineering, Marketing', type: 'text' },
      { key: 'directReports', label: 'Direct Reports', placeholder: 'e.g. 8', type: 'number' },
      { key: 'focus', label: 'Primary Management Focus', placeholder: 'e.g. Product delivery, Growth', type: 'text' },
      { key: 'meetingFreq', label: 'Sync Meeting Frequency', placeholder: 'e.g. Daily standups', type: 'text' },
    ],
  },

  developer: {
    key: 'developer',
    label: 'Developer',
    tagline: 'AI Coding Productivity Workspace',
    landingHeadline: 'Ship code faster with AI-powered workflows.',
    icon: '⚡',
    accent: '#06b6d4',
    accentRgb: '6,182,212',
    gradient: 'linear-gradient(135deg, #06b6d4, #0891b2)',
    aiPersona: 'AI Coding Assistant',
    aiGreeting: "Hey dev! I'm your Coding Assistant. Let's crush that sprint backlog.",
    dashboardTitle: 'Dev Command Center',
    taskCategories: [
      { key: 'features', label: 'Feature Dev', icon: '⚡', color: '#06b6d4' },
      { key: 'bugs', label: 'Bug Fixes', icon: '🐛', color: '#ef4444' },
      { key: 'code_review', label: 'Code Reviews', icon: '🔍', color: '#8b5cf6' },
      { key: 'sprint', label: 'Sprint Tasks', icon: '🏃', color: '#f59e0b' },
      { key: 'devops', label: 'DevOps / CI-CD', icon: '🔧', color: '#10b981' },
      { key: 'docs', label: 'Technical Docs', icon: '📖', color: '#3b82f6' },
      { key: 'learning', label: 'Learning / R&D', icon: '🧠', color: '#ec4899' },
    ],
    widgets: ['sprint_board', 'bug_tracker', 'github_activity', 'code_review_queue', 'dev_analytics', 'ci_cd_status', 'ai_coach'],
    analyticsMetrics: [
      { key: 'commits_week', label: 'Weekly Commits', icon: '📝', unit: '' },
      { key: 'bugs_resolved', label: 'Bugs Resolved', icon: '🐛', unit: '' },
      { key: 'pr_turnaround', label: 'PR Turnaround', icon: '⏱️', unit: 'hrs' },
      { key: 'code_quality', label: 'Code Quality', icon: '✨', unit: '/10' },
    ],
    notifications: [
      'PR #42 needs your review — 2 approvals pending.',
      'CI pipeline failed on main branch.',
      'Sprint ends Friday — 3 tasks remaining.',
      'New critical bug reported in production.',
      'Your code quality score improved to 9.2!',
    ],
    onboardingQuestions: [
      { key: 'primaryStack', label: 'Primary Tech Stack', placeholder: 'e.g. React, Node.js, Python', type: 'text' },
      { key: 'gitHubSync', label: 'GitHub Username', placeholder: 'e.g. alex-dev', type: 'text' },
      { key: 'mainIde', label: 'Preferred IDE', placeholder: 'e.g. VS Code, WebStorm', type: 'text' },
      { key: 'sprintLength', label: 'Sprint Length (weeks)', placeholder: 'e.g. 2', type: 'number' },
    ],
  },

  creator: {
    key: 'creator',
    label: 'Creator',
    tagline: 'AI Content Creation Productivity Hub',
    landingHeadline: 'Create, schedule, and grow your audience with AI.',
    icon: '🎬',
    accent: '#ec4899',
    accentRgb: '236,72,153',
    gradient: 'linear-gradient(135deg, #ec4899, #db2777)',
    aiPersona: 'AI Creative Director',
    aiGreeting: "Hey creator! I'm your Creative Director. Let's plan viral content together.",
    dashboardTitle: 'Creator Command Center',
    taskCategories: [
      { key: 'content_ideas', label: 'Content Ideas', icon: '💡', color: '#f59e0b' },
      { key: 'video_production', label: 'Video Production', icon: '🎬', color: '#ec4899' },
      { key: 'social_posts', label: 'Social Media', icon: '📱', color: '#3b82f6' },
      { key: 'editing', label: 'Editing', icon: '✂️', color: '#8b5cf6' },
      { key: 'collabs', label: 'Collaborations', icon: '🤝', color: '#10b981' },
      { key: 'analytics', label: 'Audience Research', icon: '📊', color: '#06b6d4' },
      { key: 'branding', label: 'Branding', icon: '🎨', color: '#f97316' },
    ],
    widgets: ['content_calendar', 'social_scheduler', 'idea_generator', 'audience_analytics', 'collab_board', 'upload_tracker', 'ai_coach'],
    analyticsMetrics: [
      { key: 'content_output', label: 'Content Published', icon: '📤', unit: '' },
      { key: 'engagement_rate', label: 'Engagement Rate', icon: '❤️', unit: '%' },
      { key: 'audience_growth', label: 'Audience Growth', icon: '📈', unit: '%' },
      { key: 'collab_score', label: 'Collaboration Score', icon: '🤝', unit: '/10' },
    ],
    notifications: [
      'Trending topic detected — create content now!',
      'Video upload scheduled for tomorrow at 10 AM.',
      'Collaboration request from @creativestudio.',
      'Engagement rate increased 18% this week!',
      'Content calendar: 2 posts due this week.',
    ],
    onboardingQuestions: [
      { key: 'channelType', label: 'Platform / Channel Type', placeholder: 'e.g. YouTube, TikTok, Blog', type: 'text' },
      { key: 'uploadFreq', label: 'Upload Frequency', placeholder: 'e.g. 3 videos/week', type: 'text' },
      { key: 'niche', label: 'Content Niche', placeholder: 'e.g. Tech reviews, Lifestyle', type: 'text' },
      { key: 'currentProject', label: 'Current Project', placeholder: 'e.g. Tutorial series', type: 'text' },
    ],
  },
};

// Helper: Get config for a role key
export function getRoleConfig(roleKey) {
  return ROLES[roleKey] || ROLES.student;
}

// Helper: Get all role keys
export function getAllRoleKeys() {
  return Object.keys(ROLES);
}

// Helper: Get role-specific AI suggestions based on tasks
export function getAISuggestions(roleKey, tasks) {
  const config = getRoleConfig(roleKey);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === 'done').length;
  const overdueTasks = tasks.filter(t => {
    if (t.status === 'done' || !t.due_date) return false;
    return new Date(t.due_date) < new Date();
  });
  const highPriority = tasks.filter(t => t.priority === 'high' && t.status !== 'done');

  const suggestions = [];

  if (overdueTasks.length > 0) {
    suggestions.push({ type: 'warning', text: `${overdueTasks.length} overdue task${overdueTasks.length > 1 ? 's' : ''} detected. Reschedule or prioritize immediately.` });
  }
  if (highPriority.length > 0) {
    suggestions.push({ type: 'focus', text: `${highPriority.length} high-priority item${highPriority.length > 1 ? 's' : ''} need your attention today.` });
  }
  if (totalTasks > 0 && completedTasks / totalTasks > 0.7) {
    suggestions.push({ type: 'success', text: `Great momentum! You've completed ${Math.round((completedTasks / totalTasks) * 100)}% of your workload.` });
  }

  // Role-specific smart suggestions
  const roleSuggestions = {
    student: [
      { type: 'tip', text: 'Schedule a 25-min Pomodoro revision session for best retention.' },
      { type: 'insight', text: 'Students who review notes within 24 hours retain 80% more.' },
    ],
    employee: [
      { type: 'tip', text: 'Block 2 hours of deep work before your first meeting.' },
      { type: 'insight', text: 'Batch similar tasks together to reduce context-switching.' },
    ],
    freelancer: [
      { type: 'tip', text: 'Send invoice reminders for overdue payments today.' },
      { type: 'insight', text: 'Clients respond 40% faster to proposals sent before noon.' },
    ],
    startup: [
      { type: 'tip', text: 'Run a quick 15-min standup to unblock the team.' },
      { type: 'insight', text: 'Sprints with fewer than 8 tasks have 92% completion rates.' },
    ],
    manager: [
      { type: 'tip', text: 'Check in with team members who haven\'t updated tasks in 48+ hours.' },
      { type: 'insight', text: 'Async updates reduce meeting time by 30%.' },
    ],
    developer: [
      { type: 'tip', text: 'Review open PRs before starting new feature work.' },
      { type: 'insight', text: 'Developers who take breaks every 90 mins write 15% fewer bugs.' },
    ],
    creator: [
      { type: 'tip', text: 'Batch-film content today for the next 3 uploads.' },
      { type: 'insight', text: 'Posts published between 10-11 AM get 23% higher engagement.' },
    ],
  };

  suggestions.push(...(roleSuggestions[roleKey] || roleSuggestions.student));

  return suggestions;
}

// ═══════════════════════════════════════════════════
// ROLE-SPECIFIC SIDEBAR MENUS
// ═══════════════════════════════════════════════════
// Each role sees ONLY its own navigation items.

export const SIDEBAR_MENUS = {
  student: [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'tasks', label: 'Assignments', emoji: '📝' },
    { id: 'exams', label: 'Exam Planner', emoji: '📋' },
    { id: 'planner', label: 'Study Planner', emoji: '📖' },
    { id: 'revision', label: 'Revision Tracker', emoji: '🔁' },
    { id: 'calendar', label: 'Semester Calendar', emoji: '📅' },
    { id: 'analytics', label: 'Study Analytics', emoji: '🧠' },
    { id: 'ai_coach', label: 'AI Study Coach', emoji: '🤖' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ],
  employee: [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'tasks', label: 'My Tasks', emoji: '✅' },
    { id: 'meetings', label: 'Meetings', emoji: '📅' },
    { id: 'team', label: 'Team Workspace', emoji: '👥' },
    { id: 'planner', label: 'Daily Planner', emoji: '🗓️' },
    { id: 'calendar', label: 'Calendar', emoji: '📆' },
    { id: 'analytics', label: 'Performance', emoji: '📈' },
    { id: 'ai_coach', label: 'AI Work Assistant', emoji: '🤖' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ],
  freelancer: [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'tasks', label: 'Projects', emoji: '📁' },
    { id: 'clients', label: 'Clients', emoji: '👤' },
    { id: 'invoices', label: 'Invoices', emoji: '💰' },
    { id: 'planner', label: 'Time Tracker', emoji: '⏱️' },
    { id: 'calendar', label: 'Deadlines', emoji: '📅' },
    { id: 'analytics', label: 'Earnings Analytics', emoji: '💹' },
    { id: 'ai_coach', label: 'AI Business Manager', emoji: '🤖' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ],
  startup: [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'tasks', label: 'Sprint Board', emoji: '🏃' },
    { id: 'team', label: 'Team Workspace', emoji: '👥' },
    { id: 'roadmap', label: 'Product Roadmap', emoji: '🗺️' },
    { id: 'planner', label: 'Sprint Planner', emoji: '📋' },
    { id: 'calendar', label: 'Calendar', emoji: '📅' },
    { id: 'analytics', label: 'KPI Analytics', emoji: '📈' },
    { id: 'ai_coach', label: 'AI Ops Manager', emoji: '🤖' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ],
  manager: [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'tasks', label: 'Delegation Board', emoji: '📤' },
    { id: 'team', label: 'Team Overview', emoji: '👥' },
    { id: 'meetings', label: 'Meetings', emoji: '🏛️' },
    { id: 'planner', label: 'Week Planner', emoji: '📋' },
    { id: 'calendar', label: 'Calendar', emoji: '📅' },
    { id: 'analytics', label: 'Performance', emoji: '📈' },
    { id: 'ai_coach', label: 'AI Leadership Advisor', emoji: '🤖' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ],
  developer: [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'tasks', label: 'Sprint Board', emoji: '🏃' },
    { id: 'bugs', label: 'Bug Tracker', emoji: '🐛' },
    { id: 'reviews', label: 'Code Reviews', emoji: '🔍' },
    { id: 'planner', label: 'Focus Timer', emoji: '⏱️' },
    { id: 'calendar', label: 'Calendar', emoji: '📅' },
    { id: 'analytics', label: 'Dev Analytics', emoji: '📈' },
    { id: 'ai_coach', label: 'AI Coding Assistant', emoji: '🤖' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ],
  creator: [
    { id: 'dashboard', label: 'Dashboard', emoji: '📊' },
    { id: 'tasks', label: 'Content Board', emoji: '🎬' },
    { id: 'social', label: 'Social Scheduler', emoji: '📱' },
    { id: 'ideas', label: 'Idea Generator', emoji: '💡' },
    { id: 'planner', label: 'Content Calendar', emoji: '📅' },
    { id: 'calendar', label: 'Upload Schedule', emoji: '📆' },
    { id: 'analytics', label: 'Audience Analytics', emoji: '❤️' },
    { id: 'ai_coach', label: 'AI Creative Director', emoji: '🤖' },
    { id: 'settings', label: 'Settings', emoji: '⚙️' },
  ],
};

// ═══════════════════════════════════════════════════
// ROLE-SPECIFIC DAILY PLANNER SCHEDULES
// ═══════════════════════════════════════════════════

export const DAILY_SCHEDULES = {
  student: [
    { time: '8:00 AM', task: 'DSA Practice', type: 'coding_practice' },
    { time: '10:00 AM', task: 'DBMS Revision', type: 'revision' },
    { time: '12:00 PM', task: 'Break & Lunch', type: 'break' },
    { time: '2:00 PM', task: 'Mini Project Work', type: 'mini_projects' },
    { time: '4:00 PM', task: 'Lab Report Writing', type: 'labs' },
    { time: '5:00 PM', task: 'Mock Test Practice', type: 'exams' },
  ],
  employee: [
    { time: '9:00 AM', task: 'Team Standup', type: 'meetings' },
    { time: '9:30 AM', task: 'Deep Work Block', type: 'dev_tasks' },
    { time: '11:30 AM', task: 'Client Review Call', type: 'client_comm' },
    { time: '1:00 PM', task: 'Lunch Break', type: 'break' },
    { time: '2:00 PM', task: 'Documentation Sprint', type: 'documentation' },
    { time: '4:00 PM', task: 'Code Review & PR', type: 'reviews' },
  ],
  freelancer: [
    { time: '9:00 AM', task: 'Client A — Design Revisions', type: 'revisions' },
    { time: '11:00 AM', task: 'Client B — Development Sprint', type: 'dev_tasks' },
    { time: '1:00 PM', task: 'Break & Admin', type: 'break' },
    { time: '2:00 PM', task: 'New Proposal Draft', type: 'deliverables' },
    { time: '4:00 PM', task: 'Invoice Follow-ups', type: 'invoices' },
    { time: '5:00 PM', task: 'Client Meeting Prep', type: 'meetings' },
  ],
  startup: [
    { time: '9:00 AM', task: 'Daily Standup', type: 'sprint' },
    { time: '9:30 AM', task: 'Product Development', type: 'product_dev' },
    { time: '12:00 PM', task: 'Team Lunch', type: 'break' },
    { time: '1:00 PM', task: 'Investor Deck Review', type: 'investor' },
    { time: '3:00 PM', task: 'QA Testing Sprint', type: 'qa' },
    { time: '5:00 PM', task: 'Marketing Strategy Sync', type: 'marketing' },
  ],
  manager: [
    { time: '8:30 AM', task: 'Review Team Updates', type: 'team_reviews' },
    { time: '9:30 AM', task: 'Leadership Sync', type: 'meetings' },
    { time: '11:00 AM', task: 'Performance Reviews', type: 'performance' },
    { time: '1:00 PM', task: 'Lunch Break', type: 'break' },
    { time: '2:00 PM', task: 'Strategy Planning', type: 'strategy' },
    { time: '4:00 PM', task: 'Task Delegation & Alignment', type: 'delegation' },
  ],
  developer: [
    { time: '9:00 AM', task: 'PR Reviews', type: 'code_review' },
    { time: '10:00 AM', task: 'Feature Development', type: 'features' },
    { time: '12:00 PM', task: 'Break', type: 'break' },
    { time: '1:00 PM', task: 'Bug Fixes — Critical', type: 'bugs' },
    { time: '3:00 PM', task: 'DevOps / CI-CD Pipeline', type: 'devops' },
    { time: '5:00 PM', task: 'Learning / Side Project', type: 'learning' },
  ],
  creator: [
    { time: '9:00 AM', task: 'Content Ideation Session', type: 'content_ideas' },
    { time: '10:30 AM', task: 'Video Recording / Filming', type: 'video_production' },
    { time: '12:30 PM', task: 'Break', type: 'break' },
    { time: '1:30 PM', task: 'Video Editing', type: 'editing' },
    { time: '3:30 PM', task: 'Social Media Scheduling', type: 'social_posts' },
    { time: '5:00 PM', task: 'Audience Research & Analytics', type: 'analytics' },
  ],
};

// Helper: Get sidebar menu for a role
export function getSidebarMenu(roleKey) {
  return SIDEBAR_MENUS[roleKey] || SIDEBAR_MENUS.student;
}

// Helper: Get daily schedule for a role
export function getDailySchedule(roleKey) {
  return DAILY_SCHEDULES[roleKey] || DAILY_SCHEDULES.student;
}

