// src/App.tsx
import React, { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import './index.css'

const App: React.FC = () => {
  useEffect(() => {
    // Apply initial theme from localStorage or system
    const savedTheme = localStorage.getItem('saas.settings.v1');
    if (savedTheme) {
      try {
        const settings = JSON.parse(savedTheme);
        if (settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
          document.documentElement.classList.add('dark');
        }
      } catch {}
    }
  }, []);

  return <AppRouter />;
  
};

export default App;