// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

// App Configuration
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'CS Jargon Platform';
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0';

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'jargon_token',
  USER: 'jargon_user',
  THEME: 'jargon_theme',
  LANGUAGE: 'jargon_language',
  REFRESH_TOKEN: 'jargon_refresh_token',
};

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin',
};

// Course Difficulty Levels
export const DIFFICULTY_LEVELS = {
  BEGINNER: 'beginner',
  INTERMEDIATE: 'intermediate',
  ADVANCED: 'advanced',
};

// Module Types
export const MODULE_TYPES = {
  VIDEO: 'video',
  TEXT: 'text',
  QUIZ: 'quiz',
  ASSIGNMENT: 'assignment',
  RESOURCE: 'resource',
};

// Assignment Status
export const ASSIGNMENT_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  SUBMITTED: 'submitted',
  GRADED: 'graded',
  LATE: 'late',
};

// Submission Status
export const SUBMISSION_STATUS = {
  PENDING: 'pending',
  GRADED: 'graded',
  RETURNED: 'returned',
  RESUBMIT: 'resubmit',
};

// Grade Levels
export const GRADE_LEVELS = {
  A_PLUS: 'A+',
  A: 'A',
  A_MINUS: 'A-',
  B_PLUS: 'B+',
  B: 'B',
  B_MINUS: 'B-',
  C_PLUS: 'C+',
  C: 'C',
  C_MINUS: 'C-',
  D: 'D',
  F: 'F',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
};

// Jargon Categories
export const JARGON_CATEGORIES = {
  PROGRAMMING: 'programming',
  DATA_STRUCTURES: 'data_structures',
  ALGORITHMS: 'algorithms',
  WEB_DEVELOPMENT: 'web_development',
  DATABASE: 'database',
  NETWORKING: 'networking',
  SECURITY: 'security',
  SOFTWARE_ENGINEERING: 'software_engineering',
  AI_ML: 'ai_ml',
  CLOUD: 'cloud',
  DEVOPS: 'devops',
  MOBILE: 'mobile',
};

// Jargon Difficulty
export const JARGON_DIFFICULTY = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
};

// Badge Types
export const BADGE_TYPES = {
  STREAK: 'streak',
  ASSIGNMENT: 'assignment',
  COURSE: 'course',
  JARGON: 'jargon',
  ATTENDANCE: 'attendance',
  SPECIAL: 'special',
};

// Badge Tiers
export const BADGE_TIERS = {
  BRONZE: 'bronze',
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
  DIAMOND: 'diamond',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  ASSIGNMENT: 'assignment',
  GRADE: 'grade',
  ANNOUNCEMENT: 'announcement',
  BADGE: 'badge',
  STREAK: 'streak',
  COURSE: 'course',
  SYSTEM: 'system',
  REMINDER: 'reminder',
};

// Notification Priority
export const NOTIFICATION_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

// Certificate Types
export const CERTIFICATE_TYPES = {
  COURSE_COMPLETION: 'course_completion',
  ACHIEVEMENT: 'achievement',
  PARTICIPATION: 'participation',
};

// Event Types
export const EVENT_TYPES = {
  WORKSHOP: 'workshop',
  WEBINAR: 'webinar',
  COMPETITION: 'competition',
  HACKATHON: 'hackathon',
  GUEST_LECTURE: 'guest_lecture',
  MEETUP: 'meetup',
};

// Resource Types
export const RESOURCE_TYPES = {
  DOCUMENT: 'document',
  VIDEO: 'video',
  LINK: 'link',
  BOOK: 'book',
  TUTORIAL: 'tutorial',
  TOOL: 'tool',
};

// Placement Test Status
export const PLACEMENT_TEST_STATUS = {
  NOT_STARTED: 'not_started',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  EVALUATED: 'evaluated',
};

// Question Types
export const QUESTION_TYPES = {
  MULTIPLE_CHOICE: 'multiple_choice',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  CODING: 'coding',
};

// Streak Freeze Status
export const STREAK_FREEZE_STATUS = {
  AVAILABLE: 'available',
  USED: 'used',
  EXPIRED: 'expired',
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  MAX_LIMIT: 100,
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: parseInt(import.meta.env.VITE_MAX_FILE_SIZE) || 5242880, // 5MB
  ALLOWED_TYPES: (import.meta.env.VITE_ALLOWED_FILE_TYPES || 'image/jpeg,image/png,image/gif,application/pdf').split(','),
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

// Date Formats
export const DATE_FORMATS = {
  SHORT: 'MMM d, yyyy',
  LONG: 'MMMM d, yyyy',
  FULL: 'EEEE, MMMM d, yyyy',
  TIME: 'h:mm a',
  DATETIME: 'MMM d, yyyy h:mm a',
  ISO: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
};

// Theme
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system',
};

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password/:token',
  VERIFY_EMAIL: '/verify-email/:token',
  
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  INTRODUCTION: '/introduction',
  
  COURSES: '/courses',
  COURSE_DETAIL: '/courses/:courseId',
  MODULE: '/courses/:courseId/modules/:moduleId',
  LESSON: '/courses/:courseId/modules/:moduleId/lessons/:lessonId',
  
  ASSIGNMENTS: '/assignments',
  ASSIGNMENT_DETAIL: '/assignments/:assignmentId',
  SUBMISSION: '/assignments/:assignmentId/submit',
  
  JARGON: '/jargon',
  JARGON_DETAIL: '/jargon/:jargonId',
  FLASHCARDS: '/jargon/flashcards',
  
  PLACEMENT_TEST: '/placement-test',
  PLACEMENT_RESULT: '/placement-test/result',
  
  NOTICE_BOARD: '/notice-board',
  ANNOUNCEMENT: '/notice-board/announcements/:id',
  EVENT: '/notice-board/events/:id',
  
  RESOURCES: '/resources',
  RESOURCE_DETAIL: '/resources/:resourceId',
  PATHWAYS: '/resources/pathways',
  
  CERTIFICATES: '/certificates',
  CERTIFICATE_VIEW: '/certificates/:certificateId',
  
  NOT_FOUND: '*',
};

// Status Colors
export const STATUS_COLORS = {
  [ASSIGNMENT_STATUS.NOT_STARTED]: 'gray',
  [ASSIGNMENT_STATUS.IN_PROGRESS]: 'blue',
  [ASSIGNMENT_STATUS.SUBMITTED]: 'yellow',
  [ASSIGNMENT_STATUS.GRADED]: 'green',
  [ASSIGNMENT_STATUS.LATE]: 'red',
  
  [ATTENDANCE_STATUS.PRESENT]: 'green',
  [ATTENDANCE_STATUS.ABSENT]: 'red',
  [ATTENDANCE_STATUS.LATE]: 'yellow',
  [ATTENDANCE_STATUS.EXCUSED]: 'blue',
};

// Regex Patterns
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/,
  URL: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  USERNAME: /^[a-zA-Z0-9_]{3,20}$/,
};

// Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, number and special character',
  PASSWORDS_NOT_MATCH: 'Passwords do not match',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_URL: 'Please enter a valid URL',
  INVALID_USERNAME: 'Username must be 3-20 characters and contain only letters, numbers, and underscores',
  FILE_TOO_LARGE: 'File size exceeds the maximum limit',
  INVALID_FILE_TYPE: 'Invalid file type',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  NOT_FOUND: 'Resource not found',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN: 'Login successful',
  LOGOUT: 'Logout successful',
  REGISTER: 'Registration successful',
  PASSWORD_RESET: 'Password reset successful',
  PROFILE_UPDATE: 'Profile updated successfully',
  ASSIGNMENT_SUBMIT: 'Assignment submitted successfully',
  SAVE: 'Saved successfully',
  DELETE: 'Deleted successfully',
  UPDATE: 'Updated successfully',
};

// Loading Messages
export const LOADING_MESSAGES = {
  DEFAULT: 'Loading...',
  SAVING: 'Saving...',
  DELETING: 'Deleting...',
  UPLOADING: 'Uploading...',
  SUBMITTING: 'Submitting...',
  PROCESSING: 'Processing...',
};

// Empty State Messages
export const EMPTY_STATE_MESSAGES = {
  NO_COURSES: 'No courses available',
  NO_ASSIGNMENTS: 'No assignments found',
  NO_JARGON: 'No jargon terms found',
  NO_NOTIFICATIONS: 'No notifications',
  NO_CERTIFICATES: 'No certificates earned yet',
  NO_BADGES: 'No badges earned yet',
  NO_RESOURCES: 'No resources available',
  NO_RESULTS: 'No results found',
};

export default {
  API_URL,
  BASE_URL,
  APP_NAME,
  APP_VERSION,
  STORAGE_KEYS,
  USER_ROLES,
  ROUTES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};