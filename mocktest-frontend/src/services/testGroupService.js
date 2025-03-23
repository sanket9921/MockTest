import API from "../api/axios";

export const fetchTestGroups = async (page = 1, limit = 10) => {
  const response = await API.get(`/test-groups?page=${page}&limit=${limit}`);
  return response.data;
};

export const createTestGroup = async (data) => {
  return await API.post("/test-groups", data);
};

export const updateTestGroup = async (id, data) => {
  return await API.put("/test-groups/" + id, data);
};

export const getTestGroupById = async (id) => {
  const res = await API.get("/test-groups/" + id);
  return res;
};

export const togglePublishTestGroup = async (id, publish) => {
  return API.patch(`/test-groups/${id}/toggle-publish`, { publish });
};
