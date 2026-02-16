import { createContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@hooks/useAuth';
import axios from '@api/axios';
import toast from 'react-hot-toast';

export const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      setIsLoading(true);
      const response = await axios.get('/notifications');
      setNotifications(response.data.notifications || []);
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user]);

  // Initial fetch
  useEffect(() => {
    if (isAuthenticated) {
      fetchNotifications();
    } else {
      // Clear notifications when logged out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isAuthenticated, fetchNotifications]);

  // Poll for new notifications every 30 seconds
  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      fetchNotifications();
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchNotifications]);

  // Mark notification as read
  const markAsRead = async (notificationId) => {
    try {
      await axios.put(`/notifications/${notificationId}/read`);
      
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif
        )
      );
      
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await axios.put('/notifications/read-all');
      
      setNotifications((prev) =>
        prev.map((notif) => ({ ...notif, read: true }))
      );
      
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast.error('Failed to mark all as read');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(`/notifications/${notificationId}`);
      
      const notification = notifications.find((n) => n._id === notificationId);
      
      setNotifications((prev) =>
        prev.filter((notif) => notif._id !== notificationId)
      );
      
      if (notification && !notification.read) {
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
      
      toast.success('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast.error('Failed to delete notification');
    }
  };

  // Clear all notifications
  const clearAll = async () => {
    try {
      await axios.delete('/notifications');
      
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch (error) {
      console.error('Error clearing notifications:', error);
      toast.error('Failed to clear notifications');
    }
  };

  // Add new notification (for real-time updates)
  const addNotification = (notification) => {
    setNotifications((prev) => [notification, ...prev]);
    
    if (!notification.read) {
      setUnreadCount((prev) => prev + 1);
    }
    
    // Show toast notification
    const notificationTypes = {
      assignment: '📝',
      grade: '📊',
      announcement: '📢',
      badge: '🏆',
      streak: '🔥',
      course: '📚',
      system: '⚙️',
      reminder: '⏰',
    };
    
    const icon = notificationTypes[notification.type] || '🔔';
    
    toast.success(`${icon} ${notification.title}`, {
      duration: 5000,
      onClick: () => {
        if (notification.link) {
          window.location.href = notification.link;
        }
      },
    });
  };

  // Get notifications by type
  const getNotificationsByType = (type) => {
    return notifications.filter((notif) => notif.type === type);
  };

  // Get unread notifications
  const getUnreadNotifications = () => {
    return notifications.filter((notif) => !notif.read);
  };

  // Get recent notifications (last 5)
  const getRecentNotifications = (count = 5) => {
    return notifications.slice(0, count);
  };

  // Check if has unread notifications
  const hasUnreadNotifications = unreadCount > 0;

  const value = {
    notifications,
    unreadCount,
    isLoading,
    hasUnreadNotifications,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAll,
    addNotification,
    getNotificationsByType,
    getUnreadNotifications,
    getRecentNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export default NotificationContext;