/**
 * Data Processor API Service
 * Service layer for all data processing APIs
 */

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Common fetch options with auth
const getFetchOptions = (method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return options;
};

/**
 * Upload CSV file
 */
export const uploadCSV = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: formData,
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get dataset with pagination
 */
export const getDataset = async (datasetId, page = 1, limit = 20) => {
  const url = new URL(`${API_BASE}/${datasetId}`);
  url.searchParams.append('page', page);
  url.searchParams.append('limit', limit);

  const response = await fetch(url, getFetchOptions());

  if (!response.ok) {
    throw new Error(`Failed to fetch dataset: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Analyze dataset metadata and schema
 */
export const analyzeDataset = async (datasetId) => {
  const response = await fetch(
    `${API_BASE}/${datasetId}/analyze`,
    getFetchOptions()
  );

  if (!response.ok) {
    throw new Error(`Failed to analyze dataset: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Get column-specific statistics
 */
export const getColumnStats = async (datasetId, columnName) => {
  const response = await fetch(
    `${API_BASE}/${datasetId}/column/${columnName}/stats`,
    getFetchOptions()
  );

  if (!response.ok) {
    throw new Error(`Failed to get column stats: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Group and analyze data
 */
export const groupAndAnalyze = async (datasetId, groupBy, metric) => {
  const response = await fetch(
    `${API_BASE}/${datasetId}/group`,
    getFetchOptions('POST', {
      groupBy,
      metric
    })
  );

  if (!response.ok) {
    throw new Error(`Failed to group data: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Execute complex query
 */
export const queryDataset = async (datasetId, query) => {
  const response = await fetch(
    `${API_BASE}/${datasetId}/query`,
    getFetchOptions('POST', {
      query
    })
  );

  if (!response.ok) {
    throw new Error(`Query failed: ${response.statusText}`);
  }

  return response.json();
};

/**
 * Filter and export data
 */
export const exportData = async (datasetId, filters, sortBy, limit, offset, format = 'json') => {
  const response = await fetch(
    `${API_BASE}/${datasetId}/export`,
    getFetchOptions('POST', {
      filters,
      sortBy,
      limit,
      offset,
      format
    })
  );

  if (!response.ok) {
    throw new Error(`Export failed: ${response.statusText}`);
  }

  if (format === 'csv') {
    // For CSV, return blob
    return response.blob();
  }

  return response.json();
};

/**
 * Download CSV file
 */
export const downloadCSV = async (datasetId, filters, sortBy, limit, offset) => {
  const blob = await exportData(datasetId, filters, sortBy, limit, offset, 'csv');
  
  // Create download link
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `export_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
