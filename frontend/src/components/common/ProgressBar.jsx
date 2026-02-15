const ProgressBar = ({
  value = 0,
  max = 100,
  size = 'md',
  color = 'primary',
  showLabel = false,
  labelPosition = 'right',
  animated = false,
  className = '',
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const colors = {
    primary: 'bg-primary-600',
    secondary: 'bg-secondary-600',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
    gradient: 'bg-gradient-to-r from-primary-500 to-secondary-500',
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showLabel && labelPosition === 'left' && (
        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
          {Math.round(percentage)}%
        </span>
      )}
      
      <div className={`flex-1 bg-gray-200 rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`
            ${sizes[size]} ${colors[color]} rounded-full transition-all duration-500 ease-out
            ${animated ? 'animate-pulse' : ''}
          `}
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      {showLabel && labelPosition === 'right' && (
        <span className="text-sm font-medium text-gray-700 min-w-[3rem]">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;