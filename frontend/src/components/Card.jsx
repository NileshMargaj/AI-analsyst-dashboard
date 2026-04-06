import React from "react";

const Card = ({ title , amount}) => {
  return (
    <div className="bg-[#131620] p-6 rounded-md w-[260px] shadow-sm">
      {/* Title */}
      <p className="text-sm tracking-widest text-gray-500 font-medium uppercase">
        {title}
      </p>

      {/* Main Number */}
      <h1 className="text-2xl font-bold text-white mt-2">
        {amount}
      </h1>

      {/* Growth Indicator */}
      <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
        <span className="text-lg">↑</span>
        9.1% vs last year
      </p>
    </div>
  );
};

export default Card;