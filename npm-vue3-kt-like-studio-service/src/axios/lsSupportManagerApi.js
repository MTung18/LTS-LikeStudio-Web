import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl = ClientSide.LikeStudioAPI + "/api/lsManagerSupport";

const LsSupportManagerApi = {
  async getLsSupportManagerListForUser(keyword, userId, startDate, endDate, page) {
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
  async getAllLsSupportManager() {
    try {
      const response = await axios.get(`${baseUrl}/all`, {
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },
  async deleteLsSupportManagerForUser(id) {
    try {
      const response = await axios.delete(`${baseUrl}/deleteForUser`, {
        params: {id: id}
      });

      console.log('axios delete');
      if(response.status === 200) return true
      else throw new Error("Failed to delete"); 

    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },
};

export default LsSupportManagerApi;

