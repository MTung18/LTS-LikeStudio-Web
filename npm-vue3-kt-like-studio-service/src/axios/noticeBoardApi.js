import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl = ClientSide.LikeStudioAPI + "/api/noticeBoard";

const NoticeBoardApi = {
 async getAllNoitceForUser(keyword, page) {
  try {
   const response = await axios.get(`${baseUrl}/searchUser`, {
    params: { 
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

 async getAllNoitceForAdmin(keyword, dateParamStart, dateParamEnd, popup, page) {
  try {
   const response = await axios.get(`${baseUrl}/searchAdmin`, {
    params: { 
     keyword: keyword,
     dateParamStart: dateParamStart,
     dateParamEnd: dateParamEnd,
     popup: popup,
     page: page 
    },
   });
   return response.data.data;
  } catch (error) {
   console.error('Error fetching data:', error);
   throw error;
  }
 },

 async findAllNoitce() {
  try {
   const response = await axios.get(`${baseUrl}/searchNotice`);

   return response.data;
  } catch (error) {
   console.error('Error fetching data:', error);
   throw error;
  }
 },

 async getNoticeById(id) {
  try {
   const response = await axios.get(`${baseUrl}/getNoticeById`, {
    params: { id: id },
   });

   return response.data;
  } catch (error) {
   console.error('Error fetching data:', error);
   throw error;
  }
 },
}

export default NoticeBoardApi;