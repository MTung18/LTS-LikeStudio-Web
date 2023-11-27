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
   
    // async findAllNoitce() {
    //  try {
    //   const response = await axios.get(`${baseUrl}/searchNotice`);
   
    //   return response.data;
    //  } catch (error) {
    //   console.error('Error fetching data:', error);
    //   throw error;
    //  }
    // },
   
    // async getNoticeById(id) {
    //  try {
    //   const response = await axios.get(`${baseUrl}/getNoticeById`, {
    //    params: { id: id },
    //   });
   
    //   return response.data;
    //  } catch (error) {
    //   console.error('Error fetching data:', error);
    //   throw error;
    //  }
    // },
   
    async deleteDataById(id) {
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
   
    async updateNotice(vmd) {
     try {
      const response = await axios.post(`${baseUrl}/update`, vmd);
      return response.data;
     } catch (error) {
      console.error('Failed to update vmd:', error);
     }
    },
   
    async addVmd(vmd) {
     try {
      const response = await axios.post(`${baseUrl}/create`, vmd);
      return response.data;
     } catch (error) {
      console.error('Failed to update notice board:', error);
     }
    }
   }
   
  // async getVmdById(id){
  //  try {
  //   const response = await axios.get(`${baseUrl}/getVmdDetail`, {
  //    params: { id: id },
  //   });

  //   return response.data.data;
  //  } catch (error) {
  //   console.error('Error fetching data:', error);
  //   throw error;
  //  }
  // }

   export default VmdApi;

 


 
