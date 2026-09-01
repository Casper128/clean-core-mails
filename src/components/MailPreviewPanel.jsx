function MailPreviewPanel({
  copied,
  effectiveMail,
  mailType,
  onCopy,
  onEditMail,
  onRestoreTemplate,
  ready,
  hasOverride,
}) {
  return (
    <aside className="preview-panel">
      <div className="preview-heading">
        <div>
          <p className="eyebrow">VISTA PREVIA EDITABLE</p>
          <h2>Correo listo</h2>
        </div>
        <button className="copy-all" disabled={!ready} onClick={() => onCopy('all')}>
          {copied === 'all' ? 'Copiado' : 'Copiar todo'}
        </button>
      </div>

      {hasOverride && mailType !== 'manual' && (
        <div className="customized-note">
          <span>Texto personalizado</span>
          <button onClick={onRestoreTemplate}>Restaurar plantilla</button>
        </div>
      )}

      <div className="mail-preview">
        <div className="preview-section">
          <div className="preview-label">
            <span>ASUNTO · EDITABLE</span>
            <button onClick={() => onCopy('subject')}>{copied === 'subject' ? 'Copiado' : 'Copiar'}</button>
          </div>
          <input
            className="subject-editor"
            required
            value={effectiveMail.subject}
            onChange={(event) => onEditMail('subject', event.target.value)}
            placeholder="Escribe el asunto"
          />
        </div>
        <div className="preview-section body-section">
          <div className="preview-label">
            <span>CUERPO · EDITABLE</span>
            <button onClick={() => onCopy('body')}>{copied === 'body' ? 'Copiado' : 'Copiar'}</button>
          </div>
          <textarea
            className="body-editor"
            required
            value={effectiveMail.body}
            onChange={(event) => onEditMail('body', event.target.value)}
            placeholder="Escribe el cuerpo del correo"
          />
        </div>
      </div>

      {!ready && <p className="preview-warning">Completa las validaciones indicadas para habilitar “Copiar todo”.</p>}
    </aside>
  );
}

export default MailPreviewPanel;
