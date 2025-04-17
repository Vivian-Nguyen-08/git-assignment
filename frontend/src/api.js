import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  timeout: 5000, // 5 second timeout
});

// Add a request interceptor to include the JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration and connection errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error("Connection refused. Is the backend server running?");
      return Promise.reject(new Error("Cannot connect to server. Please make sure the backend is running."));
    }
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("access_token");
      localStorage.removeItem("token_type");
      window.location.href = "/login";
    }
    
    console.error("Response error:", error);
    return Promise.reject(error);
  }
);





export const addMemberToGroup = async (groupId, email) => {
  const response = await fetch(`/api/addMembers/?group_id=${groupId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),  // Send email in a dictionary
  });
  
  if (!response.ok) {
    throw new Error('Failed to add member');
  }
  
  return await response.json();
};

export const removeMemberFromGroup = async (groupId, email) => {
  const response = await fetch(`/api/removeMembers/?group_id=${groupId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),  // Send email in a dictionary
  });
  
  if (!response.ok) {
    throw new Error('Failed to remove member');
  }
  
  return await response.json();
};