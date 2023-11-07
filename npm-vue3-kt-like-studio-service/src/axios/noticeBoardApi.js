import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl = ClientSide.LikeStudioAPI + "/api/noticeBoard";

const NoticeBoardApi = {
 async getAllNoitceForUser(param) {
  try {
   const response = await axios.get(`${baseUrl}/allForUser`, {
    params: { page: param },
   });

   return response.data;
  } catch (error) {
   console.error('Error fetching data:', error);
   throw error;
  }
 },

 // async getListNoitceForUser(param) {
 //  try {
 //   const response = await axios.get(`${baseUrl}/search`, {
 //    params: { page: param },
 //   });

 //   return response.data;
 //  } catch (error) {
 //   console.error('Error fetching data:', error);
 //   throw error;
 //  }
 // },
}

export default NoticeBoardApi;