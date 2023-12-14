import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl = ClientSide.LikeStudioAPI + "/api/vmdFile";

const VmdFileApi = {
  async getListFile(vmdId) {
    try {
      const response = await axios.get(`${baseUrl}/findByVmdId`, {
        params: {
            vmdId: vmdId
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

  async downloadFile(filePaths) {
    try {
      const response = await axios.post(`${baseUrl}/download`, filePaths , {responseType: 'blob'});

      return response.data
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async loadImg(imagePath) {
    try {
      const response = await axios.get(`${baseUrl}/images`, {
        params: {
          path: imagePath,
        },
        responseType: 'arraybuffer',
      });

      return response.data
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  

};

export default VmdFileApi;

