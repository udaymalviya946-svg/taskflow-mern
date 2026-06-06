import axios from "axios";

const API = axios.create({
  baseURL: "https://taskflow-mern-nzuo.onrender.com/api",
});

export default API;