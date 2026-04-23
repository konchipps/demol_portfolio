import { useEffect, useState } from "react";

const ClientLogo = ({
  name,
  logoUrl,
  alt,
  className = "",
  fallbackClassName = ""
}) => {
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setFailed(false);
  }, [logoUrl]);

  if (!logoUrl || failed) {
    return (
      <div
        className={`flex items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 text-center ${fallbackClassName}`.trim()}
      >
        <span className="text-sm font-semibold text-slate-100">{name}</span>
      </div>
    );
  }

  return (
    <img
      src={logoUrl}
      alt={alt || name}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default ClientLogo;
