import React, { useState, useEffect } from 'react'
import Query from './Query'
import DataAnalytics from './DataAnalytics'
import DataExplorer from './DataExplorer'
import GroupAnalyzer from './GroupAnalyzer'
import AdvancedQuery from './AdvancedQuery'
import DataExporter from './DataExporter'
import BarChartComponent from './charts/BarChart'
import LineChartComponent from './charts/LineChart'
import { FaArrowRight } from "react-icons/fa";
import { BiLoaderAlt } from 'react-icons/bi';
import { FiAlertCircle } from 'react-icons/fi';
import Card from './Card';

const Dashboard = ({ onDatasetSelect }) => {
    const [datasets, setDatasets] = useState([]);
    const [selectedDataset, setSelectedDataset] = useState(null);
    const [activeView, setActiveView] = useState('analytics');
    const [loadingDatasets, setLoadingDatasets] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadDatasets();
    }, []);

    const loadDatasets = async () => {
        try {
            setLoadingDatasets(true);
            const token = localStorage.getItem('token');
            
            // Check if token exists
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
        { id: 'analytics', label: 'Analytics', icon: '📊' },
        { id: 'charts', label: 'Charts', icon: '📉' },
        { id: 'explorer', label: 'Data Explorer', icon: '📋' },
        { id: 'group', label: 'Group Analysis', icon: '📈' },
        { id: 'query', label: 'Advanced Query', icon: '🔍' },
        { id: 'export', label: 'Export Data', icon: '💾' },
    ];

    const renderView = () => {
        if (!selectedDataset) {
            return (
                <div className="w-full flex items-center justify-center p-12">
                    <p className="text-gray-400">No datasets available. Please upload a CSV file first.</p>
                </div>
            );
        }

        const ChartsView = ({ datasetId }) => {
            const [chartData, setChartData] = useState({ bar: [], line: [] });
            const [loading, setLoading] = useState(true);
            const [error, setError] = useState(null);

            useEffect(() => {
                if (!datasetId) {
                    setLoading(false);
                    return;
                }

                const dummyBarData = [
                    { name: 'Jan', value: 400 },
                    { name: 'Feb', value: 300 },
                    { name: 'Mar', value: 500 },
                    { name: 'Apr', value: 450 },
                    { name: 'May', value: 600 },
                    { name: 'Jun', value: 550 },
                ];

                const dummyLineData = [
                    { name: 'Week 1', value: 200 },
                    { name: 'Week 2', value: 250 },
                    { name: 'Week 3', value: 300 },
                    { name: 'Week 4', value: 280 },
                    { name: 'Week 5', value: 350 },
                    { name: 'Week 6', value: 400 },
                ];

                const timer = setTimeout(() => {
                    setChartData({ bar: dummyBarData, line: dummyLineData });
                    setLoading(false);
                }, 800);

                return () => clearTimeout(timer);
            }, [datasetId]);

            if (loading) {
                return (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[500px]">
                        <div className="bg-[#1A1D26] rounded-lg border border-gray-700 p-6 flex items-center justify-center">
                            <BiLoaderAlt className="w-12 h-12 text-violet-500 animate-spin" />
                        </div>
                        <div className="bg-[#1A1D26] rounded-lg border border-gray-700 p-6 flex items-center justify-center">
                            <BiLoaderAlt className="w-12 h-12 text-violet-500 animate-spin" />
                        </div>
                    </div>
                );
            }

            if (error) {
                return (
                    <div className="col-span-full flex flex-col items-center justify-center p-12 bg-[#1A1D26] rounded-lg border border-gray-700 text-gray-400">
                        <FiAlertCircle className="w-12 h-12 mb-2 text-red-400" />
                        <p>{error}</p>
                    </div>
                );
            }

            return (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <BarChartComponent data={chartData.bar} loading={false} title="📊 Monthly Sales" />
                    <LineChartComponent data={chartData.line} loading={false} title="📈 Trend Analysis" />
                </div>
            );
        };

        switch (activeView) {
            case 'analytics':
                return <DataAnalytics datasetId={selectedDataset} />;
            case 'explorer':
                return <DataExplorer datasetId={selectedDataset} />;
            case 'group':
                return <GroupAnalyzer datasetId={selectedDataset} />;
            case 'query':
                return <AdvancedQuery datasetId={selectedDataset} />;
            case 'export':
                return <DataExporter datasetId={selectedDataset} />;
            case 'charts':
                return <ChartsView datasetId={selectedDataset} />;
            default:
                return <DataAnalytics datasetId={selectedDataset} />;
        }
    };

    return (
        <>
            <section className='h-full w-full p-3 space-y-4 overflow-y-auto'>
                {/* Dataset Selection */}
                <div className="bg-[#1A1D26] rounded-lg p-4 border border-gray-700">
                    <label className="block text-sm text-gray-400 mb-2">Select Dataset</label>
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
                                onDatasetSelect?.(datasetId, datasets);
                            }}
                            className="w-full bg-[#0B0D12] text-gray-300 border border-gray-700 rounded px-3 py-2"
                        >
                            <option value="">Choose a dataset...</option>
                            {datasets.map((dataset) => (
                                <option key={dataset._id} value={dataset._id}>
                                    {dataset.fileName} ({dataset.rowCount || 0} rows)
                                </option>
                            ))}
                        </select>
                    )}
                    {error && (
                        <div className="text-red-400 text-sm flex items-center gap-2 mt-2">
                            <FiAlertCircle />
                            {error}
                        </div>
                    )}
                </div>

                {/* View Tabs */}
                {selectedDataset && (
                    <div className="bg-[#1A1D26] rounded-lg border border-gray-700 overflow-hidden">
                        <div className="flex overflow-x-auto border-b border-gray-700">
                            {views.map((view) => (
                                <button
                                    key={view.id}
                                    onClick={() => setActiveView(view.id)}
                                    className={`px-4 py-3 whitespace-nowrap text-sm font-medium transition-colors ${
                                        activeView === view.id
                                            ? 'bg-violet-600 text-white border-b-2 border-violet-600'
                                            : 'text-gray-400 hover:text-gray-300'
                                    }`}
                                >
                                    <span>{view.icon} {view.label}</span>
                                </button>
                            ))}
                        </div>
                        
                        <div className="p-4">
                            {renderView()}
                        </div>
                    </div>
                )}

                {/* Original Content */}
                {!selectedDataset && (
                    <>
                        <div className="w-full rounded-lg p-4 flex flex-col gap-4">
                            <p className='text-white text-md font-medium'>ASK A QUESTION ?</p>
                            <div className='w-full flex items-center gap-4'>
                                <input type="text"
                                    placeholder='Type your question here...'
                                    className='py-2.5 w-[80%] pl-2.5  border border-gray-300 text-gray-300 bg-transparent focus:outline-none rounded-lg text-sm' />
                                <button
                                    className="py-2.5 px-5 bg-violet-600 text-white rounded-lg hover:bg-violet-700 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-400 flex items-center gap-2"
                                >
                                    <FaArrowRight className="text-sm" />
                                    <span className="text-sm font-medium">Run</span>
                                </button>
                            </div>
                            <Query />
                        </div>
                        <div className='w-full h-[200px] mt-4 rounded-lg p-4 flex items-center justify-start gap-4'>
                            <Card title={'TOTAL REVENUE'} amount={'$2.4M'} />
                            <Card title={'UNIT SOLD'} amount={'41,209'} />
                            <Card title={'AVG PROFIT MARGIN'} amount={'25.5%'} />
                            <Card title={'ACTIVE CUSTOMERS'} amount={'1,500'} />
                        </div>
                    </>
                )}
            </section>
        </>
    )
}

export default Dashboard