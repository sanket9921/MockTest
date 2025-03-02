import API from "../api/axios";

export const updateAnswers = async (questionId, correct_answers) => {
  return await API.put("/answer/" + questionId, { correct_answers });
};
