import PropTypes from 'prop-types';
import { getInitials } from '@utils/helpers';

function Avatar({
  src,
  alt,
  name,
  size = 'medium',
  shape = 'circle',
  status,
  className = '',
}) {
  const sizes = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-10 h-10 text-sm',
    large: 'w-12 h-12 text-base',
    xlarge: 'w-16 h-16 text-lg',
  };

  const shapes = {
    circle: 'rounded-full',
    square: 'rounded-lg',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    busy: 'bg-danger-500',
    away: 'bg-warning-500',
  };

  const statusSizes = {
    small: 'w-2 h-2',
    medium: 'w-2.5 h-2.5',
    large: 'w-3 h-3',
    xlarge: 'w-4 h-4',
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt || name}
          className={`object-cover ${sizes[size]} ${shapes[shape]}`}
        />
      ) : (
        <div
          className={`
            flex items-center justify-center font-medium
            bg-primary-600 text-white
            ${sizes[size]} ${shapes[shape]}
          `}
        >
          {getInitials(name || alt)}
        </div>
      )}

      {status && (
        <span
          className={`
            absolute bottom-0 right-0 block rounded-full
            border-2 border-white dark:border-gray-800
            ${statusColors[status]}
            ${statusSizes[size]}
          `}
        />
      )}
    </div>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['small', 'medium', 'large', 'xlarge']),
  shape: PropTypes.oneOf(['circle', 'square']),
  status: PropTypes.oneOf(['online', 'offline', 'busy', 'away']),
  className: PropTypes.string,
};

export default Avatar;