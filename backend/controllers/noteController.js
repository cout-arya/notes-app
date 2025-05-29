// controllers/noteController.js
const Note = require("../models/Note");

// Get all notes for user
const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

// Create new note
const createNote = async (req, res) => {
  const { title, content, subject, tags } = req.body;

  try {
    const note = new Note({
      title,
      content,
      subject,
      tags,
      user: req.user.id,
    });

    await note.save();
    res.status(201).json(note);
  } catch (err) {
    console.error("Note creation error:", err);
    res.status(500).json({ error: "Failed to create note" });
  }
};

// Update a note
// PATCH /api/notes/:id
const updateNote = async (req, res) => {
  const { id } = req.params;
  const { title, content, subject, tags } = req.body;

  try {
    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ error: "Note not found" });

    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (subject !== undefined) note.subject = subject;
    if (tags !== undefined) note.tags = tags; // update tags here!

    await note.save();
    res.json(note);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!note) {
      return res.status(404).json({ message: "Note not found or unauthorized" });
    }
    res.json({ message: "Note deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};
// Update tags only
const updateNoteTags = async (req, res) => {
  const { tags } = req.body; // expecting array of tags
  try {
    const updated = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { tags },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ error: "Note not found or unauthorized" });
    }
    res.json(updated);
  } catch (err) {
    console.error("Note tags update error:", err);
    res.status(500).json({ error: "Failed to update tags" });
  }
};

module.exports = { getNotes, createNote, updateNote, deleteNote, updateNoteTags };
