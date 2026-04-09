import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
      <div className="flex h-screen bg-[#0B0D12]">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header fileName={getSelectedDatasetName()} />
          <main className="flex-1 flex justify-center items-center overflow-hidden bg-[#0B0D12]">
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