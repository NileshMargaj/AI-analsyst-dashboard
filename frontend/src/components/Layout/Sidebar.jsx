import React from 'react'
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png'
import { MdOutlineDriveFolderUpload } from "react-icons/md";
import { BsPatchQuestion } from "react-icons/bs";
import LogoutButton from '../Auth/LogoutButton';

const Sidebar = () => {
  return (
    <aside className="w-[220px] h-full bg-gradient-to-b from-[#0F1117] via-[#0B0D12] to-[#0F1117] border-r border-[#1C1F2E]/50 flex flex-col justify-between px-4 py-6 shrink-0 shadow-xl backdrop-blur-sm">
      {/* Top Section */}
      <div className='flex flex-col'>
        {/* Logo Section */}
        <section className="mb-8">
          <div className="flex items-center gap-3 p-2 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
              <img src={logo} alt="DataLens AI Logo" className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#E2E4EF] tracking-wide leading-tight">
                Analyst AI
              </p>
              <p className="text-xs text-[#9B94FF]/70">
                Data Intelligence
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Section */}
        <section className="flex flex-col gap-1">
          <div className="mb-2 px-2">
            <p className="text-xs font-semibold text-[#9B94FF]/60 uppercase tracking-wider">
              Navigation
            </p>
          </div>

          <Link
            to="/upload"
            className="group text-sm text-[#E2E4EF] hover:bg-gradient-to-r hover:from-violet-500/20 hover:to-purple-500/20 rounded-lg px-3 py-3 transition-all duration-200 flex items-center gap-3 border border-transparent hover:border-violet-500/30 hover:shadow-md"
          >
            <div className="w-8 h-8 rounded-md bg-[#1C1F2E] group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
              <MdOutlineDriveFolderUpload className="text-[#9B94FF] group-hover:text-violet-400" />
            </div>
            <span className="font-medium">Upload File</span>
          </Link>

          <Link
            to="/"
            className="group text-sm text-[#E2E4EF] hover:bg-gradient-to-r hover:from-violet-500/20 hover:to-purple-500/20 rounded-lg px-3 py-3 transition-all duration-200 flex items-center gap-3 border border-transparent hover:border-violet-500/30 hover:shadow-md"
          >
            <div className="w-8 h-8 rounded-md bg-[#1C1F2E] group-hover:bg-violet-500/20 flex items-center justify-center transition-colors">
              <BsPatchQuestion className="text-[#9B94FF] group-hover:text-violet-400" />
            </div>
            <span className="font-medium">Dashboard</span>
          </Link>
        </section>
      </div>

      {/* Bottom Section */}
      <section className="mt-8">
        <div className="p-1 rounded-xl bg-[#1C1F2E]/50 border border-[#252838]/50">
          <LogoutButton />
        </div>
      </section>
    </aside>
  )
}

export default Sidebar