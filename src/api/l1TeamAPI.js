import { apiClient, API_ENDPOINTS } from "./config";

export const l1TeamAPI = {
  createForm: async (formData) => {
    const response = await apiClient.post(API_ENDPOINTS.L1TEAM.CREATE, formData);
    return response.data;
  },
};
