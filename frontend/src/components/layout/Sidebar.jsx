import { Fragment } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useAuth } from '@/context/AuthContext';
import {
  HiOutlineHome,
  HiOutlineAcademicCap,
  HiOutlineBookOpen,
  HiOutlineClipboardList,
  HiOutlineCollection,
  HiOutlineSpeakerphone,
  HiOutlineLibrary,
  HiOutlineBadgeCheck,
  HiOutlineChartBar,
  HiOutlineX,
} from 'react-icons/hi';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HiOutlineHome },
  { name: 'My Courses', href: '/courses', icon: HiOutlineAcademicCap },
  { name: 'Assignments', href: '/assignments', icon: HiOutlineClipboardList },
  { name: 'Jargon Library', href: '/jargons', icon: HiOutlineBookOpen },
  { name: 'Notice Board', href: '/notice-board', icon: HiOutlineSpeakerphone },
  { name: 'Resources', href: '/resources', icon: HiOutlineLibrary },
  { name: 'Certificates', href: '/certificates', icon: HiOutlineBadgeCheck },
  { name: 'My Progress', href: '/progress', icon: HiOutlineChartBar },
];

const SidebarContent = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center h-16 px-6 border-b border-gray-200">
        <Link to="/dashboard" className="flex items-center gap-2">
          <span className="text-2xl">🖥️</span>
          <span className="font-heading font-bold text-xl text-gray-900">
            CS Jargon
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
        {navigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${isActive
                  ? 'bg-primary-50 text-primary-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : ''}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* User level card */}
      <div className="p-4 border-t border-gray-200">
        <div className="p-4 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-xl text-white">
          <p className="text-sm opacity-90">Current Level</p>
          <p className="text-lg font-semibold capitalize">
            {user?.assignedLevel || 'Not Assigned'}
          </p>
          {user?.assignedLevel && (
            <p className="text-xs mt-1 opacity-75">
              {user.assignedLevel === 'beginner' ? 'A1-A2' :
               user.assignedLevel === 'intermediate' ? 'B1-B2' : 'C1-C2'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const Sidebar = ({ isOpen, onClose, isMobile = false }) => {
  if (isMobile) {
    return (
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 lg:hidden" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-linear duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900/80" />
          </Transition.Child>

          <div className="fixed inset-0 flex">
            <Transition.Child
              as={Fragment}
              enter="transition ease-in-out duration-300 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-300 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                <Transition.Child
                  as={Fragment}
                  enter="ease-in-out duration-300"
                  enterFrom="opacity-0"
                  enterTo="opacity-100"
                  leave="ease-in-out duration-300"
                  leaveFrom="opacity-100"
                  leaveTo="opacity-0"
                >
                  <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                    <button
                      type="button"
                      className="-m-2.5 p-2.5"
                      onClick={onClose}
                    >
                      <HiOutlineX className="h-6 w-6 text-white" />
                    </button>
                  </div>
                </Transition.Child>
                <SidebarContent />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    );
  }

  return <SidebarContent />;
};

export default Sidebar;