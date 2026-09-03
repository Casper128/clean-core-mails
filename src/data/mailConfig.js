export const mailTypes = [
  { id: 'integration', step: '01', title: 'Validación de integración', hint: 'Cuando existe una integración asociada' },
  { id: 'document', step: '02', title: 'Documento de cambio', hint: 'Solicitar el documento para borrado' },
  { id: 'transport', step: '03', title: 'OT de borrado', hint: 'Solicitar la orden a Auditoría SAP' },
  { id: 'final', step: '04', title: 'Desarrollo decomisado', hint: 'Correo final para comité de cambios' },
  { id: 'empty', step: '05', title: 'Sin objetos', hint: 'Cerrar el RICEF sin decomiso' },
  { id: 'manual', step: '06', title: 'Correo manual', hint: 'Redactar un correo desde cero' },
];

export const initialState = {
  ricef: '',
  module: '',
  submodule: 'N/A',
  description: '',
  integrationName: '',
  platform: 'PO',
  channelStatus: '',
  objects: '',
  sapUser: '',
  changeDocument: '',
  copyDocumentOt: '',
  deleteDocumentOt: '',
  deletionOt: '',
  otDescription: '',
  responsible: '',
  blockDate: '',
  decommissionDate: '',
  transactions: '',
  observations: '',
  transactionsValidated: false,
  excelValidated: false,
};

export const sheetUrl = 'https://docs.google.com/spreadsheets/d/16ZO88sbNNDSAdDFbY8lfVLrPgP3VgFWwlmh_cTurv9M/edit?gid=416486022#gid=416486022';
