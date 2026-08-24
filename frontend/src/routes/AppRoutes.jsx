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





// import { Routes, Route, Navigate } from 'react-router-dom';
// import { useAuth } from '@hooks/useAuth';

// // Layouts
// import DashboardLayout from '@components/layout/DashboardLayout';
// import AuthLayout from '@components/layout/AuthLayout';

// // Public Pages
// import HomePage from '@pages/HomePage';
// import NotFoundPage from '@pages/NotFoundPage';

// // Auth Pages
// import LoginPage from '@pages/auth/LoginPage';
// import RegisterPage from '@pages/auth/RegisterPage';
// import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';
// import VerifyEmailPage from '@pages/auth/VerifyEmailPage';
// import ResetPasswordPage from '@pages/auth/ResetPasswordPage';
// import OAuthCallback from '@pages/auth/OAuthCallback';

// // Protected Pages
// import DashboardPage from '@pages/dashboard/DashboardPage';
// import ProfilePage from '@pages/profile/ProfilePage';
// import SettingsPage from '@pages/profile/SettingsPage';
// import IntroductionPage from '@pages/profile/IntroductionPage';

// // Course Pages
// import CoursesPage from '@pages/courses/CoursesPage';
// import CourseDetailPage from '@pages/courses/CourseDetailPage';
// import ModulePage from '@pages/courses/ModulePage';
// import LessonPage from '@pages/courses/LessonPage';

// // Assignment Pages
// import AssignmentsPage from '@pages/assignments/AssignmentsPage';
// import AssignmentDetailPage from '@pages/assignments/AssignmentDetailPage';
// import SubmissionPage from '@pages/assignments/SubmissionPage';

// // Jargon Pages
// import JargonLibraryPage from '@pages/jargon/JargonLibraryPage';
// import JargonDetailPage from '@pages/jargon/JargonDetailPage';
// import FlashcardsPage from '@pages/jargon/FlashcardsPage';

// // Placement Pages
// import PlacementTestPage from '@pages/placement/PlacementTestPage';
// import PlacementResultPage from '@pages/placement/PlacementResultPage';

// // Notice Board Pages
// import NoticeBoardPage from '@pages/notice-board/NoticeBoardPage';
// import AnnouncementPage from '@pages/notice-board/AnnouncementPage';
// import EventPage from '@pages/notice-board/EventPage';

// // Resource Pages
// import ResourcesPage from '@pages/resources/ResourcesPage';
// import ResourceDetailPage from '@pages/resources/ResourceDetailPage';
// import PathwaysPage from '@pages/resources/PathwaysPage';

// // Certificate Pages
// import CertificatesPage from '@pages/certificates/CertificatesPage';
// import CertificateViewPage from '@pages/certificates/CertificateViewPage';

// // Admin Pages
// import AdminDashboardPage from '@pages/admin/AdminDashboardPage';
// import AdminUsersPage from '@pages/admin/AdminUsersPage';

// // Legal Pages
// import TermsOfServicePage from '@pages/legal/TermsOfServicePage';
// import PrivacyPolicyPage from '@pages/legal/PrivacyPolicyPage';
// import AboutPage from '@pages/legal/AboutPage';
// import ContactPage from '@pages/legal/ContactPage';

// // Route Components
// const ProtectedRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
//       </div>
//     );
//   }

//   return user ? children : <Navigate to="/login" replace />;
// };

// const AdminRoute = ({ children }) => {
//   const { user, loading } = useAuth();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
//       </div>
//     );
//   }

//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }

//   if (user.role !== 'admin') {
//     return <Navigate to="/dashboard" replace />;
//   }

//   return children;
// };

// const PublicRoute = ({ children }) => {
//   const { user } = useAuth();
//   return user ? <Navigate to="/dashboard" replace /> : children;
// };

// const AppRoutes = () => {
//   return (
//     <Routes>
//       {/* Public Routes */}
//       <Route path="/" element={<HomePage />} />
//       <Route path="/about" element={<AboutPage />} />
//       <Route path="/contact" element={<ContactPage />} />
//       <Route path="/terms" element={<TermsOfServicePage />} />
//       <Route path="/privacy" element={<PrivacyPolicyPage />} />

//       {/* Auth Routes */}
//       <Route
//         path="/login"
//         element={
//           <PublicRoute>
//             <AuthLayout>
//               <LoginPage />
//             </AuthLayout>
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/register"
//         element={
//           <PublicRoute>
//             <AuthLayout>
//               <RegisterPage />
//             </AuthLayout>
//           </PublicRoute>
//         }
//       />
//       <Route
//         path="/forgot-password"
//         element={
//           <PublicRoute>
//             <AuthLayout>
//               <ForgotPasswordPage />
//             </AuthLayout>
//           </PublicRoute>
//         }
//       />
//       <Route path="/verify-email" element={<VerifyEmailPage />} />
//       <Route path="/reset-password" element={<ResetPasswordPage />} />
//       <Route path="/auth/callback" element={<OAuthCallback />} />

//       {/* Introduction (One-time onboarding) */}
//       <Route
//         path="/introduction"
//         element={
//           <ProtectedRoute>
//             <IntroductionPage />
//           </ProtectedRoute>
//         }
//       />

//       {/* Protected Routes */}
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <DashboardPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Profile Routes */}
//       <Route
//         path="/profile"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <ProfilePage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/settings"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <SettingsPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Course Routes */}
//       <Route
//         path="/courses"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <CoursesPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/courses/:id"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <CourseDetailPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/courses/:courseId/modules/:moduleId"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <ModulePage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/courses/:courseId/modules/:moduleId/lessons/:lessonId"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <LessonPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Assignment Routes */}
//       <Route
//         path="/assignments"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <AssignmentsPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/assignments/:id"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <AssignmentDetailPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/assignments/:id/submit"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <SubmissionPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Jargon Routes */}
//       <Route
//         path="/jargon"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <JargonLibraryPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/jargon/:id"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <JargonDetailPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/jargon/flashcards"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <FlashcardsPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Placement Test Routes */}
//       <Route
//         path="/placement-test"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <PlacementTestPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/placement-test/results"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <PlacementResultPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Notice Board Routes */}
//       <Route
//         path="/notice-board"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <NoticeBoardPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/notice-board/announcements/:id"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <AnnouncementPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/notice-board/events/:id"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <EventPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Resource Routes */}
//       <Route
//         path="/resources"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <ResourcesPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/resources/:id"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <ResourceDetailPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/pathways"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <PathwaysPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Certificate Routes */}
//       <Route
//         path="/certificates"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <CertificatesPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />
//       <Route
//         path="/certificates/:id"
//         element={
//           <ProtectedRoute>
//             <DashboardLayout>
//               <CertificateViewPage />
//             </DashboardLayout>
//           </ProtectedRoute>
//         }
//       />

//       {/* Admin Routes */}
//       <Route
//         path="/admin"
//         element={
//           <AdminRoute>
//             <DashboardLayout>
//               <AdminDashboardPage />
//             </DashboardLayout>
//           </AdminRoute>
//         }
//       />
//       <Route
//         path="/admin/users"
//         element={
//           <AdminRoute>
//             <DashboardLayout>
//               <AdminUsersPage />
//             </DashboardLayout>
//           </AdminRoute>
//         }
//       />

//       {/* 404 Not Found */}
//       <Route path="*" element={<NotFoundPage />} />
//     </Routes>
//   );
// };

// export default AppRoutes;