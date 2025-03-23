import { data } from "react-router-dom";
import API from "../api/axios";

export const fetchTestsByGroup = async (groupId, page = 1, limit = 9) => {
  const response = await API.get(`/tests/group/${groupId}`, {
    params: { page, limit },
  });
  return response.data;
};

export const createTest = async (data) => {
  return await API.post("/tests", data);
};
export const updateTest = async (id, data) => {
  return await API.put("/tests/" + id, data);
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
export const toggleTestPublishStatus = async (testId, publishStatus) => {
  return await API.patch(`tests/${testId}/publish`, { publish: publishStatus });
};
