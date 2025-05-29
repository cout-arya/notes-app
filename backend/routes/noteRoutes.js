const express = require("express");
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  updateNoteTags,
} = require("../controllers/noteController");
const requireAuth = require("../middleware/authMiddleware");

router.use(requireAuth);

router.get("/", getNotes);
router.post("/", createNote);
router.patch("/:id", updateNote);   // <-- changed put to patch

router.delete("/:id", deleteNote);
router.patch("/:id/tags", updateNoteTags);
module.exports = router;
