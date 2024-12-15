// const express = require("express");
// const router = express.Router();
// const { generatePerformanceAnalysis } = require("../performanceAnalysis");

// // Route to generate performance analysis
// router.post("/analyze", async (req, res) => {
//   const { reportId } = req.body;

//   if (!reportId) {
//     return res.status(400).json({ success: false, message: "Report ID is required" });
//   }

//   try {
//     const result = await generatePerformanceAnalysis(reportId);
//     if (result.success) {
//       res.status(200).json({
//         success: true,
//         message: "Performance analysis generated successfully",
//         data: result.analysis,
//       });
//     } else {
//       res.status(500).json({ success: false, message: result.error });
//     }
//   } catch (error) {
//     console.error("Error in /analyze route:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// });

// module.exports = router;


const express = require("express");
const router = express.Router();
const { generatePerformanceAnalysis } = require("../performanceAnalysis");
const PerformanceAnalysis = require("../models/PerformanceAnalysis");

// Route to generate performance analysis
router.post("/analyze", async (req, res) => {
  const { reportId } = req.body;

  if (!reportId) {
    return res.status(400).json({ success: false, message: "Report ID is required" });
  }

  try {
    const result = await generatePerformanceAnalysis(reportId);
    if (result.success) {
      res.status(200).json({
        success: true,
        message: "Performance analysis generated successfully",
        data: result.analysis,
      });
    } else {
      res.status(500).json({ success: false, message: result.error });
    }
  } catch (error) {
    console.error("Error in /analyze route:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

// New route to get performance analysis by userId and reportId (POST)
router.post("/performance-analyses", async (req, res) => {
  const { user, report } = req.body;

  // Validate request body
  if (!user || !report) {
    return res.status(400).json({ success: false, message: "User ID and Report ID are required" });
  }

  try {
    // Find performance analysis by userId and reportId
    const analyses = await PerformanceAnalysis.find({ user, report });

    if (analyses.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No performance analysis found for the given user and report",
      });
    }

    res.status(200).json({
      success: true,
      message: "Performance analyses retrieved successfully",
      data: analyses,
    });
  } catch (error) {
    console.error("Error in /performance-analyses route:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});

module.exports = router;
