import React from "react";

const subjectColors = {
  English: "text-blue-400",
  Maths: "text-green-400",
  Physics: "text-purple-400",
  Chemistry: "text-red-400",
  Biology: "text-teal-400",
  "Computer Science": "text-indigo-400",
};

const subjects = [
  "English",
  "Maths",
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
];

const Sidebar = ({ selectedSubject, onSelectSubject }) => {
  const handleSubjectClick = (subject) => {
    // Always call even if the same subject is clicked to allow re-render
    if (selectedSubject === subject) {
      onSelectSubject(""); // Deselect first
      setTimeout(() => onSelectSubject(subject), 0); // Re-select after
    } else {
      onSelectSubject(subject);
    }
  };

  return (
    <aside className="w-60 bg-gradient-to-b from-[#0f172a] to-[#1e293b] text-white p-5 shadow-xl border-r border-gray-700 flex flex-col gap-4 overflow-auto">
      <h2 className="text-2xl font-bold mb-6 text-blue-300 select-none tracking-wide">
        📚 Subjects
      </h2>

      {/* All Subjects Button */}
      <button
        onClick={() => onSelectSubject("")}
        className={`w-full text-left px-4 py-3 rounded-lg transition-all duration-300 font-medium ${
          selectedSubject === ""
            ? "bg-[#1e3a8a]/60 text-white shadow-inner ring-1 ring-blue-400"
            : "hover:bg-[#1e3a8a]/40 text-blue-200"
        }`}
      >
        All Subjects
      </button>

      {/* Individual Subject Buttons */}
      {subjects.map((subject) => (
        <button
          key={subject}
          onClick={() => handleSubjectClick(subject)}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left ${
            selectedSubject === subject
              ? "bg-[#0f172a] shadow-inner ring-1 ring-current font-semibold"
              : "hover:bg-[#1e3a8a]/30"
          } ${subjectColors[subject]}`}
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 24 24"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span className="text-base select-none">{subject}</span>
        </button>
      ))}
    </aside>
  );
};

export default Sidebar;
