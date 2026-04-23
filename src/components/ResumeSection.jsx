import AnimatedSection from "./AnimatedSection";
import SectionHeading from "./SectionHeading";

const TimelineColumn = ({ title, entries }) => {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-rose-300/60 to-transparent" />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>

      <div className="mt-8 space-y-6">
        {entries.map((entry) => (
          <div key={entry.id} className="relative pl-8">
            <span className="absolute left-0 top-2 h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_20px_rgba(248,113,113,0.5)]" />
            <span className="absolute left-[5px] top-5 h-[calc(100%-8px)] w-px bg-white/10" />
            <div className="glass-panel rounded-lg p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h4 className="text-lg font-semibold text-white">{entry.title}</h4>
                  <p className="mt-1 text-sm font-medium text-rose-200">
                    {entry.organization}
                  </p>
                </div>
                <div className="text-sm text-slate-400 sm:text-right">
                  <p>{entry.period}</p>
                  <p className="mt-1">{entry.location}</p>
                </div>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300">{entry.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResumeSection = ({ resume }) => {
  return (
    <AnimatedSection id="resume" className="section-shell py-20 sm:py-24">
      <SectionHeading
        eyebrow="Resume"
        title="The work behind the polish."
        description="A quick look at the roles, education, and experience shaping the way I solve problems and ship products."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-2">
        <TimelineColumn title="Experience" entries={resume?.experience || []} />
        <TimelineColumn title="Education" entries={resume?.education || []} />
      </div>
    </AnimatedSection>
  );
};

export default ResumeSection;
