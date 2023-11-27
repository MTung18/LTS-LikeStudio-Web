import { defineStore } from "pinia";
import VmdApi from "../axios/vmdApi";
import { ref } from "vue";

export const vmdStore = defineStore("vmd", () => {
 const listOfVmdUser = ref([]);
 const listOfVmdAdmin = ref([]);
//  const listNotice = ref([]);
//  const noticeBoard = ref();
 const responseEditVmd = ref();
 const responseAddVmd = ref();
 const responseDeleteVmd = ref();

 async function getAllVmdForUser(category, keyword, page) {
  listOfVmdUser.value = await VmdApi.getAllVmdForUser(category, keyword, page)
 }

 async function getAllVmdForAdmin(category, keyword, dateParamStart, dateParamEnd, page) {
  listOfVmdAdmin.value = await VmdApi.getAllVmdForAdmin(category, keyword, dateParamStart, dateParamEnd, page)
 }

//  async function findAllNoitce() {
//   listNotice.value = await NoticeBoardApi.findAllNoitce()
//  }

//  async function getNoticeById(id) {
//   noticeBoard.value = await NoticeBoardApi.getNoticeById(id)
//  }

 async function deleteVmd(id) {
  responseDeleteVmd.value = await VmdApi.deleteDataById(id);
 }

 async function updateVmd(vmd) {
  responseEditVmd.value = await VmdApi.updateVmd(vmd);
 }

 async function addVmd(vmd) {
  responseAddVmd.value = await VmdApi.addVmd(vmd);
 }


 return {
  listOfVmdUser,
  listOfVmdAdmin,
//   noticeBoard,
//   listNotice,
  responseAddVmd,
  responseEditVmd,
  responseDeleteVmd,
  getAllVmdForUser,
  getAllVmdForAdmin,
//   getNoticeById,
//   findAllNoitce,
  deleteVmd,
  updateVmd,
  addVmd
 };
})
