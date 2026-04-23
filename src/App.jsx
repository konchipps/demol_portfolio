import { Suspense, lazy } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import LoadingSpinner from "./components/LoadingSpinner";

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Dashboard = lazy(() => import("./admin/Dashboard"));
const SettingsManager = lazy(() => import("./admin/SettingsManager"));
const HeroManager = lazy(() => import("./admin/HeroManager"));
const ServicesManager = lazy(() => import("./admin/ServicesManager"));
const ProjectsManager = lazy(() => import("./admin/ProjectsManager"));
const ResumeManager = lazy(() => import("./admin/ResumeManager"));
const TestimonialsManager = lazy(() => import("./admin/TestimonialsManager"));
const ClientsManager = lazy(() => import("./admin/ClientsManager"));
const MessagesManager = lazy(() => import("./admin/MessagesManager"));

const App = () => {
  return (
    <Suspense
      fallback={
        <div className="section-shell flex min-h-screen items-center justify-center py-20">
          <LoadingSpinner label="Loading experience..." />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Dashboard />} />
            <Route path="settings" element={<SettingsManager />} />
            <Route path="hero" element={<HeroManager />} />
            <Route path="services" element={<ServicesManager />} />
            <Route path="projects" element={<ProjectsManager />} />
            <Route path="resume" element={<ResumeManager />} />
            <Route path="testimonials" element={<TestimonialsManager />} />
            <Route path="clients" element={<ClientsManager />} />
            <Route path="messages" element={<MessagesManager />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};

export default App;
