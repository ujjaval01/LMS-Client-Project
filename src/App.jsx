import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { LibraryProvider } from './context/LibraryContext.jsx';

// Layouts
import DashboardLayout from './components/layout/DashboardLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Books from './pages/Books';
import Students from './pages/Students';
import Issues from './pages/Issues';
import Settings from './pages/Settings';
import StudentPortal from './pages/StudentPortal';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { token, user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-[var(--color-bg)] flex items-center justify-center text-glow text-2xl font-bold">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return <Navigate to={user?.role === 'student' ? '/app/student-portal' : '/app/dashboard'} replace />;
  }
  
  return children;
};

function AppContent() {
  const { user } = useAuth();

  return (
    <Router>
      <Toaster position="top-right" toastOptions={{
        className: 'glass-panel !bg-[var(--glass-bg)] !text-[var(--color-slate-100)]',
        style: { border: '1px solid var(--glass-border)' }
      }} />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/app" element={
          <ProtectedRoute>
            <LibraryProvider>
              <DashboardLayout />
            </LibraryProvider>
          </ProtectedRoute>
        }>
          <Route index element={<Navigate to={user?.role === 'student' ? '/app/student-portal' : '/app/dashboard'} replace />} />
          
          {/* Admin Routes */}
          <Route path="dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="books" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Books />
            </ProtectedRoute>
          } />
          <Route path="students" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Students />
            </ProtectedRoute>
          } />
          <Route path="issues" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Issues />
            </ProtectedRoute>
          } />

          {/* Student Routes */}
          <Route path="student-portal" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentPortal />
            </ProtectedRoute>
          } />

          {/* Common Routes */}
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
