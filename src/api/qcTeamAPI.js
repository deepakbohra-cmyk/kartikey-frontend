import { apiClient, API_ENDPOINTS } from "./config";

export const qcTeamAPI = {
  getForms: async (params) => {
    const response = await apiClient.get(API_ENDPOINTS.QCTEAM.GETFORMS, { params });
    return response.data;
  },

  getFormByGid: async (gid) => {
    const response = await apiClient.get(API_ENDPOINTS.QCTEAM.GETFORM(gid));
    return response.data;
  },
};
