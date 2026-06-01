import React from 'react';
import { NavLink } from 'react-router-dom';
import LogoutButton from '../Auth/LogoutButton';
import projectLogo from '../../assets/logo.png';
import { UploadCloud, LayoutDashboard, UserPlus, LogIn } from 'lucide-react';

const Sidebar = ({ variant = 'desktop', onClose = null }) => {
  const isDesktop = variant === 'desktop';
  const wrapperClass = isDesktop
    ? 'w-[260px] h-screen md:flex'
    : 'fixed top-14 right-0 bottom-0 z-50 w-[260px] flex';

  const linkClass = ({ isActive }) =>
    `group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${isActive ? 'text-violet-500 bg-white/[0.03]' : 'text-gray-400 hover:text-white hover:bg-white/[0.03]'
    }`;

  return (
    <aside className={"" + wrapperClass + " bg-[#0B0D12] border-r border-[#1C1F2E] flex flex-col shrink-0"}
    >
      {/* Top Header / Branding area (desktop only) */}
      <div className="hidden md:flex px-6 py-8 items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#0B0D12] border border-white/10 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <img src={projectLogo} alt="Project Logo" className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Analyst<span className="text-violet-400">AI</span></h1>
        </div>
      </div>


      {/* Scrollable Navigation Area */}
      <div className="flex flex-col flex-1 overflow-y-auto px-4 py-2">
        <section className="flex flex-col gap-2">

          {/* Link 1: Dashboard */}
          <NavLink
            to="/"
            className={linkClass}
            end
            onClick={() => onClose && onClose()}
          >
            <span className={({ isActive }) => `transition-colors ${isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-violet-400'}`}>
              <LayoutDashboard size={20} />
            </span>
            <span className="text-sm font-medium">Dashboard</span>
          </NavLink>


          {/* Link 2: Upload File */}
          <NavLink
            to="/upload"
            className={linkClass}
            onClick={() => onClose && onClose()}
          >
            <span className={({ isActive }) => `transition-colors ${isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-violet-400'}`}>
              <UploadCloud size={20} />
            </span>
            <span className="text-sm font-medium">Upload File</span>
          </NavLink>


          {/* Link 3: Register */}
          <NavLink
            to="/register"
            className={linkClass}
            onClick={() => onClose && onClose()}
          >
            <span className={({ isActive }) => `transition-colors ${isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-violet-400'}`}>
              <UserPlus size={20} />
            </span>
            <span className="text-sm font-medium">Register</span>
          </NavLink>

          {/* Link 4: Login */}
          <NavLink
            to="/login"
            className={linkClass}
            onClick={() => onClose && onClose()}
          >
            <span className={({ isActive }) => `transition-colors ${isActive ? 'text-violet-400' : 'text-gray-500 group-hover:text-violet-400'}`}>
              <LogIn size={20} />
            </span>
            <span className="text-sm font-medium">Login</span>
          </NavLink>
        </section>
      </div>

      {/* Bottom Section / Logout */}
      <div className="mt-auto p-4 border-t border-white/5">
        <div className="px-4 py-3 text-gray-400 hover:text-white transition-colors">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;