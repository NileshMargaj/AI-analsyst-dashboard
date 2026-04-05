import React from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'
import UploadFile from './components/Layout/UploadFile'

const App = () => {
  return (
    <div className="flex min-h-screen bg-[#0B0D12]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 flex justify-center items-center overflow-y-auto bg-[#0B0D12]">
          <UploadFile />
        </main>
      </div>
    </div>
  )
}

export default App