import API from "../api/axios";

export const fetchTestsByGroup = async (groupId) => {
  const response = await API.get(`/tests/group/${groupId}`);
  return response.data;
};

export const createTest = async (data) => {
  return await API.post("/tests", data);
};

export const createQuestion = async (data) => {
  return await axios.post("/questions", data);
};

export const getTestDetails = async (testId) => {
  try {
    const response = await API.get(`tests/${testId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching test details:", error);
    throw error;
  }
};

export const startTestAttempt = async (testId) => {
  try {
    const response = await API.post(`/tests/${testId}/start`, { user_id: 1 });
    return response.data.attemptId;
  } catch (error) {
    console.error("Error starting test:", error);
    throw error;
  }
};

export const getPaginatedQuestion = async (attemptId, page) => {
  const response = await API.get(
    `/attempts/${attemptId}/questions?page=${page}`
  );
  return response.data;
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

export const getTestAttemptStats = async (attemptId) => {
  const res = await API.get(`/attempts/getTestAttemptStats/${attemptId}`);
  return res.data;
};
