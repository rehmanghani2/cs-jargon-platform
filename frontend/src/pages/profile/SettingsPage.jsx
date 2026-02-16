import { useState } from 'react';
import { useAuth } from '@hooks/useAuth';
import { useTheme } from '@hooks/useTheme';
import Card from '@components/common/Card';
import Button from '@components/common/Button';
import Input from '@components/common/Input';
import Select from '@components/common/Select';
import Modal from '@components/common/Modal';
import { FiLock, FiTrash2, FiMail } from 'react-icons/fi';
import { validatePasswordChange } from '@utils/validators';

function SettingsPage() {
  const { user, changePassword, logout } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordErrors({});

    const { isValid, errors } = validatePasswordChange(passwordData);
    
    if (!isValid) {
      setPasswordErrors(errors);
      return;
    }

    setIsChangingPassword(true);
    const result = await changePassword(passwordData);
    setIsChangingPassword(false);

    if (result.success) {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    }
  };

  const handleDeleteAccount = async () => {
    // Implement delete account logic
    setShowDeleteModal(false);
    logout();
  };

  const themeOptions = [
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
    { value: 'system', label: 'System' },
  ];

  const notificationSettings = [
    { id: 'assignments', label: 'Assignment notifications', enabled: true },
    { id: 'grades', label: 'Grade notifications', enabled: true },
    { id: 'announcements', label: 'Announcements', enabled: true },
    { id: 'badges', label: 'Badge achievements', enabled: false },
    { id: 'streak', label: 'Streak reminders', enabled: true },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 dark:text-white">
          Settings
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Account Settings */}
      <Card title="Account Settings">
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email
            </p>
            <div className="flex items-center gap-2">
              <FiMail className="w-4 h-4 text-gray-400" />
              <p className="text-gray-900 dark:text-white">{user?.email}</p>
              {user?.emailVerified ? (
                <span className="text-xs text-success-600 dark:text-success-400">
                  Verified ✓
                </span>
              ) : (
                <Button variant="ghost" size="small">
                  Verify Email
                </Button>
              )}
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Role
            </p>
            <p className="text-gray-900 dark:text-white capitalize">
              {user?.role}
            </p>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card title="Change Password">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, currentPassword: e.target.value })
            }
            error={passwordErrors.currentPassword}
            leftIcon={<FiLock />}
            fullWidth
          />

          <Input
            label="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, newPassword: e.target.value })
            }
            error={passwordErrors.newPassword}
            leftIcon={<FiLock />}
            helperText="Must be at least 8 characters"
            fullWidth
          />

          <Input
            label="Confirm New Password"
            type="password"
            value={passwordData.confirmPassword}
            onChange={(e) =>
              setPasswordData({ ...passwordData, confirmPassword: e.target.value })
            }
            error={passwordErrors.confirmPassword}
            leftIcon={<FiLock />}
            fullWidth
          />

          <Button
            type="submit"
            variant="primary"
            loading={isChangingPassword}
          >
            Update Password
          </Button>
        </form>
      </Card>

      {/* Appearance */}
      <Card title="Appearance">
        <div className="space-y-4">
          <Select
            label="Theme"
            options={themeOptions}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            fullWidth
          />
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Choose how CS Jargon looks to you. Select a single theme, or sync with your system.
          </p>
        </div>
      </Card>

      {/* Notifications */}
      <Card title="Notifications">
        <div className="space-y-4">
          {notificationSettings.map((setting) => (
            <div key={setting.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {setting.label}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked={setting.enabled}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
              </label>
            </div>
          ))}
        </div>
      </Card>

      {/* Danger Zone */}
      <Card title="Danger Zone">
        <div className="space-y-4">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-red-900 dark:text-red-200 mb-1">
                  Delete Account
                </h3>
                <p className="text-sm text-red-700 dark:text-red-300">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
              </div>
              <Button
                variant="danger"
                size="small"
                leftIcon={<FiTrash2 />}
                onClick={() => setShowDeleteModal(true)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Delete Account Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Account"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteAccount}>
              Yes, Delete My Account
            </Button>
          </>
        }
      >
        <p className="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete your account? This action cannot be undone and you will lose all your data, including:
        </p>
        <ul className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-400 list-disc list-inside">
          <li>All your course progress</li>
          <li>Assignments and submissions</li>
          <li>Certificates and badges</li>
          <li>Personal information</li>
        </ul>
      </Modal>
    </div>
  );
}

export default SettingsPage;