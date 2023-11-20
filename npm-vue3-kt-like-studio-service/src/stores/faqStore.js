import { defineStore } from "pinia";
import FaqApi from "../axios/faqApi.js";
import { ref } from "vue";

export const faqStore = defineStore("faq", () => {
 const listOfFaqAdmin = ref([]);
 const listOfFaqUser = ref([]);

 async function getListFaqForAdmin(keyword, category, startDate, endDate, page) {
  listOfFaqAdmin.value = await FaqApi.getListFaqForAdmin(keyword, category, startDate, endDate, page);
 }

 async function getListFaqForUser(keyword, category, page) {
  listOfFaqUser.value = await FaqApi.getListFaqForUser(keyword, category, page);
 }

 return {
  listOfFaqAdmin,
  listOfFaqUser,
  getListFaqForAdmin,
  getListFaqForUser,
 };
})
