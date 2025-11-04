import React from "react";

const Sidebar = ({ subjects, selectedSubject, onSelectSubject }) => {
  const handleSubjectClick = (subject) => {
    if (selectedSubject === subject) {
      onSelectSubject(""); // re-trigger refresh if same subject clicked
      setTimeout(() => onSelectSubject(subject), 0);
    } else {
      onSelectSubject(subject);
    }
  };

  return (
    <aside className="w-64 h-screen bg-[#0a0f2c]/95 border-r border-[#1a2146] flex flex-col shadow-2xl">
      {/* Header */}
      <div className="p-6 border-b border-[#1f2752]">
        <h2 className="text-2xl font-bold text-blue-400 tracking-wide flex items-center gap-2">
          📚 Subjects
        </h2>
      </div>

      {/* Scrollable Subject List */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-3 custom-scroll">
        {/* All Subjects */}
        <button
          onClick={() => onSelectSubject("")}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
            selectedSubject === ""
              ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md shadow-blue-700/40"
              : "text-blue-200 hover:bg-[#1e3a8a]/30"
          }`}
        >
          All Notes
        </button>

        {/* Dynamic Subjects */}
        {subjects.length > 0 ? (
          subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => handleSubjectClick(subject)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
                selectedSubject === subject
                  ? "bg-[#11193a] text-white font-semibold border border-blue-500 shadow-inner"
                  : "text-gray-300 hover:bg-[#1c244f]"
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span className="text-sm tracking-wide">{subject}</span>
            </button>
          ))
        ) : (
          <p className="text-gray-500 text-sm text-center mt-5 italic">
            No subjects yet. Add a note to create one ✨
          </p>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[#1f2752] p-4 text-center text-xs text-gray-500">
        <p>Note Tracker © {new Date().getFullYear()}</p>
      </div>
    </aside>
  );
};

export default Sidebar;
