import CommonMailFields from './CommonMailFields';
import FinalMailForm from './FinalMailForm';
import IntegrationMailForm from './IntegrationMailForm';
import ManualMailForm from './ManualMailForm';
import TransportMailForm from './TransportMailForm';

function MailTypeForm({ mailType, form, update }) {
  return (
    <div className="form-grid">
      <CommonMailFields mailType={mailType} form={form} update={update} />
      {mailType === 'integration' && <IntegrationMailForm form={form} update={update} />}
      {mailType === 'transport' && <TransportMailForm form={form} update={update} />}
      {mailType === 'final' && <FinalMailForm form={form} update={update} />}
      {mailType === 'manual' && <ManualMailForm />}
    </div>
  );
}

export default MailTypeForm;
