import React from "react";

const Topbar = ({ onAddClick, progress }) => {
  return (
    <div className="bg-gradient-to-r from-[#0f172a] to-[#1e293b] text-white px-6 py-4 flex justify-between items-center shadow-md border-b border-gray-700 z-10">
      <h1 className="text-2xl font-bold tracking-wide select-none text-blue-300 drop-shadow-sm">
        📘 EduNote
      </h1>
      <div className="flex items-center gap-4">
        <div className="text-sm bg-[#334155] text-blue-200 px-3 py-1 rounded-full font-medium shadow-sm">
          Progress: <span className="font-bold">{progress}%</span>
        </div>
        <button
          onClick={onAddClick}
          className="bg-teal-600 hover:bg-teal-500 text-white font-semibold px-5 py-2 rounded-lg transition duration-200 shadow"
        >
          + Add Note
        </button>
      </div>
    </div>
  );
};

export default Topbar;
