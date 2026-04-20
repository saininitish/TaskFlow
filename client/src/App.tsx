import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/shared/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <TaskProvider>
          <Router>
          <div className="min-h-screen bg-[#0f172a] text-slate-200">
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />

              {/* Protected Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<DashboardPage />} />
              </Route>

              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* 404 Route */}
              <Route path="*" element={
                <div className="flex h-screen items-center justify-center font-bold text-4xl bg-[#0f172a]">
                  404 - Page Not Found
                </div>
              } />
            </Routes>
          </div>
        </Router>
        </TaskProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
