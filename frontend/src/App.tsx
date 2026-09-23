import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { RoleProtectedRoute } from './components/layout/RoleProtectedRoute';
import { ToastContainer } from './components/common/ToastContainer';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AboutPage } from './pages/AboutPage';
import { DisclaimerPage } from './pages/DisclaimerPage';
import { AccessDeniedPage } from './pages/AccessDeniedPage';
import { DemoModePage } from './pages/DemoModePage';

// Auth Pages
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Authenticated Dashboard Pages
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { NewAssessmentPage } from './pages/assessment/NewAssessmentPage';
import { AssessmentDetailPage } from './pages/assessment/AssessmentDetailPage';
import { HistoryPage } from './pages/dashboard/HistoryPage';
import { ProgressPage } from './pages/dashboard/ProgressPage';
import { RecommendationsPage } from './pages/dashboard/RecommendationsPage';
import { NutritionPlanPage } from './pages/dashboard/NutritionPlanPage';
import { ReportsPage } from './pages/dashboard/ReportsPage';
import { ChatbotPage } from './pages/dashboard/ChatbotPage';
import { FindDoctorPage } from './pages/referrals/FindDoctorPage';
import { ProfilePage } from './pages/dashboard/ProfilePage';
import { SettingsPage } from './pages/dashboard/SettingsPage';
import { DevStatusPage } from './pages/dashboard/DevStatusPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/disclaimer" element={<DisclaimerPage />} />
          <Route path="/demo" element={<DemoModePage />} />
          <Route path="/doctors" element={<FindDoctorPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/403" element={<AccessDeniedPage />} />
        </Route>

        {/* Authenticated Dashboard & Assessment Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/demo" element={<DemoModePage />} />
          <Route path="/assessment" element={<Navigate to="/assessment/new" replace />} />
          <Route path="/assessment/new" element={<NewAssessmentPage />} />
          <Route path="/assessment/:id" element={<AssessmentDetailPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/nutrition-plan" element={<NutritionPlanPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="/doctors" element={<FindDoctorPage />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/dev/status" element={<DevStatusPage />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboardPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <RoleProtectedRoute allowedRoles={['ROLE_ADMIN']}>
                <AdminDashboardPage />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* Catch-all Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
