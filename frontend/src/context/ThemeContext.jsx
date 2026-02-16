import { createContext, useState, useEffect } from 'react';
import { STORAGE_KEYS, THEMES } from '@utils/constants';

export const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Get theme from localStorage or default to light
    const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
    return savedTheme || THEMES.LIGHT;
  });

  // Apply theme changes to DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Remove all theme classes
    root.classList.remove('light', 'dark');
    
    // Apply current theme
    if (theme === THEMES.DARK) {
      root.classList.add('dark');
    } else if (theme === THEMES.SYSTEM) {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        root.classList.add('dark');
      }
    }
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
  }, [theme]);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === THEMES.SYSTEM) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = (e) => {
        const root = document.documentElement;
        if (e.matches) {
          root.classList.add('dark');
        } else {
          root.classList.remove('dark');
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  // Toggle between light and dark
  const toggleTheme = () => {
    setTheme((prev) => (prev === THEMES.LIGHT ? THEMES.DARK : THEMES.LIGHT));
  };

  // Set specific theme
  const setThemeMode = (mode) => {
    if (Object.values(THEMES).includes(mode)) {
      setTheme(mode);
    }
  };

  // Check if current theme is dark
  const isDark = () => {
    if (theme === THEMES.DARK) return true;
    if (theme === THEMES.SYSTEM) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  };

  const value = {
    theme,
    setTheme: setThemeMode,
    toggleTheme,
    isDark: isDark(),
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeContext;