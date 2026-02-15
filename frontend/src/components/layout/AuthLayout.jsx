import { Link } from 'react-router-dom';

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-700 flex">
      {/* Left side - branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12">
        <div className="max-w-md text-center text-white">
          <Link to="/" className="inline-block mb-8">
            <span className="text-6xl">🖥️</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">CS Jargon Platform</h1>
          <p className="text-lg text-white/80">
            Master Computer Science terminology with interactive learning,
            personalized courses, and professional certification.
          </p>
          
          <div className="mt-12 grid grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-3xl font-bold">500+</p>
              <p className="text-sm text-white/70">Jargons</p>
            </div>
            <div>
              <p className="text-3xl font-bold">3</p>
              <p className="text-sm text-white/70">Levels</p>
            </div>
            <div>
              <p className="text-3xl font-bold">1000+</p>
              <p className="text-sm text-white/70">Students</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Mobile logo */}
            <div className="lg:hidden text-center mb-6">
              <Link to="/" className="inline-block">
                <span className="text-4xl">🖥️</span>
              </Link>
            </div>

            {title && (
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
                {subtitle && (
                  <p className="mt-2 text-gray-600">{subtitle}</p>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;