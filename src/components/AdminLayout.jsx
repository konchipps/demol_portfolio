import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  BriefcaseBusiness,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareQuote,
  Settings2,
  Rocket,
  Sparkles,
  UserRound,
  Users,
  X
} from "lucide-react";
import { toast } from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/settings", label: "Site Settings", icon: Settings2 },
  { to: "/admin/hero", label: "Hero Content", icon: UserRound },
  { to: "/admin/services", label: "Services", icon: Sparkles },
  { to: "/admin/projects", label: "Projects", icon: Rocket },
  { to: "/admin/resume", label: "Resume", icon: FileText },
  { to: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/admin/clients", label: "Clients", icon: BriefcaseBusiness },
  { to: "/admin/messages", label: "Contact Messages", icon: Users }
];

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition ${
    isActive
      ? "bg-rose-500 text-white"
      : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
  }`;

const AdminLayout = () => {
  const [open, setOpen] = useState(false);
  const { adminProfile, logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Signed out.");
    } catch (error) {
      console.error("Failed to sign out", error);
      toast.error("Sign out failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="flex min-h-screen">
        <aside
          className={`fixed inset-y-0 left-0 z-40 w-72 border-r border-white/10 bg-slate-950/95 p-6 backdrop-blur-xl transition-transform lg:translate-x-0 ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-semibold text-white">
                Portfolio<span className="text-rose-300"> CMS</span>
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {adminProfile?.email || user?.email}
              </p>
            </div>
            <button
              type="button"
              className="rounded-lg border border-white/10 p-2 text-slate-300 lg:hidden"
              onClick={() => setOpen(false)}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <nav className="mt-10 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.to}
                  end={item.end}
                  to={item.to}
                  className={linkClass}
                  onClick={() => setOpen(false)}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="button-secondary mt-8 w-full gap-2"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </aside>

        {open ? (
          <button
            type="button"
            className="fixed inset-0 z-30 bg-slate-950/70 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="flex-1 lg:ml-72">
          <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
            <div className="section-shell flex h-20 items-center justify-between">
              <button
                type="button"
                className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-sm text-slate-100 lg:hidden"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-4 w-4" />
                Menu
              </button>
              <div className="hidden lg:block">
                <p className="text-sm uppercase tracking-[0.22em] text-rose-300">
                  Admin dashboard
                </p>
                <h1 className="mt-1 text-xl font-semibold text-white">
                  Manage public content in real time
                </h1>
              </div>
              <a className="button-secondary" href="/" target="_blank" rel="noreferrer">
                View website
              </a>
            </div>
          </header>

          <main className="section-shell py-8 sm:py-10">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
