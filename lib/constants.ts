export const ISSUE_TYPES = ['bug', 'feature_request'] as const;

export const ISSUE_STATUSES = ['open', 'in_progress', 'resolved'] as const;

export const USER_ROLES = ['contributor', 'maintainer'] as const;

export const ISSUE_TYPE_LABELS = {
  bug: '🐛 Bug',
  feature_request: '✨ Feature Request',
} as const;

export const ISSUE_STATUS_LABELS = {
  open: '🟢 Open',
  in_progress: '🟡 In Progress',
  resolved: '🟢 Resolved',
} as const;

export const STATUS_COLORS = {
  open: 'bg-green-100 text-green-800',
  in_progress: 'bg-yellow-100 text-yellow-800',
  resolved: 'bg-blue-100 text-blue-800',
} as const;

export const TYPE_COLORS = {
  bug: 'bg-red-100 text-red-800',
  feature_request: 'bg-purple-100 text-purple-800',
} as const;