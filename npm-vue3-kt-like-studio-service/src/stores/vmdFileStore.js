import { defineStore } from "pinia";
import vmdFile from "../axios/vmdFileApi";
import { ref } from "vue";

export const vmdFileStore = defineStore("vmdFile", () => {
 const listOfFile = ref([]);
 const responseUploadFile = ref();

 async function getListFile(vmdId) {
  listOfFile.value = await vmdFile.getListFile(vmdId);
 }

 async function uploadFile(file) {
  responseUploadFile.value = await vmdFile.uploadFile(file);
 }

 return {
  listOfFile,
  responseUploadFile,
  getListFile,
  uploadFile
 };
})
