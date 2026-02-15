const Avatar = ({
  src,
  alt = 'Avatar',
  name = '',
  size = 'md',
  className = '',
  showStatus = false,
  status = 'online',
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
    '2xl': 'w-24 h-24 text-2xl',
  };

  const statusColors = {
    online: 'bg-success-500',
    offline: 'bg-gray-400',
    busy: 'bg-danger-500',
    away: 'bg-warning-500',
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative inline-block ${className}`}>
      {src ? (
        <img
          src={src}
          alt={alt}
          className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div
          className={`
            ${sizes[size]} rounded-full bg-gradient-to-br from-primary-400 to-secondary-500
            flex items-center justify-center text-white font-medium ring-2 ring-white
          `}
        >
          {name ? getInitials(name) : '?'}
        </div>
      )}
      
      {showStatus && (
        <span
          className={`
            absolute bottom-0 right-0 block rounded-full ring-2 ring-white
            ${statusColors[status]}
            ${size === 'xs' || size === 'sm' ? 'w-2 h-2' : 'w-3 h-3'}
          `}
        />
      )}
    </div>
  );
};

export default Avatar;