import React from 'react'
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import projectLogo from '../../assets/logo.png';

const Header = ({
  onMenuClick = null,
  isSidebarOpen = false,
  onCloseSidebar = null,
}) => {

  const location = useLocation();
  const pathname = location.pathname;

  const routeTitleMap = {
    "/": "Dashboard",
    "/upload": "Upload File",
    "/login": "Login",
    "/register": "Register",
  };
  const pageTitle = routeTitleMap[pathname] || "Dashboard";



  return (
    <>
      <header className="h-14 w-full bg-gradient-to-r from-[#0B0D12] via-[#0F1117] to-[#0B0D12] border-b border-[#1C1F2E]/50 backdrop-blur-sm flex items-center px-4 sm:px-6 gap-4 shrink-0 shadow-lg">
        {/* Mobile menu + brand */}
        <div className="flex items-center justify-between gap-3 md:hidden w-full">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#0B0D12] border border-white/10 flex items-center justify-center shadow-lg shadow-violet-500/10">
              <img src={projectLogo} alt="Project Logo" className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-tight">
                Analyst<span className="text-violet-600">AI</span>
              </h1>
            </div>
          </div>

          <button
            type="button"
            aria-label={isSidebarOpen ? 'Close sidebar' : 'Open sidebar'}
            onClick={isSidebarOpen ? (onCloseSidebar || undefined) : (onMenuClick || undefined)}
            className="inline-flex items-center justify-center p-2 rounded-xl bg-white/[0.03] border border-white/10 text-[#E2E4EF] hover:text-white hover:bg-white/[0.06]"
          >
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Desktop title */}
        <div className="hidden md:flex items-center gap-3">
          <span className="text-lg font-bold text-[#E2E4EF] tracking-wide">
            {pageTitle}
          </span>
        </div>
      </header>
    </>
  )
}

export default Header
