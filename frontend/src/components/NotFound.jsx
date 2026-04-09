import React from 'react';
import { Link } from 'react-router-dom';
import { FiAlertTriangle } from 'react-icons/fi';

const NotFound = () => {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-[#0B0D12] px-4">
      <div className="text-center bg-[#0F1117] border border-[#1C1F2E] rounded-xl p-8 shadow-md max-w-lg w-full">
        
        {/* Icon */}
        <FiAlertTriangle className="mx-auto text-5xl text-[#6C63FF] mb-4" />

        {/* 404 Text */}
        <h1 className="text-6xl font-extrabold text-[#E2E4EF] mb-2">
          404
        </h1>

        {/* Message */}
        <h2 className="text-xl font-semibold text-[#E2E4EF] mb-2">
          Page Not Found
        </h2>
        <p className="text-[#5A5F7A] mb-6">
          The page you're looking for doesn’t exist or has been moved.
        </p>

        {/* Button */}
        <Link
          to="/"
          className="inline-block bg-[#6C63FF] hover:bg-[#403996] text-[#E2E4EF] px-6 py-2 rounded-lg font-medium transition-all duration-200"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;