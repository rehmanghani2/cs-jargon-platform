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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-r border-gray-200/80 dark:border-gray-800/80 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200/80 dark:border-gray-800/80">
            <Link to="/dashboard" className="flex items-center gap-3 group">
              <div className="p-2 bg-gradient-to-br from-primary-600 to-indigo-600 rounded-xl text-white shadow-md shadow-primary-500/20 group-hover:scale-105 transition-transform">
                <FiCode className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-display font-extrabold text-gray-900 dark:text-white tracking-tight">
                  CS Jargon
                </span>
                <span className="text-[10px] uppercase font-bold text-primary-600 dark:text-primary-400 tracking-wider">
                  PAF-IAST Portal
                </span>
              </div>
            </Link>
            
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
            <div>
              <p className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                Main Learning
              </p>
              <div className="space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={handleLinkClick}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                          isActive
                            ? 'bg-gradient-to-r from-primary-600 to-indigo-600 text-white shadow-md shadow-primary-500/25'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:translate-x-1'
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

            {/* Admin section */}
            {isAdmin && (
              <div>
                <p className="px-3 text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2">
                  Administration
                </p>
                <div className="space-y-1">
                  {adminMenuItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={handleLinkClick}
                        className={({ isActive }) =>
                          `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            isActive
                              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-md shadow-purple-500/25'
                              : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:translate-x-1'
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
          <div className="p-4 border-t border-gray-200/80 dark:border-gray-800/80">
            <Link
              to="/profile"
              onClick={handleLinkClick}
              className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/60 border border-gray-200/50 dark:border-gray-700/50 hover:border-primary-500/40 transition-all group"
            >
              {user?.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-primary-500/30"
                />
              ) : (
                <div className="w-10 h-10 bg-gradient-to-tr from-primary-600 to-indigo-600 text-white rounded-xl flex items-center justify-center text-sm font-bold shadow-sm">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {user?.name}
                </p>
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 capitalize">
                  {user?.assignedLevel || 'CS Learner'}
                </span>
              </div>
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;