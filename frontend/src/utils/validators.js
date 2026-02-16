import { REGEX_PATTERNS, ERROR_MESSAGES } from './constants';

/**
 * Basic Validation Functions
 */
export const isRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
};

export const isEmail = (email) => {
  return REGEX_PATTERNS.EMAIL.test(email);
};

export const isPassword = (password) => {
  return REGEX_PATTERNS.PASSWORD.test(password);
};

export const isPhone = (phone) => {
  return REGEX_PATTERNS.PHONE.test(phone);
};

export const isURL = (url) => {
  return REGEX_PATTERNS.URL.test(url);
};

export const isUsername = (username) => {
  return REGEX_PATTERNS.USERNAME.test(username);
};

/**
 * Length Validators
 */
export const minLength = (value, min) => {
  if (typeof value === 'string') {
    return value.trim().length >= min;
  }
  if (Array.isArray(value)) {
    return value.length >= min;
  }
  return false;
};

export const maxLength = (value, max) => {
  if (typeof value === 'string') {
    return value.trim().length <= max;
  }
  if (Array.isArray(value)) {
    return value.length <= max;
  }
  return false;
};

export const lengthBetween = (value, min, max) => {
  return minLength(value, min) && maxLength(value, max);
};

/**
 * Number Validators
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

export const isInteger = (value) => {
  return Number.isInteger(Number(value));
};

export const min = (value, minValue) => {
  return Number(value) >= minValue;
};

export const max = (value, maxValue) => {
  return Number(value) <= maxValue;
};

export const between = (value, minValue, maxValue) => {
  const num = Number(value);
  return num >= minValue && num <= maxValue;
};

export const isPositive = (value) => {
  return Number(value) > 0;
};

/**
 * Date Validators
 */
export const isDate = (value) => {
  const date = new Date(value);
  return date instanceof Date && !isNaN(date);
};

export const isFutureDate = (date) => {
  return new Date(date) > new Date();
};

export const isPastDate = (date) => {
  return new Date(date) < new Date();
};

export const isDateBetween = (date, startDate, endDate) => {
  const d = new Date(date);
  return d >= new Date(startDate) && d <= new Date(endDate);
};

/**
 * File Validators
 */
export const isValidFileSize = (file, maxSize) => {
  return file.size <= maxSize;
};

export const isValidFileType = (file, allowedTypes) => {
  return allowedTypes.includes(file.type);
};

export const isImage = (file) => {
  return file.type.startsWith('image/');
};

export const isDocument = (file) => {
  const documentTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ];
  return documentTypes.includes(file.type);
};

/**
 * Comparison Validators
 */
export const matches = (value, compareValue) => {
  return value === compareValue;
};

export const notMatches = (value, compareValue) => {
  return value !== compareValue;
};

/**
 * Array Validators
 */
export const isArray = (value) => {
  return Array.isArray(value);
};

export const isNonEmptyArray = (value) => {
  return Array.isArray(value) && value.length > 0;
};

export const arrayLength = (value, length) => {
  return Array.isArray(value) && value.length === length;
};

/**
 * Form Field Validators with Error Messages
 */
export const validateField = (name, value, rules = {}) => {
  const errors = [];

  // Required check
  if (rules.required && !isRequired(value)) {
    errors.push(rules.messages?.required || ERROR_MESSAGES.REQUIRED);
    return errors; // If required and empty, return early
  }

  // Skip other validations if value is empty and not required
  if (!isRequired(value)) {
    return errors;
  }

  // Email validation
  if (rules.email && !isEmail(value)) {
    errors.push(rules.messages?.email || ERROR_MESSAGES.INVALID_EMAIL);
  }

  // Password validation
  if (rules.password && !isPassword(value)) {
    errors.push(rules.messages?.password || ERROR_MESSAGES.INVALID_PASSWORD);
  }

  // Phone validation
  if (rules.phone && !isPhone(value)) {
    errors.push(rules.messages?.phone || ERROR_MESSAGES.INVALID_PHONE);
  }

  // URL validation
  if (rules.url && !isURL(value)) {
    errors.push(rules.messages?.url || ERROR_MESSAGES.INVALID_URL);
  }

  // Username validation
  if (rules.username && !isUsername(value)) {
    errors.push(rules.messages?.username || ERROR_MESSAGES.INVALID_USERNAME);
  }

  // Min length
  if (rules.minLength && !minLength(value, rules.minLength)) {
    errors.push(rules.messages?.minLength || `Minimum length is ${rules.minLength} characters`);
  }

  // Max length
  if (rules.maxLength && !maxLength(value, rules.maxLength)) {
    errors.push(rules.messages?.maxLength || `Maximum length is ${rules.maxLength} characters`);
  }

  // Min value
  if (rules.min !== undefined && !min(value, rules.min)) {
    errors.push(rules.messages?.min || `Minimum value is ${rules.min}`);
  }

  // Max value
  if (rules.max !== undefined && !max(value, rules.max)) {
    errors.push(rules.messages?.max || `Maximum value is ${rules.max}`);
  }

  // Match another field
  if (rules.matches !== undefined && !matches(value, rules.matches)) {
    errors.push(rules.messages?.matches || ERROR_MESSAGES.PASSWORDS_NOT_MATCH);
  }

  // Custom validator
  if (rules.custom && typeof rules.custom === 'function') {
    const customResult = rules.custom(value);
    if (customResult !== true) {
      errors.push(customResult || 'Validation failed');
    }
  }

  return errors;
};

/**
 * Form Validators
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(fieldName => {
    const fieldErrors = validateField(
      fieldName,
      formData[fieldName],
      validationRules[fieldName]
    );

    if (fieldErrors.length > 0) {
      errors[fieldName] = fieldErrors[0]; // Take first error
      isValid = false;
    }
  });

  return { isValid, errors };
};

/**
 * Login Form Validation
 */
export const validateLogin = (email, password) => {
  const errors = {};

  if (!isRequired(email)) {
    errors.email = ERROR_MESSAGES.REQUIRED;
  } else if (!isEmail(email)) {
    errors.email = ERROR_MESSAGES.INVALID_EMAIL;
  }

  if (!isRequired(password)) {
    errors.password = ERROR_MESSAGES.REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Registration Form Validation
 */
export const validateRegistration = (formData) => {
  const errors = {};

  // Name validation
  if (!isRequired(formData.name)) {
    errors.name = ERROR_MESSAGES.REQUIRED;
  } else if (!minLength(formData.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  // Email validation
  if (!isRequired(formData.email)) {
    errors.email = ERROR_MESSAGES.REQUIRED;
  } else if (!isEmail(formData.email)) {
    errors.email = ERROR_MESSAGES.INVALID_EMAIL;
  }

  // Password validation
  if (!isRequired(formData.password)) {
    errors.password = ERROR_MESSAGES.REQUIRED;
  } else if (!isPassword(formData.password)) {
    errors.password = ERROR_MESSAGES.INVALID_PASSWORD;
  }

  // Confirm password validation
  if (!isRequired(formData.confirmPassword)) {
    errors.confirmPassword = ERROR_MESSAGES.REQUIRED;
  } else if (!matches(formData.password, formData.confirmPassword)) {
    errors.confirmPassword = ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Profile Update Validation
 */
export const validateProfile = (formData) => {
  const errors = {};

  if (!isRequired(formData.name)) {
    errors.name = ERROR_MESSAGES.REQUIRED;
  } else if (!minLength(formData.name, 2)) {
    errors.name = 'Name must be at least 2 characters';
  }

  if (formData.phone && !isPhone(formData.phone)) {
    errors.phone = ERROR_MESSAGES.INVALID_PHONE;
  }

  if (formData.website && !isURL(formData.website)) {
    errors.website = ERROR_MESSAGES.INVALID_URL;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Password Change Validation
 */
export const validatePasswordChange = (formData) => {
  const errors = {};

  if (!isRequired(formData.currentPassword)) {
    errors.currentPassword = ERROR_MESSAGES.REQUIRED;
  }

  if (!isRequired(formData.newPassword)) {
    errors.newPassword = ERROR_MESSAGES.REQUIRED;
  } else if (!isPassword(formData.newPassword)) {
    errors.newPassword = ERROR_MESSAGES.INVALID_PASSWORD;
  }

  if (!isRequired(formData.confirmPassword)) {
    errors.confirmPassword = ERROR_MESSAGES.REQUIRED;
  } else if (!matches(formData.newPassword, formData.confirmPassword)) {
    errors.confirmPassword = ERROR_MESSAGES.PASSWORDS_NOT_MATCH;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Assignment Submission Validation
 */
export const validateAssignmentSubmission = (formData, file) => {
  const errors = {};

  if (!isRequired(formData.comments)) {
    errors.comments = 'Please provide submission comments';
  }

  if (!file) {
    errors.file = 'Please upload a file';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Contact Form Validation
 */
export const validateContactForm = (formData) => {
  const errors = {};

  if (!isRequired(formData.name)) {
    errors.name = ERROR_MESSAGES.REQUIRED;
  }

  if (!isRequired(formData.email)) {
    errors.email = ERROR_MESSAGES.REQUIRED;
  } else if (!isEmail(formData.email)) {
    errors.email = ERROR_MESSAGES.INVALID_EMAIL;
  }

  if (!isRequired(formData.subject)) {
    errors.subject = ERROR_MESSAGES.REQUIRED;
  }

  if (!isRequired(formData.message)) {
    errors.message = ERROR_MESSAGES.REQUIRED;
  } else if (!minLength(formData.message, 10)) {
    errors.message = 'Message must be at least 10 characters';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export default {
  isRequired,
  isEmail,
  isPassword,
  validateField,
  validateForm,
  validateLogin,
  validateRegistration,
  validateProfile,
  validatePasswordChange,
};