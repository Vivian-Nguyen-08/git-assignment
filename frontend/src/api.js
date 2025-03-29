import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",  
  withCredentials: true,  // ensures cookies (if used) are sent
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

export default api;
