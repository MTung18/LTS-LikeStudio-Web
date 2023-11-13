import { defineStore } from "pinia";
import FaqApi from "../axios/faqApi.js";
import { ref } from "vue";

export const faqStore = defineStore("faq", () => {
 const listOfFaqAdmin = ref([]);
 const listOfFaqUser = ref([]);
 const listOfFaqByCategory = ref([]);

 async function getListFaqForAdmin(keyword, category, startDate, endDate, page) {
  listOfFaqAdmin.value = await FaqApi.getListFaqForAdmin(keyword, category, startDate, endDate, page);
 }

 async function getListFaqForUser(category, keyword) {
  listOfFaqUser.value = await FaqApi.getListFaqForUser(category, keyword);
 }

 async function getByCategory(param) {
  listOfFaqByCategory.value = await FaqApi.getByCategory(param);
 }

 return {
  listOfFaqAdmin,
  listOfFaqUser,
  listOfFaqByCategory,
  getListFaqForAdmin,
  getListFaqForUser,
  getByCategory,
 };
})
