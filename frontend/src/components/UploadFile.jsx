import React, { useState, useRef } from 'react'
import upload_logo from '../assets/upload_logo.png'
import { FiUpload } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

const UploadFile = () => {
  const [status, setStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  //? Handle file select
  const handleFileSelect = (file) => {
    if (file) {
      setSelectedFile(file);
      setStatus(`Selected: ${file.name}`);
      setIsSuccess(null);
    }
  };

  //? Input change
  const onInputChange = (e) => {
    handleFileSelect(e.target.files[0]);
  };

  //? Drag & Drop
  const handleDrop = (e) => {
    e.preventDefault();
    handleFileSelect(e.dataTransfer.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  //? Upload
  const handleUpload = async () => {
    if (!selectedFile) {
      setStatus('Please select a file first');
      setIsSuccess(false);
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      setStatus('Uploading...');
      const response = await fetch('http://localhost:3000/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        setIsSuccess(true);
        setStatus(`Uploaded: ${data.datasetId}`);
        navigate('/')
      } else {
        setIsSuccess(false);
        setStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setStatus(`Upload failed: ${err.message}`);
    }
  };

  return (
    <div className="w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 min-h-[500px] sm:min-h-[550px]">
      <section className='w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl flex flex-col rounded-2xl shadow-2xl overflow-hidden bg-gradient-to-br from-[#0F1117] to-[#0B0D12] border border-[#1C1F2E]/50 backdrop-blur-sm'>

        {/* Header Section */}
        <div className='flex flex-col items-center justify-center py-4 sm:py-6 px-4 sm:px-6 space-y-2 sm:space-y-3'>
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/30">
            <img src={upload_logo} alt="upload_logo" className='w-8 h-8 sm:w-10 sm:h-10' />
          </div>
          <div className="text-center space-y-1">
            <h1 className='text-lg sm:text-xl font-bold text-[#E2E4EF]'>
              Upload your file here
            </h1>
            <p className='text-[#9B94FF] text-xs sm:text-sm font-medium'>
              Drag & drop or browse to upload
            </p>
          </div>
        </div>

        {/* Upload Area */}
        <div
          onClick={() => fileInputRef.current.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="relative mx-4 sm:mx-6 mb-4 sm:mb-6 bg-gradient-to-br from-[#131620] to-[#0F1117] border-2 border-dashed border-violet-500/30 hover:border-violet-400 hover:bg-gradient-to-br hover:from-violet-500/5 hover:to-purple-500/5 rounded-xl cursor-pointer transition-all duration-300 shadow-inner group"
        >
          <div className="flex flex-col items-center justify-center py-6 sm:py-8 px-6 sm:px-8 space-y-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center border border-violet-500/30 group-hover:border-violet-400 transition-colors">
              <FiUpload className='text-lg sm:text-xl text-violet-400 group-hover:text-violet-300 transition-colors' />
            </div>

            <div className="text-center space-y-1">
              <p className="text-[#E2E4EF] font-semibold text-sm sm:text-base">
                Click or Drag file here
              </p>
              <p className='text-[#5A5F7A] text-xs sm:text-sm font-medium'>
                Supports .PDF, .CSV files up to 10MB
              </p>
            </div>

            {/* Status Message */}
            {status && (
              <div className={`px-4 py-3 rounded-lg text-sm font-medium text-center max-w-xs ${
                isSuccess === null
                  ? "text-[#9B94FF] bg-[#6C63FF]/10 border border-[#6C63FF]/30"
                  : isSuccess
                    ? "text-green-400 bg-green-500/10 border border-green-500/30"
                    : "text-red-400 bg-red-500/10 border border-red-500/30"
              }`}>
                {status}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 w-full max-w-xs">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current.click();
                }}
                className="flex-1 bg-[#1C1F2E] hover:bg-[#252838] text-[#9B94FF] px-3 sm:px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 border border-[#252838] hover:border-violet-500/50 hover:shadow-md"
              >
                Browse Files
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleUpload();
                }}
                disabled={!selectedFile}
                className="flex-1 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white px-3 sm:px-4 py-2 text-sm rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
              >
                Upload File
              </button>
            </div>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={onInputChange}
            className="hidden"
            accept=".csv,.pdf"
          />
        </div>
      </section>
    </div>
  );
};

export default UploadFile;