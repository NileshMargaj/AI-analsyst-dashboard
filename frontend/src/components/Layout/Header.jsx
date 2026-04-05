import React from 'react'

const Header = ({ fileName = null }) => {
  return (
    <header className="h-12 w-full bg-[#0B0D12] border-b border-[#1C1F2E] flex items-center px-5 gap-3 shrink-0">

      <span className="text-[14px] font-bold text-[#E2E4EF]">
        Overview
      </span>

      {/* File chip */}
      <div className="flex items-center gap-1.5 bg-[#161922] border border-[#252838] rounded-full px-3 py-1">
        <div className={`w-1.5 h-1.5 rounded-full ${fileName ? 'bg-[#3DD68C]' : 'bg-[#3A3D52]'}`} />
        <span className="text-[11px] text-[#5A5F7A]">
          {fileName ?? 'No file loaded'}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="text-[11px] text-[#5A5F7A] border border-[#252838] rounded-lg px-3 py-1 hover:border-[#6C63FF] hover:text-[#9B94FF] transition-colors bg-transparent">
          Clear
        </button>
        <div className="w-7 h-7 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 flex items-center justify-center text-[9px] font-bold text-[#9B94FF]">
          AK
        </div>
      </div>

    </header>
  )
}

export default Header