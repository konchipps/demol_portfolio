const GlassPanel = ({ as: Component = "div", className = "", children, ...props }) => {
  return (
    <Component className={`glass-panel rounded-lg ${className}`.trim()} {...props}>
      {children}
    </Component>
  );
};

export default GlassPanel;
