function MailNav({ mailTypes, selectedMailType, onSelect, onReset }) {
  return (
    <nav className="mail-nav" aria-label="Tipos de correo">
      <p className="nav-label">Selecciona una plantilla</p>
      {mailTypes.map((item) => (
        <button
          key={item.id}
          className={selectedMailType === item.id ? 'mail-option active' : 'mail-option'}
          onClick={() => onSelect(item.id)}
        >
          <span className="step">{item.step}</span>
          <span>
            <strong>{item.title}</strong>
            <small>{item.hint}</small>
          </span>
        </button>
      ))}
      <button className="reset-button" onClick={onReset}>Limpiar formulario</button>
    </nav>
  );
}

export default MailNav;
