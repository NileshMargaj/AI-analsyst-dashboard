import React, { useState, useRef } from 'react'
import upload_logo from '../assets/upload_logo.png'
import { FiUpload } from "react-icons/fi";

const UploadFile = () => {
  const [status, setStatus] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSuccess, setIsSuccess] = useState(null);
  const fileInputRef = useRef(null);

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
      } else {
        setIsSuccess(false);
        setStatus(`Error: ${data.error}`);
      }
    } catch (err) {
      setStatus(`Upload failed: ${err.message}`);
    }
  };

  return (
    <section className='h-[80%] w-[40%] flex flex-col justify-around rounded-lg shadow-lg overflow-hidden'>


      <div className='h-[40%] w-full flex flex-col items-center justify-start gap-1'>
        <img src={upload_logo} alt="upload_logo" className='h-[100px] w-[100px]' />
        <p className='text-[17px] font-bold text-white mb-1'>
          Upload your file here...
        </p>
        <p className='text-gray-600 text-[13px]'>
          Drag & drop or browse file
        </p>
      </div>


      <div
        onClick={() => fileInputRef.current.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        className="relative h-[55%] w-full bg-[#131620] border border-dashed border-violet-200 hover:border-violet-500 rounded-lg cursor-pointer flex items-center justify-center transition"
      >
        <div className="h-[70%] w-[60%] flex flex-col items-center justify-evenly">
          <FiUpload className='text-[30px] text-violet-600' />

          <span className="text-gray-400 font-bold">
            Click or Drag file here
          </span>

          <p
            className={`text-xs ${isSuccess === null
                ? "text-gray-400"
                : isSuccess
                  ? "text-green-500"
                  : "text-red-500"
              } px-2 py-2 rounded mt-1 w-full text-center`}
          >
            {status}
          </p>

          <p className='text-gray-600 mb-1 text-[13px]'>
            Supports .PDF, .CSV
          </p>


          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current.click();
              }}
              className="bg-gray-600 text-white px-4 py-1.5 text-[14px] rounded-md hover:bg-gray-700"
            >
              Browse
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              className="bg-violet-600 text-white px-4 py-1.5 text-[14px] rounded-md hover:bg-violet-700"
            >
              Upload
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
  );
};

export default UploadFile;