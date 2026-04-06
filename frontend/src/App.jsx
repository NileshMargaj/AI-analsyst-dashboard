import React, { useState } from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import UploadFile from './components/UploadFile'
import Dashboard from './components/Dashboard'

const App = () => {
  const [selectedOption, setSelectedOption] = useState('UploadFile');
  return (
    <div className="flex min-h-screen bg-[#0B0D12]">
      <Sidebar setSelectedOption={setSelectedOption} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 flex justify-center items-center overflow-y-auto bg-[#0B0D12]">
        {
            selectedOption === 'UploadFile' ? <UploadFile /> : <Dashboard />
        }  
        </main>
      </div>
    </div>
  )
}

export default App