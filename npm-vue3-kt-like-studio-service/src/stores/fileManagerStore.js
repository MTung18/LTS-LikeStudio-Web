import { defineStore } from "pinia";
import FileManager from "../axios/fileManagerApi";
import { ref } from "vue";

export const fileManagerStore = defineStore("fileManager", () => {
 const listOfFile = ref([]);
 const response = ref();

 async function getListFile(functionType, titleId) {
  listOfFile.value = await FileManager.getListFile(functionType, titleId);
 }

 async function uploadFile(file) {
  response.value = await FileManager.uploadFile(file);
 }

 return {
  listOfFile,
  response,
  getListFile,
  uploadFile
 };
})
