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
      });
    }
  }, [activeNote]);

  const updateNote = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch(`/api/notes/${activeNote._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editData.title,
          content: editData.content,
          subject: editData.subject,
          tags: editData.tags,
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Update failed:", errorText);
        throw new Error("Failed to update note");
      }

      const updatedNote = await res.json();

      setAllNotes((prev) =>
        prev.map((note) => (note._id === updatedNote._id ? updatedNote : note))
      );
      setActiveNote(updatedNote);
      setEditMode(false);

      // ✅ Update parent so progress updates instantly
      if (onUpdateTags) {
        onUpdateTags(updatedNote._id, updatedNote.tags);
      }

    } catch (err) {
      console.error(err);
      alert("Failed to update note");
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
            <span className="italic text-white/80">{note.subject || "No Subject"}</span>
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
            className="bg-[#0f111a] text-white rounded-xl w-full max-w-2xl h-[90vh] overflow-y-auto p-6 relative"
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
                        <label
                          key={tag}
                          className="flex items-center gap-1 cursor-pointer select-none"
                        >
                          <input
                            type="checkbox"
                            checked={editData.tags.includes(tag)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setEditData({
                                  ...editData,
                                  tags: [...editData.tags, tag],
                                });
                              } else {
                                setEditData({
                                  ...editData,
                                  tags: editData.tags.filter((t) => t !== tag),
                                });
                              }
                            }}
                          />
                          <span
                            className={`capitalize px-2 py-0.5 rounded ${tagColors[tag]}`}
                          >
                            {tag}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={updateNote}
                      className="flex-1 bg-green-600 hover:bg-green-700 py-2 rounded font-semibold"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditMode(false);
                        setEditData({
                          title: activeNote.title,
                          content: activeNote.content,
                          subject: activeNote.subject,
                          tags: activeNote.tags || [],
                        });
                      }}
                      className="flex-1 bg-gray-600 hover:bg-gray-700 py-2 rounded font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-4">{activeNote.title}</h2>
                  <p className="mb-4 whitespace-pre-wrap text-gray-200">
                    {activeNote.content}
                  </p>

                  <div className="mb-4 flex flex-wrap gap-2">
                    {activeNote.tags?.map((tag) => (
                      <span
                        key={tag}
                        className={`${tagColors[tag]} text-white px-3 py-1 rounded capitalize`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-gray-400 italic mb-6">
                    Subject: {activeNote.subject || "No Subject"}
                  </div>
                  <div className="flex justify-between text-xs text-gray-500 mb-6">
                    <span>{activeNote.date || ""}</span>
                    <span>{activeNote.time || ""}</span>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 py-2 rounded font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDeleteNote(activeNote._id);
                        setActiveNote(null);
                      }}
                      className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded font-semibold"
                    >
                      Delete
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
