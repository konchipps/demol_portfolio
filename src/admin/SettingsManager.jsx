import { useEffect, useMemo, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import {
  BriefcaseBusiness,
  Eye,
  EyeOff,
  FileText,
  MessageSquareQuote,
  Phone,
  Rocket,
  Sparkles,
  UserRound
} from "lucide-react";
import { toast } from "react-hot-toast";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import { db } from "../firebase/config";
import { useDocument } from "../hooks/useDocument";
import { siteSettingsSeed } from "../utils/defaultContent";

const sectionCatalog = [
  {
    key: "hero",
    label: "Hero",
    description: "Controls the intro area with your name, role, image, stats, and social links.",
    icon: UserRound
  },
  {
    key: "services",
    label: "Services",
    description: "Shows the public list of service cards and the Services navigation link.",
    icon: Sparkles
  },
  {
    key: "resume",
    label: "Resume",
    description: "Shows the experience and education timeline section on the homepage.",
    icon: FileText
  },
  {
    key: "projects",
    label: "Projects",
    description: "Shows the projects gallery and hides its navigation link when disabled.",
    icon: Rocket
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Shows the testimonials block and its navigation link on the public site.",
    icon: MessageSquareQuote
  },
  {
    key: "clients",
    label: "Clients",
    description: "Shows the client logo grid section on the public site.",
    icon: BriefcaseBusiness
  },
  {
    key: "contact",
    label: "Contact",
    description: "Shows the contact form, contact details, and its navigation link.",
    icon: Phone
  }
];

const normalizeSettings = (settings) => ({
  ...siteSettingsSeed,
  ...settings,
  sections: {
    ...siteSettingsSeed.sections,
    ...(settings?.sections || {})
  }
});

const ToggleSwitch = ({ checked, onClick }) => {
  return (
    <button
      type="button"
      aria-pressed={checked}
      onClick={onClick}
      className={`relative h-8 w-14 rounded-full border transition ${
        checked
          ? "border-rose-300/40 bg-rose-500/80"
          : "border-white/10 bg-slate-950/70 hover:border-white/20"
      }`}
    >
      <span
        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-sm transition ${
          checked ? "left-7" : "left-1"
        }`}
      />
    </button>
  );
};

const SettingsManager = () => {
  const { data: settings, loading } = useDocument("siteContent", "settings", siteSettingsSeed);
  const [form, setForm] = useState(siteSettingsSeed);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setForm(normalizeSettings(settings));
  }, [settings]);

  const visibleCount = useMemo(
    () =>
      sectionCatalog.filter((section) => form.sections?.[section.key] !== false).length,
    [form.sections]
  );

  const toggleSection = (key) => {
    setForm((current) => ({
      ...current,
      sections: {
        ...current.sections,
        [key]: current.sections?.[key] === false
      }
    }));
  };

  const showAll = () => {
    setForm(normalizeSettings(siteSettingsSeed));
  };

  const hideAll = () => {
    setForm({
      ...siteSettingsSeed,
      sections: Object.fromEntries(sectionCatalog.map((section) => [section.key, false]))
    });
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      await setDoc(
        doc(db, "siteContent", "settings"),
        {
          sections: {
            ...siteSettingsSeed.sections,
            ...(form.sections || {})
          },
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      toast.success("Section visibility updated.");
    } catch (error) {
      console.error("Failed to update site settings", error);
      toast.error(error.message || "Unable to update site settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Site settings
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Section visibility</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Hide or show entire homepage sections. Hidden sections disappear from the public
            page and their navigation links are removed too.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="button-secondary" onClick={showAll}>
            Show all
          </button>
          <button type="button" className="button-secondary" onClick={hideAll}>
            Hide all
          </button>
          <button type="button" className="button-primary" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save visibility"}
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner label="Loading site settings..." /> : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <GlassPanel className="p-5">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">
            Sections visible
          </p>
          <p className="mt-4 text-3xl font-bold text-white">{visibleCount}</p>
          <p className="mt-2 text-sm text-slate-400">
            out of {sectionCatalog.length} public homepage sections
          </p>
        </GlassPanel>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {sectionCatalog.map((section) => {
          const Icon = section.icon;
          const enabled = form.sections?.[section.key] !== false;

          return (
            <GlassPanel key={section.key} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`rounded-lg border p-3 ${
                      enabled
                        ? "border-rose-300/20 bg-rose-300/10 text-rose-200"
                        : "border-white/10 bg-white/[0.03] text-slate-400"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">{section.label}</h3>
                      <span
                        className={`inline-flex items-center gap-2 rounded-lg border px-3 py-1 text-xs uppercase tracking-[0.18em] ${
                          enabled
                            ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                            : "border-white/10 bg-white/[0.03] text-slate-400"
                        }`}
                      >
                        {enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        {enabled ? "Visible" : "Hidden"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-400">{section.description}</p>
                  </div>
                </div>

                <ToggleSwitch checked={enabled} onClick={() => toggleSection(section.key)} />
              </div>
            </GlassPanel>
          );
        })}
      </div>
    </div>
  );
};

export default SettingsManager;
