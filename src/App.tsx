import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import { store, RootState, AppDispatch } from "@/store/store";
import { fetchProfile } from "@/store/slices/authSlice";
import { useEffect } from "react";

import Login from "@/pages/auth/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import ProtectedRoute from "@/routes/ProtectedRoute";

import AdminDashboard from "@/pages/admin/Dashboard";
import Students from "@/pages/admin/Students";
import Teachers from "@/pages/admin/Teachers";
import Parents from "@/pages/admin/Parents";
import Classes from "@/pages/admin/Classes";
import ClassScheduleManagement from "@/pages/admin/ClassSchedule";
import Exams from "@/pages/admin/Exams";
import AdminAttendance from "@/pages/admin/Attendance";
import Settings from "@/pages/admin/Settings";

import TeacherDashboard from "@/pages/teacher/Dashboard";
import TeacherClasses from "@/pages/teacher/Classes";
import TeacherAttendance from "@/pages/teacher/Attendance";
import TeacherExams from "@/pages/teacher/Exams";

import StudentDashboard from "@/pages/student/Dashboard";
import StudentClasses from "@/pages/student/Classes";
import StudentExams from "@/pages/student/Exams";
import StudentResults from "@/pages/student/Results";

import ParentDashboard from "@/pages/parent/Dashboard";
import ParentProgress from "@/pages/parent/Progress";
import ParentAttendance from "@/pages/parent/Attendance";

import ChatPage from "@/components/chat/ChatPage";
import Fees from "@/pages/shared/Fees";
import NoticeBoard from "@/pages/shared/NoticeBoard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { isAuthenticated, user, token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Fetch user profile on app load if token exists but user doesn't
   * This ensures user data is synced with backend
   */
  useEffect(() => {
    if (token && !user) {
      dispatch(fetchProfile());
    }
  }, [token, user, dispatch]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated && user
            ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace />
            : <Navigate to="/login" replace />
        }
      />
      <Route path="/login" element={isAuthenticated && user ? <Navigate to={`/${user.role.toLowerCase()}/dashboard`} replace /> : <Login />} />

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={['admin']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/students" element={<Students />} />
        <Route path="/admin/teachers" element={<Teachers />} />
        <Route path="/admin/parents" element={<Parents />} />
        <Route path="/admin/classes" element={<Classes />} />
        <Route path="/admin/schedule" element={<ClassScheduleManagement />} />
        <Route path="/admin/exams" element={<Exams />} />
        <Route path="/admin/attendance" element={<AdminAttendance />} />
        <Route path="/admin/notices" element={<NoticeBoard />} />
        <Route path="/admin/chat" element={<ChatPage currentUserRole="admin" />} />
        <Route path="/admin/settings" element={<Settings />} />
      </Route>

      {/* Teacher Routes */}
      <Route element={<ProtectedRoute allowedRoles={['teacher']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/classes" element={<TeacherClasses />} />
        <Route path="/teacher/attendance" element={<TeacherAttendance />} />
        <Route path="/teacher/exams" element={<TeacherExams />} />
        <Route path="/teacher/notices" element={<NoticeBoard />} />
        <Route path="/teacher/chat" element={<ChatPage currentUserRole="teacher" />} />
      </Route>

      {/* Student Routes */}
      <Route element={<ProtectedRoute allowedRoles={['student']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/classes" element={<StudentClasses />} />
        <Route path="/student/exams" element={<StudentExams />} />
        <Route path="/student/results" element={<StudentResults />} />
        <Route path="/student/fees" element={<Fees />} />
        <Route path="/student/notices" element={<NoticeBoard />} />
        <Route path="/student/chat" element={<ChatPage currentUserRole="student" />} />
      </Route>

      {/* Parent Routes */}
      <Route element={<ProtectedRoute allowedRoles={['parent']}><DashboardLayout /></ProtectedRoute>}>
        <Route path="/parent/dashboard" element={<ParentDashboard />} />
        <Route path="/parent/progress" element={<ParentProgress />} />
        <Route path="/parent/attendance" element={<ParentAttendance />} />
        <Route path="/parent/fees" element={<Fees />} />
        <Route path="/parent/notices" element={<NoticeBoard />} />
        <Route path="/parent/chat" element={<ChatPage currentUserRole="parent" />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
