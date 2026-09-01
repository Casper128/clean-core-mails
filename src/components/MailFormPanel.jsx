import MailTypeForm from './mailForms/MailTypeForm';

function MailFormPanel({ mailType, selectedMail, form, update, ready, documentStructures, checks }) {
  return (
    <section className="form-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">DATOS DEL CORREO</p>
          <h2>{selectedMail?.title}</h2>
        </div>
        <span className={ready ? 'status ready' : 'status'}>
          {ready ? 'Listo para copiar' : 'Faltan validaciones'}
        </span>
      </div>

      <MailTypeForm mailType={mailType} form={form} update={update} />

      {mailType === 'document' && (
        <div className="derived-value">
          <span>Estructura definida</span>
          <code>Para Copia: {documentStructures.copy}</code>
          <code>Para Borrado: {documentStructures.delete}</code>
        </div>
      )}

      <div className="checklist">
        {checks.map((check) => (
          <div key={check.label} className={check.ok ? 'check ok' : 'check'}>
            <span>{check.ok ? '✓' : '!'}</span>
            {check.label}
          </div>
        ))}
      </div>
    </section>
  );
}

export default MailFormPanel;
