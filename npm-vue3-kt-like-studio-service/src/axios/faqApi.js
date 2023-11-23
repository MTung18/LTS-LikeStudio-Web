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

  async getFaqById(id) {
    try {
     const response = await axios.get(`${baseUrl}/getFaqById`, {
      params: { id: id },
     });
  
     return response.data;
    } catch (error) {
     console.error('Error fetching data:', error);
     throw error;
    }
   },

  async updateFaq(faq) {
    try {
     const response = await axios.put(`${baseUrl}/edit`, faq);
     return response.data;
    } catch (error) {
     console.error('Failed to update FAQ:', error);
    }
   },

   async addNotice(faq) {
    try {
     const response = await axios.post(`${baseUrl}/create`, faq);
     return response.data;
    } catch (error) {
     console.error('Failed to update FAQ:', error);
    }
   },

   async deleteDataById(id) {
    try {
     const response = await axios.get(`${baseUrl}/delete`, {
      params: { id: id },
     });
     return response.data;
    } catch (error) {
     console.error('Delete error.', error);
     throw error;
    }
   },
};

export default FaqApi;

