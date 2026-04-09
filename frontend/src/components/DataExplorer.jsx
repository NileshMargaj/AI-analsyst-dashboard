import React, { useState, useEffect } from 'react';
import { getDataset } from '../services/dataProcessorAPI';
import { BiLoaderAlt, BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';

const DataExplorer = ({ datasetId }) => {
  const [data, setData] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (datasetId) {
      loadData();
    }
  }, [datasetId, currentPage, limit]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getDataset(datasetId, currentPage, limit);
      setData(result.data);
      setPagination(result.pagination);
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
        <span className="text-gray-400">Loading data...</span>
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

  if (!data || data.length === 0) {
    return (
      <div className="w-full p-6 bg-[#1A1D26] rounded-lg text-center text-gray-400">
        No data available
      </div>
    );
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="w-full space-y-4">
      {/* Table */}
      <div className="bg-[#1A1D26] rounded-lg border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700 bg-[#0B0D12]">
                {columns.map((col) => (
                  <th key={col} className="px-4 py-3 text-left text-sm font-semibold text-gray-300">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx} className="border-b border-gray-700/50 hover:bg-[#0B0D12]/50 transition">
                  {columns.map((col) => (
                    <td key={`${idx}-${col}`} className="px-4 py-3 text-sm text-gray-300">
                      {String(row[col] ?? '-').slice(0, 50)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="bg-[#1A1D26] rounded-lg p-4 border border-gray-700 flex items-center justify-between">
          <div className="text-sm text-gray-400">
            Page {pagination.currentPage} of {pagination.totalPages} ({pagination.totalItems} total)
          </div>

          <div className="flex items-center gap-4">
            <select
              value={limit}
              onChange={(e) => {
                setLimit(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-1.5 text-sm"
            >
              <option value={10}>10 rows</option>
              <option value={20}>20 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>

            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 bg-[#0B0D12] border border-gray-700 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BiChevronLeft className="text-gray-400" />
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                disabled={currentPage === pagination.totalPages}
                className="p-2 bg-[#0B0D12] border border-gray-700 rounded hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <BiChevronRight className="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataExplorer;
