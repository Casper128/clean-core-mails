import { useEffect, useRef } from 'react';

const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const plainTextToHtml = (text) => escapeHtml(text).replaceAll('\n', '<br>');

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
  const bodyEditorRef = useRef(null);
  const bodyHtml = effectiveMail.bodyHtml ?? plainTextToHtml(effectiveMail.body);

  useEffect(() => {
    if (bodyEditorRef.current && bodyEditorRef.current.innerHTML !== bodyHtml) {
      bodyEditorRef.current.innerHTML = bodyHtml;
    }
  }, [bodyHtml]);

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
            <button disabled={!ready} onClick={() => onCopy('subject')}>{copied === 'subject' ? 'Copiado' : 'Copiar'}</button>
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
            <button disabled={!ready} onClick={() => onCopy('body')}>{copied === 'body' ? 'Copiado' : 'Copiar'}</button>
          </div>
          <div
            ref={bodyEditorRef}
            className="body-editor"
            contentEditable
            onInput={(event) => onEditMail('body', event.currentTarget.innerText)}
            role="textbox"
            aria-label="Cuerpo del correo"
            suppressContentEditableWarning
          />
        </div>
      </div>

      {!ready && <p className="preview-warning">Completa las validaciones indicadas para habilitar “Copiar todo”.</p>}
    </aside>
  );
}

export default MailPreviewPanel;
