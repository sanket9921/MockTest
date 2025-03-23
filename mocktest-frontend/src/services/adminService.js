import API from "../api/axios";

export const getAdminIds = async () => {
  return await API.get("/admins");
};
