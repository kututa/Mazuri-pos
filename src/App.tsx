import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { Layout } from './components/Layout';
import { LoginForm } from './components/auth/LoginForm';
import { ForgotPassword } from './components/auth/ForgotPassword';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import { AuthLayout } from './components/auth/AuthLayout';
import { Unauthorized } from './components/Unauthorized';
import { AdminDashboard } from './components/dashboard/AdminDashboard';
import { OwnerDashboard } from './components/dashboard/OwnerDashboard';
import { AttendantDashboard } from './components/dashboard/AttendantDashboard';
import { UsersList } from './components/users/UsersList';
import { UserForm } from './components/users/UserForm';
import { UserProfile } from './components/users/UserProfile';
import { InventoryList } from './components/inventory/InventoryList';
import { InventoryForm } from './components/inventory/InventoryForm';
import { InventoryDetails } from './components/inventory/InventoryDetails';
import { CategoryManagement } from './components/inventory/CategoryManagement';
import { SalesInterface } from './components/sales/SalesInterface';
import { NotificationPreferences } from './components/notifications/NotificationPreferences';
import { ExpenseList } from './components/expenses/ExpenseList';
import { ExpenseForm } from './components/expenses/ExpenseForm';
import { ExpenseAnalytics } from './components/expenses/ExpenseAnalytics';
import { ImportExport } from './components/data/ImportExport';
import { useAuthStore } from './store/authStore';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';
import { UserRole } from './types/auth';

function App() {
  const { setUser, setSession } = useAuthStore();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [setUser, setSession]);

  return (
    <ThemeProvider>
      <PermissionProvider>
        <NotificationProvider>
          <Router>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/login" element={
                <AuthLayout title="Sign in to your account">
                  <LoginForm />
                </AuthLayout>
              } />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <ProtectedRoute allowedRoles={[UserRole.ADMIN]}>
                  <Layout>
                    <Routes>
                      <Route index element={<AdminDashboard />} />
                      <Route path="users" element={<UsersList />} />
                      <Route path="users/new" element={<UserForm />} />
                      <Route path="users/:id" element={<UserProfile />} />
                      <Route path="users/:id/edit" element={<UserForm />} />
                      <Route path="inventory" element={<InventoryList />} />
                      <Route path="inventory/new" element={<InventoryForm />} />
                      <Route path="inventory/:id" element={<InventoryDetails />} />
                      <Route path="inventory/:id/edit" element={<InventoryForm />} />
                      <Route path="categories" element={<CategoryManagement />} />
                      <Route path="expenses" element={<ExpenseList />} />
                      <Route path="expenses/new" element={<ExpenseForm />} />
                      <Route path="expenses/analytics" element={<ExpenseAnalytics />} />
                      <Route path="settings/notifications" element={<NotificationPreferences />} />
                      <Route path="data" element={<ImportExport />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Owner Routes */}
              <Route path="/owner/*" element={
                <ProtectedRoute allowedRoles={[UserRole.OWNER]}>
                  <Layout>
                    <Routes>
                      <Route index element={<OwnerDashboard />} />
                      <Route path="inventory" element={<InventoryList />} />
                      <Route path="inventory/new" element={<InventoryForm />} />
                      <Route path="inventory/:id" element={<InventoryDetails />} />
                      <Route path="inventory/:id/edit" element={<InventoryForm />} />
                      <Route path="categories" element={<CategoryManagement />} />
                      <Route path="expenses" element={<ExpenseList />} />
                      <Route path="expenses/new" element={<ExpenseForm />} />
                      <Route path="expenses/analytics" element={<ExpenseAnalytics />} />
                      <Route path="settings/notifications" element={<NotificationPreferences />} />
                      <Route path="data" element={<ImportExport />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Attendant Routes */}
              <Route path="/attendant/*" element={
                <ProtectedRoute allowedRoles={[UserRole.ATTENDANT]}>
                  <Layout>
                    <Routes>
                      <Route index element={<AttendantDashboard />} />
                      <Route path="inventory" element={<InventoryList />} />
                      <Route path="inventory/:id" element={<InventoryDetails />} />
                      <Route path="sales" element={<SalesInterface />} />
                      <Route path="settings/notifications" element={<NotificationPreferences />} />
                    </Routes>
                  </Layout>
                </ProtectedRoute>
              } />

              {/* Default Route - Redirect to appropriate dashboard based on role */}
              <Route path="/" element={
                <ProtectedRoute>
                  {({ userRole }) => {
                    switch (userRole) {
                      case UserRole.ADMIN:
                        return <Navigate to="/admin" replace />;
                      case UserRole.OWNER:
                        return <Navigate to="/owner" replace />;
                      case UserRole.ATTENDANT:
                        return <Navigate to="/attendant" replace />;
                      default:
                        return <Navigate to="/login" replace />;
                    }
                  }}
                </ProtectedRoute>
              } />
            </Routes>
          </Router>
        </NotificationProvider>
      </PermissionProvider>
    </ThemeProvider>
  );
}

export default App;