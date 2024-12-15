// const axios = require("axios");
// const PerformanceAnalysis = require("./models/PerformanceAnalysis"); // Create this model
// const Report = require("./models/reportModel"); // Assuming you have a Report model

// const generatePerformanceAnalysis = async (reportId) => {
//   try {
//     // Fetch report by ID
//     const report = await Report.findById(reportId).populate("user").populate("exam");
//     if (!report) {
//       throw new Error("Report not found");
//     }

//     const openAIKey = process.env.OPENAI_API_KEY;
//     if (!openAIKey) {
//       throw new Error("OpenAI API key not configured");
//     }

//     const prompt = `
//       User: ${report.user.name}
//       Exam: ${report.exam.name}
//       Duration: ${report.exam.duration} minutes
//       Total Marks: ${report.exam.totalMarks}
//       Passing Marks: ${report.exam.passingMarks}
//       Questions: ${report.exam.questions.length}
//       Correct Answers: ${report.result.correctAnswers.length}
//       Wrong Answers: ${report.result.wrongAnswers.length}
//       Verdict: ${report.result.verdict}

//       Analyze the performance of the user, highlighting their strengths, weaknesses, and provide suggestions for improvement. Format the output with a detailed analysis.
//     `;

//     // Call OpenAI API
//     const response = await axios.post(
//       "https://api.openai.com/v1/completions",
//       {
//         model: "text-davinci-003",
//         prompt,
//         max_tokens: 500,
//         temperature: 0.7,
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${openAIKey}`,
//         },
//       }
//     );

//     const detailedAnalysis = response.data.choices[0].text.trim();

//     // Save analysis to the database
//     const performanceAnalysis = new PerformanceAnalysis({
//       user: report.user._id,
//       report: report._id,
//       analysis: detailedAnalysis,
//     });

//     await performanceAnalysis.save();

//     return { success: true, analysis: detailedAnalysis };
//   } catch (error) {
//     console.error("Error generating performance analysis:", error.message);
//     return { success: false, error: error.message };
//   }
// };

// module.exports = { generatePerformanceAnalysis };

const axios = require("axios");
const mongoose = require("mongoose");
const PerformanceAnalysis = require("./models/PerformanceAnalysis");
const Report = require("./models/reportModel");

const generatePerformanceAnalysis = async (reportId) => {
  try {
    // Fetch the report from MongoDB using the provided reportId
    const report = await Report.findById(reportId)
      .populate("user") // Populate user details
      .populate("exam"); // Populate exam details

    if (!report) {
      throw new Error("Report not found");
    }

    // Construct the prompt for OpenAI API
    const prompt = `
      Analyze the following performance report and provide a detailed summary with strengths, weaknesses, and suggestions for improvement:

      User: ${report.user.name}
      Email: ${report.user.email}
      Exam: ${report.exam.name}
      Duration: ${report.exam.duration} minutes
      Total Marks: ${report.exam.totalMarks}
      Passing Marks: ${report.exam.passingMarks}
      Total Questions: ${report.exam.questions.length}
      Correct Answers: ${report.result.correctAnswers.length}
      Wrong Answers: ${report.result.wrongAnswers.length}
      Verdict: ${report.result.verdict}

      Details of Correct Answers:
      ${report.result.correctAnswers
        .map(
          (q) => `
          - Question: ${q.name}
            Answer: ${q.correctOption}
        `
        )
        .join("")}

      Details of Wrong Answers:
      ${report.result.wrongAnswers
        .map(
          (q) => `
          - Question: ${q.name}
            Correct Answer: ${q.correctOption}
        `
        )
        .join("")}
    `;

    // Use OpenAI API to generate the analysis
    const openAIKey = process.env.OPENAI_API_KEY;
    let detailedAnalysis = "";
    
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo", // Or "gpt-4"
          messages: [
            {
              role: "system",
              content:
                "You are an assistant that provides detailed performance analysis.",
            },
            {
              role: "user",
              content: prompt, // Ensure `prompt` is defined and valid
            },
          ],
          max_tokens: 500,
          temperature: 0.7,
        },
        {
          headers: {
            Authorization: `Bearer ${openAIKey}`,
          },
        }
      );

      console.log(response.data); // Log the OpenAI API response

      // Access response data inside the try block
      detailedAnalysis = response.data.choices[0]?.message.content.trim();

      if (!detailedAnalysis) {
        throw new Error("Failed to get analysis from OpenAI");
      }

    } catch (error) {
      console.error(
        "Error generating performance analysis:",
        error.response ? error.response.data : error.message
      );
      throw error; // Propagate the error
    }

    // Save the analysis in the PerformanceAnalysis collection
    const performanceAnalysis = new PerformanceAnalysis({
      user: report.user._id,
      report: report._id,
      analysis: detailedAnalysis,
    });

    await performanceAnalysis.save();

    return { success: true, analysis: detailedAnalysis };
  } catch (error) {
    console.error("Error generating performance analysis:", error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { generatePerformanceAnalysis };
