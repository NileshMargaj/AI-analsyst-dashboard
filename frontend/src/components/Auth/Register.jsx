import React, { useState } from 'react';
import { FiUserPlus, FiEye, FiEyeOff } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const Register = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Registration successful! You can now login.');
        if (onSuccess) onSuccess();
        setFormData({ username: '', email: '', password: '' });
        navigate('/login');
      } else {
        setStatus(`Error: ${data.error || data.message}`);
      }
    } catch (err) {
      setStatus(`Registration failed: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-[70%] w-[40%] flex items-center justify-center bg-[#0B0D12] p-5">
      <div className="w-full max-w-md bg-[#0F1117] border border-[#1C1F2E] rounded-lg shadow-sm p-3">
        <div className="text-center mb-3">
          <FiUserPlus className="mx-auto text-3xl text-[#6C63FF] mb-1" />
          <h2 className="text-xl font-bold text-[#E2E4EF] mb-1">Register</h2>
          <p className="text-[#5A5F7A] text-sm">Create your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-[#5A5F7A] mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              minLength="4"
              maxLength="20"
              className="w-full px-4 py-1.5 bg-[#131620] border border-[#252838] rounded-lg text-[#E2E4EF] text-sm placeholder-[#5A5F7A] focus:outline-none  transition"
              placeholder="Enter username (4-20 chars)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A5F7A] mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-1.5 bg-[#131620] border border-[#252838] rounded-lg text-[#E2E4EF] text-sm placeholder-[#5A5F7A] focus:outline-none  transition"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#5A5F7A] mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                minLength="4"
                maxLength="12"
                className="w-full px-4 py-1.5 pr-12 mb-2 bg-[#131620] border border-[#252838] rounded-lg text-[#E2E4EF] text-sm placeholder-[#5A5F7A] focus:outline-none transition"
                placeholder="Enter password (4-12 chars)"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5F7A] hover:text-[#E2E4EF] hover:opacity-70 transition p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>
          </div>

          {status && (
            <p className={`p-3 rounded-lg text-sm bg-[#3DD68C]/10 text-[#3DD68C] border border-[#3DD68C]/30 ${status.includes('successful') ? '' : 'bg-red-500/20 text-red-200 border border-red-500/30'}`}>
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
                <div className="w-5 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        <p className="text-center mt-5 text-[#5A5F7A]">
          Already have an account?{' '}
          <Link to={"/login"} className="text-[#6C63FF] hover:text-[#9B94FF] font-medium">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

