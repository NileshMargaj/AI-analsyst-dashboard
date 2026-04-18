import React, { useState, useEffect } from 'react';
import { analyzeDataset, downloadCSV, exportData } from '../services/dataProcessorAPI';
import { BiLoaderAlt, BiDownload } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';

const DataExporter = ({ datasetId }) => {
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);
  const [rowCount, setRowCount] = useState(0);

  useEffect(() => {
    if (datasetId) {
      loadDatasetInfo();
    }
  }, [datasetId]);

  const loadDatasetInfo = async () => {
    try {
      const analysis = await analyzeDataset(datasetId);
      setRowCount(analysis.dataset.rowCount);
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePreview = async () => {
    try {
      setLoadingPreview(true);
      setError(null);
      const result = await exportData(datasetId, [], null, 5, 0);
      setPreview(result);
    } catch (err) {
      setError('Preview failed: ' + err.message);
    } finally {
      setLoadingPreview(false);
    }
  };

  const handleExport = async () => {
    try {
      setLoadingExport(true);
      setError(null);
      await downloadCSV(datasetId, [], null, rowCount, 0);
    } catch (err) {
      setError('Export failed: ' + err.message);
    } finally {
      setLoadingExport(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700 space-y-4">
        <h3 className="text-white font-semibold text-lg mb-4">Export Dataset</h3>
        
        <div className="bg-[#0B0D12] p-4 rounded-lg text-sm text-gray-400">
          <p><span className="text-violet-400 font-semibold">{rowCount.toLocaleString()}</span> total rows</p>
          <p>Preview shows first 5 rows, export downloads all rows as CSV</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handlePreview}
            disabled={loadingPreview}
            className="flex-1 py-3 px-6 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loadingPreview ? (
              <>
                <BiLoaderAlt className="animate-spin" />
                Previewing...
              </>
            ) : (
              'Preview Data'
            )}
          </button>

          <button
            onClick={handleExport}
            disabled={loadingExport}
            className="flex-1 py-3 px-6 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-700 hover:to-purple-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loadingExport ? (
              <>
                <BiLoaderAlt className="animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <BiDownload />
                Export CSV
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-300 text-sm flex items-center gap-2">
            <FiAlertCircle />
            {error}
          </div>
        )}
      </div>

      {preview && (
        <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-white font-semibold">Data Preview (First 5 Rows)</h4>
            <button
              onClick={() => setPreview(null)}
              className="text-gray-400 hover:text-white text-sm"
            >
              Close
            </button>
          </div>
          {Array.isArray(preview.data) && preview.data.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-gray-700 bg-gray-900/50">
                    {Object.keys(preview.data[0]).map((col) => (
                      <th key={col} className="text-left py-2 px-3 text-violet-400 font-medium">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.data.map((row, idx) => (
                    <tr key={idx} className="border-b border-gray-800 hover:bg-gray-800/50">
                      {Object.values(row).map((val, colIdx) => (
                        <td key={colIdx} className="py-2 px-3 max-w-xs truncate text-gray-300">
                          {String(val || '-')}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400">
              No data to preview
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DataExporter;
