import API from "../api/axios";

export const submitQuestion = async (data) => {
  return await API.post("/questions/addquestion2", data);
};
