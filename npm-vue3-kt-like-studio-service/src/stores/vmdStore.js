import { defineStore } from "pinia";
import VmdApi from "../axios/vmdApi.js";
import { ref } from "vue";

export const vmdStore = defineStore("vmd", () => {
 // const listOfFaqAdmin = ref([]);
 const listOfVmdUser = ref([]);
 const vmd = ref();
 // const responseEditFaq = ref();
 // const responseAddFaq = ref();
 // const responseDeleteFaq = ref();

 // async function getListFaqForAdmin(keyword, category, startDate, endDate, page) {
 //  listOfFaqAdmin.value = await FaqApi.getListFaqForAdmin(keyword, category, startDate, endDate, page);
 // }

 async function getListVmdForUser(keyword, category, page) {
  listOfVmdUser.value = await VmdApi.getListVmdForUser(category, keyword, page);
 }

 async function getVmdById(id) {
  vmd.value = await VmdApi.getVmdById(id)
 }

 // async function updateFaq(faq) {
 //  responseEditFaq.value = await FaqApi.updateFaq(faq);
 // }

 // async function addFaq(faq) {
 //  responseAddFaq.value = await FaqApi.addNotice(faq);
 // }

 // async function deleteFaq(id) {
 //  responseDeleteFaq.value = await FaqApi.deleteDataById(id);
 // }

 return {
  listOfVmdUser,
  vmd,
  getListVmdForUser,
  getVmdById
 };
})
