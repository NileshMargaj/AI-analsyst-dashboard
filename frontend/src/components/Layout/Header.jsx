import React, { useState } from 'react'
import { Link } from 'react-router-dom';

const Header = ({ fileName = null }) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [user, setUser] = useState(null);

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    setShowLoginModal(false);
    setShowRegisterModal(false);
  };

  const handleLogout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=localhost';
    setUser(null);
  };

  return (
    <>
      <header className="h-14 w-full bg-gradient-to-r from-[#0B0D12] via-[#0F1117] to-[#0B0D12] border-b border-[#1C1F2E]/50 backdrop-blur-sm flex items-center px-6 gap-4 shrink-0 shadow-lg">

        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-sm">AI</span>
          </div>
          <span className="text-lg font-bold text-[#E2E4EF] tracking-wide">
            Analyst Dashboard
          </span>
        </div>

        {/* File Status Chip */}
        <div className="flex items-center gap-2 bg-[#161922]/80 border border-[#252838]/60 rounded-full px-4 py-2 backdrop-blur-sm">
          <div className={`w-2 h-2 rounded-full shadow-sm ${fileName ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-gray-400 to-gray-500'}`} />
          <span className="text-xs text-[#9B94FF] font-medium">
            {fileName ?? 'No dataset loaded'}
          </span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Auth Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 text-xs text-[#9B94FF]">
                <span>Welcome,</span>
                <span className="font-medium text-[#E2E4EF]">{user.username || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-xs text-[#5A5F7A] border border-[#252838]/60 rounded-lg px-3 py-1.5 hover:border-red-500/60 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 bg-transparent backdrop-blur-sm"
              >
                Logout
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 border-2 border-[#1C1F2E] flex items-center justify-center text-xs font-bold text-white shadow-md">
                {user.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/register"
                className="text-xs text-[#9B94FF] border border-[#252838]/60 rounded-lg px-3 py-1.5 hover:border-violet-500/60 hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-200 bg-transparent backdrop-blur-sm"
              >
                Register
              </Link>
              <Link
                to="/login"
                className="text-xs text-white border border-violet-500/60 rounded-lg px-3 py-1.5 hover:border-violet-400 hover:bg-violet-500/20 transition-all duration-200 bg-violet-500/10 backdrop-blur-sm shadow-sm"
              >
                Login
              </Link>
            </>
          )}
        </div>

      </header>

    </>
  )
}

export default Header
