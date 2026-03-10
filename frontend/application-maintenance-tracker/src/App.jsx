import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import LoginPage         from './pages/LoginPage';
import CreateToken       from './pages/CreateToken';
import UserDashboard     from './UserDashboard';
import AdminDashboard    from './AdminDashboard';
import AdminAllRecords   from './AdminAllRecords';
import AdminTokenAssignment from './AdminTokenAssignment';
import TokenDetails      from './TokenDetails';
import DeveloperDashboard from './DeveloperDashboard';
import CommonWorkDetail  from './CommonWorkDetail';
import MyWorks           from './MyWorks';
import TesterDashboard   from './TesterDashboard';

// Protected route — redirects to login if not authenticated or wrong role
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Root: show login, or redirect authenticated users */}
      <Route
        path="/"
        element={
          user
            ? <Navigate to={
                user.role === 'USER'      ? '/user/dashboard' :
                user.role === 'ADMIN'     ? '/admin/dashboard' :
                user.role === 'DEVELOPER' ? '/developer/dashboard' :
                '/tester/dashboard'
              } replace />
            : <LoginPage />
        }
      />

      {/* USER routes */}
      <Route path="/user/dashboard" element={
        <ProtectedRoute roles={['USER']}><UserDashboard /></ProtectedRoute>
      } />
      <Route path="/user/create-token" element={
        <ProtectedRoute roles={['USER']}><CreateToken /></ProtectedRoute>
      } />

      {/* ADMIN routes */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute roles={['ADMIN']}><AdminDashboard /></ProtectedRoute>
      } />
      <Route path="/admin/all-records" element={
        <ProtectedRoute roles={['ADMIN']}><AdminAllRecords /></ProtectedRoute>
      } />
      <Route path="/admin/assign/:id" element={
        <ProtectedRoute roles={['ADMIN']}><AdminTokenAssignment /></ProtectedRoute>
      } />
      <Route path="/admin/token/:id" element={
        <ProtectedRoute roles={['ADMIN']}><TokenDetails /></ProtectedRoute>
      } />

      {/* DEVELOPER routes */}
      <Route path="/developer/dashboard" element={
        <ProtectedRoute roles={['DEVELOPER']}><DeveloperDashboard /></ProtectedRoute>
      } />
      <Route path="/developer/work/:id" element={
        <ProtectedRoute roles={['DEVELOPER']}><CommonWorkDetail /></ProtectedRoute>
      } />
      <Route path="/developer/my-works" element={
        <ProtectedRoute roles={['DEVELOPER']}><MyWorks /></ProtectedRoute>
      } />

      {/* TESTER routes */}
      <Route path="/tester/dashboard" element={
        <ProtectedRoute roles={['TESTER']}><TesterDashboard /></ProtectedRoute>
      } />
      <Route path="/tester/work/:id" element={
        <ProtectedRoute roles={['TESTER']}><CommonWorkDetail /></ProtectedRoute>
      } />
      <Route path="/tester/my-works" element={
        <ProtectedRoute roles={['TESTER']}><MyWorks /></ProtectedRoute>
      } />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
