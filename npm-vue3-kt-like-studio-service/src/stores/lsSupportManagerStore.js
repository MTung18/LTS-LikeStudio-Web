import { defineStore } from "pinia";
import LsSupportManagerApi from "@/axios/lsSupportManagerApi.js";
import { ref } from "vue";

export const lsSupportManagerStore = defineStore("lsSupportManager", () => {

    const lsSupportManagerListForUser = ref([]);
    const lsSupportManagerById = ref([]);
    const allLsSupportManager = ref([]);

    async function getLsSupportManagerListForUser(keyword,userId,startDate,endDate,page) {
        lsSupportManagerListForUser.value = await LsSupportManagerApi.getLsSupportManagerListForUser(keyword,userId,startDate,endDate,page);
    }
    async function getLsSupportManagerById(id) {
        lsSupportManagerById.value = await LsSupportManagerApi.getLsSupportManagerById(id);
    }
    async function getAllLsSupportManager() {
        allLsSupportManager.value = await LsSupportManagerApi.getAllLsSupportManager();
    }
    async function deleteLsSupportManagerForUser(id) {
        await LsSupportManagerApi.deleteLsSupportManagerForUser(id);
    }

    console.log(allLsSupportManager.value);
    return {
        lsSupportManagerListForUser,
        lsSupportManagerById,
        allLsSupportManager,
        getLsSupportManagerListForUser,
        getLsSupportManagerById,
        getAllLsSupportManager,
        deleteLsSupportManagerForUser
    };
})

