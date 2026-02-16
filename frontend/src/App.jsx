import { useEffect } from 'react';
import { AuthProvider } from '@context/AuthContext';
import { ThemeProvider } from '@context/ThemeContext';
import { NotificationProvider } from '@context/NotificationContext';
import AppRoutes from '@routes/AppRoutes';
import ErrorBoundary from '@components/common/ErrorBoundary';

function App() {
  useEffect(() => {
    // Set initial theme
    const savedTheme = localStorage.getItem('jargon_theme') || 'light';
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <NotificationProvider>
            <AppRoutes />
          </NotificationProvider>
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;