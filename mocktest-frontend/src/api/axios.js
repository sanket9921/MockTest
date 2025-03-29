import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:5000/api",
  // baseURL: "http://164.92.115.205:5000/api",
  withCredentials: true,
});

export default API;
