// qcTeamAPI.js
import { apiClient, API_ENDPOINTS } from "./config";

export const qcTeamAPI = {
  getForms: async (params = {}) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.QCTEAM.GETFORMS, { 
        params: {
          ...params,
          ...(params.fromDate && { fromDate: params.fromDate }),
          ...(params.toDate && { toDate: params.toDate }),
        }
      });
      return response.data; 
    } catch (error) {
      console.error('Error fetching forms:', error);
      throw error;
    }
  },

  getFormByGid: async (gid) => {
    try {
      const response = await apiClient.get(API_ENDPOINTS.QCTEAM.GETFORM(gid));
      return response.data;
    } catch (error) {
      console.error('Error fetching form by GID:', error);
      throw error;
    }
  },

  searchByGid: async (gid) => {
    try {
      const response = await apiClient.get(`${API_ENDPOINTS.QCTEAM.GETFORMS}/gid`, {
        params: { gid }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching by GID:', error);
      throw error;
    }
  },

  getQcForms: async (email) => {
    const response = await apiClient.get(API_ENDPOINTS.QCTEAM.GETQC, { params: { email } });
    return response.data;
  },

  getFormById: async (id) => {
    const response = await apiClient.get(API_ENDPOINTS.QCTEAM.GETFORMBYID, { params: { id } });
    return response.data;
  },

  saveQcForm: async (qcFormData) => {
    const response = await apiClient.post("/qcteam/save", qcFormData);
    return response.data;
  },
};