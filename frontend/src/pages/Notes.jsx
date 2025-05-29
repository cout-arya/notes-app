import React, { useEffect, useState, useMemo } from "react";
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
  });

  const fetchNotes = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/notes", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      alert("Error fetching notes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSelectSubject = (subject) => {
    setSelectedSubject((prev) => (prev === subject ? "" : subject));
    setTimeout(() => setSelectedSubject(subject), 0);
  };

  const filteredNotes = useMemo(() => {
    return selectedSubject
      ? notes.filter((note) => note.subject === selectedSubject)
      : notes;
  }, [notes, selectedSubject]);

  const addNote = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      alert("Title and content are required");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Add note failed");
      const newNote = await res.json();
      setNotes((prev) => [newNote, ...prev]);
      setForm({ title: "", content: "", subject: "", tags: [] });
      setShowAddForm(false);
    } catch (err) {
      alert("Failed to add note");
      console.error(err);
    }
  };

  const confirmDeleteNote = (id) => {
    setNoteToDelete(id);
  };

  const deleteNote = async () => {
    if (!noteToDelete) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/notes/${noteToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Delete failed");
      setNotes((prev) => prev.filter((note) => note._id !== noteToDelete));
      setNoteToDelete(null);
    } catch (err) {
      alert("Failed to delete note");
      console.error(err);
    }
  };

  const toggleTag = (tag) => {
    setForm((prev) => {
      const tags = prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags };
    });
  };

  // ✅ Live tag update from NotesGrid
  const updateNoteTags = (id, updatedTags) => {
    setNotes((prevNotes) =>
      prevNotes.map((note) =>
        note._id === id ? { ...note, tags: updatedTags } : note
      )
    );
  };

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
        <Sidebar
          selectedSubject={selectedSubject}
          onSelectSubject={handleSelectSubject}
        />

        <main className="flex-1 overflow-auto p-6">
          {/* Add form */}
          {showAddForm && (
            <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-[#010311]/90 backdrop-blur-sm">
              <div className="w-full max-w-2xl mx-auto p-8 bg-[#0e1b33]/90 backdrop-blur rounded-xl shadow-2xl border border-[#1f2937] animate-slideDown">
                <h2 className="text-3xl font-bold mb-6 text-white">✍️ Add New Note</h2>
                <form onSubmit={addNote} className="space-y-6">
                  <input
                    type="text"
                    placeholder="Enter title"
                    value={form.title}
                    onChange={(e) =>
                      setForm({ ...form, title: e.target.value })
                    }
                    className="w-full bg-[#142c6c]/80 text-white placeholder-blue-300 border border-blue-800 rounded-lg px-4 py-3"
                    required
                  />
                  <textarea
                    placeholder="Write your note content here..."
                    value={form.content}
                    onChange={(e) =>
                      setForm({ ...form, content: e.target.value })
                    }
                    className="w-full bg-[#142c6c]/80 text-white border border-blue-800 rounded-lg px-4 py-3 h-40 resize-none"
                    required
                  />
                  <select
                    value={form.subject}
                    onChange={(e) =>
                      setForm({ ...form, subject: e.target.value })
                    }
                    className="w-full bg-[#142c6c]/80 text-white border border-blue-800 rounded-lg px-4 py-3"
                  >
                    <option value="">Select Subject (optional)</option>
                    <option value="English">English</option>
                    <option value="Maths">Maths</option>
                    <option value="Physics">Physics</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Biology">Biology</option>
                    <option value="Computer Science">Computer Science</option>
                  </select>
                  <div className="flex gap-4 flex-wrap">
                    {["important", "doubt", "done"].map((tag) => (
                      <label key={tag} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.tags.includes(tag)}
                          onChange={() => toggleTag(tag)}
                          className="accent-current"
                        />
                        <span className="capitalize text-blue-300">{tag}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex justify-end gap-4">
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-5 py-2 rounded-lg text-blue-300 hover:bg-[#1e3a8a]/50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-2 rounded-lg transition"
                    >
                      ➕ Add Note
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete modal */}
          {noteToDelete && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
              <div className="bg-[#0e1b33] p-6 rounded-lg max-w-sm w-full text-blue-200 shadow-lg">
                <h3 className="text-xl font-bold mb-4">Confirm Delete</h3>
                <p className="mb-6">
                  Are you sure you want to delete this note? This action cannot
                  be undone.
                </p>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() => setNoteToDelete(null)}
                    className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteNote}
                    className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 transition text-white"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Notes Display */}
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
                onUpdateTags={updateNoteTags} // ✅ pass live update handler
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Notes;
