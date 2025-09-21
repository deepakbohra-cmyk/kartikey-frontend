import { apiClient, API_ENDPOINTS } from "./config";

export const feedbackAPI = {
  createFeedback: async (feedbackData) => {
    const response = await apiClient.post(API_ENDPOINTS.FEEDBACK.CREATE, feedbackData);
    return response.data;
  },
};
