import React, { useState, useEffect } from 'react';
import { analyzeDataset } from '../services/dataProcessorAPI';
import { BiLoaderAlt } from 'react-icons/bi';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';

// Add style to hide scrollbars
const hideScrollbarStyle = `
  .hide-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .hide-scrollbar::-webkit-scrollbar {
    display: none;
  }
`;

const DataAnalytics = ({ datasetId }) => {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (datasetId) {
      loadAnalysis();
    }
  }, [datasetId]);

  const loadAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await analyzeDataset(datasetId);
      setAnalysis(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-6 bg-[#1A1D26] rounded-lg flex items-center justify-center gap-3">
        <BiLoaderAlt className="animate-spin text-violet-500 text-xl" />
        <span className="text-gray-400">Analyzing dataset...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-[#1A1D26] rounded-lg border border-red-500/30">
        <div className="flex items-center gap-3 text-red-400">
          <FiAlertCircle />
          <span>{error}</span>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const { dataset, analysis: columnAnalysis } = analysis;

  return (
    <>
      <style>{hideScrollbarStyle}</style>
      <div className="w-full space-y-4">
      {/* Dataset Overview */}
      <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">Dataset Overview</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0B0D12] p-4 rounded-lg">
            <p className="text-gray-400 text-sm">File Name</p>
            <p className="text-white font-medium mt-1 truncate">{dataset.fileName}</p>
          </div>
          <div className="bg-[#0B0D12] p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Total Rows</p>
            <p className="text-white font-medium mt-1">{dataset.rowCount.toLocaleString()}</p>
          </div>
          <div className="bg-[#0B0D12] p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Columns</p>
            <p className="text-white font-medium mt-1">{dataset.columnCount}</p>
          </div>
          <div className="bg-[#0B0D12] p-4 rounded-lg">
            <p className="text-gray-400 text-sm">Data Type</p>
            <p className="text-white font-medium mt-1">CSV</p>
          </div>
        </div>
      </div>

      {/* Column Analysis */}
      <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700">
        <h3 className="text-white font-semibold mb-4">Column Statistics</h3>
        <div className="space-y-3 max-h-96 overflow-y-auto hide-scrollbar">
          {dataset.columns.map((col) => {
            const stats = columnAnalysis[col];
            if (!stats) return null;

            return (
              <div key={col} className="bg-[#0B0D12] p-4 rounded-lg border border-gray-700/50">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-white font-medium">{col}</p>
                    <p className="text-gray-400 text-sm">Type: {stats.type}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-violet-500/20 text-violet-400 rounded">
                    {stats.type}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Total</p>
                    <p className="text-gray-300">{stats.count}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Missing</p>
                    <p className={stats.missing > 0 ? 'text-yellow-400' : 'text-green-400'}>
                      {stats.missing}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Distinct</p>
                    <p className="text-gray-300">{stats.distinct || 'N/A'}</p>
                  </div>
                  {stats.type === 'number' && (
                    <>
                      <div>
                        <p className="text-gray-500 text-xs">Average</p>
                        <p className="text-gray-300">
                          {typeof stats.average === 'number' ? stats.average.toFixed(2) : 'N/A'}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {stats.type === 'number' && (
                  <div className="mt-3 pt-3 border-t border-gray-700 grid grid-cols-3 gap-2 text-sm">
                    <div>
                      <p className="text-gray-500 text-xs">Min</p>
                      <p className="text-gray-300">
                        {typeof stats.min === 'number' ? stats.min.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Max</p>
                      <p className="text-gray-300">
                        {typeof stats.max === 'number' ? stats.max.toFixed(2) : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Sum</p>
                      <p className="text-gray-300">
                        {typeof stats.sum === 'number' ? stats.sum.toLocaleString() : 'N/A'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
    </>
  );
};

export default DataAnalytics;
