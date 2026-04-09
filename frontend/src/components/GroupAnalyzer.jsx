import React, { useState, useEffect } from 'react';
import { groupAndAnalyze, analyzeDataset } from '../services/dataProcessorAPI';
import { BiLoaderAlt } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';

const GroupAnalyzer = ({ datasetId }) => {
  const [columns, setColumns] = useState([]);
  const [numericColumns, setNumericColumns] = useState([]);
  const [groupBy, setGroupBy] = useState('');
  const [metric, setMetric] = useState('');
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
      const cols = analysis.dataset.columns;
      setColumns(cols);

      // Split numeric and non-numeric columns
      const numeric = [];
      Object.entries(analysis.dataset.schema).forEach(([col, type]) => {
        if (type === 'number') {
          numeric.push(col);
        }
      });
      setNumericColumns(numeric);

      // Auto-select first numeric column
      if (numeric.length > 0) {
        setMetric(numeric[0]);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAnalyze = async () => {
    if (!groupBy || !metric) {
      setError('Please select both groupBy and metric fields');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await groupAndAnalyze(datasetId, groupBy, metric);
      setResults(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Controls */}
      <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700 space-y-4">
        <h3 className="text-white font-semibold">Group & Analyze Data</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Group By Column</label>
            <select
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
            >
              <option value="">Select column...</option>
              {columns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Metric Column (Numeric)</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
            >
              <option value="">Select numeric column...</option>
              {numericColumns.map((col) => (
                <option key={col} value={col}>
                  {col}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!groupBy || !metric || loading}
          className="w-full py-2.5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <BiLoaderAlt className="animate-spin text-sm" />
              <span>Analyzing...</span>
            </>
          ) : (
            <span>Analyze Groups</span>
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
        <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700 space-y-4">
          <h3 className="text-white font-semibold">
            Results ({results.groupCount} groups)
          </h3>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(results.analysis).map(([groupKey, stats]) => (
              <div key={groupKey} className="bg-[#0B0D12] p-4 rounded-lg border border-gray-700/50">
                <p className="text-white font-medium mb-3">{groupKey}</p>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Count</p>
                    <p className="text-gray-300 font-medium">{stats.count}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Sum</p>
                    <p className="text-gray-300 font-medium">
                      {typeof stats.sum === 'number' ? stats.sum.toLocaleString() : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Average</p>
                    <p className="text-gray-300 font-medium">
                      {typeof stats.average === 'number' ? stats.average.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Min</p>
                    <p className="text-gray-300 font-medium">
                      {typeof stats.min === 'number' ? stats.min.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Max</p>
                    <p className="text-gray-300 font-medium">
                      {typeof stats.max === 'number' ? stats.max.toFixed(2) : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupAnalyzer;
