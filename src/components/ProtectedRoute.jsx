import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { getAdminSetupMessage, isPermissionDeniedError } from "../utils/firebaseErrors";
import ConfigNotice from "./ConfigNotice";
import GlassPanel from "./GlassPanel";
import LoadingSpinner from "./LoadingSpinner";

const ProtectedRoute = () => {
  const { adminCheckError, hasFirebaseConfig, isAdmin, loading, user } = useAuth();
  const location = useLocation();

  if (!hasFirebaseConfig) {
    return (
      <div className="section-shell flex min-h-screen items-center justify-center py-20">
        <div className="w-full max-w-xl">
          <ConfigNotice description="Admin access needs Firebase Authentication, Firestore, and Storage configured first. Add your Firebase keys, then create an admin auth user plus a matching admins/{uid} document." />
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="section-shell flex min-h-screen items-center justify-center py-20">
        <LoadingSpinner label="Checking admin access..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (isPermissionDeniedError(adminCheckError)) {
    return (
      <div className="section-shell flex min-h-screen items-center justify-center py-20">
        <GlassPanel className="w-full max-w-xl p-8">
          <ShieldAlert className="h-10 w-10 text-rose-300" />
          <h1 className="mt-5 text-2xl font-semibold text-white">
            Firestore rules are still blocking admin access.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {getAdminSetupMessage(user.uid)}
          </p>
          <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
            Current UID: {user.uid}
          </p>
        </GlassPanel>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="section-shell flex min-h-screen items-center justify-center py-20">
        <GlassPanel className="w-full max-w-lg p-8">
          <ShieldAlert className="h-10 w-10 text-rose-300" />
          <h1 className="mt-5 text-2xl font-semibold text-white">
            This account is not assigned admin access.
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            Create a document at <span className="font-semibold text-white">admins/{user.uid}</span> in
            Firestore for this authenticated user, then sign in again.
          </p>
        </GlassPanel>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;
