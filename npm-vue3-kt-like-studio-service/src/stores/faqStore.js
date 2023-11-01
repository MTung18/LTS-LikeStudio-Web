import { defineStore } from "pinia";
import FaqApi from "../axios/faqApi.js";
import { ref } from "vue";

export const faqStore = defineStore("faq", () => {
 const listOfFaq = ref([]);

 async function fetchListOfFaq(param) {
  listOfFaq.value = await FaqApi.getListFaq(param);
 }

 return {
  listOfFaq,
  fetchListOfFaq,
 };
})
