import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Camera,
  GitBranch,
  Globe,
  MapPin,
  Mail,
  Send
} from "lucide-react";
import { motion } from "framer-motion";

const socialIcons = {
  GitHub: GitBranch,
  LinkedIn: BriefcaseBusiness,
  Instagram: Camera,
  X: Send,
  Twitter: Send,
  Dribbble: ArrowUpRight,
  Behance: ArrowUpRight,
  Website: Globe
};

const HeroSection = ({ hero }) => {
  const socialLinks = hero?.socialLinks || [];
  const stats = hero?.stats || [];

  return (
    <section id="home" className="section-shell pb-20 pt-12 sm:pb-24 lg:pb-28 lg:pt-16">
      <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
            Available for select freelance work
          </p>
          <h1 className="mt-6 max-w-3xl text-5xl font-bold tracking-tight text-white sm:text-6xl">
            {hero?.name || "Your Name"}
          </h1>
          <p className="mt-4 text-2xl font-semibold text-slate-200">{hero?.title}</p>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            {hero?.description}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4 text-sm text-slate-300">
            {hero?.location ? (
              <span className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-300" />
                {hero.location}
              </span>
            ) : null}
            {hero?.email ? (
              <a
                href={`mailto:${hero.email}`}
                className="inline-flex items-center gap-2 transition hover:text-white"
              >
                <Mail className="h-4 w-4 text-cyan-300" />
                {hero.email}
              </a>
            ) : null}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {socialLinks.map((link) => {
              const Icon = socialIcons[link.label] || ArrowUpRight;
              return (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-slate-200 transition hover:border-rose-300/35 hover:bg-white/[0.06] hover:text-white"
                  aria-label={link.label}
                >
                  <Icon className="h-5 w-5" />
                </a>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((stat, index) => {
              const Icon = index === 0 ? BriefcaseBusiness : index === 1 ? ArrowUpRight : Award;

              return (
                <div key={`${stat.label}-${stat.value}`} className="glass-panel rounded-lg p-5">
                  <Icon className="h-5 w-5 text-rose-300" />
                  <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
                  <p className="mt-2 text-sm text-slate-400">{stat.label}</p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative">
          <motion.div
            className="absolute -left-3 top-6 h-44 w-44 rounded-full bg-rose-500/20 blur-3xl"
            animate={{ opacity: [0.5, 0.85, 0.5], scale: [1, 1.08, 1] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute right-2 top-1/3 h-40 w-40 rounded-full bg-cyan-500/12 blur-3xl"
            animate={{ opacity: [0.35, 0.65, 0.35], y: [0, -8, 0] }}
            transition={{ duration: 7, repeat: Infinity }}
          />

          <div className="relative mx-auto max-w-md">
            <div className="absolute inset-x-10 bottom-5 h-10 rounded-full bg-black/60 blur-2xl" />
            <motion.img
              src={hero?.profileImageUrl}
              alt={hero?.name || "Profile"}
              className="relative z-10 w-full rounded-[32px] object-cover shadow-[0_35px_80px_rgba(2,6,23,0.55)]"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
