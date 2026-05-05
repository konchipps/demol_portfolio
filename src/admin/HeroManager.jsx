import { useEffect, useMemo, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import FormField from "../components/FormField";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { db, storageUploadsEnabled } from "../firebase/config";
import { useDocument } from "../hooks/useDocument";
import { heroSeed } from "../utils/defaultContent";
import { uploadImage } from "../utils/firebaseUploads";
import {
  getSocialIcon,
  getSocialIconLabel,
  normalizeSocialIconKey,
  socialIconOptions
} from "../utils/socialIcons";

const blankLink = { label: "", url: "", icon: "" };
const blankStat = { label: "", value: "" };

const HeroManager = () => {
  const { data: hero, loading } = useDocument("siteContent", "hero", heroSeed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(heroSeed);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (hero && !open) {
      setForm({
        ...heroSeed,
        ...hero,
        socialLinks: (hero.socialLinks || heroSeed.socialLinks).map((link) => ({
          ...link,
          icon: link.icon || normalizeSocialIconKey(link.label)
        })),
        stats: hero.stats || heroSeed.stats,
        phoneNumbers: hero.phoneNumbers || heroSeed.phoneNumbers
      });
      setErrors({});
      setImageFile(null);
    }
  }, [hero, open]);

  const socialLinks = useMemo(
    () => (form.socialLinks?.length ? form.socialLinks : [blankLink]),
    [form.socialLinks]
  );
  const stats = useMemo(() => (form.stats?.length ? form.stats : [blankStat]), [form.stats]);
  const phoneNumbers = useMemo(
    () =>
      Array.isArray(form.phoneNumbers)
        ? form.phoneNumbers.join("\n")
        : String(form.phoneNumbers || ""),
    [form.phoneNumbers]
  );

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const updateArrayField = (field, index, key, value) => {
    const nextItems = [...(form[field] || [])];
    nextItems[index] = { ...nextItems[index], [key]: value };
    setForm((current) => ({ ...current, [field]: nextItems }));
  };

  const addArrayItem = (field, item) => {
    setForm((current) => ({
      ...current,
      [field]: [...(current[field] || []), item]
    }));
  };

  const removeArrayItem = (field, index) => {
    setForm((current) => ({
      ...current,
      [field]: (current[field] || []).filter((_, itemIndex) => itemIndex !== index)
    }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name?.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.title?.trim()) {
      nextErrors.title = "Role/title is required.";
    }

    if (!form.description?.trim()) {
      nextErrors.description = "Description is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      let profileImageUrl = form.profileImageUrl;

      if (imageFile) {
        profileImageUrl = await uploadImage(imageFile, "hero");
      }

      const { id, updatedAt, ...rest } = form;

      await setDoc(
        doc(db, "siteContent", "hero"),
        {
          ...rest,
          profileImageUrl,
          socialLinks: socialLinks
            .filter((link) => link.label && link.url)
            .map((link) => ({
              ...link,
              icon: link.icon || normalizeSocialIconKey(link.label)
            })),
          stats: stats.filter((stat) => stat.label && stat.value),
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      toast.success("Hero content updated.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update hero content", error);
      toast.error(error.message || "Unable to update hero content.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Hero content
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">First impression settings</h2>
        </div>
        <button type="button" className="button-primary" onClick={() => setOpen(true)}>
          <Pencil className="mr-2 h-4 w-4" />
          Edit hero
        </button>
      </div>

      {loading ? <LoadingSpinner label="Loading hero content..." /> : null}

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">
            Preview
          </p>
          <h3 className="mt-5 text-3xl font-bold text-white">{hero?.name}</h3>
          <p className="mt-2 text-xl text-slate-200">{hero?.title}</p>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-300">{hero?.description}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {(hero?.stats || []).map((stat) => (
              <div key={`${stat.label}-${stat.value}`} className="rounded-lg border border-white/10 p-4">
                <p className="text-2xl font-semibold text-white">{stat.value}</p>
                <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="p-6">
          <img
            src={hero?.profileImageUrl}
            alt={hero?.name || "Profile"}
            className="h-[420px] w-full rounded-lg object-cover"
          />
        </GlassPanel>
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Edit hero content"
        description="Update the public intro, supporting links, stats, and profile image."
      >
        <form className="grid gap-5" onSubmit={handleSave}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Full name"
              value={form.name || ""}
              onChange={(event) => updateField("name", event.target.value)}
              error={errors.name}
            />
            <FormField
              label="Role / title"
              value={form.title || ""}
              onChange={(event) => updateField("title", event.target.value)}
              error={errors.title}
            />
          </div>

          <FormField
            label="Description"
            textarea
            value={form.description || ""}
            onChange={(event) => updateField("description", event.target.value)}
            error={errors.description}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Email"
              type="email"
              value={form.email || ""}
              onChange={(event) => updateField("email", event.target.value)}
            />
            <FormField
              label="Location"
              value={form.location || ""}
              onChange={(event) => updateField("location", event.target.value)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Resume URL"
              value={form.resumeUrl || ""}
              onChange={(event) => updateField("resumeUrl", event.target.value)}
            />
            <FormField
              label="Profile image URL"
              value={form.profileImageUrl || ""}
              onChange={(event) => updateField("profileImageUrl", event.target.value)}
            />
          </div>

          <FormField
            label="Phone numbers"
            textarea
            placeholder={"09751876871\n09281453911"}
            value={phoneNumbers}
            onChange={(event) =>
              updateField(
                "phoneNumbers",
                event.target.value
                  .split(/\r?\n|,/)
                  .map((item) => item.trim())
                  .filter(Boolean)
              )
            }
          />

          <FormField label="Upload profile image">
            <div className="rounded-lg border border-dashed border-white/15 p-4">
              <label
                className={`button-secondary gap-2 ${
                  storageUploadsEnabled ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
              >
                <ImagePlus className="h-4 w-4" />
                {storageUploadsEnabled ? "Choose image" : "Storage setup required"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={!storageUploadsEnabled}
                  onChange={(event) => setImageFile(event.target.files?.[0] || null)}
                />
              </label>
              <p className="mt-3 text-xs leading-6 text-slate-400">
                {imageFile
                  ? imageFile.name
                  : storageUploadsEnabled
                    ? "Choose an image file to upload it through Firebase Storage."
                    : "Use the Profile image URL field for now. File uploads stay disabled until Firebase Storage is initialized and VITE_ENABLE_STORAGE_UPLOADS is set to true."}
              </p>
            </div>
          </FormField>

          <div className="grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">Social links</p>
                <button
                  type="button"
                  className="button-secondary gap-2 px-3 py-2"
                  onClick={() => addArrayItem("socialLinks", { ...blankLink })}
                >
                  <Plus className="h-4 w-4" />
                  Add link
                </button>
              </div>
              <div className="space-y-4">
                {socialLinks.map((link, index) => (
                  <div key={`social-${index}`} className="rounded-lg border border-white/10 p-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <FormField
                        label="Label"
                        value={link.label}
                        onChange={(event) =>
                          updateArrayField("socialLinks", index, "label", event.target.value)
                        }
                      />
                      <FormField label="Icon">
                        <div className="space-y-3">
                          <select
                            className="field-input"
                            value={link.icon || ""}
                            onChange={(event) =>
                              updateArrayField("socialLinks", index, "icon", event.target.value)
                            }
                          >
                            <option value="">Match label automatically</option>
                            {socialIconOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                          <div className="inline-flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-slate-300">
                            {(() => {
                              const Icon = getSocialIcon(link.icon || link.label);
                              return <Icon className="h-4 w-4 text-rose-300" />;
                            })()}
                            <span>
                              {link.icon ? getSocialIconLabel(link.icon) : "Auto from label"}
                            </span>
                          </div>
                        </div>
                      </FormField>
                    </div>
                    <div className="mt-4 grid gap-4">
                      <FormField
                        label="URL"
                        value={link.url}
                        onChange={(event) =>
                          updateArrayField("socialLinks", index, "url", event.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-rose-300"
                      onClick={() => removeArrayItem("socialLinks", index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-200">Stats</p>
                <button
                  type="button"
                  className="button-secondary gap-2 px-3 py-2"
                  onClick={() => addArrayItem("stats", { ...blankStat })}
                >
                  <Plus className="h-4 w-4" />
                  Add stat
                </button>
              </div>
              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <div key={`stat-${index}`} className="rounded-lg border border-white/10 p-4">
                    <div className="grid gap-4">
                      <FormField
                        label="Label"
                        value={stat.label}
                        onChange={(event) =>
                          updateArrayField("stats", index, "label", event.target.value)
                        }
                      />
                      <FormField
                        label="Value"
                        value={stat.value}
                        onChange={(event) =>
                          updateArrayField("stats", index, "value", event.target.value)
                        }
                      />
                    </div>
                    <button
                      type="button"
                      className="mt-4 inline-flex items-center gap-2 text-sm text-rose-300"
                      onClick={() => removeArrayItem("stats", index)}
                    >
                      <Trash2 className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" className="button-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default HeroManager;
