function Field({ label, hint, required, className = '', children }) {
  return (
    <label className={`field ${className}`}>
      <span>
        {label}
        {required && <b>*</b>}
        {hint && <small>{hint}</small>}
      </span>
      {children}
    </label>
  );
}

export default Field;
