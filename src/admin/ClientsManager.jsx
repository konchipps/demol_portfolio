import { useEffect, useState } from "react";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { ImagePlus, Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import ClientLogo from "../components/ClientLogo";
import FormField from "../components/FormField";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { db, storageUploadsEnabled } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { uploadImage } from "../utils/firebaseUploads";
import { slugify } from "../utils/formatters";

const blankClient = {
  name: "",
  websiteUrl: "",
  logoUrl: "",
  order: 1
};

const ClientsManager = () => {
  const { data: clients, loading } = useCollection("clients", {
    field: "order",
    direction: "asc"
  });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankClient);
  const [logoFile, setLogoFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setForm(blankClient);
      setLogoFile(null);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.logoUrl.trim() && !logoFile) {
      nextErrors.logoUrl = "Upload a logo or add a direct logo URL.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEdit = (client) => {
    setEditingId(client.id);
    setForm(client);
    setOpen(true);
  };

  const handleDelete = async (clientId) => {
    try {
      await deleteDoc(doc(db, "clients", clientId));
      toast.success("Client removed.");
    } catch (error) {
      console.error("Failed to remove client", error);
      toast.error("Unable to remove client.");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      let logoUrl = form.logoUrl;

      if (logoFile) {
        logoUrl = await uploadImage(logoFile, "clients");
      }

      const clientId = editingId || slugify(form.name) || `client-${Date.now()}`;

      await setDoc(
        doc(db, "clients", clientId),
        {
          name: form.name,
          websiteUrl: form.websiteUrl,
          logoUrl,
          order: Number(form.order) || clients.length + 1,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      toast.success(editingId ? "Client updated." : "Client added.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to save client", error);
      toast.error(error.message || "Unable to save client.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Clients
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Logo grid management</h2>
        </div>
        <button type="button" className="button-primary" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add client
        </button>
      </div>

      {loading ? <LoadingSpinner label="Loading clients..." /> : null}

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {clients.map((client) => (
          <GlassPanel key={client.id} className="p-5">
            <div className="flex items-start justify-between gap-4">
              <ClientLogo
                name={client.name}
                logoUrl={client.logoUrl}
                className="h-12 w-28 object-contain object-left"
                fallbackClassName="h-12 w-28"
              />
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 p-2 text-slate-200"
                  onClick={() => handleEdit(client)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 p-2 text-rose-300"
                  onClick={() => handleDelete(client.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-5 font-semibold text-white">{client.name}</p>
            <p className="mt-2 text-sm text-slate-400">{client.websiteUrl || "No website link"}</p>
          </GlassPanel>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit client" : "Add client"}
      >
        <form className="grid gap-5" onSubmit={handleSave}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Client name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              error={errors.name}
            />
            <FormField
              label="Website URL"
              value={form.websiteUrl}
              onChange={(event) =>
                setForm((current) => ({ ...current, websiteUrl: event.target.value }))
              }
            />
          </div>
          <FormField
            label="Logo URL"
            value={form.logoUrl}
            onChange={(event) => setForm((current) => ({ ...current, logoUrl: event.target.value }))}
            error={errors.logoUrl}
          />
          <FormField label="Upload logo">
            <div className="rounded-lg border border-dashed border-white/15 p-4">
              <label
                className={`button-secondary gap-2 ${
                  storageUploadsEnabled ? "cursor-pointer" : "cursor-not-allowed opacity-60"
                }`}
              >
                <ImagePlus className="h-4 w-4" />
                {storageUploadsEnabled ? "Choose file" : "Storage setup required"}
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  disabled={!storageUploadsEnabled}
                  onChange={(event) => setLogoFile(event.target.files?.[0] || null)}
                />
              </label>
              <p className="mt-3 text-xs leading-6 text-slate-400">
                {logoFile
                  ? logoFile.name
                  : storageUploadsEnabled
                    ? "Choose a logo file to upload it through Firebase Storage."
                    : "Use the Logo URL field for now. File uploads stay disabled until Firebase Storage is initialized and VITE_ENABLE_STORAGE_UPLOADS is set to true."}
              </p>
            </div>
          </FormField>
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
              {submitting ? "Saving..." : "Save client"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ClientsManager;
