import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import ServicesSection from "../components/ServicesSection";
import ProjectsSection from "../components/ProjectsSection";
import ResumeSection from "../components/ResumeSection";
import TestimonialsSection from "../components/TestimonialsSection";
import ClientsSection from "../components/ClientsSection";
import ContactSection from "../components/ContactSection";
import { useDocument } from "../hooks/useDocument";
import { useCollection } from "../hooks/useCollection";
import {
  clientsSeed,
  heroSeed,
  projectsSeed,
  resumeSeed,
  servicesSeed,
  siteSettingsSeed,
  testimonialsSeed
} from "../utils/defaultContent";

const LoadingShell = () => (
  <div id="top" className="relative min-h-screen overflow-hidden">
    <div className="absolute inset-0 bg-hero-grid opacity-80" aria-hidden="true" />
    <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-6 sm:px-8 lg:px-10">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="h-8 w-14 rounded bg-white/10" />
        <div className="hidden items-center gap-3 md:flex">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="h-4 w-16 rounded bg-white/10" />
          ))}
          <div className="h-10 w-32 rounded-md bg-rose-500/20" />
        </div>
      </div>

      <div className="grid flex-1 items-center gap-10 py-14 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
        <div className="space-y-6">
          <div className="h-4 w-52 rounded bg-rose-500/30" />
          <div className="space-y-3">
            <div className="h-14 w-full max-w-xl rounded bg-white/10" />
            <div className="h-14 w-full max-w-lg rounded bg-white/10" />
          </div>
          <div className="space-y-3">
            <div className="h-4 w-full max-w-2xl rounded bg-white/10" />
            <div className="h-4 w-full max-w-2xl rounded bg-white/10" />
            <div className="h-4 w-full max-w-xl rounded bg-white/10" />
          </div>
          <div className="flex flex-wrap gap-4 pt-4">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-24 w-36 rounded-lg border border-white/10 bg-white/5 backdrop-blur"
              />
            ))}
          </div>
        </div>

        <div className="mx-auto flex w-full max-w-md justify-center lg:justify-end">
          <div className="h-[26rem] w-full rounded-[28px] border border-white/10 bg-white/5 backdrop-blur" />
        </div>
      </div>
    </div>
  </div>
);

const Home = () => {
  const { data: hero, loading: heroLoading } = useDocument("siteContent", "hero", heroSeed);
  const { data: siteSettings, loading: siteSettingsLoading } = useDocument(
    "siteContent",
    "settings",
    siteSettingsSeed
  );
  const { data: resume, loading: resumeLoading } = useDocument(
    "siteContent",
    "resume",
    resumeSeed
  );
  const { data: services, loading: servicesLoading } = useCollection(
    "services",
    { field: "order", direction: "asc", fallbackWhenEmpty: true },
    servicesSeed
  );
  const { data: projects, loading: projectsLoading } = useCollection(
    "projects",
    { field: "order", direction: "asc", fallbackWhenEmpty: true },
    projectsSeed
  );
  const { data: testimonials, loading: testimonialsLoading } = useCollection(
    "testimonials",
    { field: "order", direction: "asc", fallbackWhenEmpty: true },
    testimonialsSeed
  );
  const { data: clients, loading: clientsLoading } = useCollection(
    "clients",
    { field: "order", direction: "asc", fallbackWhenEmpty: true },
    clientsSeed
  );
  const isInitialLoading =
    heroLoading ||
    siteSettingsLoading ||
    resumeLoading ||
    servicesLoading ||
    projectsLoading ||
    testimonialsLoading ||
    clientsLoading;
  const sectionVisibility = {
    ...siteSettingsSeed.sections,
    ...(siteSettings?.sections || {})
  };

  return (
    <>
      <Helmet>
        <title>
          {isInitialLoading ? "Loading Portfolio..." : hero?.name ? `${hero.name} | Portfolio` : "Portfolio Website"}
        </title>
        <meta
          name="description"
          content={
            hero?.description ||
            "Premium portfolio website with Firebase-backed content management."
          }
        />
      </Helmet>

      {isInitialLoading ? (
        <LoadingShell />
      ) : (
      <div id="top" className="relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-grid opacity-80" aria-hidden="true" />
        <div className="relative">
          <Navbar
            name={hero?.name}
            resumeUrl={hero?.resumeUrl || "#"}
            sectionVisibility={sectionVisibility}
          />
          {sectionVisibility.hero ? <HeroSection hero={hero} /> : null}
          {sectionVisibility.services ? <ServicesSection services={services} /> : null}
          {sectionVisibility.resume ? <ResumeSection resume={resume} /> : null}
          {sectionVisibility.projects ? <ProjectsSection projects={projects} /> : null}
          {sectionVisibility.testimonials ? (
            <TestimonialsSection testimonials={testimonials} />
          ) : null}
          {sectionVisibility.clients ? <ClientsSection clients={clients} /> : null}
          {sectionVisibility.contact ? <ContactSection hero={hero} /> : null}

          <footer className="section-shell border-t border-white/10 py-8 text-sm text-slate-400">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>Crafted with React, Tailwind, Framer Motion, and Firebase.</p>
              <p>{hero?.name || "Your Name"} (c) {new Date().getFullYear()}</p>
            </div>
          </footer>
        </div>
      </div>
      )}
    </>
  );
};

export default Home;
