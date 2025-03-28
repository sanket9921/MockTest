import API from "../api/axios";

export const startTestAttempt = async (testId) => {
  try {
    const response = await API.post(`/tests/${testId}/start`, { user_id: 1 });
    return response.data.attemptId;
  } catch (error) {
    console.error("Error starting test:", error);
    throw error;
  }
};

export const getTestAttsemptQuestions = async (attemptId) => {
  const response = await API.get(`/attempts/${attemptId}/questions`);
  return response.data.data;
};

export const saveUserAnswer = async (attemptId, questionId, answer) => {
  await API.post(`/attempts/${attemptId}/answer`, {
    question_id: questionId,
    answer,
  });
};

export const submitTest = async (attemptId) => {
  await API.post(`/attempts/${attemptId}/submit`);
};

export const markQuestionForReview = async (
  attemptId,
  questionId,
  markedForReview
) => {
  await API.post(`/attempts/${attemptId}/mark-review`, {
    question_id: questionId,
    marked_for_review: markedForReview,
  });
};

export const clearAnswer = async (attemptId, questionId) => {
  await API.post(`/attempts/${attemptId}/clearAnswer`, {
    question_id: questionId,
  });
};

export const getTestAttemptStats = async (attemptId) => {
  const res = await API.get(`/attempts/getTestAttemptStats/${attemptId}`);
  return res.data;
};

export const getResult = async (attemptId) => {
  const res = await API.get(`attempts/${attemptId}/result`);
  return res.data;
};

export const getRemainingTime = async (attemptId) => {
  const res = await API.get(`attempts/getRemainingTime/${attemptId}`);
  return res.data;
};

export const getInProgressTests = async () => {
  const response = await API.get("/attempts/in-progress");
  return response.data.data;
};

export const getCompletedTests = async (page = 1, limit = 8) => {
  const response = await API.get(`/attempts/testcompleted`, {
    params: { page, limit },
  });
  return response.data;
};

export const getTopCategories = async (limit = 5) => {
  try {
    const response = await API.get(`attempts/top-categories?limit=${limit}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching top categories:", error);
    throw error;
  }
};

export const getCategoryWiseScores = async (categoryId) => {
  try {
    const response = await API.get("/attempts/category-wise-scores", {
      params: { categoryId },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category-wise scores:", error);
    return {
      Easy: { final_score: 0 },
      Medium: { final_score: 0 },
      Hard: { final_score: 0 },
    };
  }
};

export const getCategoryAverageScores = async (startDate, endDate) => {
  try {
    const response = await API.get("/attempts/category-average-scores", {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching category average scores:", error);
    return { data: [], attemptedCategories: [] };
  }
};
