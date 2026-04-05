import React from 'react'
import Sidebar from './components/Layout/Sidebar'
import Header from './components/Layout/Header'

const App = () => {
  return (
    <div className="flex min-h-screen bg-[#0B0D12]">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <main className="flex-1 p-5 overflow-y-auto bg-[#0B0D12]">
        </main>
      </div>
    </div>
  )
}

export default App