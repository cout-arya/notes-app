const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    subject: { type: String }, // Optional subject
    tags: [{ type: String }],  // Tags like ["important", "doubt", "done"]
    link: { type: String },    // ✅ New: optional link field
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
