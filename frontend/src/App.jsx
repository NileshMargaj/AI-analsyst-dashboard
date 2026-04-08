import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import UploadFile from './components/UploadFile'
import Dashboard from './components/Dashboard'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'

const App = () => {
  return (
    <Router>
      <div className="flex min-h-screen bg-[#0B0D12]">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Header />
          <main className="flex-1 flex justify-center items-center overflow-y-auto bg-[#0B0D12]">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/upload" element={<UploadFile />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App