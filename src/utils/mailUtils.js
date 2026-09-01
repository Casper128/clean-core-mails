export const cleanItems = (value) => [
  ...new Set(value.split(/[\n,;]+/).map((item) => item.trim()).filter(Boolean)),
];

export const formatDate = (value) => (value ? value.split('-').reverse().join('/') : '[FECHA]');

export const valueOr = (value, placeholder) => value.trim() || `[${placeholder}]`;

export const displaySubmodule = (value) => {
  const normalized = value.trim().toUpperCase();
  return !normalized || normalized === 'NA' || normalized === 'N/A' ? 'N/A' : normalized;
};

export const buildStructure = (form) => {
  const module = valueOr(form.module.toUpperCase(), 'MÓDULO');
  const ricef = valueOr(form.ricef, 'RICEF');
  const submodule = form.submodule.trim().toUpperCase();
  const middle = !submodule || submodule === 'N/A' || submodule === 'NA' ? '' : `-${submodule}`;

  return `CCORE-${module}${middle}-${ricef}-E1-B-PRY2026-0023`;
};

export const buildDocumentStructures = (form) => {
  const module = valueOr(form.module.toUpperCase(), 'MÓDULO');
  const submodule = form.submodule.trim().toUpperCase();
  const middle = !submodule || submodule === 'N/A' || submodule === 'NA' ? '' : `-${submodule}`;
  const ricef = valueOr(form.ricef, 'RICEF');

  return {
    copy: `CCORE-${module}${middle}-${ricef}-E1-C-PRY2026-0023`,
    delete: `CCORE-${module}${middle}-${ricef}-E1-B-PRY2026-0023`,
  };
};

export const hasTransportType = (value, type) => {
  const normalized = value.toUpperCase().replace(/\s+/g, ' ').trim();
  return normalized.includes(`-E1-${type}-`);
};

export const validateOt = (form) => {
  const normalized = form.otDescription.toUpperCase().replace(/\s/g, '');
  const match = normalized.match(/S(\d{10})/);
  const extractedDocument = match?.[1] ?? '';

  return {
    extractedDocument,
    isDeletionOt: Boolean(form.ricef && normalized.includes(`-${form.ricef}-E1-B-`)),
    documentMatches: Boolean(form.changeDocument && extractedDocument === form.changeDocument),
  };
};
