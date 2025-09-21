import { apiClient, API_ENDPOINTS } from "./config";

export const userAPI = {
  getAllUsers: async () => {
    const response = await apiClient.get(API_ENDPOINTS.USER.ALLUSER);
    return response.data;
  },

  addUser: async (userData) => {
    const response = await apiClient.post(API_ENDPOINTS.USER.ADD, userData);
    return response.data;
  },

  editUser: async (id, userData) => {
    const response = await apiClient.patch(API_ENDPOINTS.USER.EDIT(id), userData);
    return response.data;
  },

  deleteUser: async (id) => {
    const response = await apiClient.delete(API_ENDPOINTS.USER.DELETE(id));
    return response.data;
  },
};
