import Field from '../Field';

function IntegrationMailForm({ form, update }) {
  return (
    <>
      <Field label="Estado de los canales" required className="wide">
        <input required value={form.channelStatus} onChange={(event) => update('channelStatus', event.target.value)} />
      </Field>
    </>
  );
}

export default IntegrationMailForm;
