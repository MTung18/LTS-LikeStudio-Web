import { defineStore } from "pinia";
import FileManager from "../axios/fileManagerApi";
import { ref } from "vue";

export const fileManagerStore = defineStore("fileManager", () => {
 const listOfFile = ref([]);
 const responseUploadFile = ref();
 const responseDownloadFile = ref();

 async function getListFile(functionType, titleId) {
  listOfFile.value = await FileManager.getListFile(functionType, titleId);
 }

 async function uploadFile(file) {
  responseUploadFile.value = await FileManager.uploadFile(file);
 }

 async function downloadFile(path) {
  responseDownloadFile.value = await FileManager.downloadFile(path);
 }

 return {
  listOfFile,
  responseUploadFile,
  responseDownloadFile,
  getListFile,
  uploadFile,
  downloadFile
 };
})
