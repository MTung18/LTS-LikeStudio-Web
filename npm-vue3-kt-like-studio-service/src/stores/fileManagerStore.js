import { defineStore } from "pinia";
import FileManager from "../axios/fileManagerApi";
import { ref } from "vue";

export const fileManagerStore = defineStore("fileManager", () => {
 const listOfFile = ref([]);
 const responseUploadFile = ref();

 async function getListFile(functionType, titleId) {
  listOfFile.value = await FileManager.getListFile(functionType, titleId);
 }

 async function uploadFile(file) {
  responseUploadFile.value = await FileManager.uploadFile(file);
 }

 return {
  listOfFile,
  responseUploadFile,
  getListFile,
  uploadFile
 };
})
