import React, { useState } from 'react';
import { FiLogIn } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Login = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
   const navigate = useNavigate();

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
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        setStatus('Login successful!');
        if (onSuccess) onSuccess();
        setFormData({ email: '', password: '' });
        navigate("/")
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
    <div className="h-[70%] w-[40%] flex items-center justify-center bg-[#0B0D12] p-5">
      <div className="w-full max-w-md bg-[#0F1117] border border-[#1C1F2E] rounded-lg shadow-sm p-3">
        <div className="text-center mb-1">
          <FiLogIn className="mx-auto text-3xl text-[#6C63FF] mb-1" />
          <h2 className="text-xl font-bold text-[#E2E4EF] mb-2">Login</h2>
          <p className="text-[#5A5F7A]">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#5A5F7A] mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#131620] border border-[#252838] rounded-lg text-[#E2E4EF] placeholder-[#5A5F7A] focus:outline-none  transition"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A5F7A] mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 bg-[#131620] border border-[#252838] rounded-lg text-[#E2E4EF] placeholder-[#5A5F7A] focus:outline-none  transition"
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
            className="w-full bg-[#6C63FF] hover:bg-[#403996] text-[#E2E4EF] py-2 px-4 rounded-lg font-semibold text-sm focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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

        <p className="text-center mt-5 text-[#5A5F7A]">
          Don&apos;t have an account?{' '}
          <Link to={"/register"} className="text-[#6C63FF] hover:text-[#9B94FF] font-medium">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

