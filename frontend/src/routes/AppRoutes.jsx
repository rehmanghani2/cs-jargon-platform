import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@hooks/useAuth';
import ProtectedRoute from './ProtectedRoute';
import PublicRoute from './PublicRoute';

// Layouts
import DashboardLayout from '@components/layout/DashboardLayout';
import AuthLayout from '@components/layout/AuthLayout';

// Auth Pages
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '@pages/auth/ResetPasswordPage';
import VerifyEmailPage from '@pages/auth/VerifyEmailPage';
import OAuthCallback from '@pages/auth/OAuthCallback';

// Main Pages
import HomePage from '@pages/HomePage';
import DashboardPage from '@pages/dashboard/DashboardPage';
import NotFoundPage from '@pages/NotFoundPage';

// Profile Pages
import ProfilePage from '@pages/profile/ProfilePage';
import IntroductionPage from '@pages/profile/IntroductionPage';
import SettingsPage from '@pages/profile/SettingsPage';

// Placement Test Pages
import PlacementTestPage from '@pages/placement/PlacementTestPage';
import PlacementResultPage from '@pages/placement/PlacementResultPage';

// Course Pages
import CoursesPage from '@pages/courses/CoursesPage';
import CourseDetailPage from '@pages/courses/CourseDetailPage';
import ModulePage from '@pages/courses/ModulePage';
import LessonPage from '@pages/courses/LessonPage';

// Assignment Pages
import AssignmentsPage from '@pages/assignments/AssignmentsPage';
import AssignmentDetailPage from '@pages/assignments/AssignmentDetailPage';
import SubmissionPage from '@pages/assignments/SubmissionPage';

// Jargon Pages
import JargonLibraryPage from '@pages/jargon/JargonLibraryPage';
import JargonDetailPage from '@pages/jargon/JargonDetailPage';
import FlashcardsPage from '@pages/jargon/FlashcardsPage';

// Notice Board Pages
import NoticeBoardPage from '@pages/notice-board/NoticeBoardPage';
import AnnouncementPage from '@pages/notice-board/AnnouncementPage';
import EventPage from '@pages/notice-board/EventPage';

// Resource Pages
import ResourcesPage from '@pages/resources/ResourcesPage';
import ResourceDetailPage from '@pages/resources/ResourceDetailPage';
import PathwaysPage from '@pages/resources/PathwaysPage';

// Certificate Pages
import CertificatesPage from '@pages/certificates/CertificatesPage';
import CertificateViewPage from '@pages/certificates/CertificateViewPage';

function AppRoutes() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Public Home Route */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Routes */}
      <Route element={<PublicRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        </Route>
      </Route>

      {/* Email Verification */}
      <Route path="/verify-email/:token" element={<VerifyEmailPage />} />

      {/* OAuth Callback */}
      <Route path="/auth/callback" element={<OAuthCallback />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          {/* Dashboard */}
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Profile */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Placement Test */}
          <Route path="/placement-test" element={<PlacementTestPage />} />
          <Route path="/placement-test/result" element={<PlacementResultPage />} />

          {/* Courses */}
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/courses/:courseId" element={<CourseDetailPage />} />
          <Route path="/courses/:courseId/modules/:moduleId" element={<ModulePage />} />
          <Route path="/courses/:courseId/modules/:moduleId/lessons/:lessonId" element={<LessonPage />} />

          {/* Assignments */}
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/assignments/:assignmentId" element={<AssignmentDetailPage />} />
          <Route path="/assignments/:assignmentId/submit" element={<SubmissionPage />} />

          {/* Jargon */}
          <Route path="/jargon" element={<JargonLibraryPage />} />
          <Route path="/jargon/:jargonId" element={<JargonDetailPage />} />
          <Route path="/jargon/flashcards" element={<FlashcardsPage />} />

          {/* Notice Board */}
          <Route path="/notice-board" element={<NoticeBoardPage />} />
          <Route path="/notice-board/announcements/:id" element={<AnnouncementPage />} />
          <Route path="/notice-board/events/:id" element={<EventPage />} />

          {/* Resources */}
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:resourceId" element={<ResourceDetailPage />} />
          <Route path="/resources/pathways" element={<PathwaysPage />} />

          {/* Certificates */}
          <Route path="/certificates" element={<CertificatesPage />} />
          <Route path="/certificates/:certificateId" element={<CertificateViewPage />} />
        </Route>
      </Route>

      {/* 404 Not Found */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default AppRoutes;