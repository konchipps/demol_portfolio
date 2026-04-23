import GlassPanel from "./GlassPanel";

const ConfigNotice = ({
  title = "Firebase setup required",
  description = "Add your Firebase environment variables to .env.local to enable live content, authentication, and file uploads."
}) => {
  return (
    <GlassPanel className="p-5">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-rose-300">
        {title}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-300">{description}</p>
    </GlassPanel>
  );
};

export default ConfigNotice;
