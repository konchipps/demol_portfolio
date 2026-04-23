import { Database, FileText, MessageSquare, Rocket, Sparkles, Users } from "lucide-react";
import { toast } from "react-hot-toast";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import { useCollection } from "../hooks/useCollection";
import { useDocument } from "../hooks/useDocument";
import { formatTimestamp } from "../utils/formatters";
import { seedPortfolioContent } from "../utils/seedFirestore";

const Dashboard = () => {
  const { data: hero, loading: heroLoading } = useDocument(
    "siteContent",
    "hero",
    null,
    { fallbackWhenMissing: false }
  );
  const { data: services, loading: servicesLoading } = useCollection("services", {
    field: "order",
    direction: "asc"
  });
  const { data: projects, loading: projectsLoading } = useCollection("projects", {
    field: "order",
    direction: "asc"
  });
  const { data: testimonials, loading: testimonialsLoading } = useCollection(
    "testimonials",
    {
      field: "order",
      direction: "asc"
    }
  );
  const { data: clients, loading: clientsLoading } = useCollection("clients", {
    field: "order",
    direction: "asc"
  });
  const { data: messages, loading: messagesLoading } = useCollection("messages", {
    field: "createdAt",
    direction: "desc"
  });

  const loading =
    heroLoading ||
    servicesLoading ||
    projectsLoading ||
    testimonialsLoading ||
    clientsLoading ||
    messagesLoading;

  const summaryCards = [
    {
      label: "Hero ready",
      value: hero ? "Yes" : "No",
      icon: Sparkles
    },
    {
      label: "Services",
      value: services.length,
      icon: Database
    },
    {
      label: "Projects",
      value: projects.length,
      icon: Rocket
    },
    {
      label: "Testimonials",
      value: testimonials.length,
      icon: Users
    },
    {
      label: "Messages",
      value: messages.length,
      icon: MessageSquare
    }
  ];

  const handleSeed = async () => {
    try {
      await seedPortfolioContent();
      toast.success("Demo content added to Firestore.");
    } catch (error) {
      console.error("Failed to seed Firestore", error);
      toast.error(error.message || "Unable to seed demo content.");
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Overview
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Control room for your portfolio</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-300">
            Content updates publish in real time across the public site. Use the sections in the
            sidebar for detailed editing, or start by loading the demo content bundle.
          </p>
        </div>
        <button type="button" className="button-primary" onClick={handleSeed}>
          Load demo content
        </button>
      </div>

      {loading ? <LoadingSpinner label="Loading dashboard..." /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <GlassPanel key={card.label} className="p-5">
              <Icon className="h-5 w-5 text-rose-300" />
              <p className="mt-5 text-3xl font-bold text-white">{card.value}</p>
              <p className="mt-2 text-sm text-slate-400">{card.label}</p>
            </GlassPanel>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold text-white">Recent messages</h3>
              <p className="mt-1 text-sm text-slate-400">
                Latest inbound contact form submissions
              </p>
            </div>
            <FileText className="h-5 w-5 text-rose-300" />
          </div>

          <div className="mt-6 space-y-4">
            {messages.slice(0, 5).map((message) => (
              <div key={message.id} className="rounded-lg border border-white/10 p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-medium text-white">{message.name}</p>
                    <p className="text-sm text-slate-400">{message.email}</p>
                  </div>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                    {formatTimestamp(message.createdAt)}
                  </p>
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-300">{message.message}</p>
              </div>
            ))}
            {!messages.length ? (
              <p className="text-sm text-slate-400">No messages yet.</p>
            ) : null}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <h3 className="text-xl font-semibold text-white">Content checklist</h3>
          <div className="mt-6 space-y-4 text-sm text-slate-300">
            <div className="rounded-lg border border-white/10 p-4">
              <p className="font-medium text-white">Hero content</p>
              <p className="mt-2 leading-7">
                Update your intro, social links, stats, profile image, and resume download URL.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="font-medium text-white">Services and resume</p>
              <p className="mt-2 leading-7">
                Keep order fields tidy so the public sections stay consistent and premium-looking.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="font-medium text-white">Site settings</p>
              <p className="mt-2 leading-7">
                Hide or restore entire homepage sections from the Site Settings panel without
                deleting their content.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="font-medium text-white">Projects</p>
              <p className="mt-2 leading-7">
                Keep your strongest concepts and live builds organized with direct image
                URLs, tech chips, and optional launch links.
              </p>
            </div>
            <div className="rounded-lg border border-white/10 p-4">
              <p className="font-medium text-white">Client logos</p>
              <p className="mt-2 leading-7">
                Use direct logo URLs for now. Firebase Storage uploads can be enabled later once
                the bucket is initialized.
              </p>
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
};

export default Dashboard;
