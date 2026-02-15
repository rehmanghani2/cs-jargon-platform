import { ImSpinner2 } from 'react-icons/im';

const Loader = ({
  size = 'md',
  color = 'primary',
  fullScreen = false,
  text = '',
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  const colors = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    white: 'text-white',
    gray: 'text-gray-400',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center">
      <ImSpinner2 className={`animate-spin ${sizes[size]} ${colors[color]}`} />
      {text && <p className="mt-3 text-gray-600">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export const PageLoader = ({ text = 'Loading...' }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <Loader size="lg" text={text} />
  </div>
);

export const ButtonLoader = () => (
  <ImSpinner2 className="w-5 h-5 animate-spin" />
);

export default Loader;