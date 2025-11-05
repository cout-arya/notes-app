import express from "express";
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  updateNoteTags,
} from "./controllers/noteController.js";
import requireAuth from "./middleware/authMiddleware.js";

const router = express.Router();

// Protect all note routes
router.use(requireAuth);

router.get("/", getNotes);
router.post("/", createNote);
router.patch("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id/tags", updateNoteTags);

export default router;
