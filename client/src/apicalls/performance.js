import { default as axiosInstance } from ".";

// Generate performance analysis for a given report
export const generatePerformanceAnalysis = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/performance/analyze", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

// Get performance analyses by user and report (userId, reportId)
export const getPerformanceAnalysesByUserAndReport = async (payload) => {
  try {
    const response = await axiosInstance.post("/api/performance/performance-analyses", payload);
    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
