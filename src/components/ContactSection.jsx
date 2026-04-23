import { useState } from "react";
import { addDoc, collection, serverTimestamp, updateDoc } from "firebase/firestore";
import { Phone, Send } from "lucide-react";
import { toast } from "react-hot-toast";
import { db, hasFirebaseConfig } from "../firebase/config";
import { sendContactEmail } from "../utils/formSubmit";
import AnimatedSection from "./AnimatedSection";
import ConfigNotice from "./ConfigNotice";
import FormField from "./FormField";
import GlassPanel from "./GlassPanel";
import SectionHeading from "./SectionHeading";

const initialForm = {
  name: "",
  email: "",
  message: ""
};

const normalizePhoneNumbers = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(/\r?\n|,/)
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const ContactSection = ({ hero }) => {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const phoneNumbers = normalizePhoneNumbers(hero?.phoneNumbers);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Your name is required.";
    }

    if (!form.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!form.message.trim()) {
      nextErrors.message = "A message helps.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    if (!hasFirebaseConfig || !db) {
      toast.error("Add Firebase config before submitting messages.");
      return;
    }

    setSubmitting(true);

    try {
      const messageRef = await addDoc(collection(db, "messages"), {
        ...form,
        createdAt: serverTimestamp(),
        emailNotification: {
          provider: "FormSubmit",
          status: "pending",
          to: "aarondemol2004@gmail.com"
        }
      });

      try {
        const emailResult = await sendContactEmail(form);
        const responseMessage = emailResult?.message || "";
        const status = /confirm|activation|verify/i.test(responseMessage)
          ? "activation_required"
          : "submitted";

        await updateDoc(messageRef, {
          emailNotification: {
            provider: "FormSubmit",
            status,
            to: "aarondemol2004@gmail.com",
            responseMessage,
            updatedAt: serverTimestamp()
          }
        });

        setForm(initialForm);
        setErrors({});
        toast.success(
          status === "activation_required"
            ? "Message saved. Check Gmail to activate FormSubmit for the first email."
            : "Message sent successfully."
        );
      } catch (emailError) {
        await updateDoc(messageRef, {
          emailNotification: {
            provider: "FormSubmit",
            status: "failed",
            to: "aarondemol2004@gmail.com",
            error: emailError.message || "FormSubmit could not send the email.",
            updatedAt: serverTimestamp()
          }
        });

        setForm(initialForm);
        setErrors({});
        toast.error("Message saved to the dashboard, but email delivery could not be confirmed.");
      }
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error(error.message || "Something went wrong while sending your message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatedSection id="contact" className="section-shell py-20 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[0.95fr_1.05fr]">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Let's build something that earns a second look."
            description="For consulting, design partnerships, or full-stack delivery, send a note and I'll get back to you with the next step."
          />

          <div className="mt-10 grid gap-4">
            <GlassPanel className="p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">
                Email
              </p>
              <a
                href={hero?.email ? `mailto:${hero.email}` : "#"}
                className="mt-3 block text-lg font-medium text-white"
              >
                {hero?.email || "aarondemol2004@gmail.com"}
              </a>
            </GlassPanel>
            <GlassPanel className="p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">
                Location
              </p>
              <p className="mt-3 text-lg font-medium text-white">
                {hero?.location || "Remote"}
              </p>
            </GlassPanel>
            <GlassPanel className="p-5">
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">
                Phone
              </p>
              <div className="mt-3 space-y-3">
                {(phoneNumbers.length ? phoneNumbers : ["09751876871", "09281453911"]).map((phone) => (
                  <a
                    key={phone}
                    href={`tel:${phone}`}
                    className="flex items-center gap-3 text-lg font-medium text-white transition hover:text-rose-200"
                  >
                    <Phone className="h-4 w-4 text-rose-300" />
                    {phone}
                  </a>
                ))}
              </div>
            </GlassPanel>
            {!hasFirebaseConfig ? (
              <ConfigNotice description="Contact form submissions are ready, but Firestore needs to be configured first. Once your Firebase keys are in place, messages will save directly to the dashboard." />
            ) : null}
          </div>
        </div>

        <GlassPanel className="p-6 sm:p-8">
          <form className="grid gap-5" onSubmit={handleSubmit}>
            <FormField
              label="Name"
              name="name"
              placeholder="Your name"
              value={form.name}
              onChange={handleChange}
              error={errors.name}
            />
            <FormField
              label="Email"
              type="email"
              name="email"
              placeholder="name@example.com"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
            />
            <FormField
              label="Message"
              name="message"
              textarea
              placeholder="Tell me a little about the project."
              value={form.message}
              onChange={handleChange}
              error={errors.message}
            />
            <button className="button-primary gap-2" type="submit" disabled={submitting}>
              <Send className="h-4 w-4" />
              {submitting ? "Sending..." : "Send Message"}
            </button>
          </form>
        </GlassPanel>
      </div>
    </AnimatedSection>
  );
};

export default ContactSection;
