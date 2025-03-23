import API from "../api/axios";

export const updateAnswers = async (questionId, correct_answers) => {
  return await API.put("/answer/" + questionId, { correct_answers });
};

export const updateAnswerOfFib = async (questionId, correctTextAnswer) => {
  return await API.put(`/answer/updateAnswerOfFib/${questionId}`, {
    correctTextAnswer,
  });
};
