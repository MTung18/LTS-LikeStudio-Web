import { defineStore } from "pinia";
import VmdApi from "../axios/vmdApi";
import { ref } from "vue";

export const vmdStore = defineStore("vmd", () => {
 const listOfVmdUser = ref([]);
 const listOfVmdAdmin = ref([]);
 const responseAddVmd = ref();
 const vmdById = ref()
 const updateRes = ref()
 const deleteRes = ref()
 

 async function getAllVmdForUser(category, keyword, page) {
  listOfVmdUser.value = await VmdApi.getAllVmdForUser(category, keyword, page)
 }

 async function getAllVmdForAdmin(category, keyword, dateParamStart, dateParamEnd, page) {
  listOfVmdAdmin.value = await VmdApi.getAllVmdForAdmin(category, keyword, dateParamStart, dateParamEnd, page)
 }

 async function update(param) {
  updateRes.value = await VmdApi.update(param);
 }

 async function addVmd(vmd) {
  responseAddVmd.value = await VmdApi.addVmd(vmd);
 }

 async function getById(id) {
  vmdById.value = await VmdApi.getById(id)
;
 }
 async function deleteById(id) {
  deleteRes.value = await VmdApi.deleteById(id)
;
 }


 return {
  listOfVmdUser,
  listOfVmdAdmin,
  updateRes,
  vmdById,
  responseAddVmd,
  deleteRes,
  getAllVmdForUser,
  getAllVmdForAdmin,
  update,
  getById,
  addVmd,
  deleteById
 };
})