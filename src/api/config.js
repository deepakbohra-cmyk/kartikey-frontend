import axios from "axios";

export const API_CONFIG = {
  BASE_URL: "http://localhost:8080/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
  },
};

export const apiClient = axios.create({
    baseURL : API_CONFIG.BASE_URL,
    timeout : API_CONFIG.TIMEOUT,
    headers : API_CONFIG.HEADERS    
})

export const API_ENDPOINTS = {
    SHEET :{
        
    }
}