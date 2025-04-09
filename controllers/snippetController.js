const Snippet = require("../models/Snippet");
const fs = require("fs");
const os = require("os");
const path = require("path");
const {
  analyzeAndOptimizeCode,
  getComplexity,
} = require("../services/geminiService");

// Get AI-Optimized code
const getOptimized = async (req, res) => {
  try {
    const aiResponse = await analyzeAndOptimizeCode(req.body.code);
    const response = JSON.parse(aiResponse);

    res.status(201).json({ message: "AI-Optimized Code", snippet: response });
  } catch (error) {
    res.status(500).json({
      message: "Error creating AI-optimized code",
      error: error.message,
    });
  }
};

// ✅ Create a snippet with AI analysis
const createSnippet = async (req, res) => {
  try {
    const { title, language, code, tags } = req.body;
    const aiResponse = await getComplexity(code);

    const response = JSON.parse(aiResponse);

    const snippet = new Snippet({
      user: req.user.id,
      username: req.user.username,
      title,
      language,
      code,
      timeComplexity: response.timeComplexity,
      spaceComplexity: response.spaceComplexity,
      tags: tags,
    });

    await snippet.save();

    res.status(201).json({ message: "Snippet saved", snippet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating snippet", error: error.message });
  }
};

// ✅ Get all snippets
const getSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find();
    res.status(200).json({ snippets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching snippets", error: error.message });
  }
};

// ✅ Get all snippets for the logged-in user
const getUserSnippets = async (req, res) => {
  try {
    const snippets = await Snippet.find({ user: req.user.id });
    res.status(200).json({ snippets });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching snippets", error: error.message });
  }
};

// ✅ Get a single snippet by ID
const getSnippetById = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet || snippet.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Snippet not found" });
    }
    res.status(200).json({ snippet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching snippet", error: error.message });
  }
};

// ✅ Get the original snippet (for forking)
const getOriginalSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet) {
      return res.status(404).json({ message: "Snippet not found" });
    }
    res.status(200).json({ snippet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching snippet", error: error.message });
  }
};

// ✅ Update snippet (Allow user to replace code with AI-optimized code)
const updateSnippet = async (req, res) => {
  try {
    const { title, language, code, tags } = req.body;

    let snippet = await Snippet.findById(req.params.id);
    if (!snippet || snippet.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    const aiResponse = await getComplexity(code);
    const response = JSON.parse(aiResponse);

    snippet.title = title;
    snippet.language = language;
    snippet.code = code;
    snippet.tags = tags;
    snippet.timeComplexity = response.timeComplexity;
    snippet.spaceComplexity = response.spaceComplexity;

    await snippet.save();
    res.status(200).json({ message: "Snippet updated", snippet });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating snippet", error: error.message });
  }
};

// ✅ Delete snippet
const deleteSnippet = async (req, res) => {
  try {
    const snippet = await Snippet.findById(req.params.id);
    if (!snippet || snippet.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Snippet not found" });
    }

    await snippet.deleteOne();
    res
      .status(200)
      .json({ success: true, message: "Snippet deleted successfully" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting snippet",
      error: error.message,
    });
  }
};

const forkSnippet = async (req, res) => {
  try {
    // console.log(req.body);

    const { originalSnippetId } = req.body;

    // Find the original snippet
    const originalSnippet = await Snippet.findById(originalSnippetId);
    if (!originalSnippet) {
      return res.status(404).json({ message: "Original snippet not found" });
    }

    // Create a new snippet based on the original snippet
    const forkedSnippet = new Snippet({
      user: req.user.id, // Set the current user as the owner of the forked snippet
      username: req.user.username,
      title: originalSnippet.title,
      language: originalSnippet.language,
      code: originalSnippet.code,
      timeComplexity: originalSnippet.timeComplexity,
      spaceComplexity: originalSnippet.spaceComplexity,
      tags: originalSnippet.tags,
      forkedFrom: originalSnippet._id, // Reference to the original snippet
    });

    // Save the forked snippet
    await forkedSnippet.save();

    res.status(201).json({
      message: "Snippet forked successfully",
      snippet: forkedSnippet,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error forking snippet",
      error: error.message,
    });
  }
};

module.exports = {
  createSnippet,
  getSnippets,
  getUserSnippets,
  getSnippetById,
  updateSnippet,
  deleteSnippet,
  getOptimized,
  forkSnippet,
  getOriginalSnippet,
};
