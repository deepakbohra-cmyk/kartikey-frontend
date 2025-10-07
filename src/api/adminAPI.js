import { apiClient, API_ENDPOINTS } from "./config";

export const adminAPI = {
  uploadUsers: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.UPLOAD_USERS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  uploadForms: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post(API_ENDPOINTS.ADMIN.UPLOAD_FORMS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getQcForms: async (params = {}) => {
    // params: { page, size, email, workType, gid, decision, fromDate, toDate }
    const response = await apiClient.get(API_ENDPOINTS.ADMIN.GET_QC_FORMS, { params });
    return response.data;
  },
};
