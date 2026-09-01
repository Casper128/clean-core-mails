import { useEffect, useMemo, useState } from 'react';
import './App.css';
import AppHeader from './components/AppHeader';
import MailFormPanel from './components/MailFormPanel';
import MailNav from './components/MailNav';
import MailPreviewPanel from './components/MailPreviewPanel';
import { initialState, mailTypes } from './data/mailConfig';
import { generateMail } from './templates/mailTemplates';
import { buildDocumentStructures, cleanItems, hasTransportType } from './utils/mailUtils';
function App() {
    const [mailType, setMailType] = useState('integration');
    const [form, setForm] = useState(() => {
        try {
            const stored = localStorage.getItem('clean-core-mail-form');
            return stored ? { ...initialState, ...JSON.parse(stored) } : initialState;
        }
        catch {
            return initialState;
        }
    });
    const [copied, setCopied] = useState(null);
    const [overrides, setOverrides] = useState({});
    useEffect(() => { localStorage.setItem('clean-core-mail-form', JSON.stringify(form)); }, [form]);
    const selectedMail = mailTypes.find((item) => item.id === mailType);
    const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const documentStructures = useMemo(() => buildDocumentStructures(form), [form]);
    const transactions = useMemo(() => cleanItems(form.transactions), [form.transactions]);
    const generated = useMemo(() => generateMail(mailType, { form, transactions }), [form, mailType, transactions]);
    const effectiveMail = overrides[mailType] ?? generated;
    const checks = useMemo(() => {
        const base = [{ label: 'RICEF de cuatro dígitos', ok: /^\d{4}$/.test(form.ricef) }];
        const moduleFields = [
            { label: 'Módulo diligenciado', ok: Boolean(form.module.trim()) },
            { label: 'Submódulo diligenciado', ok: Boolean(form.submodule.trim()) },
        ];
        const descriptionField = { label: 'Descripción diligenciada', ok: Boolean(form.description.trim()) };
        if (mailType === 'integration')
            return [...base, { label: 'Estado de canales diligenciado', ok: Boolean(form.channelStatus.trim()) }];
        if (mailType === 'document')
            return [...base, { label: 'Módulo diligenciado', ok: Boolean(form.module.trim()) }];
        if (mailType === 'transport')
            return [
                { label: 'Documento/OT para copia diligenciado', ok: Boolean(form.copyDocumentOt.trim()) },
                { label: 'La línea de copia contiene -E1-C-', ok: hasTransportType(form.copyDocumentOt, 'C') },
                { label: 'Documento/OT para borrado diligenciado', ok: Boolean(form.deleteDocumentOt.trim()) },
                { label: 'La línea de borrado contiene -E1-B-', ok: hasTransportType(form.deleteDocumentOt, 'B') },
            ];
        if (mailType === 'final')
            return [...base,
                { label: 'Módulo diligenciado', ok: Boolean(form.module.trim()) },
                descriptionField,
                { label: 'Responsable diligenciado', ok: Boolean(form.responsible.trim()) },
                { label: 'Documento de cambio de borrado diligenciado', ok: /^\d{10}$/.test(form.changeDocument) },
                { label: 'Fecha de bloqueo diligenciada', ok: Boolean(form.blockDate) },
                { label: 'Transacciones diligenciadas', ok: Boolean(form.transactions.trim()) },
                { label: 'Se validaron las transacciones', ok: form.transactionsValidated },
                { label: 'Se validó el archivo de Excel', ok: form.excelValidated },
            ];
        if (mailType === 'empty')
            return base;
        return [
            { label: 'Asunto diligenciado', ok: Boolean(effectiveMail.subject.trim()) },
            { label: 'Cuerpo diligenciado', ok: Boolean(effectiveMail.body.trim()) },
        ];
    }, [effectiveMail.body, effectiveMail.subject, form, mailType]);
    const ready = checks.every((check) => check.ok);
    const copy = async (kind) => {
        const text = kind === 'subject' ? effectiveMail.subject : kind === 'body' ? effectiveMail.body : `ASUNTO:\n${effectiveMail.subject}\n\nCUERPO:\n${effectiveMail.body}`;
        await navigator.clipboard.writeText(text);
        setCopied(kind);
        window.setTimeout(() => setCopied(null), 1800);
    };
    const reset = () => { setForm(initialState); setOverrides({}); localStorage.removeItem('clean-core-mail-form'); };
    const editMail = (key, value) => {
        setOverrides((current) => ({ ...current, [mailType]: { ...(current[mailType] ?? generated), [key]: value } }));
    };
    const restoreTemplate = () => setOverrides((current) => {
        const next = { ...current };
        delete next[mailType];
        return next;
    });
    return <main className="app-shell">
    <AppHeader />

    <div className="workspace">
      <MailNav mailTypes={mailTypes} selectedMailType={mailType} onSelect={setMailType} onReset={reset} />
      <MailFormPanel mailType={mailType} selectedMail={selectedMail} form={form} update={update} ready={ready} documentStructures={documentStructures} checks={checks} />
      <MailPreviewPanel copied={copied} effectiveMail={effectiveMail} mailType={mailType} onCopy={copy} onEditMail={editMail} onRestoreTemplate={restoreTemplate} ready={ready} hasOverride={Boolean(overrides[mailType])} />
    </div>
  </main>;
}
export default App;
