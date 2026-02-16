import { NavLink, Link } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import { 
  FiHome,
  FiBook,
  FiFileText,
  FiBookOpen,
  FiClipboard,
  FiBell,
  FiAward,
  FiFolder,
  FiCode,
  FiX
} from 'react-icons/fi';

function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth();

  const menuItems = [
    {
      title: 'Dashboard',
      icon: FiHome,
      path: '/dashboard',
    },
    {
      title: 'Courses',
      icon: FiBook,
      path: '/courses',
    },
    {
      title: 'Assignments',
      icon: FiFileText,
      path: '/assignments',
    },
    {
      title: 'Jargon Library',
      icon: FiBookOpen,
      path: '/jargon',
    },
    {
      title: 'Notice Board',
      icon: FiBell,
      path: '/notice-board',
    },
    {
      title: 'Resources',
      icon: FiFolder,
      path: '/resources',
    },
    {
      title: 'Certificates',
      icon: FiAward,
      path: '/certificates',
    },
  ];

  // Admin menu items
  const adminMenuItems = [
    {
      title: 'Admin Panel',
      icon: FiClipboard,
      path: '/admin',
    },
  ];

  const isAdmin = user?.role === 'admin' || user?.role === 'instructor';

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700">
            <Link to="/dashboard" className="flex items-center gap-2">
              <FiCode className="w-6 h-6 text-primary-600" />
              <span className="text-xl font-display font-bold text-gray-900 dark:text-white">
                CS Jargon
              </span>
            </Link>
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={handleLinkClick}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`
                    }
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.title}</span>
                  </NavLink>
                );
              })}
            </div>

            {/* Admin section */}
            {isAdmin && (
              <div className="mt-8">
                <h3 className="px-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  Administration
                </h3>
                <div className="space-y-1">
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                            isActive
                              ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400'
                              : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                          }`
                        }
                      >
                        <Icon className="w-5 h-5 flex-shrink-0" />
                        <span>{item.title}</span>
                      </NavLink>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* User info at bottom */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  View Profile
                </p>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;