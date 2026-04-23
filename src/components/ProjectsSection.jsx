import { CodeXml, ExternalLink } from "lucide-react";
import AnimatedSection from "./AnimatedSection";
import GlassPanel from "./GlassPanel";
import SectionHeading from "./SectionHeading";

const isRealUrl = (value) => value && value !== "#";

const getProjectUrl = (project) => {
  if (isRealUrl(project.liveUrl)) {
    return project.liveUrl;
  }

  if (isRealUrl(project.repoUrl)) {
    return project.repoUrl;
  }

  return "";
};

const openProjectUrl = (url) => {
  if (!url) {
    return;
  }

  const openedWindow = window.open(url, "_blank", "noopener,noreferrer");

  if (openedWindow) {
    openedWindow.opener = null;
  }
};

const ProjectCard = ({ project, featured }) => {
  const projectUrl = getProjectUrl(project);
  const isClickable = Boolean(projectUrl);
  const techStack = Array.isArray(project.techStack)
    ? project.techStack
    : String(project.techStack || "")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);

  const handleCardClick = (event) => {
    if (event.target.closest?.("a")) {
      return;
    }

    openProjectUrl(projectUrl);
  };

  const handleCardKeyDown = (event) => {
    if (event.target.closest?.("a")) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProjectUrl(projectUrl);
    }
  };

  return (
    <GlassPanel
      as="article"
      role={isClickable ? "link" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      aria-label={isClickable ? `Open ${project.title}` : undefined}
      onClick={isClickable ? handleCardClick : undefined}
      onKeyDown={isClickable ? handleCardKeyDown : undefined}
      className={`group overflow-hidden transition ${
        isClickable
          ? "cursor-pointer hover:border-rose-300/35 hover:bg-white/[0.06] focus:outline-none focus:ring-2 focus:ring-rose-400/25"
          : ""
      } ${
        featured ? "md:col-span-2 xl:grid xl:grid-cols-[1.05fr_0.95fr]" : ""
      }`}
    >
      <div className={`relative overflow-hidden ${featured ? "min-h-[320px]" : "h-56"}`}>
        <img
          src={project.imageUrl}
          alt={project.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {project.category ? (
            <span className="rounded-lg border border-white/15 bg-slate-950/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
              {project.category}
            </span>
          ) : null}
          {project.status ? (
            <span className="rounded-lg border border-rose-300/25 bg-rose-400/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-rose-100 backdrop-blur">
              {project.status}
            </span>
          ) : null}
        </div>
      </div>

      <div className="flex min-h-full flex-col p-6">
        <div className="flex-1">
          <h3 className="text-2xl font-bold tracking-tight text-white">{project.title}</h3>
          <p className="mt-4 text-sm leading-7 text-slate-300">{project.description}</p>

          {techStack.length ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {techStack.map((item) => (
                <span
                  key={item}
                  className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {item}
                </span>
              ))}
            </div>
          ) : null}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          {isRealUrl(project.liveUrl) ? (
            <a
              className="button-primary gap-2 px-4 py-2"
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
            >
              View live
              <ExternalLink className="h-4 w-4" />
            </a>
          ) : null}
          {isRealUrl(project.repoUrl) ? (
            <a
              className="button-secondary gap-2 px-4 py-2"
              href={project.repoUrl}
              target="_blank"
              rel="noreferrer"
            >
              Repository
              <CodeXml className="h-4 w-4" />
            </a>
          ) : null}
        </div>
      </div>
    </GlassPanel>
  );
};

const ProjectsSection = ({ projects }) => {
  return (
    <AnimatedSection id="projects" className="section-shell py-20 sm:py-24">
      <SectionHeading
        eyebrow="Projects"
        title="Build ideas shaped into portfolio-ready work."
        description="A curated list of possible projects, live builds, and case-study concepts that can be refined from the dashboard as your portfolio grows."
      />

      <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project, index) => (
          <ProjectCard key={project.id} project={project} featured={index === 0} />
        ))}
      </div>
    </AnimatedSection>
  );
};

export default ProjectsSection;
