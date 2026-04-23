import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { Lock, ShieldCheck } from "lucide-react";
import { toast } from "react-hot-toast";
import ConfigNotice from "../components/ConfigNotice";
import FormField from "../components/FormField";
import GlassPanel from "../components/GlassPanel";
import { db } from "../firebase/config";
import { useAuth } from "../hooks/useAuth";
import {
  getAuthErrorMessage,
  getAuthSetupMessage,
  getAdminSetupMessage,
  isPermissionDeniedError
} from "../utils/firebaseErrors";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { adminCheckError, hasFirebaseConfig, isAdmin, loading, login, logout, user } =
    useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState("");

  const redirectTo = location.state?.from?.pathname || "/admin";

  useEffect(() => {
    if (!loading && isAdmin) {
      navigate("/admin", { replace: true });
    }
  }, [isAdmin, loading, navigate]);

  const validate = () => {
    const nextErrors = {};

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    }

    if (!form.password.trim()) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    if (authErrorMessage) {
      setAuthErrorMessage("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);
    setAuthErrorMessage("");

    try {
      const credential = await login(form.email, form.password);
      const adminSnapshot = await getDoc(doc(db, "admins", credential.user.uid));

      if (!adminSnapshot.exists()) {
        await logout();
        throw new Error("This account is authenticated, but it is not registered as an admin.");
      }

      toast.success("Welcome back.");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      if (isPermissionDeniedError(error)) {
        toast.error("Firestore rules are blocking the admin lookup.");
      } else {
        const message = getAuthErrorMessage(error);
        console.error("Admin login failed", error.code || error.message || error);
        setAuthErrorMessage(message);
        toast.error(message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin Login | Portfolio CMS</title>
      </Helmet>

      <div className="section-shell flex min-h-screen items-center justify-center py-14">
        <div className="grid w-full max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
              Portfolio admin
            </p>
            <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Manage the public site without touching code.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300">
              Update the hero, services, resume, testimonials, client logos, and incoming
              contact messages from one protected dashboard.
            </p>
            <div className="mt-8 flex items-center gap-3 text-sm text-slate-300">
              <ShieldCheck className="h-5 w-5 text-emerald-300" />
              Email/password auth plus Firestore admin role checking
            </div>
          </div>

          <GlassPanel className="p-6 sm:p-8">
            {!hasFirebaseConfig ? (
              <ConfigNotice description="Admin login is ready, but Firebase is not configured yet. Add your Firebase keys to .env.local first, then restart the dev server." />
            ) : null}

            <div className="mb-8 flex items-center gap-3">
              <div className="rounded-lg border border-rose-400/20 bg-rose-500/10 p-3 text-rose-200">
                <Lock className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-white">Sign in</h2>
                <p className="mt-1 text-sm text-slate-400">Admin accounts only</p>
              </div>
            </div>

            <form className="grid gap-5" onSubmit={handleSubmit}>
              <FormField
                label="Email"
                type="email"
                name="email"
                placeholder="admin@example.com"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
              />
              <FormField
                label="Password"
                type="password"
                name="password"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                error={errors.password}
              />
              <button
                type="submit"
                disabled={submitting || !hasFirebaseConfig}
                className="button-primary"
              >
                {submitting ? "Signing in..." : "Login to Dashboard"}
              </button>
            </form>

            {authErrorMessage ? (
              <div className="mt-6 rounded-lg border border-amber-400/20 bg-amber-500/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-amber-300">
                  Login setup
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-200">{authErrorMessage}</p>
                <p className="mt-3 text-sm leading-6 text-slate-400">{getAuthSetupMessage()}</p>
              </div>
            ) : null}

            {user && isPermissionDeniedError(adminCheckError) ? (
              <div className="mt-6 rounded-lg border border-rose-400/20 bg-rose-500/10 p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">
                  Firestore rules required
                </p>
                <p className="mt-3 text-sm leading-6 text-slate-300">
                  {getAdminSetupMessage(user.uid)}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.2em] text-slate-500">
                  Current UID: {user.uid}
                </p>
              </div>
            ) : null}

            <div className="mt-6 text-sm text-slate-400">
              Need the public site instead?{" "}
              <Link className="font-medium text-rose-300 hover:text-rose-200" to="/">
                Back to portfolio
              </Link>
            </div>
          </GlassPanel>
        </div>
      </div>
    </>
  );
};

export default Login;
