import { STORAGE_KEYS, FILE_UPLOAD } from './constants';

/**
 * Local Storage Helper Functions
 */
export const storage = {
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  },
  
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};

/**
 * Token Management
 */
export const tokenManager = {
  setToken: (token) => storage.set(STORAGE_KEYS.TOKEN, token),
  getToken: () => storage.get(STORAGE_KEYS.TOKEN),
  removeToken: () => storage.remove(STORAGE_KEYS.TOKEN),
  
  setRefreshToken: (token) => storage.set(STORAGE_KEYS.REFRESH_TOKEN, token),
  getRefreshToken: () => storage.get(STORAGE_KEYS.REFRESH_TOKEN),
  removeRefreshToken: () => storage.remove(STORAGE_KEYS.REFRESH_TOKEN),
  
  clearTokens: () => {
    tokenManager.removeToken();
    tokenManager.removeRefreshToken();
  },
};

/**
 * User Management
 */
export const userManager = {
  setUser: (user) => storage.set(STORAGE_KEYS.USER, user),
  getUser: () => storage.get(STORAGE_KEYS.USER),
  removeUser: () => storage.remove(STORAGE_KEYS.USER),
  updateUser: (updates) => {
    const user = userManager.getUser();
    if (user) {
      userManager.setUser({ ...user, ...updates });
    }
  },
};

/**
 * String Utilities
 */
export const truncate = (str, length = 50, suffix = '...') => {
  if (!str || str.length <= length) return str;
  return str.substring(0, length).trim() + suffix;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
};

export const slugify = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

export const sanitizeHTML = (html) => {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Number Utilities
 */
export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat().format(num);
};

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

export const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Array Utilities
 */
export const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const unique = (array) => {
  return [...new Set(array)];
};

export const groupBy = (array, key) => {
  return array.reduce((result, item) => {
    const group = item[key];
    if (!result[group]) {
      result[group] = [];
    }
    result[group].push(item);
    return result;
  }, {});
};

export const sortBy = (array, key, order = 'asc') => {
  return [...array].sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];
    
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
};

export const chunk = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Object Utilities
 */
export const pick = (obj, keys) => {
  return keys.reduce((result, key) => {
    if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
      result[key] = obj[key];
    }
    return result;
  }, {});
};

export const omit = (obj, keys) => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const isEmpty = (value) => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * URL Utilities
 */
export const getQueryParams = (search = window.location.search) => {
  return Object.fromEntries(new URLSearchParams(search));
};

export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, value);
    }
  });
  return searchParams.toString();
};

export const getFileExtension = (filename) => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const getMimeType = (filename) => {
  const ext = getFileExtension(filename).toLowerCase();
  const mimeTypes = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
  };
  return mimeTypes[ext] || 'application/octet-stream';
};

/**
 * File Utilities
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

export const validateFile = (file) => {
  const errors = [];
  
  if (!file) {
    errors.push('No file selected');
    return { valid: false, errors };
  }
  
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    errors.push(`File size must be less than ${formatFileSize(FILE_UPLOAD.MAX_SIZE)}`);
  }
  
  if (!FILE_UPLOAD.ALLOWED_TYPES.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed`);
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Async Utilities
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

export const debounce = (func, wait = 300) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
};

/**
 * Grade Calculation
 */
export const calculateGrade = (score, total) => {
  if (!total || total === 0) return 'N/A';
  const percentage = (score / total) * 100;
  
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 60) return 'D';
  return 'F';
};

export const getGradeColor = (grade) => {
  const colors = {
    'A+': 'green',
    'A': 'green',
    'A-': 'green',
    'B+': 'blue',
    'B': 'blue',
    'B-': 'blue',
    'C+': 'yellow',
    'C': 'yellow',
    'C-': 'yellow',
    'D': 'orange',
    'F': 'red',
  };
  return colors[grade] || 'gray';
};

/**
 * Progress Calculation
 */
export const calculateProgress = (completed, total) => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Streak Calculation
 */
export const calculateStreak = (dates) => {
  if (!dates || dates.length === 0) return 0;
  
  const sortedDates = dates
    .map(d => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);
  
  let streak = 1;
  const oneDay = 24 * 60 * 60 * 1000;
  
  for (let i = 0; i < sortedDates.length - 1; i++) {
    const diff = sortedDates[i] - sortedDates[i + 1];
    if (diff === oneDay) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Color Utilities
 */
export const getStatusColor = (status) => {
  const colors = {
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue',
    pending: 'yellow',
    active: 'green',
    inactive: 'gray',
  };
  return colors[status] || 'gray';
};

export const getBadgeColor = (tier) => {
  const colors = {
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
    diamond: '#B9F2FF',
  };
  return colors[tier] || '#6B7280';
};

/**
 * Copy to Clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy:', error);
    return false;
  }
};

/**
 * Download File
 */
export const downloadFile = (url, filename) => {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Generate Random ID
 */
export const generateId = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

/**
 * Get Initials from Name
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

/**
 * Get Random Color
 */
export const getRandomColor = () => {
  const colors = [
    '#ef4444', '#f59e0b', '#10b981', '#3b82f6', 
    '#8b5cf6', '#ec4899', '#06b6d4', '#14b8a6'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

/**
 * Format Duration
 */
export const formatDuration = (minutes) => {
  if (!minutes) return '0m';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export default {
  storage,
  tokenManager,
  userManager,
  truncate,
  capitalize,
  formatNumber,
  formatPercentage,
  calculateGrade,
  calculateProgress,
  copyToClipboard,
  downloadFile,
};