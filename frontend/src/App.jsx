import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import UploadFile from './components/UploadFile'
import Dashboard from './components/Dashboard'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import NotFound from './components/NotFound';

const App = () => {
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleDatasetSelect = (datasetId, datasetList) => {
    setSelectedDataset(datasetId);
    setDatasets(datasetList);
  };

  const getSelectedDatasetName = () => {
    if (!selectedDataset || !datasets.length) return null;
    const dataset = datasets.find(d => d._id === selectedDataset);
    return dataset ? dataset.fileName : null;
  };

  return (
    <Router>
      <div className="flex h-screen overflow-hidden bg-[#0B0D12]">
        {/* Desktop sidebar */}
        <div className="hidden md:block">
          <Sidebar variant="desktop" />
        </div>

        {/* Mobile sidebar + backdrop */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 z-40 bg-black/60 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        <div className={`md:hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
          <Sidebar variant="mobile" onClose={() => setIsSidebarOpen(false)} />
        </div>

        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header
            fileName={getSelectedDatasetName()}
            onMenuClick={() => setIsSidebarOpen(true)}
            isSidebarOpen={isSidebarOpen}
            onCloseSidebar={() => setIsSidebarOpen(false)}
          />
          <main className="flex-1 overflow-y-auto min-w-0 bg-[#0B0D12] px-3 sm:px-4 lg:px-6">
            <Routes>
              <Route path="/" element={<Dashboard onDatasetSelect={handleDatasetSelect} />} />
              <Route path="/upload" element={<UploadFile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
