const SectionHeading = ({ eyebrow, title, description, align = "left" }) => {
  const alignmentClass = align === "center" ? "mx-auto max-w-2xl text-center" : "";

  return (
    <div className={alignmentClass}>
      {eyebrow ? (
        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-rose-300">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-slate-300">{description}</p>
      ) : null}
    </div>
  );
};

export default SectionHeading;
