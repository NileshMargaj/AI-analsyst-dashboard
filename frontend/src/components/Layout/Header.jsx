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
      <header className="h-12 w-full bg-[#0B0D12] border-b border-[#1C1F2E] flex items-center px-5 gap-3 shrink-0">

        <span className="text-[13px] font-bold text-[#E2E4EF]">
          Dashboard
        </span>

        {/* File chip */}
        <div className="flex items-center gap-1.5 bg-[#161922] border border-[#252838] rounded-full px-3 py-1">
          <div className={`w-1.5 h-1.5 rounded-full ${fileName ? 'bg-[#3DD68C]' : 'bg-[#3A3D52]'}`} />
          <span className="text-[11px] text-[#5A5F7A]">
            {fileName ?? 'No file loaded'}
          </span>
        </div>

        <div className="ml-auto flex items-center gap-2">
          {user ? (
            <>
              <button 
                onClick={handleLogout}
                className="text-[11px] text-[#5A5F7A] border border-[#252838] rounded-lg px-3 py-1 hover:border-red-500 hover:text-red-400 transition-colors bg-transparent"
              >
                Logout
              </button>
              <div className="w-7 h-7 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 flex items-center justify-center text-[9px] font-bold text-[#9B94FF]">
                {user.username?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            </>
          ) : (
            <>
            <Link to="/register" className="text-[11px] text-[#5A5F7A] border border-[#252838] rounded-lg px-3 py-1 hover:border-[#6C63FF] hover:text-[#9B94FF] transition-colors bg-transparent">
              Register
            </Link>
            <Link to="/login" className="text-[11px] text-[#5A5F7A] border border-[#6C63FF] rounded-lg px-3 py-1 hover:border-[#9B94FF] hover:text-[#9B94FF] bg-[#6C63FF]/10 transition-colors">
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
