import React, { useState } from 'react';
import { FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
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
      className="w-full group flex items-center gap-3 px-4 py-3 rounded-lg text-[#E2E4EF] hover:bg-gradient-to-r hover:from-red-500/20 hover:to-pink-500/20 transition-all duration-200 disabled:opacity-50 border border-transparent hover:border-red-500/30 hover:shadow-md"
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-red-400/30 border-t-red-400 rounded-full animate-spin" />
      ) : (
        <div className="w-8 h-8 rounded-md bg-[#1C1F2E] group-hover:bg-red-500/20 flex items-center justify-center transition-colors">
          <FiLogOut className="text-sm text-[#9B94FF] group-hover:text-red-400" />
        </div>
      )}

      <span className="text-sm font-medium">
        {loading ? 'Logging out...' : 'Logout'}
      </span>
    </button>
  );
};

export default LogoutButton;