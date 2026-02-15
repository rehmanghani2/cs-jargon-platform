import { forwardRef } from 'react';
import { HiExclamationCircle } from 'react-icons/hi';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  return (
    <div className={containerClassName}>
      {label && (
        <label className="label" htmlFor={props.id || props.name}>
          {label}
          {props.required && <span className="text-danger-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-400">{leftIcon}</span>
          </div>
        )}
        
        <input
          ref={ref}
          className={`
            input
            ${leftIcon ? 'pl-10' : ''}
            ${rightIcon || error ? 'pr-10' : ''}
            ${error ? 'input-error' : ''}
            ${className}
          `}
          {...props}
        />
        
        {(rightIcon || error) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            {error ? (
              <HiExclamationCircle className="h-5 w-5 text-danger-500" />
            ) : (
              <span className="text-gray-400">{rightIcon}</span>
            )}
          </div>
        )}
      </div>
      
      {error && <p className="error-text">{error}</p>}
      {helperText && !error && (
        <p className="text-sm text-gray-500 mt-1">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;