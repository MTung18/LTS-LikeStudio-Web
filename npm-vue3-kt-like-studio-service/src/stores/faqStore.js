import { defineStore } from "pinia";
import FaqApi from "../axios/faqApi.js";
import { ref } from "vue";

export const faqStore = defineStore("faq", () => {
 const listOfFaqAdmin = ref([]);
 const listOfFaqUser = ref([]);
 const faq = ref();
 const responseEditFaq = ref();
 const responseAddFaq = ref();
 const responseDeleteFaq = ref();

 async function getListFaqForAdmin(keyword, category, startDate, endDate, page) {
  listOfFaqAdmin.value = await FaqApi.getListFaqForAdmin(keyword, category, startDate, endDate, page);
 }

 async function getListFaqForUser(keyword, category, page) {
  listOfFaqUser.value = await FaqApi.getListFaqForUser(keyword, category, page);
 }

 async function getFaqById(id) {
  faq.value = await FaqApi.getFaqById(id)
 }

 async function updateFaq(faq) {
  responseEditFaq.value = await FaqApi.updateFaq(faq);
 }

 async function addFaq(faq) {
  responseAddFaq.value = await FaqApi.addNotice(faq);
 }

 async function deleteFaq(id) {
  responseDeleteFaq.value = await FaqApi.deleteDataById(id);
 }

 return {
  listOfFaqAdmin,
  listOfFaqUser,
  responseEditFaq,
  responseAddFaq,
  faq,
  getListFaqForAdmin,
  getListFaqForUser,
  updateFaq,
  addFaq,
  getFaqById,
  deleteFaq
 };
})
