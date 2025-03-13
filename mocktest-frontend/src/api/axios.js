import axios from "axios";

const API = axios.create({
  baseURL: "http://192.168.93.242:5000/api",
  withCredentials: true,
});

export default API;
