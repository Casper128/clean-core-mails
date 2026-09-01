import { useEffect, useMemo, useState } from 'react';
import './App.css';
const mailTypes = [
    { id: 'integration', step: '01', title: 'Validación de integración', hint: 'Cuando existe una integración asociada' },
    { id: 'document', step: '02', title: 'Documento de cambio', hint: 'Solicitar el documento para borrado' },
    { id: 'transport', step: '03', title: 'OT de borrado', hint: 'Solicitar la orden a Auditoría SAP' },
    { id: 'final', step: '04', title: 'Desarrollo decomisado', hint: 'Correo final para comité de cambios' },
    { id: 'empty', step: '05', title: 'Sin objetos', hint: 'Cerrar el RICEF sin decomiso' },
    { id: 'manual', step: '06', title: 'Correo manual', hint: 'Redactar un correo desde cero' },
];
const initialState = {
    ricef: '', module: '', submodule: 'N/A', description: '', integrationName: '',
    platform: 'PO', channelStatus: 'Los canales se encontraban apagados.', objects: '',
    sapUser: '', changeDocument: '', deletionOt: '', otDescription: '', responsible: '',
    blockDate: '', decommissionDate: '', transactions: '', observations: '',
    transactionsValidated: false, excelValidated: false,
};
const sheetUrl = 'https://docs.google.com/spreadsheets/d/16ZO88sbNNDSAdDFbY8lfVLrPgP3VgFWwlmh_cTurv9M/edit?gid=416486022#gid=416486022';
const cleanItems = (value) => [...new Set(value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean))];
const formatDate = (value) => value ? value.split('-').reverse().join('/') : '[FECHA]';
const valueOr = (value, placeholder) => value.trim() || `[${placeholder}]`;
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
    const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));
    const structure = useMemo(() => {
        const module = valueOr(form.module.toUpperCase(), 'MÓDULO');
        const ricef = valueOr(form.ricef, 'RICEF');
        const submodule = form.submodule.trim().toUpperCase();
        const middle = !submodule || submodule === 'N/A' || submodule === 'NA' ? '' : `-${submodule}`;
        return `CCORE-${module}${middle}-${ricef}-E1-B-PRY2026-0023`;
    }, [form.module, form.ricef, form.submodule]);
    const transactions = useMemo(() => cleanItems(form.transactions), [form.transactions]);
    const objects = useMemo(() => cleanItems(form.objects), [form.objects]);
    const otValidation = useMemo(() => {
        const normalized = form.otDescription.toUpperCase().replace(/\s/g, '');
        const match = normalized.match(/S(\d{10})/);
        const extractedDocument = match?.[1] ?? '';
        return {
            extractedDocument,
            isDeletionOt: Boolean(form.ricef && normalized.includes(`-${form.ricef}-E1-B-`)),
            documentMatches: Boolean(form.changeDocument && extractedDocument === form.changeDocument),
        };
    }, [form.changeDocument, form.otDescription, form.ricef]);
    const generated = useMemo(() => {
        const ricef = valueOr(form.ricef, 'RICEF');
        const module = valueOr(form.module.toUpperCase(), 'MÓDULO');
        const submodule = valueOr(form.submodule.toUpperCase(), 'SUBMÓDULO');
        const description = valueOr(form.description, 'DESCRIPCIÓN DEL EXCEL');
        const document = valueOr(form.changeDocument, 'DOCUMENTO DE CAMBIO');
        const transactionList = transactions.length ? transactions.join(', ') : 'No se identificaron transacciones.';
        if (mailType === 'integration') {
            const platform = valueOr(form.platform, 'PLATAFORMA');
            const objectList = objects.length ? objects.map((item) => `- ${item}`).join('\n') : '- [OBJETOS ABAP]';
            return {
                subject: `[NTSA] - Clean Core - ${ricef} - Validación Objetos ABAP - ${platform}`,
                body: `Buenas tardes equipo,

Quisiera informar que, durante la revisión de este decomiso, se identificó que el RICEF ${ricef} cuenta con la siguiente integración asociada:

Integración: ${valueOr(form.integrationName, 'INTEGRACIÓN')}
Plataforma: ${platform}

Como medida previa, se realizó el apagado de la integración en el ambiente PRD.

En este sentido, agradeceré su confirmación sobre si podemos proceder inicialmente con el decomiso de los siguientes objetos ABAP y posteriormente realizar el decomiso de la integración:

${objectList}

Nota: ${valueOr(form.channelStatus, 'ESTADO DE LOS CANALES')}

Saludos,`,
            };
        }
        if (mailType === 'document')
            return {
                subject: `[NTSA] Solicitud de documento de cambio proceso decomisar RICEF ${ricef} Clean Core`,
                body: `Buenos días equipo,
Espero se encuentren bien.

Por favor su ayuda con la gestión del envío del documento de cambio para el borrado de los objetos del RICEF ${ricef} que se va a decomisar.

Módulo SAP: ${module}
Submódulo SAP: ${submodule}
RICEF: ${ricef}

Estructura definida para borrado:
${structure}

Saludos,`,
            };
        if (mailType === 'transport')
            return {
                subject: `[NTSA] Clean Core - Solicitud OT de borrado RICEF ${ricef}`,
                body: `Buenos días equipo,

@Auditoría SAP: solicito tu apoyo con la creación de la Orden de Transporte (OT) de borrado correspondiente al siguiente documento:

Usuario: ${valueOr(form.sapUser, 'USUARIO SAP')}
Documento de cambio: ${document}
Estructura para borrado: ${structure}

Quedo atento a cualquier inquietud.

Saludos,`,
            };
        if (mailType === 'final')
            return {
                subject: `[NTSA] Clean Core - Desarrollo Decomisado ${ricef}`,
                body: `Cordial saludo equipo,
Espero se encuentren bien.

Para el proceso de Clean Core se seleccionó el siguiente RICEF para retirar del sistema:

RICEF: ${ricef}
Descripción: ${description}
Responsable: ${valueOr(form.responsible, 'RESPONSABLE')}
OT de borrado: ${valueOr(form.deletionOt, 'OT DE BORRADO')}
Estructura de borrado: ${structure}

Validaciones previas confirmadas:
- Se verificó que las transacciones relacionadas están desbloqueadas y autorizadas para decomiso.
- Se verificó en el Excel que el RICEF está marcado con Definición = Decomisar.

Se informa con el propósito de que lo tengan en cuenta para las actividades del comité de cambios.

a. Diligenciar el formato del comité de cambios:
Documento de cambio a informar: ${document}
Transacciones identificadas: ${transactionList}

b. Presentar los retiros de los programas en los ambientes del ERP.

Los criterios de selección fueron:

1. Se toma como base de selección el archivo de Google Sheet “Desarrollos Z Descripciones SISS Funcionales”:
${sheetUrl}

2. Se aplicaron los siguientes filtros:
Módulo = ${module}
Submódulo = ${submodule}
Responsable de la definición = DILIGENCIADO
Definición = Decomisar
Observaciones = Se realizó la validación de transacciones desbloqueadas: ${transactionList}

Nota: el campo Fecha Bloqueo Seguridad se encuentra diligenciado con fecha ${formatDate(form.blockDate)}.
Fecha de decomiso: ${formatDate(form.decommissionDate)}.
${form.observations.trim() ? `\nObservaciones adicionales: ${form.observations.trim()}\n` : ''}
Saludos,`,
            };
        if (mailType === 'empty')
            return {
                subject: `[NTSA] Clean Core - Sin Objetos Para Decomisar ${ricef}`,
                body: `Buenos días equipo,
Espero se encuentren bien.

En el marco del proceso de Clean Core, se seleccionó el siguiente RICEF para su retiro del sistema:

RICEF: ${ricef}
Descripción: ${description}

Durante la revisión de los objetos asociados a este RICEF, no se identificó ningún objeto perteneciente al mismo en el sistema.

Por lo anterior, no aplica ninguna acción de decomiso para este RICEF, ya que no existen objetos activos que retirar.

Quedamos atentos a cualquier comentario adicional al respecto.

      Saludos,`,
            };
        return { subject: '', body: '' };
    }, [form, mailType, objects, structure, transactions]);
    const effectiveMail = overrides[mailType] ?? generated;
    const checks = useMemo(() => {
        const base = [{ label: 'RICEF de cuatro dígitos', ok: /^\d{4}$/.test(form.ricef) }];
        if (mailType === 'integration')
            return [...base, { label: 'Integración identificada', ok: Boolean(form.integrationName.trim()) }, { label: 'Objetos ABAP ingresados', ok: objects.length > 0 }];
        if (mailType === 'document')
            return [...base, { label: 'Módulo diligenciado', ok: Boolean(form.module.trim()) }];
        if (mailType === 'transport')
            return [...base, { label: 'Usuario SAP diligenciado', ok: Boolean(form.sapUser.trim()) }, { label: 'Documento de 10 dígitos', ok: /^\d{10}$/.test(form.changeDocument) }];
        if (mailType === 'final')
            return [...base,
                { label: 'Datos del decomiso completos', ok: Boolean(form.module && form.description && form.responsible && form.deletionOt) },
                { label: 'OT identificada como borrado del RICEF', ok: otValidation.isDeletionOt },
                { label: 'Documento coincide con la descripción de la OT', ok: otValidation.documentMatches },
                { label: 'Transacciones desbloqueadas validadas', ok: form.transactionsValidated },
                { label: 'Definición = Decomisar validada en Excel', ok: form.excelValidated },
            ];
        if (mailType === 'empty')
            return [...base, { label: 'Descripción diligenciada', ok: Boolean(form.description.trim()) }];
        return [
            { label: 'Asunto diligenciado', ok: Boolean(effectiveMail.subject.trim()) },
            { label: 'Cuerpo diligenciado', ok: Boolean(effectiveMail.body.trim()) },
        ];
    }, [effectiveMail.body, effectiveMail.subject, form, mailType, objects.length, otValidation]);
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
    <header className="topbar">
      <div className="brand-mark" aria-hidden="true">CC</div>
      <div><p className="eyebrow">NTSA · CLEAN CORE</p><h1>Generador de correos</h1></div>
      <div className="privacy-note"><span /> Los datos permanecen en este navegador</div>
    </header>

    <div className="workspace">
      <nav className="mail-nav" aria-label="Tipos de correo">
        <p className="nav-label">Selecciona una plantilla</p>
        {mailTypes.map((item) => <button key={item.id} className={mailType === item.id ? 'mail-option active' : 'mail-option'} onClick={() => setMailType(item.id)}>
          <span className="step">{item.step}</span><span><strong>{item.title}</strong><small>{item.hint}</small></span>
        </button>)}
        <button className="reset-button" onClick={reset}>Limpiar formulario</button>
      </nav>

      <section className="form-panel">
        <div className="panel-heading"><div><p className="eyebrow">DATOS DEL CORREO</p><h2>{mailTypes.find((item) => item.id === mailType)?.title}</h2></div><span className={ready ? 'status ready' : 'status'}>{ready ? 'Listo para copiar' : 'Faltan validaciones'}</span></div>
        <div className="form-grid">
          {mailType !== 'manual' && <Field label="RICEF" hint="4 dígitos" required><input inputMode="numeric" maxLength={4} value={form.ricef} onChange={(e) => update('ricef', e.target.value.replace(/\D/g, ''))} placeholder="2541"/></Field>}
          {!['integration', 'manual'].includes(mailType) && <><Field label="Módulo SAP" required={mailType !== 'empty'}><input value={form.module} onChange={(e) => update('module', e.target.value.toUpperCase())} placeholder="CRM"/></Field><Field label="Submódulo SAP"><input value={form.submodule} onChange={(e) => update('submodule', e.target.value.toUpperCase())} placeholder="N/A"/></Field></>}
          {['integration', 'document', 'final', 'empty'].includes(mailType) && <Field label="Descripción" className="wide"><textarea value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Descripción tomada del Excel" rows={2}/></Field>}

          {mailType === 'integration' && <><Field label="Nombre de la integración" required><input value={form.integrationName} onChange={(e) => update('integrationName', e.target.value)} placeholder="Integración asociada"/></Field><Field label="Plataforma"><input value={form.platform} onChange={(e) => update('platform', e.target.value.toUpperCase())} placeholder="PO"/></Field><Field label="Estado de los canales" className="wide"><input value={form.channelStatus} onChange={(e) => update('channelStatus', e.target.value)}/></Field><Field label="Objetos ABAP" hint="Uno por línea o separados por comas" required className="wide"><textarea value={form.objects} onChange={(e) => update('objects', e.target.value)} placeholder={'ZOBJETO_1\nZOBJETO_2'} rows={5}/></Field></>}

          {mailType === 'transport' && <><Field label="Usuario SAP" required><input value={form.sapUser} onChange={(e) => update('sapUser', e.target.value.toUpperCase())} placeholder="EXSSSHENAO"/></Field><Field label="Documento de cambio" hint="10 dígitos, sin S" required><input inputMode="numeric" maxLength={10} value={form.changeDocument} onChange={(e) => update('changeDocument', e.target.value.replace(/\D/g, ''))} placeholder="7000033433"/></Field></>}

          {mailType === 'final' && <><Field label="Responsable" required><input value={form.responsible} onChange={(e) => update('responsible', e.target.value)} placeholder="Nombre del responsable"/></Field><Field label="Documento de cambio" hint="10 dígitos, sin S" required><input inputMode="numeric" maxLength={10} value={form.changeDocument} onChange={(e) => update('changeDocument', e.target.value.replace(/\D/g, ''))} placeholder="7000033433"/></Field><Field label="OT de borrado" required><input value={form.deletionOt} onChange={(e) => update('deletionOt', e.target.value.toUpperCase())} placeholder="ERDK995320"/></Field><Field label="Descripción de la OT" hint="Pegar desde SAP" required className="wide"><textarea value={form.otDescription} onChange={(e) => update('otDescription', e.target.value)} placeholder="Descripción que contiene -2541-E1-B- y S7000033433" rows={3}/></Field><Field label="Fecha Bloqueo Seguridad"><input type="date" value={form.blockDate} onChange={(e) => update('blockDate', e.target.value)}/></Field><Field label="Fecha de decomiso"><input type="date" value={form.decommissionDate} onChange={(e) => update('decommissionDate', e.target.value)}/></Field><Field label="Transacciones" hint="Una por línea o separadas por comas" className="wide"><textarea value={form.transactions} onChange={(e) => update('transactions', e.target.value)} placeholder="ZTX01, ZTX02, ZTX03" rows={3}/></Field><div className="validation-box wide"><p className="box-title">Confirmaciones obligatorias</p><Check checked={form.transactionsValidated} onChange={(value) => update('transactionsValidated', value)}>Validé las transacciones desbloqueadas y autorizadas para decomisar.</Check><Check checked={form.excelValidated} onChange={(value) => update('excelValidated', value)}>Validé en el Excel que el RICEF tiene <strong>Definición = Decomisar</strong>.</Check></div><Field label="Observaciones adicionales" className="wide"><textarea value={form.observations} onChange={(e) => update('observations', e.target.value)} rows={2}/></Field></>}
          {mailType === 'manual' && <div className="manual-note wide"><strong>Redacción libre</strong><p>Escribe directamente el asunto y el cuerpo en la vista previa. El texto se copiará exactamente como lo dejes.</p></div>}
        </div>

        {['document', 'transport', 'final'].includes(mailType) && <div className="derived-value"><span>Estructura de borrado</span><code>{structure}</code></div>}
        <div className="checklist">{checks.map((check) => <div key={check.label} className={check.ok ? 'check ok' : 'check'}><span>{check.ok ? '✓' : '!'}</span>{check.label}</div>)}{mailType === 'final' && otValidation.extractedDocument && <p className="extracted">Documento encontrado en la OT: <strong>{otValidation.extractedDocument}</strong></p>}</div>
      </section>

      <aside className="preview-panel">
        <div className="preview-heading"><div><p className="eyebrow">VISTA PREVIA EDITABLE</p><h2>Correo listo</h2></div><button className="copy-all" disabled={!ready} onClick={() => copy('all')}>{copied === 'all' ? 'Copiado' : 'Copiar todo'}</button></div>
        {overrides[mailType] && mailType !== 'manual' && <div className="customized-note"><span>Texto personalizado</span><button onClick={restoreTemplate}>Restaurar plantilla</button></div>}
        <div className="mail-preview"><div className="preview-section"><div className="preview-label"><span>ASUNTO · EDITABLE</span><button onClick={() => copy('subject')}>{copied === 'subject' ? 'Copiado' : 'Copiar'}</button></div><input className="subject-editor" value={effectiveMail.subject} onChange={(event) => editMail('subject', event.target.value)} placeholder="Escribe el asunto"/></div><div className="preview-section body-section"><div className="preview-label"><span>CUERPO · EDITABLE</span><button onClick={() => copy('body')}>{copied === 'body' ? 'Copiado' : 'Copiar'}</button></div><textarea className="body-editor" value={effectiveMail.body} onChange={(event) => editMail('body', event.target.value)} placeholder="Escribe el cuerpo del correo"/></div></div>
        {!ready && <p className="preview-warning">Completa las validaciones indicadas para habilitar “Copiar todo”.</p>}
      </aside>
    </div>
  </main>;
}
function Field({ label, hint, required, className = '', children }) {
    return <label className={`field ${className}`}><span>{label}{required && <b>*</b>}{hint && <small>{hint}</small>}</span>{children}</label>;
}
function Check({ checked, onChange, children }) {
    return <label className="checkbox-row"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)}/><span className="fake-check">✓</span><span>{children}</span></label>;
}
export default App;
