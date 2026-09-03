import { sheetUrl } from '../data/mailConfig';
import { buildDocumentStructures, displaySubmodule, formatDate, valueOr } from '../utils/mailUtils';

const sheetLinkText = 'Desarrollos Z Descripciones SISS Funcionales';
const escapeHtml = (value) =>
  String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');

const mailTemplateMap = {
  integration: ({ form }) => {
    const ricef = valueOr(form.ricef, 'RICEF');

    return {
      subject: `[NTSA] - Clean Core - ${ricef} - Validación Objetos ABAP - PO`,
      body: `Cordial Saludo equipo,

Quisiera informar que, durante la revisión de este decomiso, se identificó que el RICEF ${ricef} cuenta con la siguiente integración asociada:

Como medida previa, se realizó el apagado de la integración en el ambiente PRD.

En este sentido, agradeceré su confirmación sobre si podemos proceder inicialmente con decomisar los siguientes objetos ABAP y posteriormente realizar el decomiso de la integración:


Nota: ${valueOr(form.channelStatus, 'ESTADO DE LOS CANALES')}

Saludos,`,
    };
  },

  document: ({ form }) => {
    const ricef = valueOr(form.ricef, 'RICEF');
    const module = valueOr(form.module.toUpperCase(), 'MÓDULO');
    const submodule = displaySubmodule(form.submodule);
    const structures = buildDocumentStructures(form);

    return {
      subject: `[NTSA] Solicitud de documentos de cambios proceso decomisar Ricef ${ricef} Clean Core`,
      body: `Buenos días Equipo,
Espero se encuentren bien.

Por favor su ayuda con la gestión del envío de los documentos de cambio para el borrado y copiado de los objetos del ricef ${ricef} que se va a decomisar.

Modulo SAP: ${module}
Submódulo SAP: ${submodule}
RICEF: ${ricef}

Estructura definida:
Para Copia:   ${structures.copy}
Para Borrado: ${structures.delete}

Saludos`,
    };
  },

  transport: ({ form }) => {
    return {
      subject: '[NTSA] Clean Core - Solicitud OT de copia y borrado',
      body: `Buenos días equipo,

@Auditoria SAP  Solicito tu apoyo con la creación de las Órdenes de Transporte (OT) correspondientes para los siguientes documentos:

Usuario :  EXSSshenao

Para Copia:    ${valueOr(form.copyDocumentOt, 'DOCUEMTNO_DE_CAMBIO-OT')}
Para Borrado:  ${valueOr(form.deleteDocumentOt, 'DOCUEMTNO_DE_CAMBIO-OT')}

Quedo atento a cualquier inquietud.

Saludos,`,
    };
  },

  final: ({ form, transactions }) => {
    const ricef = valueOr(form.ricef, 'RICEF');
    const module = valueOr(form.module.toUpperCase(), 'MÓDULO');
    const description = valueOr(form.description, 'DESCRIPCIÓN DEL EXCEL');
    const document = valueOr(form.changeDocument, 'DOCUMENTO DE CAMBIO');
    const transactionList = transactions.length ? transactions.join(', ') : 'No se identificaron transacciones.';
    const submodule = displaySubmodule(form.submodule);
    const submoduleFilter = submodule === 'N/A' ? '' : `     Submodulo = ${submodule}
`;
    const blockDate = formatDate(form.blockDate);
    const responsible = valueOr(form.responsible, 'RESPONSABLE-MENCIONADO');
    const htmlRicef = escapeHtml(ricef);
    const htmlModule = escapeHtml(module);
    const htmlSubmodule = escapeHtml(submodule);
    const htmlDescription = escapeHtml(description);
    const htmlDocument = escapeHtml(document);
    const htmlResponsible = escapeHtml(responsible);
    const htmlTransactionList = escapeHtml(transactionList);
    const htmlBlockDate = escapeHtml(blockDate);

    return {
      subject: `[NTSA] Clean Core - Desarrollo Decomisado ${ricef}`,
      body: `Cordial Saludo equipo,
Espero se encuentren bien.

Para el proceso de CLEAN CORE se han seleccionado el siguiente RICEF para retirar del sistema: 
Ricef: ${ricef}
Descripción: ${description} 
Responsable:  ${responsible}
Transacción: ${transactionList}


Se informan con el propósito de que los tengan en cuenta para las actividades del comité de cambios.
     a. Diligenciar el formato del comité de cambios: 
        Documento de cambio a informar: ${document} 
        Se identifica transacciones: ${transactionList}
     b. Presentar los retiros de los programas en los ambientes del ERP.

Los criterios de selección fueron:

1.Se toma como base de selección el archivo de Google sheet  Desarrollos Z Descripciones SISS Funcionales
 ${sheetUrl} 

2. Se realiza filtros sobre el documento de la siguiente manera:

     Módulo    = ${module}
${submoduleFilter}     Responsable de la definición DILIGENCIADO
     Definición = Decomisar
     Observaciones = Se encontro transaccion ${transactionList}

     Nota: El campo Fecha Bloqueo Seguridad se encuentra diligenciado con fecha ${blockDate}
Saludos,`,
      bodyHtml: `Cordial Saludo equipo,<br>
Espero se encuentren bien.<br>
<br>
Para el proceso de CLEAN CORE se han seleccionado el siguiente RICEF para retirar del sistema:<br>
Ricef: ${htmlRicef}<br>
Descripci&oacute;n: ${htmlDescription}<br>
Responsable: ${htmlResponsible}<br>
Transacci&oacute;n: ${htmlTransactionList}<br>
<br>
<br>
Se informan con el prop&oacute;sito de que los tengan en cuenta para las actividades del comit&eacute; de cambios.<br>
&nbsp;&nbsp;&nbsp;&nbsp; a. Diligenciar el formato del comit&eacute; de cambios:<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Documento de cambio a informar: ${htmlDocument}<br>
&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Se identifica transacciones: ${htmlTransactionList}<br>
&nbsp;&nbsp;&nbsp;&nbsp; b. Presentar los retiros de los programas en los ambientes del ERP.<br>
<br>
Los criterios de selecci&oacute;n fueron:<br>
<br>
1.Se toma como base de selecci&oacute;n el archivo de Google sheet <a href="${sheetUrl}">${sheetLinkText}</a><br>
<br>
2. Se realiza filtros sobre el documento de la siguiente manera:<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp; M&oacute;dulo = ${htmlModule}<br>
${submodule === 'N/A' ? '' : `&nbsp;&nbsp;&nbsp;&nbsp; Submodulo = ${htmlSubmodule}<br>`}&nbsp;&nbsp;&nbsp;&nbsp; Responsable de la definici&oacute;n DILIGENCIADO<br>
&nbsp;&nbsp;&nbsp;&nbsp; Definici&oacute;n = Decomisar<br>
&nbsp;&nbsp;&nbsp;&nbsp; Observaciones = Se encontro transaccion ${htmlTransactionList}<br>
<br>
&nbsp;&nbsp;&nbsp;&nbsp; Nota: El campo Fecha Bloqueo Seguridad se encuentra diligenciado con fecha ${htmlBlockDate}<br>
Saludos,`,
    };
  },

  empty: ({ form }) => {
    const ricef = valueOr(form.ricef, 'RICEF');

    return {
      subject: `[NTSA] Clean Core - Sin Objetos Para Decomisar ${ricef}`,
      body: `Buenos días equipo,
Espero se encuentren bien.

En el marco del proceso de Clean Core, se seleccionó el siguiente RICEF para su retiro del sistema:

RICEF: ${ricef}

Durante la revisión de los objetos asociados a este RICEF, no se identificó ningún objeto perteneciente al mismo en el sistema.

Por lo anterior, no aplica ninguna acción de decomiso para este RICEF, ya que no existen objetos activos que retirar.

Quedamos atentos a cualquier comentario adicional al respecto.

Saludos,
`,
    };
  },

  manual: () => ({ subject: '', body: '' }),
};

export const generateMail = (mailType, context) => mailTemplateMap[mailType](context);
