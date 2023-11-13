import { defineStore } from "pinia";
import CategoryApi from "../axios/categoryApi";
import { ref } from "vue";

export const categoryStore = defineStore("category", () => {
 const listCategory = ref([]);

 async function getListCategory(param) {
  listCategory.value = await CategoryApi.getListCategory(param);
 }

 return {
  listCategory,
  getListCategory,
 };
})