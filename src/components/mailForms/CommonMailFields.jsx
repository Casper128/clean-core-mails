import Field from '../Field';

function CommonMailFields({ mailType, form, update }) {
  return (
    <>
      {!['manual', 'transport'].includes(mailType) && (
        <Field label="RICEF" hint="4 dígitos" required>
          <input
            inputMode="numeric"
            maxLength={4}
            required
            value={form.ricef}
            onChange={(event) => update('ricef', event.target.value.replace(/\D/g, ''))}
            placeholder="2541"
          />
        </Field>
      )}

      {!['integration', 'manual', 'transport', 'empty'].includes(mailType) && (
        <>
          <Field label="Módulo SAP" required>
            <input
              required
              value={form.module}
              onChange={(event) => update('module', event.target.value.toUpperCase())}
              placeholder="CRM"
            />
          </Field>
          <Field label="Submódulo SAP" required={!['document', 'final'].includes(mailType)}>
            <input
              required={!['document', 'final'].includes(mailType)}
              value={form.submodule}
              onChange={(event) => update('submodule', event.target.value.toUpperCase())}
              placeholder="N/A"
            />
          </Field>
        </>
      )}

      {mailType === 'final' && (
        <Field label="Descripción" required className="wide">
          <textarea
            required
            value={form.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="Descripción tomada del Excel"
            rows={2}
          />
        </Field>
      )}
    </>
  );
}

export default CommonMailFields;
