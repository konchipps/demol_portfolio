import { useEffect, useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import FormField from "../components/FormField";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { db } from "../firebase/config";
import { useDocument } from "../hooks/useDocument";
import { resumeSeed } from "../utils/defaultContent";

const blankEntry = {
  id: "",
  title: "",
  organization: "",
  period: "",
  location: "",
  description: ""
};

const ResumeManager = () => {
  const { data: resume, loading } = useDocument("siteContent", "resume", resumeSeed);
  const [editor, setEditor] = useState({
    open: false,
    section: "experience",
    index: null,
    form: blankEntry
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!editor.open) {
      setEditor({ open: false, section: "experience", index: null, form: blankEntry });
      setErrors({});
    }
  }, [editor.open]);

  const openEditor = (section, entry = blankEntry, index = null) => {
    setEditor({
      open: true,
      section,
      index,
      form: entry
    });
  };

  const validate = () => {
    const nextErrors = {};

    ["title", "organization", "period", "description"].forEach((field) => {
      if (!editor.form[field]?.trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const persistResume = async (nextResume) => {
    await setDoc(
      doc(db, "siteContent", "resume"),
      {
        ...nextResume,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
  };

  const handleDelete = async (section, index) => {
    try {
      const nextResume = {
        ...resume,
        [section]: (resume?.[section] || []).filter((_, itemIndex) => itemIndex !== index)
      };

      await persistResume(nextResume);
      toast.success("Resume entry removed.");
    } catch (error) {
      console.error("Failed to remove resume entry", error);
      toast.error("Unable to remove entry.");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const currentEntries = [...(resume?.[editor.section] || [])];
      const nextEntry = {
        ...editor.form,
        id: editor.form.id || `${editor.section}-${Date.now()}`
      };

      if (editor.index === null) {
        currentEntries.push(nextEntry);
      } else {
        currentEntries[editor.index] = nextEntry;
      }

      await persistResume({
        ...resume,
        [editor.section]: currentEntries
      });

      toast.success(editor.index === null ? "Entry added." : "Entry updated.");
      setEditor((current) => ({ ...current, open: false }));
    } catch (error) {
      console.error("Failed to save resume entry", error);
      toast.error("Unable to save entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const renderColumn = (section, title) => (
    <GlassPanel className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">Timeline entries on the public site</p>
        </div>
        <button
          type="button"
          className="button-secondary gap-2 px-3 py-2"
          onClick={() => openEditor(section)}
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="mt-6 space-y-4">
        {(resume?.[section] || []).map((entry, index) => (
          <div key={entry.id} className="rounded-lg border border-white/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-white">{entry.title}</p>
                <p className="mt-1 text-sm text-rose-200">{entry.organization}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 p-2 text-slate-200"
                  onClick={() => openEditor(section, entry, index)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 p-2 text-rose-300"
                  onClick={() => handleDelete(section, index)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              {entry.period} • {entry.location}
            </p>
            <p className="mt-3 text-sm leading-7 text-slate-300">{entry.description}</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
          Resume
        </p>
        <h2 className="mt-2 text-3xl font-bold text-white">Experience and education</h2>
      </div>

      {loading ? <LoadingSpinner label="Loading resume content..." /> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {renderColumn("experience", "Experience")}
        {renderColumn("education", "Education")}
      </div>

      <Modal
        open={editor.open}
        onClose={() => setEditor((current) => ({ ...current, open: false }))}
        title={`${editor.index === null ? "Add" : "Edit"} ${
          editor.section === "experience" ? "experience" : "education"
        } entry`}
      >
        <form className="grid gap-5" onSubmit={handleSave}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Title"
              value={editor.form.title}
              onChange={(event) =>
                setEditor((current) => ({
                  ...current,
                  form: { ...current.form, title: event.target.value }
                }))
              }
              error={errors.title}
            />
            <FormField
              label="Organization"
              value={editor.form.organization}
              onChange={(event) =>
                setEditor((current) => ({
                  ...current,
                  form: { ...current.form, organization: event.target.value }
                }))
              }
              error={errors.organization}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Period"
              value={editor.form.period}
              onChange={(event) =>
                setEditor((current) => ({
                  ...current,
                  form: { ...current.form, period: event.target.value }
                }))
              }
              error={errors.period}
            />
            <FormField
              label="Location"
              value={editor.form.location}
              onChange={(event) =>
                setEditor((current) => ({
                  ...current,
                  form: { ...current.form, location: event.target.value }
                }))
              }
            />
          </div>
          <FormField
            label="Description"
            textarea
            value={editor.form.description}
            onChange={(event) =>
              setEditor((current) => ({
                ...current,
                form: { ...current.form, description: event.target.value }
              }))
            }
            error={errors.description}
          />
          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="button-secondary"
              onClick={() => setEditor((current) => ({ ...current, open: false }))}
            >
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save entry"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ResumeManager;
