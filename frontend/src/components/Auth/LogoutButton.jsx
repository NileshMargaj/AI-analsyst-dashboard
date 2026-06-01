import React, { useState } from 'react';
import { LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE}/auth/logout`, {
        method: 'POST',
        credentials: 'include', // important for cookies
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login'); // redirect after logout
      } else {
        console.error(data.message || 'Logout failed');
      }
    } catch (error) {
      console.error('Logout error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="w-full group flex items-center gap-3 px-4 py-3 rounded-lg text-[#E2E4EF] hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 transition-all duration-200 disabled:opacity-50 border border-transparent hover:border-red-500/30 hover:shadow-md hover:text-red-400"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
      ) : (
        <LogOut className="text-sm text-gray-400 group-hover:text-red-400" />
      )}

      <span className="text-sm font-medium hover:text-red-400">
        {loading ? 'Logging out...' : 'Logout'}
      </span>
    </button>
  );
};

export default LogoutButton;