import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl= ClientSide.LikeStudioAPI + "/api/faq";

const FaqApi = {
  async getListFaqForAdmin(param) {
    try {
      const response = await axios.get(`${baseUrl}/search`, {
        params: { keyword: param },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async getListFaqForUser(category, param) {
    try {
      const response = await axios.get(`${baseUrl}/searchForUser`, {
        params: { 
          category: category,
          keyword: param 
        },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },

  async getByCategory(param) {
    try {
      const response = await axios.get(`${baseUrl}/getByCategory`, {
        params: { category: param },
      });

      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }
};

export default FaqApi;

