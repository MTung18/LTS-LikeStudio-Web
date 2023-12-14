import { defineStore } from "pinia";
import vmdFile from "../axios/vmdFileApi";
import { ref } from "vue";

export const vmdFileStore = defineStore("vmdFile", () => {
 const listOfFile = ref([]);
 const responseUploadFile = ref();
 const responseDownloadFile = ref();
 const responseLoadImg = ref();

 async function getListFile(vmdId) {
  listOfFile.value = await vmdFile.getListFile(vmdId);
 }

 async function uploadFile(file) {
  responseUploadFile.value = await vmdFile.uploadFile(file);
 }

 async function downloadFile(filePaths) {
  responseDownloadFile.value = await vmdFile.downloadFile(filePaths);
 }

 async function loadImg(imagePath) {
  responseLoadImg.value = await vmdFile.loadImg(imagePath);
 }

 return {
  listOfFile,
  responseUploadFile,
  responseDownloadFile,
  responseLoadImg,
  getListFile,
  uploadFile,
  downloadFile,
  loadImg
 };
})
