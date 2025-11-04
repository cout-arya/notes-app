import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import NotesGrid from "../components/NotesGrid";

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [form, setForm] = useState({
    title: "",
    content: "",
    subject: "",
    tags: [],
    link: "",
  });
  const [subjects, setSubjects] = useState([]);

  const API_URL = "http://localhost:5000/api/notes";

  // Fetch notes from API
  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data);

      // Extract unique subjects dynamically
      const uniqueSubjects = [
        ...new Set(res.data.map((note) => note.subject).filter(Boolean)),
      ];
      setSubjects(uniqueSubjects);
    } catch (err) {
      alert("Error fetching notes");
      console.error("Fetch notes error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // Handle subject selection (toggle)
  const handleSelectSubject = (subject) => {
    setSelectedSubject((prev) => (prev === subject ? "" : subject));
    setTimeout(() => setSelectedSubject(subject), 0);
  };

  // Filter notes based on selected subject
  const filteredNotes = useMemo(() => {
    return selectedSubject
      ? notes.filter((note) => note.subject === selectedSubject)
      : notes;
  }, [notes, selectedSubject]);

  // Add new note
  const addNote = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and content are required");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(API_URL, form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotes((prev) => [res.data, ...prev]);
      setForm({ title: "", content: "", subject: "", tags: [], link: "" });
      setShowAddForm(false);

      // Update subjects dynamically
      if (form.subject && !subjects.includes(form.subject)) {
        setSubjects((prev) => [...prev, form.subject]);
      }
    } catch (err) {
      alert("Failed to add note");
      console.error("Add note error:", err.response?.data || err.message);
    }
  };

  // Delete confirmation
  const confirmDeleteNote = (id) => {
    setNoteToDelete(id);
  };

  // Delete note
  const deleteNote = async () => {
    if (!noteToDelete) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(`${API_URL}/${noteToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes((prev) => prev.filter((note) => note._id !== noteToDelete));
      setNoteToDelete(null);
    } catch (err) {
      alert("Failed to delete note");
      console.error("Delete note error:", err.response?.data || err.message);
    }
  };

  // Toggle tags in form
  const toggleTag = (tag) => {
    setForm((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  // Update tags in NotesGrid
  const updateNoteTags = (id, updatedTags) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === id ? { ...note, tags: updatedTags } : note
      )
    );
  };

  // Calculate progress (done / total)
  const doneCount = filteredNotes.filter((note) =>
    note.tags?.includes("done")
  ).length;
  const progress =
    filteredNotes.length === 0
      ? 0
      : Math.round((doneCount / filteredNotes.length) * 100);

  return (
    <div className="flex flex-col h-screen bg-[#010311] text-blue-200">
      <Topbar onAddClick={() => setShowAddForm(true)} progress={progress} />
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          subjects={subjects}
          selectedSubject={selectedSubject}
          onSelectSubject={handleSelectSubject}
        />

        {/* Main Notes Area */}
        <main className="flex-1 overflow-auto p-6 relative">
          {/* Add Note Modal */}
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#010311]/80 backdrop-blur-md">
              <form
                onSubmit={addNote}
                className="relative bg-[#0b102b]/90 border border-[#1f2a5f] p-8 rounded-2xl shadow-2xl w-full max-w-3xl text-white animate-fadeIn"
              >
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-700 pb-3">
                  <h2 className="text-2xl font-semibold tracking-wide">
                    📝 Add New Note
                  </h2>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="text-gray-400 hover:text-white text-2xl transition"
                  >
                    ✕
                  </button>
                </div>

                {/* Title */}
                <input
                  type="text"
                  placeholder="Enter note title..."
                  value={form.title}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  className="w-full mb-4 p-3 rounded-lg bg-[#141a3b] border border-[#2a3570] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />

                {/* Subject */}
                <input
                  type="text"
                  placeholder="Subject (e.g., DSA, React, ML...)"
                  value={form.subject}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, subject: e.target.value }))
                  }
                  className="w-full mb-4 p-3 rounded-lg bg-[#141a3b] border border-[#2a3570] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />

                {/* Link */}
                <input
                  type="url"
                  placeholder="Attach a reference link (optional)"
                  value={form.link}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, link: e.target.value }))
                  }
                  className="w-full mb-4 p-3 rounded-lg bg-[#141a3b] border border-[#2a3570] focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                />

                {/* Content */}
                <textarea
                  placeholder="Start writing your note here..."
                  value={form.content}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, content: e.target.value }))
                  }
                  className="w-full h-64 mb-5 p-4 rounded-lg bg-[#141a3b] border border-[#2a3570] focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder-gray-400 text-[15px] leading-relaxed"
                />

                {/* Tags */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {["important", "doubt", "done"].map((tag) => (
                    <button
                      type="button"
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${
                        form.tags.includes(tag)
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                          : "bg-[#1c2241] text-gray-300 hover:bg-blue-500/20"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="px-5 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:opacity-90 transition font-semibold shadow-lg shadow-blue-600/40"
                  >
                    Save Note
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {noteToDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-[#0a0f2c] p-6 rounded-xl">
                <p>Are you sure you want to delete this note?</p>
                <div className="flex justify-end gap-2 mt-4">
                  <button
                    onClick={() => setNoteToDelete(null)}
                    className="px-4 py-2 bg-gray-500 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteNote}
                    className="px-4 py-2 bg-red-600 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          <div>
            {loading ? (
              <p className="text-center text-blue-300">Loading notes...</p>
            ) : filteredNotes.length === 0 ? (
              <p className="text-center text-blue-300">
                No notes found for this subject.
              </p>
            ) : (
              <NotesGrid
                notes={filteredNotes}
                onDeleteNote={confirmDeleteNote}
                onUpdateTags={updateNoteTags}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notes;
