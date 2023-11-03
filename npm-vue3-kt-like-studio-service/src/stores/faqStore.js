import { defineStore } from "pinia";
import FaqApi from "../axios/faqApi.js";
import { ref } from "vue";

export const faqStore = defineStore("faq", () => {
 const listOfFaqAdmin = ref([]);
 const listOfFaqUser = ref([]);
 const listOfFaqByCategory = ref([]);

 async function getListFaqForAdmin(param) {
  listOfFaqAdmin.value = await FaqApi.getListFaqForAdmin(param);
 }

 async function getListFaqForUser(param) {
  listOfFaqUser.value = await FaqApi.getListFaqForUser(param);
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
