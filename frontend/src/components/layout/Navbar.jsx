import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { useAuth } from '@/context/AuthContext';
import Avatar from '@/components/common/Avatar';
import {
  HiOutlineMenu,
  HiOutlineBell,
  HiOutlineSearch,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineUser,
} from 'react-icons/hi';

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="sticky top-0 z-40 bg-white border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
            >
              <HiOutlineMenu className="w-6 h-6" />
            </button>

            {/* Search */}
            <div className="hidden md:flex items-center">
              <div className="relative">
                <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search jargons, courses..."
                  className="w-64 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Streak indicator */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-orange-50 rounded-lg">
              <span className="text-lg">🔥</span>
              <span className="text-sm font-semibold text-orange-600">
                {user?.currentStreak || 0}
              </span>
            </div>

            {/* Points */}
            <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 bg-primary-50 rounded-lg">
              <span className="text-lg">⭐</span>
              <span className="text-sm font-semibold text-primary-600">
                {user?.points || 0}
              </span>
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
              <HiOutlineBell className="w-6 h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-danger-500 rounded-full" />
            </button>

            {/* User menu */}
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-3 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                <Avatar
                  src={user?.profilePicture ? `/uploads/profiles/${user.profilePicture}` : null}
                  name={user?.fullName}
                  size="sm"
                />
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-700">
                    {user?.fullName}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    {user?.assignedLevel || 'Student'}
                  </p>
                </div>
              </Menu.Button>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-lg bg-white shadow-lg ring-1 ring-black/5 focus:outline-none py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/profile"
                        className={`${active ? 'bg-gray-50' : ''} flex items-center gap-3 px-4 py-2 text-sm text-gray-700`}
                      >
                        <HiOutlineUser className="w-5 h-5" />
                        My Profile
                      </Link>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <Link
                        to="/settings"
                        className={`${active ? 'bg-gray-50' : ''} flex items-center gap-3 px-4 py-2 text-sm text-gray-700`}
                      >
                        <HiOutlineCog className="w-5 h-5" />
                        Settings
                      </Link>
                    )}
                  </Menu.Item>
                  <div className="border-t border-gray-100 my-1" />
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`${active ? 'bg-gray-50' : ''} flex items-center gap-3 px-4 py-2 text-sm text-danger-600 w-full`}
                      >
                        <HiOutlineLogout className="w-5 h-5" />
                        Logout
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;