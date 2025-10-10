import axios from "axios";

export const API_CONFIG = {
  BASE_URL: import.meta.env.BASEURL,
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: API_CONFIG.HEADERS,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",        
    VERIFY_TOKEN: "/auth/refresh",
  },
  L1TEAM: {
    CREATE: "/l1team",             
  },
  USER: {
    ALLUSER: "/user/alluser",
    ADD: "/user/add",
    EDIT: (id) => `/user/edit/${id}`,
    DELETE: (id) => `/user/delete/${id}`,
    SEARCH: "/users/search",
    GET_BY_ID: (id) => `/user/${id}`,
    CHANGE_PASSWORD: "/user/change-password",
    RESET_PASSWORD: "/user/reset-password",
  },
  QCTEAM: {
    GETFORMS: "/qcteam",
    GETFORM: (gid) => `/qcteam/gid?gid=${gid}`, 
    GETQC: "/qcteam/qcforms",
    GETFORMBYID: "/qcteam/id",
  },
  FEEDBACK: {
    CREATE: "/feedback",
    GETALL: "/feedback/getall",
    STATUS: (id) => `/feedback/${id}/status`
  },
  ADMIN: {
    UPLOAD_USERS: "/super/users",
    UPLOAD_FORMS: "/super/forms",
    GET_QC_FORMS: "/super/getqcform",
    GET_ALL_METRICS: "/super/allmetric",
  },
};
