import { 
  format, 
  formatDistanceToNow, 
  formatRelative, 
  parseISO,
  isToday,
  isYesterday,
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
} from 'date-fns';

/**
 * Date Formatters
 */
export const formatDate = (date, formatStr = 'MMM dd, yyyy') => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return format(dateObj, formatStr);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

export const formatDateTime = (date) => {
  return formatDate(date, 'MMM dd, yyyy h:mm a');
};

export const formatTime = (date) => {
  return formatDate(date, 'h:mm a');
};

export const formatDateShort = (date) => {
  return formatDate(date, 'MM/dd/yyyy');
};

export const formatDateLong = (date) => {
  return formatDate(date, 'MMMM dd, yyyy');
};

export const formatDateFull = (date) => {
  return formatDate(date, 'EEEE, MMMM dd, yyyy');
};

/**
 * Relative Time Formatters
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(dateObj, { addSuffix: true });
  } catch (error) {
    console.error('Error formatting relative time:', error);
    return '';
  }
};

export const formatTimeAgo = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    
    const minutes = differenceInMinutes(now, dateObj);
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    
    const hours = differenceInHours(now, dateObj);
    if (hours < 24) return `${hours}h ago`;
    
    const days = differenceInDays(now, dateObj);
    if (days < 7) return `${days}d ago`;
    
    return formatDate(dateObj, 'MMM dd, yyyy');
  } catch (error) {
    console.error('Error formatting time ago:', error);
    return '';
  }
};

export const formatSmartDate = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    
    if (isToday(dateObj)) {
      return `Today at ${formatTime(dateObj)}`;
    }
    
    if (isYesterday(dateObj)) {
      return `Yesterday at ${formatTime(dateObj)}`;
    }
    
    const days = differenceInDays(new Date(), dateObj);
    if (days < 7) {
      return formatDate(dateObj, 'EEEE') + ' at ' + formatTime(dateObj);
    }
    
    return formatDateTime(dateObj);
  } catch (error) {
    console.error('Error formatting smart date:', error);
    return '';
  }
};

export const formatDeadline = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : date;
    const now = new Date();
    
    if (dateObj < now) {
      return 'Overdue';
    }
    
    const hours = differenceInHours(dateObj, now);
    if (hours < 24) {
      return `Due in ${hours}h`;
    }
    
    const days = differenceInDays(dateObj, now);
    if (days === 0) {
      return 'Due today';
    }
    if (days === 1) {
      return 'Due tomorrow';
    }
    if (days < 7) {
      return `Due in ${days} days`;
    }
    
    return `Due ${formatDate(dateObj)}`;
  } catch (error) {
    console.error('Error formatting deadline:', error);
    return '';
  }
};

/**
 * Number Formatters
 */
export const formatNumber = (num, decimals = 0) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return Number(num).toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const formatCompactNumber = (num) => {
  if (num === null || num === undefined || isNaN(num)) return '0';
  
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';
  
  if (absNum >= 1000000) {
    return sign + (absNum / 1000000).toFixed(1) + 'M';
  }
  if (absNum >= 1000) {
    return sign + (absNum / 1000).toFixed(1) + 'K';
  }
  return sign + absNum.toString();
};

export const formatPercentage = (value, decimals = 0) => {
  if (value === null || value === undefined || isNaN(value)) return '0%';
  return `${Number(value).toFixed(decimals)}%`;
};

export const formatCurrency = (amount, currency = 'USD', decimals = 2) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(amount);
};

export const formatScore = (score, total) => {
  if (!total || total === 0) return '0/0';
  return `${score}/${total}`;
};

export const formatGrade = (score, total) => {
  if (!total || total === 0) return 'N/A';
  const percentage = (score / total) * 100;
  return `${percentage.toFixed(1)}%`;
};

/**
 * Text Formatters
 */
export const formatName = (firstName, lastName) => {
  if (!firstName && !lastName) return '';
  if (!lastName) return firstName;
  return `${firstName} ${lastName}`;
};

export const formatInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(' ');
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
};

export const formatPhone = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  if (cleaned.length === 11) {
    return `+${cleaned.slice(0, 1)} (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7)}`;
  }
  return phone;
};

export const formatAddress = (address) => {
  if (!address) return '';
  const { street, city, state, zip, country } = address;
  const parts = [street, city, state, zip, country].filter(Boolean);
  return parts.join(', ');
};

export const formatList = (items, conjunction = 'and') => {
  if (!items || items.length === 0) return '';
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} ${conjunction} ${items[1]}`;
  
  const lastItem = items[items.length - 1];
  const otherItems = items.slice(0, -1).join(', ');
  return `${otherItems}, ${conjunction} ${lastItem}`;
};

export const truncateText = (text, maxLength = 100, suffix = '...') => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + suffix;
};

export const truncateMiddle = (text, maxLength = 50) => {
  if (!text || text.length <= maxLength) return text;
  const charsToShow = maxLength - 3;
  const frontChars = Math.ceil(charsToShow / 2);
  const backChars = Math.floor(charsToShow / 2);
  return text.substr(0, frontChars) + '...' + text.substr(text.length - backChars);
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.split(' ').map(capitalize).join(' ');
};

export const camelToTitle = (str) => {
  if (!str) return '';
  const result = str.replace(/([A-Z])/g, ' $1');
  return result.charAt(0).toUpperCase() + result.slice(1);
};

export const slugToTitle = (slug) => {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => capitalize(word))
    .join(' ');
};

/**
 * File Size Formatter
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  if (!bytes) return '';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Duration Formatters
 */
export const formatDuration = (minutes) => {
  if (!minutes || minutes === 0) return '0m';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

export const formatSeconds = (seconds) => {
  if (!seconds || seconds === 0) return '0:00';
  
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

/**
 * Status Formatters
 */
export const formatStatus = (status) => {
  if (!status) return '';
  return status
    .split('_')
    .map(word => capitalize(word))
    .join(' ');
};

export const formatBadgeType = (type) => {
  const types = {
    streak: 'Streak',
    assignment: 'Assignment',
    course: 'Course Completion',
    jargon: 'Jargon Master',
    attendance: 'Perfect Attendance',
    special: 'Special Achievement',
  };
  return types[type] || formatStatus(type);
};

export const formatDifficulty = (difficulty) => {
  const levels = {
    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    easy: 'Easy',
    medium: 'Medium',
    hard: 'Hard',
  };
  return levels[difficulty] || capitalize(difficulty);
};

/**
 * Array Formatters
 */
export const formatTags = (tags) => {
  if (!tags || tags.length === 0) return '';
  return tags.join(', ');
};

export const formatAuthors = (authors) => {
  if (!authors || authors.length === 0) return '';
  if (authors.length === 1) return authors[0].name;
  if (authors.length === 2) return `${authors[0].name} and ${authors[1].name}`;
  return `${authors[0].name} and ${authors.length - 1} others`;
};

/**
 * Special Formatters
 */
export const formatStreakDisplay = (days) => {
  if (days === 0) return 'Start your streak!';
  if (days === 1) return '1 day streak';
  return `${days} day streak`;
};

export const formatProgressText = (completed, total) => {
  if (!total || total === 0) return 'Not started';
  if (completed === 0) return 'Not started';
  if (completed === total) return 'Completed';
  return `${completed} of ${total} completed`;
};

export const formatAttendanceRate = (present, total) => {
  if (!total || total === 0) return '0%';
  const rate = (present / total) * 100;
  return `${rate.toFixed(1)}%`;
};

export default {
  formatDate,
  formatDateTime,
  formatTime,
  formatRelativeTime,
  formatTimeAgo,
  formatSmartDate,
  formatDeadline,
  formatNumber,
  formatPercentage,
  formatCurrency,
  formatFileSize,
  formatDuration,
  formatStatus,
  truncateText,
  capitalize,
};