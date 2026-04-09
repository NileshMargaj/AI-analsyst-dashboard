import React, { useState, useEffect } from 'react';
import { analyzeDataset, downloadCSV, exportData } from '../services/dataProcessorAPI';
import { BiLoaderAlt, BiDownload } from 'react-icons/bi';
import { FiAlertCircle, FiX, FiPlus } from 'react-icons/fi';

const DataExporter = ({ datasetId }) => {
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState([{ field: '', operator: '=', value: '' }]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [limit, setLimit] = useState(100);
  const [offset, setOffset] = useState(0);
  const [format, setFormat] = useState('csv');
  const [fileName, setFileName] = useState('export');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    if (datasetId) {
      loadColumns();
    }
  }, [datasetId]);

  const loadColumns = async () => {
    try {
      const analysis = await analyzeDataset(datasetId);
      setColumns(analysis.dataset.columns);
      setRowCount(analysis.dataset.rowCount);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGeneratePreview = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterObj = filters.filter((f) => f.field && f.value);
      const result = await exportData(
        datasetId,
        filterObj,
        sortField ? { field: sortField, order: sortOrder } : undefined,
        Math.min(5, limit), // Preview first 5 rows
        offset,
        format
      );

      // Extract data from response
      if (format === 'csv') {
        // Convert blob to text for preview
        const text = await result.text();
        setPreview(text);
      } else {
        setPreview(result.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoading(true);
      setError(null);

      const filterObj = filters.filter((f) => f.field && f.value);

      if (format === 'csv') {
        await downloadCSV(
          datasetId,
          filterObj,
          sortField ? { field: sortField, order: sortOrder } : undefined,
          limit,
          offset
        );
      } else {
        const result = await exportData(
          datasetId,
          filterObj,
          sortField ? { field: sortField, order: sortOrder } : undefined,
          limit,
          offset,
          format
        );

        const dataStr = JSON.stringify(result.data, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${fileName}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateFilter = (idx, key, value) => {
    const newFilters = [...filters];
    newFilters[idx][key] = value;
    setFilters(newFilters);
  };

  const OPERATORS = ['=', '!=', '>', '<', '>=', '<=', 'contains', 'starts_with', 'ends_with'];

  return (
    <div className="w-full space-y-4">
      <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700 space-y-4">
        <h3 className="text-white font-semibold">Export Data</h3>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">Filters (Optional)</label>
            <button
              onClick={() => setFilters([...filters, { field: '', operator: '=', value: '' }])}
              className="text-violet-400 text-sm flex items-center gap-1 hover:text-violet-300"
            >
              <FiPlus className="text-sm" />
              Add Filter
            </button>
          </div>

          {filters.map((filter, idx) => (
            <div key={idx} className="flex gap-2 items-end">
              <select
                value={filter.field}
                onChange={(e) => updateFilter(idx, 'field', e.target.value)}
                className="flex-1 bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2 text-sm"
              >
                <option value="">Column...</option>
                {columns.map((col) => (
                  <option key={col} value={col}>
                    {col}
                  </option>
                ))}
              </select>

              <select
                value={filter.operator}
                onChange={(e) => updateFilter(idx, 'operator', e.target.value)}
                className="w-20 bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-2 py-2 text-sm"
              >
                {OPERATORS.map((op) => (
                  <option key={op} value={op}>
                    {op}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={filter.value}
                onChange={(e) => updateFilter(idx, 'value', e.target.value)}
                placeholder="Value"
                className="flex-1 bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2 text-sm"
              />

              {filters.length > 1 && (
                <button
                  onClick={() => setFilters(filters.filter((_, i) => i !== idx))}
                  className="p-2 text-red-400 hover:text-red-300"
                >
                  <FiX />
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Sort & Pagination */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Sort By</label>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value)}
              className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
            >
              <option value="">None</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Order</label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Limit</label>
            <input
              type="number"
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value))}
              className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Offset</label>
            <input
              type="number"
              value={offset}
              onChange={(e) => setOffset(Number(e.target.value))}
              className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Export Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
            >
              <option value="csv">CSV</option>
              <option value="json">JSON</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">File Name</label>
            <input
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              placeholder="export"
              className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-[#0B0D12] p-3 rounded text-xs text-gray-400">
          <p>Total rows in dataset: <span className="text-violet-400 font-semibold">{rowCount}</span></p>
          <p>Will export up to <span className="text-violet-400 font-semibold">{limit}</span> rows starting from offset <span className="text-violet-400 font-semibold">{offset}</span></p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleGeneratePreview}
            disabled={loading}
            className="flex-1 py-2.5 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? 'Loading...' : 'Preview'}
          </button>

          <button
            onClick={handleExport}
            disabled={loading}
            className="flex-1 py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <BiLoaderAlt className="animate-spin text-sm" />
                <span>Exporting...</span>
              </>
            ) : (
              <>
                <BiDownload />
                <span>Export & Download</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle />
            {error}
          </div>
        )}
      </div>

      {/* Preview */}
      {preview && (
        <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Preview (First 5 Records)</h3>
          
          {format === 'csv' ? (
            <div className="bg-[#0B0D12] p-4 rounded overflow-x-auto">
              <pre className="text-gray-300 text-xs font-mono whitespace-pre-wrap break-words">
                {preview}
              </pre>
            </div>
          ) : (
            <div className="bg-[#0B0D12] p-4 rounded overflow-y-auto max-h-96">
              <table className="w-full text-sm text-gray-300">
                <thead className="border-b border-gray-700">
                  <tr>
                    {columns.map((col) => (
                      <th key={col} className="text-left py-2 px-3 text-violet-400">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Array.isArray(preview) &&
                    preview.map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-800">
                        {columns.map((col) => (
                          <td key={col} className="py-2 px-3 truncate max-w-xs">
                            {String(row[col] || '-').substring(0, 50)}
                          </td>
                        ))}
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataExporter;
