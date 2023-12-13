import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl = ClientSide.LikeStudioAPI + "/api/file";

const FileManagerApi = {
  async getListFile(functionType, titleId) {
    try {
      const response = await axios.get(`${baseUrl}/getByTitle`, {
        params: {
          functionType: functionType,
          titleId: titleId
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async uploadFile(file) {
    try {
      const response = await axios.post(`${baseUrl}/upload`, file, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async downloadFile(path) {
    try {
      const response = await axios.get(`${baseUrl}/download`, {
        params: {
          path: path
        },
        responseType: 'blob',
      });

      return response.data
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
};

export default FileManagerApi;

