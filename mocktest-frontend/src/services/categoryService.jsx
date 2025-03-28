import API from "../api/axios";

export const getCategories = async () => {
  return await API.get("/categories");
};

export const createCategory = async (categoryData) => {
  return await API.post("/categories", categoryData);
};

export const updateCategory = async (id, categoryData) => {
  return await API.put("/categories/" + id, categoryData);
};
