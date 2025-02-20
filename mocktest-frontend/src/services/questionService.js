import API from "../api/axios";

export const submitQuestion = async (formData) => {
  return await API.post("/questions/addquestion2", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updateQuestion = async (id, formData) => {
  return await API.put("/questions/" + id, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
export const fetchQuestionsByTestId = async (testId) => {
  const response = await API.get(`/questions/testquestions/${testId}`);
  return response.data.data;
};

export const deleteQuestion = async (questionId) => {
  const response = await API.delete("/questions/" + questionId);
  return response.data;
};
