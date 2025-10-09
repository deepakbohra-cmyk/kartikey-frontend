import { apiClient, API_ENDPOINTS } from "./config";

export const authAPI = {
  login: async (email, password) => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, { email, password });
    return response.data;
  },

  logout: async () => {
    const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },

  getUserData: async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      throw new Error("No auth token found");
    }

    const response = await apiClient.post(
      API_ENDPOINTS.AUTH.VERIFY_TOKEN,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  },
};
