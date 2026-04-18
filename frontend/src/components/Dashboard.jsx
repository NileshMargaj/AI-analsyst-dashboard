import React, { useState, useEffect } from 'react'
import DataAnalytics from './DataAnalytics'
import AdvancedQuery from './AdvancedQuery'
import DataExporter from './DataExporter'
import BarChartComponent from './charts/BarChart'
import LineChartComponent from './charts/LineChart'
import AIQuery from './AIQuery'
import { BiLoaderAlt } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';

const Dashboard = ({ onDatasetSelect }) => {
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [activeView, setActiveView] = useState('ai-query'); // Default to AI
    const [loadingDatasets, setLoadingDatasets] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDatasets();
    }, []);

    const loadDatasets = async () => {
        try {
            setLoadingDatasets(true);
            const token = localStorage.getItem('token');
            
            if (!token) {
                setError('Please login first to access datasets');
                setLoadingDatasets(false);
                return;
            }

            const response = await fetch('http://localhost:3000/api/uploads', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    setError('Unauthorized: Please login again');
                    localStorage.removeItem('token');
                } else {
                    setError('Failed to load datasets');
                }
                return;
            }
            
            const data = await response.json();
            setDatasets(data.datasets || []);
            
            if (data.datasets && data.datasets.length > 0) {
                const firstDatasetId = data.datasets[0]._id;
                setSelectedDataset(firstDatasetId);
                onDatasetSelect?.(firstDatasetId, data.datasets);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoadingDatasets(false);
        }
    };

    const views = [
        { id: 'ai-query', label: '🤖 AI Query', icon: 'AI' },
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'charts', label: 'Charts', icon: '📉' },
        { id: 'export', label: 'Export', icon: '💾' },
    ];

    const renderView = () => {
        if (!selectedDataset) {
            return (
                <div className="w-full flex items-center justify-center p-12">
                    <p className="text-gray-400">Upload a CSV to start analyzing with AI!</p>
                </div>
            );
        }

        const ChartsView = ({ datasetId }) => {
            const [chartData, setChartData] = useState([]);
            const [loading, setLoading] = useState(true);

            useEffect(() => {
                const fetchCharts = async () => {
                    try {
                        const token = localStorage.getItem('token');
                        const res = await fetch(`http://localhost:3000/api/${datasetId}/analyze`, {
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        const analysis = await res.json();
                        // Sample chart data from analysis
                        const barData = Object.entries(analysis.analysis || {}).slice(0, 5).map(([col, stats]) => ({
                            name: col,
                            value: stats.average || stats.sum || 0
                        }));
                        setChartData(barData);
                    } catch (err) {
                        console.error('Charts load error:', err);
                    } finally {
                        setLoading(false);
                    }
                };
                if (datasetId) fetchCharts();
            }, [datasetId]);

            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChartComponent data={chartData} loading={loading} title="📊 Column Averages" />
                    <LineChartComponent data={chartData} loading={loading} title="📈 Data Trends" />
                </div>
            );
        };

        switch (activeView) {
            case 'ai-query':
                return <AIQuery datasetId={selectedDataset} />;
            case 'analytics':
                return <DataAnalytics datasetId={selectedDataset} />;

            case 'query':
                return <AdvancedQuery datasetId={selectedDataset} />;
            case 'export':
                return <DataExporter datasetId={selectedDataset} />;
            case 'charts':
                return <ChartsView datasetId={selectedDataset} />;
            default:
                return <AIQuery datasetId={selectedDataset} />;
        }
    };

    return (
        <section className='h-full w-full p-3 space-y-6 overflow-y-auto'>
            {/* Dataset Selector */}
            <div className="bg-[#1A1D26] rounded-lg p-6 border border-gray-700">
                <label className="block text-sm font-medium text-gray-300 mb-3">Dataset</label>
                {loadingDatasets ? (
                    <div className="flex items-center gap-2 text-gray-400">
                        <BiLoaderAlt className="animate-spin" />
                        <span>Loading datasets...</span>
                    </div>
                ) : (
                    <select
                        value={selectedDataset || ''}
                        onChange={(e) => {
                            const datasetId = e.target.value;
                            setSelectedDataset(datasetId);
                            setActiveView('ai-query'); // Reset to AI
                            onDatasetSelect?.(datasetId, datasets);
                        }}
                        className="w-full bg-[#0B0D12] border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-violet-500 focus:outline-none transition"
                    >
                        <option value="">Select dataset...</option>
                        {datasets.map((dataset) => (
                            <option key={dataset._id} value={dataset._id}>
                                {dataset.fileName} ({dataset.rowCount?.toLocaleString() || 0} rows)
                            </option>
                        ))}
                    </select>
                )}
                {error && (
                    <div className="mt-3 p-3 bg-red-900/20 border border-red-500/50 rounded text-red-300 text-sm flex items-center gap-2">
                        <FiAlertCircle />
                        {error}
                    </div>
                )}
            </div>

            {/* AI Query - Main View */}
            {selectedDataset ? (
                <div className="bg-[#1A1D26] rounded-2xl border border-gray-700 p-1">
                    <div className="flex overflow-x-auto bg-gray-900/50 rounded-xl">
                        {views.map((view) => (
                            <button
                                key={view.id}
                                onClick={() => setActiveView(view.id)}
                                className={`px-6 py-3 whitespace-nowrap text-sm font-medium transition-all flex items-center gap-2 ${
                                    activeView === view.id
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
                                }`}
                            >
                                <span>{view.icon}</span>
                                <span>{view.label}</span>
                            </button>
                        ))}
                    </div>
                    <div className="p-6">
                        {renderView()}
                    </div>
                </div>
            ) : (
                <div className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/30 p-12 rounded-2xl text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">🤖 AI Analytics Dashboard</h2>
                    <p className="text-gray-300 mb-8 max-w-md mx-auto leading-relaxed">
                        Upload your CSV data and ask questions in plain English. 
                        Get instant charts, insights, and analysis powered by AI.
                    </p>
                    <div className="bg-[#1A1D26] p-8 rounded-xl border border-gray-700 max-w-2xl mx-auto">
                        <h3 className="text-lg font-semibold text-violet-400 mb-4">Try these:</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-sm">
                                "Top 5 products"
                            </div>
                            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-sm">
                                "Sales by month"
                            </div>
                            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-600 text-sm">
                                "Best region"
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Dashboard;

