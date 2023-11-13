import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl= ClientSide.LikeStudioAPI + "/api/lsManagerSupport";

const LsSupportManagerApi = {
  async getLsSupportManagerListForUser(keyword,userId,startDate,endDate,page) {
    try {
      const response = await axios.get(`${baseUrl}/getByKeywordForUser`, {
        params: { 
          keyword: keyword,
          userId: userId,
          startDate: startDate,
          endDate: endDate,
          page: page,
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },
  async getLsSupportManagerById(id) {
    try {
      const response = await axios.get(`${baseUrl}/getById`, {
        params: { 
          id: id
        },
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },
};

export default LsSupportManagerApi;

