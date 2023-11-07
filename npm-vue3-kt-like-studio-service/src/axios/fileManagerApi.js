import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl= ClientSide.LikeStudioAPI + "/api/file";

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
};

export default FileManagerApi;

