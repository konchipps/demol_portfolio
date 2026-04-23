import AnimatedSection from "./AnimatedSection";
import ClientLogo from "./ClientLogo";
import GlassPanel from "./GlassPanel";
import SectionHeading from "./SectionHeading";

const ClientsSection = ({ clients }) => {
  return (
    <AnimatedSection className="section-shell py-20 sm:py-24">
      <SectionHeading
        eyebrow="Clients"
        title="Selected partners and product teams."
        description="A handful of brands, founders, and builders I have helped with strategy, interface design, and frontend delivery."
      />

      <div className="mt-12 grid gap-4 grid-cols-2 md:grid-cols-4">
        {clients.map((client) => (
          <GlassPanel
            key={client.id}
            as={client.websiteUrl ? "a" : "div"}
            href={client.websiteUrl}
            target={client.websiteUrl ? "_blank" : undefined}
            rel={client.websiteUrl ? "noreferrer" : undefined}
            className="flex min-h-[120px] items-center justify-center p-6 transition hover:border-rose-300/30"
          >
            <ClientLogo
              name={client.name}
              logoUrl={client.logoUrl}
              className="max-h-14 w-full object-contain opacity-80 grayscale transition hover:opacity-100 hover:grayscale-0"
              fallbackClassName="min-h-[56px] w-full"
            />
          </GlassPanel>
        ))}
      </div>
    </AnimatedSection>
  );
};

export default ClientsSection;
