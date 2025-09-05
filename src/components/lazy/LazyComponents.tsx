import { lazy } from "react";

// Lazy load heavy components
export const LazyTeacherDashboard = lazy(() => import("../TeacherDashboard"));
export const LazyStudentDashboard = lazy(
  () => import("../student/StudentDashboardClient")
);
