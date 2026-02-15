import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';

// Layouts
import DashboardLayout from '@/components/layout/DashboardLayout';
import AuthLayout from '@/components/layout/AuthLayout';

// Route Guards
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Loader
import { PageLoader } from '@/components/common/Loader';

// Auth Pages (eager load for fast initial load)
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@/pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@/pages/auth/VerifyEmailPage';

// Lazy load other pages
const DashboardPage = lazy(() => import('@/pages/dashboard/DashboardPage'));
const IntroductionPage = lazy(() => import('@/pages/profile/IntroductionPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const SettingsPage = lazy(() => import('@/pages/profile/SettingsPage'));
const PlacementTestPage = lazy(() => import('@/pages/placement/PlacementTestPage'));
const PlacementResultPage = lazy(() => import('@/pages/placement/PlacementResultPage'));
const CoursesPage = lazy(() => import('@/pages/courses/CoursesPage'));
const CourseDetailPage = lazy(() => import('@/pages/courses/CourseDetailPage'));
const ModulePage = lazy(() => import('@/pages/courses/ModulePage'));
const LessonPage = lazy(() => import('@/pages/courses/LessonPage'));
const AssignmentsPage = lazy(() => import('@/pages/assignments/AssignmentsPage'));
const AssignmentDetailPage = lazy(() => import('@/pages/assignments/AssignmentDetailPage'));
const JargonLibraryPage = lazy(() => import('@/pages/jargon/JargonLibraryPage'));
const JargonDetailPage = lazy(() => import('@/pages/jargon/JargonDetailPage'));
const FlashcardsPage = lazy(() => import('@/pages/jargon/FlashcardsPage'));
const NoticeBoardPage = lazy(() => import('@/pages/notice-board/NoticeBoardPage'));
const ResourcesPage = lazy(() => import('@/pages/resources/ResourcesPage'));
const CertificatesPage = lazy(() => import('@/pages/certificates/CertificatesPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPasswordPage />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <PublicRoute>
              <ResetPasswordPage />
            </PublicRoute>
          }
        />
        <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

        {/* Introduction (requires auth but not profile) */}
        <Route
          path="/introduction"
          element={
            <ProtectedRoute>
              <IntroductionPage />
            </ProtectedRoute>
          }
        />

        {/* Placement test (requires auth and profile) */}
        <Route
          path="/placement-test"
          element={
            <ProtectedRoute requireProfile>
              <PlacementTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/placement-result"
          element={
            <ProtectedRoute requireProfile>
              <PlacementResultPage />
            </ProtectedRoute>
          }
        />

        {/* Protected routes with dashboard layout */}
        <Route
          element={
            <ProtectedRoute requireProfile requirePlacement>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          
          {/* Courses */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/modules/:moduleId" element={<ModulePage />} />
          <Route path="/courses/:courseId/modules/:moduleId/lessons/:lessonIndex" element={<LessonPage />} />
          
          {/* Assignments */}
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/assignments/:assignmentId" element={<AssignmentDetailPage />} />
          
          {/* Jargon Library */}
          <Route path="/jargons" element={<JargonLibraryPage />} />
          <Route path="/jargons/:jargonId" element={<JargonDetailPage />} />
          <Route path="/jargons/flashcards" element={<FlashcardsPage />} />
          
          {/* Notice Board */}
          <Route path="/notice-board" element={<NoticeBoardPage />} />
          
          {/* Resources */}
          <Route path="/resources" element={<ResourcesPage />} />
          
          {/* Certificates */}
          <Route path="/certificates" element={<CertificatesPage />} />
        </Route>

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;