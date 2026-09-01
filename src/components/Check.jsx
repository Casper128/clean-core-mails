function Check({ checked, onChange, children }) {
  return (
    <label className="checkbox-row">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="fake-check">✓</span>
      <span>{children}</span>
    </label>
  );
}

export default Check;
