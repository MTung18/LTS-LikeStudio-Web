import { defineStore } from "pinia";
import LsSupportManagerApi from "@/axios/lsSupportManagerApi.js";
import { ref } from "vue";

export const lsSupportManagerStore = defineStore("lsSupportManager", () => {

    const lsSupportManagerListForUser = ref([]);
    const lsSupportManagerListForAdmin = ref([]);
    const lsSupportManagerById = ref([]);
    const allLsSupportManager = ref([]);
    const lsSupportManagerCategoryList = ref([])
    const answerRes = ref()
    const updateRes = ref()
    const addRes = ref()

    async function getLsSupportManagerListForUser(keyword,userId,startDate,endDate,page) {
        lsSupportManagerListForUser.value = await LsSupportManagerApi.getLsSupportManagerListForUser(keyword,userId,startDate,endDate,page);
    }
    async function getLsSupportManagerListForAdmin(keyword,category,status,startDate,endDate,page) {
        lsSupportManagerListForAdmin.value = await LsSupportManagerApi.getLsSupportManagerListForAdmin(keyword,category,status,startDate,endDate,page);
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
    async function add(param) {
        addRes.value = await LsSupportManagerApi.add(param);
    }
    async function deleteLsSupportManagerForAdmin(answerId,questionId) {
        await LsSupportManagerApi.deleteLsSupportManagerForAdmin(answerId,questionId);
    }
    async function getLsSupportManagerCategoryList() {
        lsSupportManagerCategoryList.value = await LsSupportManagerApi.getLsSupportManagerCategoryList();
    }
    async function answer(param) {
        answerRes.value = await LsSupportManagerApi.answer(param);
    }
    async function update(param) {
        updateRes.value = await LsSupportManagerApi.update(param);
    }
    return {
        lsSupportManagerListForUser,
        lsSupportManagerListForAdmin,
        lsSupportManagerById,
        allLsSupportManager,
        lsSupportManagerCategoryList,
        answerRes,
        updateRes,
        addRes,
        getLsSupportManagerListForUser,
        getLsSupportManagerListForAdmin,
        getLsSupportManagerById,
        getAllLsSupportManager,
        deleteLsSupportManagerForUser,
        add,
        deleteLsSupportManagerForAdmin,
        getLsSupportManagerCategoryList,
        answer,
        update
    };
})

