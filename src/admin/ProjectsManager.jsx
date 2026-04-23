import { useEffect, useState } from "react";
import { deleteDoc, doc, serverTimestamp, setDoc, writeBatch } from "firebase/firestore";
import { CodeXml, ExternalLink, Pencil, Plus, Sparkles, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import FormField from "../components/FormField";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { db } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { projectsSeed } from "../utils/defaultContent";
import { slugify } from "../utils/formatters";

const blankProject = {
  title: "",
  category: "",
  status: "Concept",
  description: "",
  imageUrl: "",
  techStack: "",
  liveUrl: "",
  repoUrl: "",
  order: 1
};

const toFormProject = (project) => ({
  title: project.title || "",
  category: project.category || "",
  status: project.status || "Concept",
  description: project.description || "",
  imageUrl: project.imageUrl || "",
  techStack: Array.isArray(project.techStack)
    ? project.techStack.join(", ")
    : project.techStack || "",
  liveUrl: project.liveUrl || "",
  repoUrl: project.repoUrl || "",
  order: project.order || 1
});

const parseTechStack = (value) =>
  Array.isArray(value)
    ? value
    : String(value || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

const ProjectsManager = () => {
  const { data: projects, loading } = useCollection("projects", {
    field: "order",
    direction: "asc"
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankProject);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setForm(blankProject);
      setEditingId(null);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) {
      nextErrors.title = "Title is required.";
    }

    if (!form.description.trim()) {
      nextErrors.description = "Description is required.";
    }

    if (!form.imageUrl.trim()) {
      nextErrors.imageUrl = "Add a direct image URL for the project card.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const updateField = (name, value) => {
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleEdit = (project) => {
    setEditingId(project.id);
    setForm(toFormProject(project));
    setOpen(true);
  };

  const handleDelete = async (projectId) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      toast.success("Project removed.");
    } catch (error) {
      console.error("Failed to remove project", error);
      toast.error("Unable to remove project.");
    }
  };

  const handleSeed = async () => {
    setSeeding(true);

    try {
      const batch = writeBatch(db);

      projectsSeed.forEach(({ id, ...project }) => {
        batch.set(
          doc(db, "projects", id),
          {
            ...project,
            updatedAt: serverTimestamp()
          },
          { merge: true }
        );
      });

      await batch.commit();
      toast.success("Starter projects added.");
    } catch (error) {
      console.error("Failed to add starter projects", error);
      toast.error(error.message || "Unable to add starter projects.");
    } finally {
      setSeeding(false);
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const projectId = editingId || slugify(form.title) || `project-${Date.now()}`;

      await setDoc(
        doc(db, "projects", projectId),
        {
          title: form.title,
          category: form.category,
          status: form.status,
          description: form.description,
          imageUrl: form.imageUrl,
          techStack: parseTechStack(form.techStack),
          liveUrl: form.liveUrl,
          repoUrl: form.repoUrl,
          order: Number(form.order) || projects.length + 1,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      toast.success(editingId ? "Project updated." : "Project added.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to save project", error);
      toast.error(error.message || "Unable to save project.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Projects
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Project list management</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">
            Add portfolio projects, concept ideas, case studies, and live builds for the
            public Projects section.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="button-secondary gap-2" onClick={handleSeed} disabled={seeding}>
            <Sparkles className="h-4 w-4" />
            {seeding ? "Adding..." : "Load project ideas"}
          </button>
          <button type="button" className="button-primary" onClick={() => setOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add project
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner label="Loading projects..." /> : null}

      <div className="grid gap-5 xl:grid-cols-2">
        {projects.map((project) => (
          <GlassPanel key={project.id} className="overflow-hidden">
            <div className="grid min-h-full md:grid-cols-[0.85fr_1.15fr]">
              <img
                src={project.imageUrl}
                alt={project.title}
                className="h-64 w-full object-cover md:h-full"
              />
              <div className="flex flex-col p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="flex flex-wrap gap-2">
                      {project.category ? (
                        <span className="rounded-lg border border-white/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-slate-300">
                          {project.category}
                        </span>
                      ) : null}
                      {project.status ? (
                        <span className="rounded-lg border border-rose-300/20 bg-rose-300/10 px-3 py-1 text-xs uppercase tracking-[0.18em] text-rose-200">
                          {project.status}
                        </span>
                      ) : null}
                    </div>
                    <h3 className="mt-4 text-xl font-semibold text-white">{project.title}</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="rounded-lg border border-white/10 p-2 text-slate-200"
                      onClick={() => handleEdit(project)}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      className="rounded-lg border border-white/10 p-2 text-rose-300"
                      onClick={() => handleDelete(project.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="mt-4 text-sm leading-7 text-slate-300">{project.description}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {parseTechStack(project.techStack).map((item) => (
                    <span
                      key={item}
                      className="rounded-lg border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-300"
                    >
                      {item}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-400">
                  {project.liveUrl && project.liveUrl !== "#" ? (
                    <a className="inline-flex items-center gap-2 text-rose-200" href={project.liveUrl} target="_blank" rel="noreferrer">
                      Live <ExternalLink className="h-4 w-4" />
                    </a>
                  ) : null}
                  {project.repoUrl && project.repoUrl !== "#" ? (
                    <a className="inline-flex items-center gap-2 text-slate-200" href={project.repoUrl} target="_blank" rel="noreferrer">
                      Repo <CodeXml className="h-4 w-4" />
                    </a>
                  ) : null}
                </div>
              </div>
            </div>
          </GlassPanel>
        ))}

        {!projects.length ? (
          <GlassPanel className="p-6">
            <p className="text-sm text-slate-400">
              No projects yet. Add your first project or load the starter project ideas.
            </p>
          </GlassPanel>
        ) : null}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit project" : "Add project"}
        description="Use direct image URLs until Firebase Storage uploads are enabled. Public project cards open the Live URL first, then the Repository URL if no live link is set."
      >
        <form className="grid gap-5" onSubmit={handleSave}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Title"
              value={form.title}
              onChange={(event) => updateField("title", event.target.value)}
              error={errors.title}
            />
            <FormField
              label="Category"
              value={form.category}
              placeholder="SaaS, Portfolio, E-commerce"
              onChange={(event) => updateField("category", event.target.value)}
            />
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Status"
              value={form.status}
              placeholder="Concept, Prototype, Live Build"
              onChange={(event) => updateField("status", event.target.value)}
            />
            <FormField
              label="Order"
              type="number"
              min="1"
              value={form.order}
              onChange={(event) => updateField("order", event.target.value)}
            />
          </div>

          <FormField
            label="Description"
            textarea
            value={form.description}
            onChange={(event) => updateField("description", event.target.value)}
            error={errors.description}
          />

          <FormField
            label="Project image URL"
            value={form.imageUrl}
            placeholder="https://images.unsplash.com/..."
            onChange={(event) => updateField("imageUrl", event.target.value)}
            error={errors.imageUrl}
          />

          <FormField
            label="Tech stack"
            value={form.techStack}
            placeholder="React, Firebase, Tailwind"
            onChange={(event) => updateField("techStack", event.target.value)}
          />

          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Live URL"
              value={form.liveUrl}
              placeholder="https://..."
              onChange={(event) => updateField("liveUrl", event.target.value)}
            />
            <FormField
              label="Repository URL"
              value={form.repoUrl}
              placeholder="https://github.com/..."
              onChange={(event) => updateField("repoUrl", event.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3">
            <button type="button" className="button-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save project"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ProjectsManager;
