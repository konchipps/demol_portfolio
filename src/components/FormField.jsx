const FormField = ({
  label,
  textarea = false,
  error,
  className = "",
  children,
  ...props
}) => {
  const Component = textarea ? "textarea" : "input";

  return (
    <label className={`block ${className}`.trim()}>
      <span className="mb-2 block text-sm font-medium text-slate-200">{label}</span>
      {children || (
        <Component
          {...props}
          className={`field-input ${textarea ? "min-h-[120px] resize-y" : ""}`.trim()}
        />
      )}
      {error ? <span className="mt-2 block text-xs text-rose-300">{error}</span> : null}
    </label>
  );
};

export default FormField;
