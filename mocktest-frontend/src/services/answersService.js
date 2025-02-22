import API from "../api/axios";

export const updateAnswers = async (id, correct_answers) => {
  return await API.put("/answer/" + id, { correct_answers });
};
