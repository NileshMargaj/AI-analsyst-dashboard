import React, { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';

const Login = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Login successful!');
        if (onSuccess) onSuccess();
        setFormData({ email: '', password: '' });
      } else {
        setStatus(`Error: ${data.error || data.message}`);
      }
    } catch (err) {
      setStatus(`Login failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B0D12] p-8">
      <div className="w-full max-w-md bg-[#0F1117] border border-[#1C1F2E] rounded-lg shadow-sm p-6">
        <div className="text-center mb-8">
          <FiLogIn className="mx-auto text-5xl text-[#6C63FF] mb-4" />
          <h2 className="text-2xl font-bold text-[#E2E4EF] mb-2">Login</h2>
          <p className="text-[#5A5F7A]">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#5A5F7A] mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#131620] border border-[#252838] rounded-lg text-[#E2E4EF] placeholder-[#5A5F7A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A5F7A] mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#131620] border border-[#252838] rounded-lg text-[#E2E4EF] placeholder-[#5A5F7A] focus:outline-none focus:ring-2 focus:ring-[#6C63FF] focus:border-[#6C63FF] transition"
              placeholder="Enter your password"
            />
          </div>

          {status && (
            <p className={`p-3 rounded-lg text-sm bg-[#3DD68C]/10 text-[#3DD68C] border border-[#3DD68C]/30 ${status.includes('successful') || status.includes('Login') ? '' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
              {status}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#6C63FF] hover:bg-[#9B94FF] text-[#E2E4EF] py-3 px-4 rounded-lg font-semibold text-lg focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="text-center mt-6 text-[#5A5F7A]">
          Don&apos;t have an account?{' '}
          <a href="#" className="text-[#6C63FF] hover:text-[#9B94FF] font-medium">Register here</a>
        </p>
      </div>
    </div>
  );
};

export default Login;

