import Button from './Button';

const EmptyState = ({
  icon,
  title,
  description,
  action,
  actionText,
  className = '',
}) => {
  return (
    <div className={`text-center py-12 px-4 ${className}`}>
      {icon && (
        <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
          {icon}
        </div>
      )}
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-500 max-w-sm mx-auto mb-6">
          {description}
        </p>
      )}
      
      {action && actionText && (
        <Button onClick={action}>
          {actionText}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;