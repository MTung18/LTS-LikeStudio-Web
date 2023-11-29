import axios from 'axios';
import { ClientSide } from "../../public/appsettings.json"

const baseUrl = ClientSide.LikeStudioAPI + "/api/permisstion";
const PermisstionApi = {
    async getAllPermisstion(keyword, page) {
        try {
            const response = await axios.get(`${baseUrl}/getAll`, {
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

    async addPermisstion(data) {
        try {
            const response = await axios.post(`${baseUrl}/insert`, data );
            return response.data;
        } catch (error) {
            console.error('Failed to create Permisstion:', error);
        }
    },

    async update(data) {
        try {
            const response = await axios.post(`${baseUrl}/update`, data);
            return response.data;
        } catch (error) {
            console.error('Failed to update Permisstion:', error);
        }
    },

    async getAllUser(keyword, page) {
        try {
            const response = await axios.get(`${baseUrl}/getAllUser`, {
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

    async getListRole() {
        try {
            const response = await axios.get(`${baseUrl}/getRoles`);
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw error;
        }
    }
}
export default PermisstionApi;
