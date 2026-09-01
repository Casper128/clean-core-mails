import Check from '../Check';
import Field from '../Field';

function FinalMailForm({ form, update }) {
  return (
    <>
      <Field label="Responsable" required>
        <input
          required
          value={form.responsible}
          onChange={(event) => update('responsible', event.target.value)}
          placeholder="Nombre del responsable"
        />
      </Field>
      <Field label="Documento de cambio de la OT de borrado" hint="10 dígitos, sin S" required>
        <input
          inputMode="numeric"
          maxLength={10}
          required
          value={form.changeDocument}
          onChange={(event) => update('changeDocument', event.target.value.replace(/\D/g, ''))}
          placeholder="7000033433"
        />
      </Field>
      <Field label="Fecha Bloqueo Seguridad" required>
        <input required type="date" value={form.blockDate} onChange={(event) => update('blockDate', event.target.value)} />
      </Field>
      <Field label="Transacciones" hint="Una por línea o separadas por comas" required className="wide">
        <textarea
          required
          value={form.transactions}
          onChange={(event) => update('transactions', event.target.value)}
          placeholder="ZTX01, ZTX02, ZTX03"
          rows={3}
        />
      </Field>
      <div className="validation-box wide">
        <p className="box-title">Confirmaciones obligatorias</p>
        <Check checked={form.transactionsValidated} onChange={(value) => update('transactionsValidated', value)}>
          Validé las transacciones desbloqueadas y autorizadas para decomisar.
        </Check>
        <Check checked={form.excelValidated} onChange={(value) => update('excelValidated', value)}>
          Validé en el Excel que el RICEF tiene <strong>Definición = Decomisar</strong>.
        </Check>
      </div>
    </>
  );
}

export default FinalMailForm;
