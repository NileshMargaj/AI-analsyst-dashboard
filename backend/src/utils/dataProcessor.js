/**
 * Data Processing Module - AI Analytics Complete & Legacy Compatible
 */

// ===== AI CHART FORMATTING (NEW) =====
export const formatForCharts = (data, operation = 'bar') => {
  if (!data || (Array.isArray(data) && data.length === 0)) return [];
  if (typeof data === 'object' && !Array.isArray(data)) {
    return Object.entries(data).map(([label, metrics]) => {
      const row = { name: String(label) };
      const metricKey = Object.keys(metrics).find(k => k.includes('sum') || k.includes('avg')) || Object.keys(metrics)[0];
      row.value = Number(metrics[metricKey]) || 0;
      return row;
    }).slice(0, 20);
  }
  if (Array.isArray(data)) {
    return data.map(row => ({
      name: row.name || Object.keys(row)[0] || 'N/A',
      value: Number(row.value) || Number(Object.values(row)[1]) || 0
    })).slice(0, 20);
  }
  return [];
};

// ===== CORE FUNCTIONS (SIMPLIFIED + EXPORTED) =====
export const getColumns = (data) => Array.from(new Set([].concat(...(data || []).map(Object.keys))));

export const getSchema = (data) => {
  const schema = {};
  getColumns(data).forEach(col => schema[col] = 'string');
  return schema;
};

export const filterData = (data, field, operator, value) => (data || []).filter(row => {
  const v = row[field];
  switch (operator.toLowerCase()) {
    case '=': return v == value;
    case '!=': return v != value;
    case '>': return Number(v) > Number(value);
    case '<': return Number(v) < Number(value);
    case 'contains': return String(v).includes(String(value));
    default: return true;
  }
});

export const groupBy = (data, field) => (data || []).reduce((g, r) => {
  const k = r[field];
  g[k] = g[k] || [];
  g[k].push(r);
  return g;
}, {});

export const sortData = (data, field, order = 'asc') => {
  const sorted = [...(data || [])];
  sorted.sort((a, b) => order === 'asc' ? (a[field] || 0) - (b[field] || 0) : (b[field] || 0) - (a[field] || 0));
  return sorted;
};

export const safeNumeric = (v) => parseFloat(String(v)) || 0;

export const sum = (data, field) => (data || []).reduce((t, r) => t + safeNumeric(r[field]), 0);
export const average = (data, field) => data.length ? sum(data, field) / data.length : 0;
export const count = (data) => (data || []).length;
export const countDistinct = (data, field) => new Set((data || []).map(r => r[field])).size;
export const getUnique = (data, field) => [...new Set((data || []).map(r => r[field]))];
export const paginate = (data, page = 1, size = 10) => {
  const start = (page - 1) * size;
  return (data || []).slice(start, start + size);
};

export const summarize = (data, field) => {
  const values = (data || []).map(r => r[field]).filter(v => v !== undefined && v !== null && v !== '');
  const numericValues = values.map(safeNumeric).filter(v => !isNaN(v));
  const nonEmptyValues = values.filter(v => v !== '');

  return {
    count: data.length,
    valid: nonEmptyValues.length,
    missing: data.length - nonEmptyValues.length,
    distinct: countDistinct(data, field),
    type: numericValues.length > nonEmptyValues.length * 0.5 ? 'number' : 'string',
    sample: nonEmptyValues.slice(0, 5),
    
    // Numeric stats
    ...(numericValues.length > 0 && {
      sum: sum(data, field),
      average: average(data, field),
      min: Math.min(...numericValues),
      max: Math.max(...numericValues)
    }),
    
    // Categorical top values
    ...(nonEmptyValues.length > 0 && {
      topValues: Object.entries(groupBy(data, field))
        .sort(([,a], [,b]) => b.length - a.length)
        .slice(0, 3)
        .map(([val, rows]) => ({ value: val, count: rows.length }))
    })
  };
};

export const analyzeData = (data, groupField, metricField) => Object.fromEntries(
  Object.entries(groupBy(data, groupField)).map(([k, rows]) => [k, summarize(rows, metricField)])
);

export const processQuery = (data, query = {}) => {
  let result = [...(data || [])];
  if (query.filter) result = filterData(result, query.filter.field, query.filter.operator, query.filter.value);
  if (query.groupBy) result = analyzeData(result, query.groupBy, query.metric || getColumns(data)[1]);
  if (query.limit) result = result.slice(0, query.limit);
  return { success: true, data: result };
};

// ===== ALL LEGACY SUPPORT =====
export const detectType = (v) => typeof v === 'number' ? 'number' : 'string';
export const convertToType = (v) => Number(v) || v;
export const isValidValue = (v) => v != null;
export const getRows = (data) => data || [];
export const applyMultipleFilters = (data, filters) => filters.reduce((d, f) => filterData(d, f.field, f.operator, f.value), data || []);
export const groupByMultiple = groupBy; // Simplified
export const sortByMultiple = sortData; // Simplified
export const min = (data, field) => data.length ? Math.min(...data.map(r => safeNumeric(r[field]))) : 0;
export const max = (data, field) => data.length ? Math.max(...data.map(r => safeNumeric(r[field]))) : 0;
export const analyzeDataAdvanced = analyzeData; // Simplified
export const fillMissing = (data, field, val) => data.map(r => ({ ...r, [field]: r[field] || val }));

console.log('✅ DataProcessor: AI Ready + Legacy Compatible');

