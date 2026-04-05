import React from 'react'
import logo from '../../assets/logo.png'

const Sidebar = () => {
  return (
    <aside className="w-[200px] min-h-screen bg-[#0F1117] border-r border-[#1C1F2E] flex flex-col px-2.5 py-4 shrink-0">
      <section>
        <p className="text-[13px] font-bold text-[#E2E4EF] tracking-wide">
          <span>
            <img src={logo} alt="DataLens AI Logo" className="w-8 h-8 inline-block mr-1" />
          </span>
          Analyst AI
        </p>
      </section>
      <section className="flex flex-col gap-2 mt-4">
        <div className="text-[14px] text-[#E2E4EF] hover:bg-[#1C1F2E] rounded-lg px-3 py-2 transition-colors">
          Dashboard
        </div>
        <div className="text-[14px] text-[#E2E4EF] hover:bg-[#1C1F2E] rounded-lg px-3 py-2 transition-colors">
          Upload
        </div>
        <div className="text-[14px] text-[#E2E4EF] hover:bg-[#1C1F2E] rounded-lg px-3 py-2 transition-colors">
          Trends
        </div>
        <div className="text-[14px] text-[#E2E4EF] hover:bg-[#1C1F2E] rounded-lg px-3 py-2 transition-colors">
          Ask anything
        </div>
        <div className="text-[14px] text-[#E2E4EF] hover:bg-[#1C1F2E] rounded-lg px-3 py-2 transition-colors">
          Reports
        </div>
      </section>
    </aside>
  )
}

export default Sidebar