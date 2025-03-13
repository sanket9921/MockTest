import API from "../api/axios";

export const fetchTestGroups = async () => {
  const response = await API.get("/test-groups");
  return response.data;
};

export const createTestGroup = async (data) => {
  return await API.post("/test-groups", data);
};

export const updateTestGroup = async (id, data) => {
  return await API.put("/test-groups/" + id, data);
};

export const getTestGroupById = async (id) => {
  console.log("hello");
  console.log(id);
  const res = await API.get("/test-groups/" + id);
  console.log(res);
  return res;
};
