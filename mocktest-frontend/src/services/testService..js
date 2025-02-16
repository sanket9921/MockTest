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
