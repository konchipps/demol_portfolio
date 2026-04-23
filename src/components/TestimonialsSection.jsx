import { Star } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import GlassPanel from "./GlassPanel";
import SectionHeading from "./SectionHeading";

const TestimonialsSection = ({ testimonials }) => {
  return (
    <AnimatedSection id="testimonials" className="section-shell py-20 sm:py-24">
      <SectionHeading
        eyebrow="Testimonials"
        title="Trusted by teams that care about taste and traction."
        description="A few words from collaborators who wanted sharper products, clearer launches, and calmer build cycles."
      />

      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {testimonials.map((testimonial) => (
          <GlassPanel key={testimonial.id} className="flex h-full flex-col p-6">
            <div className="flex items-center gap-1 text-amber-300">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={`${testimonial.id}-star-${index}`}
                  className={`h-4 w-4 ${
                    index < testimonial.rating ? "fill-current" : "text-white/15"
                  }`}
                />
              ))}
            </div>
            <p className="mt-5 flex-1 text-sm leading-7 text-slate-200">
              "{testimonial.feedback}"
            </p>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-base font-semibold text-white">{testimonial.name}</p>
              <p className="mt-1 text-sm text-slate-400">{testimonial.role}</p>
            </div>
          </GlassPanel>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default TestimonialsSection;
