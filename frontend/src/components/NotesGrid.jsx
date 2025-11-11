import React, { useEffect, useState } from "react";

// Tag badge colors
const tagColors = {
  important: "bg-red-500",
  doubt: "bg-yellow-400",
  done: "bg-green-500",
};

// Gradient background classes
const gradientClasses = [
  "bg-gradient-to-r from-pink-500 to-pink-400",
  "bg-gradient-to-r from-yellow-500 to-yellow-400",
  "bg-gradient-to-r from-blue-500 to-blue-400",
  "bg-gradient-to-r from-green-500 to-green-400",
  "bg-gradient-to-r from-purple-500 to-purple-400",
  "bg-gradient-to-r from-orange-500 to-orange-400",
];

// Function to pick a gradient class based on note ID (hash)
const getGradient = (noteId = "") => {
  const hash = [...noteId.toString()].reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  );
  return gradientClasses[hash % gradientClasses.length];
};

const availableTags = ["important", "doubt", "done"];

const NotesGrid = ({ notes, onDeleteNote, onUpdateTags }) => {
  const [activeNote, setActiveNote] = useState(null);
  const [allNotes, setAllNotes] = useState(notes);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    content: "",
    subject: "",
    tags: [],
    link: "",
  });

  useEffect(() => {
    setAllNotes(notes);
  }, [notes]);

  useEffect(() => {
    if (activeNote) {
      setEditMode(false);
      setEditData({
        title: activeNote.title || "",
        content: activeNote.content || "",
        subject: activeNote.subject || "",
        tags: activeNote.tags || [],
        link: activeNote.link || "",
      });
    }
  }, [activeNote]);

  const updateNote = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You are not logged in. Please log in again.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/notes/${activeNote._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editData),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Update failed:", errorData);
        throw new Error(errorData.error || "Failed to update note");
      }

      const updatedNote = await res.json();
      setAllNotes((prev) =>
        prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
      setActiveNote(updatedNote);
      setEditMode(false);

      if (onUpdateTags) onUpdateTags(updatedNote._id, updatedNote.tags);
    } catch (err) {
      console.error("Error updating note:", err.message);
      alert(err.message);
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {allNotes.length === 0 && (
        <p className="text-white col-span-3 text-center">No notes to display.</p>
      )}

      {allNotes.map((note) => (
        <div
          key={note._id}
          className={`min-h-[220px] text-white rounded-xl shadow-lg cursor-pointer p-6 flex flex-col justify-between transition transform hover:scale-[1.02] hover:shadow-xl ${getGradient(
            note._id
          )}`}
          onClick={() => setActiveNote(note)}
        >
          <div>
            <h3 className="text-xl font-bold mb-2 truncate">{note.title}</h3>
            <p className="text-sm text-white/90 line-clamp-5">{note.content}</p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2 items-center justify-between text-xs font-medium">
            <div className="flex gap-1 flex-wrap">
              {note.tags?.map((tag) => (
                <span
                  key={tag}
                  className={`${tagColors[tag]} text-white px-3 py-1 rounded capitalize opacity-80`}
                >
                  {tag}
                </span>
              ))}
            </div>
            <span className="italic text-white/80">
              {note.subject || "No Subject"}
            </span>
          </div>
        </div>
      ))}

      {activeNote && (
        <div
          className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 px-4"
          onClick={() => {
            setActiveNote(null);
            setEditMode(false);
          }}
        >
          <div
            className="bg-[#0f111a] text-white rounded-none w-full h-screen overflow-y-auto p-8 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-gray-200 font-bold text-xl"
              onClick={() => {
                setActiveNote(null);
                setEditMode(false);
              }}
              aria-label="Close modal"
            >
              &times;
            </button>

            <div className="mt-8">
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={editData.title}
                    onChange={(e) =>
                      setEditData({ ...editData, title: e.target.value })
                    }
                    className="w-full mb-4 p-2 rounded bg-[#1f2937] text-white border border-gray-600"
                    placeholder="Title"
                  />

                  <input
                    type="url"
                    value={editData.link}
                    onChange={(e) =>
                      setEditData({ ...editData, link: e.target.value })
                    }
                    className="w-full mb-4 p-2 rounded bg-[#1f2937] text-white border border-gray-600"
                    placeholder="Reference link (optional)"
                  />

                  <textarea
                    value={editData.content}
                    onChange={(e) =>
                      setEditData({ ...editData, content: e.target.value })
                    }
                    className="w-full mb-4 p-2 rounded bg-[#1f2937] text-white border border-gray-600 resize-y"
                    rows={6}
                    placeholder="Content"
                  />

                  <input
                    type="text"
                    value={editData.subject}
                    onChange={(e) =>
                      setEditData({ ...editData, subject: e.target.value })
                    }
                    className="w-full mb-4 p-2 rounded bg-[#1f2937] text-white border border-gray-600"
                    placeholder="Subject"
                  />

                  <div className="mb-6">
                    <label className="block mb-1 font-semibold">Tags:</label>
                    <div className="flex gap-4">
                      {availableTags.map((tag) => (
                        <label key={tag} className="flex items-center gap-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editData.tags.includes(tag)}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                tags: e.target.checked
                                  ? [...editData.tags, tag]
                                  : editData.tags.filter((t) => t !== tag),
                              })
                            }
                          />
                          {tag}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-500 rounded"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={updateNote}
                      className="px-4 py-2 bg-green-600 rounded"
                    >
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-3xl font-bold mb-4">{activeNote.title}</h2>

                  {activeNote.link && (
                    <a
                      href={activeNote.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mb-4 text-blue-400 hover:underline"
                    >
                      🔗 Open Attached Link
                    </a>
                  )}

                  <p className="whitespace-pre-line mb-4 text-white/90 leading-relaxed">
                    {activeNote.content}
                  </p>
                  <p className="text-sm text-white/70 mb-4">
                    <strong>Subject:</strong>{" "}
                    {activeNote.subject || "No Subject"}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {activeNote.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`${tagColors[tag]} text-white px-3 py-1 rounded text-sm`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex justify-end gap-3 mr-8">
                    <button
                      onClick={() => onDeleteNote(activeNote._id)}
                      className="px-4 py-2 bg-red-600 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-blue-600 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotesGrid;
