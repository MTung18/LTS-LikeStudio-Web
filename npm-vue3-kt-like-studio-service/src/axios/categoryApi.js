import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl= ClientSide.LikeStudioAPI + "/api/category";

const CategoryApi = {
 async getListCategory(param) {
   try {
     const response = await axios.get(`${baseUrl}/functionType`, {
       params: { functionType: param },
     });

     return response.data;
   } catch (error) {
     console.error('Error fetching data:', error);
     throw error;
   }
 },
};

export default CategoryApi;