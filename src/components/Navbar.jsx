import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const defaultCvUrl = "/aaron-demol-cv.pdf";

const getInitials = (name) => {
  const parts = String(name || "")
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (!parts.length) {
    return "AD";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

const CvDownloadLink = ({ className, href }) => {
  return (
    <a
      className={className}
      href={href || defaultCvUrl}
      download="Aaron-Demol-CV.pdf"
      type="application/pdf"
    >
      Download CV
    </a>
  );
};

const getNavLinks = (sectionVisibility = {}) => {
  const links = [{ label: "Home", href: "#top" }];

  if (sectionVisibility.services !== false) {
    links.push({ label: "Services", href: "#services" });
  }

  if (sectionVisibility.resume !== false) {
    links.push({ label: "Resume", href: "#resume" });
  }

  if (sectionVisibility.projects !== false) {
    links.push({ label: "Projects", href: "#projects" });
  }

  if (sectionVisibility.testimonials !== false) {
    links.push({ label: "Testimonials", href: "#testimonials" });
  }

  if (sectionVisibility.contact !== false) {
    links.push({ label: "Contact", href: "#contact" });
  }

  return links;
};

const Navbar = ({ name = "Aaron Demol", resumeUrl = "#", sectionVisibility = {} }) => {
  const [open, setOpen] = useState(false);
  const [elevated, setElevated] = useState(false);
  const cvUrl = resumeUrl && resumeUrl !== "#" ? resumeUrl : defaultCvUrl;
  const initials = getInitials(name);
  const navLinks = getNavLinks(sectionVisibility);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 border-b transition ${
        elevated
          ? "border-white/10 bg-slate-950/85 backdrop-blur-xl"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="section-shell flex h-20 items-center justify-between gap-6">
        <a href="#top" className="text-lg font-semibold tracking-[0.14em] text-white">
          {initials}<span className="text-rose-300">.</span>
        </a>

        <nav className="hidden items-center gap-8 lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-300 transition hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a className="button-secondary" href="/login">
            Admin
          </a>
          <CvDownloadLink className="button-primary" href={cvUrl} />
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg border border-white/10 p-2 text-slate-100 lg:hidden"
          aria-label="Toggle navigation"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="section-shell border-t border-white/10 py-4 lg:hidden">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <a className="button-secondary" href="/login">
                Admin
              </a>
              <CvDownloadLink className="button-primary" href={cvUrl} />
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
};

export default Navbar;
