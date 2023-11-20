import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl= ClientSide.LikeStudioAPI + "/api/faq";

const FaqApi = {
  async getListFaqForAdmin(keyword = null, category = null, startDate = null, endDate = null, page = null) {
    try {
      const response = await axios.get(`${baseUrl}/search`, {
        params: { 
          keyword: keyword, 
          category: category,
          startDate: startDate,
          endDate: endDate,
          page: page
         },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async getListFaqForUser(keyword, category, page) {
    try {
      const response = await axios.get(`${baseUrl}/searchForUser`, {
        params: {
          keyword: keyword,
          category: category,
          page: page
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },
};

export default FaqApi;

