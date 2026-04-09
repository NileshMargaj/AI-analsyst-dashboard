import React, { useState, useEffect } from 'react';
import { queryDataset, analyzeDataset } from '../services/dataProcessorAPI';
import { BiLoaderAlt } from 'react-icons/bi';
import { FiAlertCircle, FiX, FiPlus } from 'react-icons/fi';

const AdvancedQuery = ({ datasetId }) => {
  const [columns, setColumns] = useState([]);
  const [filters, setFilters] = useState([{ field: '', operator: '=', value: '' }]);
  const [groupBy, setGroupBy] = useState('');
  const [metrics, setMetrics] = useState([{ type: 'count', field: '' }]);
  const [sortField, setSortField] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [limit, setLimit] = useState(10);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (datasetId) {
      loadColumns();
    }
  }, [datasetId]);

  const loadColumns = async () => {
    try {
      const analysis = await analyzeDataset(datasetId);
      setColumns(analysis.dataset.columns);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleExecuteQuery = async () => {
    try {
      setLoading(true);
      setError(null);

      const query = {
        filter: filters.filter((f) => f.field && f.value),
        groupBy: groupBy || undefined,
        metric: metrics.filter((m) => m.field),
        sort: sortField ? [{ field: sortField, order: sortOrder }] : undefined,
        limit: limit || undefined
      };

      const result = await queryDataset(datasetId, query);
      setResults(result);
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

  const updateMetric = (idx, key, value) => {
    const newMetrics = [...metrics];
    newMetrics[idx][key] = value;
    setMetrics(newMetrics);
  };

  const OPERATORS = ['=', '!=', '>', '<', '>=', '<=', 'contains', 'starts_with', 'ends_with'];
  const METRIC_TYPES = ['count', 'sum', 'average', 'min', 'max'];

  return (
    <div className="w-full space-y-4">
      {/* Query Builder */}
      <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700 space-y-4">
        <h3 className="text-white font-semibold">Advanced Query</h3>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm text-gray-400">Filters</label>
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

        {/* Group By */}
        <div>
          <label className="block text-sm text-gray-400 mb-2">Group By</label>
          <select
            value={groupBy}
            onChange={(e) => setGroupBy(e.target.value)}
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

        {/* Metrics */}
        {groupBy && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-400">Metrics</label>
              <button
                onClick={() => setMetrics([...metrics, { type: 'count', field: '' }])}
                className="text-violet-400 text-sm flex items-center gap-1 hover:text-violet-300"
              >
                <FiPlus className="text-sm" />
                Add Metric
              </button>
            </div>

            {metrics.map((metric, idx) => (
              <div key={idx} className="flex gap-2">
                <select
                  value={metric.type}
                  onChange={(e) => updateMetric(idx, 'type', e.target.value)}
                  className="w-32 bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  {METRIC_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>

                <select
                  value={metric.field}
                  onChange={(e) => updateMetric(idx, 'field', e.target.value)}
                  className="flex-1 bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2 text-sm"
                >
                  <option value="">Field...</option>
                  {columns.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>

                {metrics.length > 1 && (
                  <button
                    onClick={() => setMetrics(metrics.filter((_, i) => i !== idx))}
                    className="p-2 text-red-400 hover:text-red-300"
                  >
                    <FiX />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Sort & Limit */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
        </div>

        <button
          onClick={handleExecuteQuery}
          disabled={loading}
          className="w-full py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <BiLoaderAlt className="animate-spin text-sm" />
              <span>Executing Query...</span>
            </>
          ) : (
            <span>Execute Query</span>
          )}
        </button>

        {error && (
          <div className="text-red-400 text-sm flex items-center gap-2">
            <FiAlertCircle />
            {error}
          </div>
        )}
      </div>

      {/* Results */}
      {results && (
        <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700">
          <h3 className="text-white font-semibold mb-4">Query Results</h3>
          <div className="bg-[#0B0D12] p-4 rounded max-h-96 overflow-y-auto">
            <pre className="text-gray-300 text-sm font-mono whitespace-pre-wrap break-words">
              {JSON.stringify(results.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedQuery;
