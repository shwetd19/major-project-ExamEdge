const mongoose = require("mongoose");

const performanceAnalysisSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    report: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Report",
      required: true,
    },
    analysis: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "PerformanceAnalysis",
  performanceAnalysisSchema
);
