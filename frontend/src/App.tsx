import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import { PublicLayout } from './components/layout/PublicLayout';
import { AppLayout } from './components/layout/AppLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { RoleProtectedRoute } from './components/layout/RoleProtectedRoute';
import { ToastContainer } from './components/common/ToastContainer';

// Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const DesignVariantsPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.DesignVariantsPage })));
const HowItWorksPage = lazy(() => import('./pages/HowItWorksPage').then(module => ({ default: module.HowItWorksPage })));
const AboutPage = lazy(() => import('./pages/AboutPage').then(module => ({ default: module.AboutPage })));
const DisclaimerPage = lazy(() => import('./pages/DisclaimerPage').then(module => ({ default: module.DisclaimerPage })));
const AccessDeniedPage = lazy(() => import('./pages/AccessDeniedPage').then(module => ({ default: module.AccessDeniedPage })));
const DemoModePage = lazy(() => import('./pages/DemoModePage').then(module => ({ default: module.DemoModePage })));

// Auth Pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage').then(module => ({ default: module.LoginPage })));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage').then(module => ({ default: module.RegisterPage })));
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage').then(module => ({ default: module.ForgotPasswordPage })));

// Authenticated Dashboard Pages
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage').then(module => ({ default: module.DashboardPage })));
const NewAssessmentPage = lazy(() => import('./pages/assessment/NewAssessmentPage').then(module => ({ default: module.NewAssessmentPage })));
const AssessmentDetailPage = lazy(() => import('./pages/assessment/AssessmentDetailPage').then(module => ({ default: module.AssessmentDetailPage })));
const HistoryPage = lazy(() => import('./pages/dashboard/HistoryPage').then(module => ({ default: module.HistoryPage })));
const ProgressPage = lazy(() => import('./pages/dashboard/ProgressPage').then(module => ({ default: module.ProgressPage })));
const RecommendationsPage = lazy(() => import('./pages/dashboard/RecommendationsPage').then(module => ({ default: module.RecommendationsPage })));
const NutritionPlanPage = lazy(() => import('./pages/dashboard/NutritionPlanPage').then(module => ({ default: module.NutritionPlanPage })));
const ReportsPage = lazy(() => import('./pages/dashboard/ReportsPage').then(module => ({ default: module.ReportsPage })));
const ChatbotPage = lazy(() => import('./pages/dashboard/ChatbotPage').then(module => ({ default: module.ChatbotPage })));
const FindDoctorPage = lazy(() => import('./pages/referrals/FindDoctorPage').then(module => ({ default: module.FindDoctorPage })));
const ProfilePage = lazy(() => import('./pages/dashboard/ProfilePage').then(module => ({ default: module.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/dashboard/SettingsPage').then(module => ({ default: module.SettingsPage })));
const DevStatusPage = lazy(() => import('./pages/dashboard/DevStatusPage').then(module => ({ default: module.DevStatusPage })));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage').then(module => ({ default: module.AdminDashboardPage })));

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div role="status" className="p-8 text-center">Loading page...</div>}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/designs" element={<DesignVariantsPage />} />
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
      </Suspense>

      {/* Global Toast Notifications */}
      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;
