import AnimatedSection from "./AnimatedSection";
import GlassPanel from "./GlassPanel";
import SectionHeading from "./SectionHeading";
import { getServiceIcon } from "../utils/iconMap";

const ServicesSection = ({ services }) => {
  return (
    <AnimatedSection id="services" className="section-shell py-20 sm:py-24">
      <SectionHeading
        eyebrow="Services"
        title="Creative strategy and frontend execution in one place."
        description="A focused mix of design, product thinking, and implementation support for founders, teams, and ambitious launches."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {services.map((service) => {
          const Icon = getServiceIcon(service.icon);

          return (
            <GlassPanel key={service.id} className="p-6">
              <div className="inline-flex rounded-lg border border-rose-300/15 bg-rose-300/10 p-3 text-rose-200">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-xl font-semibold text-white">{service.title}</h3>
              <p className="mt-4 text-sm leading-7 text-slate-300">{service.description}</p>
            </GlassPanel>
          );
        })}
      </div>
    </AnimatedSection>
  );
};

export default ServicesSection;
