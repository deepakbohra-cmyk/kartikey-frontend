import { apiClient, API_ENDPOINTS } from "./config";

export const feedbackAPI = {
  createFeedback: async (feedbackData) => {
    const response = await apiClient.post(API_ENDPOINTS.FEEDBACK.CREATE, feedbackData);
    return response.data;
  },

  getAllFeedback : async ()=>{
    const response = await apiClient.get(API_ENDPOINTS.FEEDBACK.GETALL);
    console.log(response)
    return  response.data
  },

  changeStatus : async (id , payload) => {
    const response = await apiClient.patch(API_ENDPOINTS.FEEDBACK.STATUS(id) , payload)
    return response;
  }
};
