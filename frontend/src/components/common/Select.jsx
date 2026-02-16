import PropTypes from 'prop-types';
import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  options = [],
  error,
  helperText,
  fullWidth = false,
  className = '',
  ...props
}, ref) => {
  const selectClasses = `
    w-full px-4 py-2 rounded-lg border transition-colors
    ${error
      ? 'border-danger-500 focus:ring-danger-500 focus:border-danger-500'
      : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
    }
    dark:bg-gray-800 dark:border-gray-600 dark:text-gray-100
    disabled:bg-gray-100 disabled:cursor-not-allowed dark:disabled:bg-gray-700
    focus:ring-2 focus:outline-none
  `.trim();

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {label}
        </label>
      )}
      
      <select
        ref={ref}
        className={selectClasses}
        {...props}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            disabled={option.disabled}
          >
            {option.label}
          </option>
        ))}
      </select>
      
      {error && (
        <p className="mt-1 text-sm text-danger-600 dark:text-danger-400">
          {error}
        </p>
      )}
      
      {helperText && !error && (
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

Select.propTypes = {
  label: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    })
  ),
  error: PropTypes.string,
  helperText: PropTypes.string,
  fullWidth: PropTypes.bool,
  className: PropTypes.string,
};

export default Select;