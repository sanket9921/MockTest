import API from "../api/axios";

export const deleteOption = async (questionId) => {
  const response = await API.delete("/options/" + questionId);
  return response.data;
};

export const updateOption = async (id, formData) => {
  return await API.put("/options/" + id, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
