import { useEffect, useState } from "react";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import FormField from "../components/FormField";
import GlassPanel from "../components/GlassPanel";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { db } from "../firebase/config";
import { useCollection } from "../hooks/useCollection";
import { slugify } from "../utils/formatters";

const blankTestimonial = {
  name: "",
  role: "",
  rating: 5,
  feedback: "",
  order: 1
};

const TestimonialsManager = () => {
  const { data: testimonials, loading } = useCollection("testimonials", {
    field: "order",
    direction: "asc"
  });
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankTestimonial);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!open) {
      setEditingId(null);
      setForm(blankTestimonial);
      setErrors({});
    }
  }, [open]);

  const validate = () => {
    const nextErrors = {};

    ["name", "feedback"].forEach((field) => {
      if (!form[field]?.trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleEdit = (testimonial) => {
    setEditingId(testimonial.id);
    setForm(testimonial);
    setOpen(true);
  };

  const handleDelete = async (testimonialId) => {
    try {
      await deleteDoc(doc(db, "testimonials", testimonialId));
      toast.success("Testimonial removed.");
    } catch (error) {
      console.error("Failed to remove testimonial", error);
      toast.error("Unable to remove testimonial.");
    }
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      const testimonialId =
        editingId || slugify(`${form.name}-${form.role || Date.now()}`) || `testimonial-${Date.now()}`;
      await setDoc(
        doc(db, "testimonials", testimonialId),
        {
          name: form.name,
          role: form.role,
          feedback: form.feedback,
          rating: Number(form.rating),
          order: Number(form.order) || testimonials.length + 1,
          updatedAt: serverTimestamp()
        },
        { merge: true }
      );

      toast.success(editingId ? "Testimonial updated." : "Testimonial added.");
      setOpen(false);
    } catch (error) {
      console.error("Failed to save testimonial", error);
      toast.error("Unable to save testimonial.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Testimonials
          </p>
          <h2 className="mt-2 text-3xl font-bold text-white">Client feedback</h2>
        </div>
        <button type="button" className="button-primary" onClick={() => setOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add testimonial
        </button>
      </div>

      {loading ? <LoadingSpinner label="Loading testimonials..." /> : null}

      <div className="grid gap-5 xl:grid-cols-3">
        {testimonials.map((testimonial) => (
          <GlassPanel key={testimonial.id} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={`${testimonial.id}-${index}`}
                    className={`h-4 w-4 ${
                      index < testimonial.rating ? "fill-current" : "text-white/15"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-lg border border-white/10 p-2 text-slate-200"
                  onClick={() => handleEdit(testimonial)}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-lg border border-white/10 p-2 text-rose-300"
                  onClick={() => handleDelete(testimonial.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-200">"{testimonial.feedback}"</p>
            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="font-semibold text-white">{testimonial.name}</p>
              <p className="mt-1 text-sm text-slate-400">{testimonial.role}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editingId ? "Edit testimonial" : "Add testimonial"}
      >
        <form className="grid gap-5" onSubmit={handleSave}>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Name"
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              error={errors.name}
            />
            <FormField
              label="Role"
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            />
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            <FormField
              label="Rating"
              type="number"
              min="1"
              max="5"
              value={form.rating}
              onChange={(event) =>
                setForm((current) => ({ ...current, rating: event.target.value }))
              }
            />
            <FormField
              label="Order"
              type="number"
              min="1"
              value={form.order}
              onChange={(event) => setForm((current) => ({ ...current, order: event.target.value }))}
            />
          </div>
          <FormField
            label="Feedback"
            textarea
            value={form.feedback}
            onChange={(event) =>
              setForm((current) => ({ ...current, feedback: event.target.value }))
            }
            error={errors.feedback}
          />
          <div className="flex justify-end gap-3">
            <button type="button" className="button-secondary" onClick={() => setOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="button-primary" disabled={submitting}>
              {submitting ? "Saving..." : "Save testimonial"}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TestimonialsManager;
