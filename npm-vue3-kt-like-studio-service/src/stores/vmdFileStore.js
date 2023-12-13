import { defineStore } from "pinia";
import vmdFile from "../axios/vmdFileApi";
import { ref } from "vue";

export const vmdFileStore = defineStore("vmdFile", () => {
 const listOfFile = ref([]);
 const responseUploadFile = ref();
 const responseDownloadFile = ref();

 async function getListFile(vmdId) {
  listOfFile.value = await vmdFile.getListFile(vmdId);
 }

 async function uploadFile(file) {
  responseUploadFile.value = await vmdFile.uploadFile(file);
 }

 async function downloadFile(filePaths) {
  responseDownloadFile.value = await vmdFile.downloadFile(filePaths);
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
