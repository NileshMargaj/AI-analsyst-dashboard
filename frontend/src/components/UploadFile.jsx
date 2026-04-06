import React from 'react'
import upload_logo from '../assets/upload_logo.png'
import { FiUpload } from "react-icons/fi";

const UploadFile = () => {
  return (
    <section className='h-[80%] w-[40%] flex flex-col justify-around rounded-lg shadow-lg overflow-hidden'>
      <div className='h-[40%] w-full flex flex-col items-center justify-start gap-1'>
        <img src={upload_logo} alt="upload_logo" className='h-[100px] w-[100px]' />
        <p className='text-[17px] font-bold text-white mb-1'>
          Upload your file here...
        </p>
        <p className='text-gray-600 text-[13px]'>
          Drag a file onto the left panel, or use the big drop zone below.
        </p>
      </div>
      <div className="relative h-[55%] w-full bg-[#131620] border border-dashed border-violet-200 hover:border-violet-500 hover:bg-transparent rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center">
        <div className="h-[70%] w-[50%] flex flex-col items-center justify-evenly">
          <FiUpload className='text-[30px] text-violet-600' />
          <span className="text-gray-400 pointer-events-none font-bold">
            Click or Drag file here
          </span>
          <p className='text-gray-600 text-[13px]'>
            Supports .PDF, .CSV
          </p>
          <button className="bg-violet-600 text-white px-4 py-1.5 text-[14px] rounded-md  ">
            Browse file
          </button>
        </div>
        <input
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </section>
  )
}

export default UploadFile