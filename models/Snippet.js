const mongoose = require("mongoose");

const SnippetSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    username: { type: String, required: true },
    title: { type: String, required: true },
    language: { type: String, required: true },
    code: { type: String, required: true },
    timeComplexity: String,
    spaceComplexity: String,
    tags: { type: [String], default: [] },
    forkedFrom: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Snippet",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Snippet", SnippetSchema);
