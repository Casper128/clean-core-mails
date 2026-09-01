import Field from '../Field';

function TransportMailForm({ form, update }) {
  return (
    <>
      <Field label="Para Copia" hint="Documento de cambio - OT" required className="wide">
        <input
          required
          value={form.copyDocumentOt}
          onChange={(event) => update('copyDocumentOt', event.target.value.toUpperCase())}
          placeholder="7000033432 CCORE-CRM-2541-E1-C-PRY2026-0023"
        />
      </Field>
      <Field label="Para Borrado" hint="Documento de cambio - OT" required className="wide">
        <input
          required
          value={form.deleteDocumentOt}
          onChange={(event) => update('deleteDocumentOt', event.target.value.toUpperCase())}
          placeholder="7000033433 CCORE-CRM-2541-E1-B-PRY2026-0023"
        />
      </Field>
    </>
  );
}

export default TransportMailForm;
