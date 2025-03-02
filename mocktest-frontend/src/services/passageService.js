import API from "../api/axios";

export const updatePassage = async (id, formData) => {
  return await API.put("/passage/" + id, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePassage = async (passage_id) => {
  const response = await API.delete("/passage/" + passage_id);
  return response.data;
};
