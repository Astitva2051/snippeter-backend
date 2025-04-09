const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createSnippet,
  getSnippets,
  getUserSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  getOptimized,
  forkSnippet,
  getOriginalSnippet,
} = require("../controllers/snippetController");

// 🔹 CRUD Endpoints
router.post("/add-snippet", authMiddleware, createSnippet); // Create snippet with AI analysis
router.get("/userSnippets", authMiddleware, getUserSnippets); // Get all user snippets
router.post("/optimized-code", authMiddleware, getOptimized); // Get optimized code

router.post("/fork-snippet", authMiddleware, forkSnippet); // Fork a snippet
router.get("/", authMiddleware, getSnippets); // Get all snippets

router.put("/edit-snippet/:id", authMiddleware, updateSnippet); // Update snippet (Replace with AI-optimized code if needed)
router.get("/original-snippet/:id", authMiddleware, getOriginalSnippet); // Get single snippet
router.get("/:id", authMiddleware, getSnippetById); // Get single snippet
router.delete("/:id", authMiddleware, deleteSnippet); // Delete snippet

module.exports = router;
