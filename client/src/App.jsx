import React from 'react';
import './App.css';
import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <Router>
      <HeroUIProvider>
        <ToastProvider placement={'top-right'}/>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </HeroUIProvider>
    </Router>
  );
}

export default App;