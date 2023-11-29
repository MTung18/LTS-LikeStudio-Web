import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl = ClientSide.LikeStudioAPI + "/api/vmd" ;
const VmdApi = {
    async getAllVmdForUser(category, keyword, page) {
     try {
      const response = await axios.get(`${baseUrl}/searchForUser`, {
       params: {
        category : category,
        keyword: keyword,
        page: page
       },
      });
      return response.data.data;
     } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
     }
    },
   
    async getAllVmdForAdmin(category, keyword, dateParamStart, dateParamEnd, page) {
     try {
      const response = await axios.get(`${baseUrl}/searchForAdmin`, {
       params: {
        category: category,
        keyword: keyword,
        dateParamStart: dateParamStart,
        dateParamEnd: dateParamEnd,
        page: page
       },
      });
      return response.data.data;
     } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
     }
    },
   
    async addVmd(vmd) {
     try {
      const response = await axios.post(`${baseUrl}/create`, vmd);
      return response.data;
     } catch (error) {
      console.error('Failed to create Vmd:', error);
     }
    },

    async update(param) {
     try {
      const response = await axios.post(`${baseUrl}/update`, param);
      return response.data;
     } catch (error) {
      console.error('Failed to update Vmd:', error);
     }
    },

    async getById(id) {
     try {
      const response = await axios.get(`${baseUrl}/getVmdDetail`, {
       params: { id: id },
      });
      return response.data;
     } catch (error) {
      console.error('find error.', error);
      throw error;
     }
    },

    async deleteById(id) {
     try {
      const response = await axios.delete(`${baseUrl}/delete`, {
       params: { id: id },
      });
      return response.data;
     } catch (error) {
      console.error('Delete error.', error);
      throw error;
     }
    },
   }
   export default VmdApi;
 


 
