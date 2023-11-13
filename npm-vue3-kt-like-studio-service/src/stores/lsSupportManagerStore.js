import { defineStore } from "pinia";
import LsSupportManagerApi from "@/axios/lsSupportManagerApi.js";
import { ref } from "vue";

export const lsSupportManagerStore = defineStore("lsSupportManager", () => {

    const lsSupportManagerListForUser = ref([]);
    const lsSupportManagerById = ref([]);

    async function getLsSupportManagerListForUser(keyword,userId,startDate,endDate,page) {
        lsSupportManagerListForUser.value = await LsSupportManagerApi.getLsSupportManagerListForUser(keyword,userId,startDate,endDate,page);
    }
    async function getLsSupportManagerById(id) {
        lsSupportManagerById.value = await LsSupportManagerApi.getLsSupportManagerById(id);
    }

    return {
        lsSupportManagerListForUser,
        lsSupportManagerById,
        getLsSupportManagerListForUser,
        getLsSupportManagerById,
    };
})

