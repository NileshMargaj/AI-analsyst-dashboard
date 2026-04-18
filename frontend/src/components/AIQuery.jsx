import React, { useState } from 'react';
import { BiLoaderAlt, BiSearch, BiError } from 'react-icons/bi';
import { queryAI } from '../services/aiService.js';
import BarChartComponent from './charts/BarChart';
import LineChartComponent from './charts/LineChart';

const AIQuery = ({ datasetId }) => {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryExamples] = useState([
    'Top 5 products by revenue',
    'Sales trend by month',
    'Average profit by region',
    'Highest revenue category'
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim() || !datasetId) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await queryAI(datasetId, query.trim());
      setResult(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getChartComponent = () => {
    if (!result?.chartData?.length) return null;

    // Dynamic chart type based on operation
    const operation = result.structuredQuery?.operation || 'bar';
    
    switch (operation) {
      case 'trend':
        return <LineChartComponent data={result.chartData} title="📈 Trend Analysis" />;
      case 'top':
      case 'sum':
      case 'average':
      default:
        return <BarChartComponent data={result.chartData} title="📊 Top Results" />;
    }
  };

  if (!datasetId) {
    return (
      <div className="bg-[#1A1D26] p-8 rounded-lg border border-dashed border-gray-700 text-center">
        <p className="text-gray-400 mb-4">Select a dataset to start querying</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Query Input */}
      <form onSubmit={handleSubmit} className="bg-[#1A1D26] p-6 rounded-xl border border-gray-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask anything about your data... e.g. 'Top 5 products by sales'"
            className="flex-1 bg-[#0B0D12] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-violet-500 focus:outline-none transition"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-600 px-6 py-3 rounded-lg font-medium flex items-center gap-2 transition-all disabled:cursor-not-allowed"
          >
            {loading ? (
              <BiLoaderAlt className="animate-spin w-4 h-4" />
            ) : (
              <BiSearch className="w-4 h-4" />
            )}
            {loading ? 'Analyzing...' : 'Run'}
          </button>
        </div>

        {/* Examples */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <p className="text-sm text-gray-400 mb-2">Try these:</p>
          <div className="flex flex-wrap gap-2">
            {queryExamples.map((example, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(example)}
                className="text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-violet-300 border border-gray-600 transition"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      </form>

      {/* Results */}
      {loading && (
        <div className="bg-[#1A1D26] p-8 rounded-lg border border-gray-700 text-center animate-pulse">
          <BiLoaderAlt className="w-12 h-12 text-violet-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-400">AI is analyzing your query...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-2">
            <BiError className="w-5 h-5 text-red-400" />
            <h3 className="font-medium text-red-300">Query failed</h3>
          </div>
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {result && (
        <div className="space-y-6">
          {/* Insight */}
          <div className="bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/30 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-3">
              💡 AI Insight
            </h3>
            <p className="text-gray-200 text-lg leading-relaxed">{result.insight}</p>
            <p className="text-sm text-gray-400 mt-2">
              Query: "{result.query}" → {result.metadata?.operations?.join(', ') || 'processed'}
            </p>
          </div>

          {/* Chart */}
          <div className="bg-[#1A1D26] border border-gray-700 rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-6 text-white">📊 Visualization</h3>
            {getChartComponent() || (
              <div className="h-80 flex items-center justify-center bg-gray-900/50 rounded-lg">
                <p className="text-gray-400">No chart data available for this query</p>
              </div>
            )}
          </div>

          {/* Raw Data Preview */}
          {result.rawData?.length > 0 && (
            <div className="bg-[#1A1D26] border border-gray-700 rounded-xl overflow-hidden">
              <div className="bg-gray-900/50 px-6 py-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  📋 Raw Results ({result.rawData.length} rows)
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      {Object.keys(result.rawData[0] || {}).map((key) => (
                        <th key={key} className="px-4 py-3 text-left text-gray-300 font-medium bg-gray-900/50">
                          {key}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rawData.slice(0, 10).map((row, idx) => (
                      <tr key={idx} className="border-b border-gray-700 hover:bg-gray-900/30 transition">
                        {Object.values(row).map((value, i) => (
                          <td key={i} className="px-4 py-3 text-gray-300">
                            {typeof value === 'number' ? value.toLocaleString() : value}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {result.rawData.length > 10 && (
                <div className="px-6 py-4 bg-gray-900/50 border-t border-gray-700 text-center">
                  <p className="text-gray-400 text-sm">
                    Showing first 10 of {result.rawData.length} rows
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIQuery;

