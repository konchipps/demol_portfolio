import { useEffect, useState } from "react";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import FormField from "../components/FormField";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { db } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { getServiceIcon, serviceIconOptions } from "../utils/iconMap";
import { slugify } from "../utils/formatters";

const blankService = {
  id: "",
  icon: "LayoutDashboard",
  title: "",
  description: "",
  order: 1
};

const ServicesManager = () => {
  const { data: services, loading } = useCollection("services", {
    field: "order",
    direction: "asc"
  });
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(blankService);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setForm(blankService);
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

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEdit = (service) => {
    setEditingId(service.id);
    setForm(service);
    setOpen(true);
  };

  const handleDelete = async (serviceId) => {
    try {
      await deleteDoc(doc(db, "services", serviceId));
      toast.success("Service removed.");
    } catch (error) {
      console.error("Failed to remove service", error);
      toast.error("Unable to remove service.");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const serviceId = editingId || slugify(form.title) || `service-${Date.now()}`;
      await setDoc(
        doc(db, "services", serviceId),
        {
          icon: form.icon,
          title: form.title,
          description: form.description,
          order: Number(form.order) || services.length + 1,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      toast.success(editingId ? "Service updated." : "Service added.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to save service", error);
      toast.error("Unable to save service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Services
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Manage service cards</h2>
        </div>
        <button type="button" className="button-primary" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add service
        </button>
      </div>

      {loading ? <LoadingSpinner label="Loading services..." /> : null}

      <div className="grid gap-5 xl:grid-cols-3">
        {services.map((service) => {
          const Icon = getServiceIcon(service.icon);

          return (
            <GlassPanel key={service.id} className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="rounded-lg border border-rose-300/20 bg-rose-300/10 p-3 text-rose-200">
                  <Icon className="h-6 w-6" />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="rounded-lg border border-white/10 p-2 text-slate-200"
                    onClick={() => handleEdit(service)}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    className="rounded-lg border border-white/10 p-2 text-rose-300"
                    onClick={() => handleDelete(service.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{service.description}</p>
            </GlassPanel>
          );
        })}
        {!services.length ? (
          <GlassPanel className="p-6">
            <p className="text-sm text-slate-400">No services yet. Add your first one.</p>
          </GlassPanel>
        ) : null}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit service" : "Add service"}
      >
        <form className="grid gap-5" onSubmit={handleSave}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Title"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              error={errors.title}
            />
            <FormField label="Icon">
              <select
                value={form.icon}
                onChange={(event) => setForm((current) => ({ ...current, icon: event.target.value }))}
                className="field-input"
              >
                {serviceIconOptions.map((iconName) => (
                  <option key={iconName} value={iconName}>
                    {iconName}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
          <FormField
            label="Description"
            textarea
            value={form.description}
            onChange={(event) =>
              setForm((current) => ({ ...current, description: event.target.value }))
            }
            error={errors.description}
          />
          <FormField
            label="Order"
            type="number"
            min="1"
            value={form.order}
            onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))}
          />
          <div className="flex justify-end gap-3">
            <button type="button" className="button-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save service"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServicesManager;
