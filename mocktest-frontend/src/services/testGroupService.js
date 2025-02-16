import API from "../api/axios";

export const fetchTestGroups = async () => {
  const response = await API.get("/test-groups");
  return response.data;
};

export const createTestGroup = async (data) => {
  return await API.post("/test-groups", data);
};
