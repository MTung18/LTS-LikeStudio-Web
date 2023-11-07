import { defineStore } from "pinia";
import FileManager from "../axios/fileManagerApi";
import { ref } from "vue";

export const fileManagerStore = defineStore("fileManager", () => {
 const listOfFile = ref([]);

 async function getListFile(functionType, titleId) {
  listOfFile.value = await FileManager.getListFile(functionType, titleId);
 }

 return {
  listOfFile,
  getListFile,
 };
})
