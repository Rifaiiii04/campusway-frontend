import { lazy } from "react";

// Lazy load heavy components
export const LazyTeacherDashboard = lazy(() => import("../TeacherDashboard"));
export const LazyStudentDashboard = lazy(
  () => import("../student/StudentDashboardClient")
);
export const LazyMajorDetailModal = lazy(
  () => import("../student/MajorDetailModal")
);
export const LazySettingsModal = lazy(() => import("../student/SettingsModal"));
export const LazyChartComponent = lazy(
  () => import("../teacher/ChartComponent")
);

// Lazy load utility components
export const LazyLoadingSpinner = lazy(() => import("../ui/LoadingSpinner"));
export const LazyErrorBoundary = lazy(() => import("../ui/ErrorBoundary"));
