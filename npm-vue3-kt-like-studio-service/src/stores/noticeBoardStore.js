import { defineStore } from "pinia";
import NoticeBoardApi from "../axios/noticeBoardApi";
import { ref } from "vue";

export const noticeBoardStore = defineStore("notice", () => {
 const listOfNoticeUser = ref([]);
 const listOfNoticeAdmin = ref([]);
 const listNotice = ref([]);
 const noticeBoard = ref();
 const responseEditNotice = ref();
 const responseAddNotice = ref();
 const responseDeleteNotice = ref();

 async function getAllNoitceForUser(keyword, page) {
  listOfNoticeUser.value = await NoticeBoardApi.getAllNoitceForUser(keyword, page)
 }

 async function getAllNoitceForAdmin(keyword, dateParamStart, dateParamEnd, popup, page) {
  listOfNoticeAdmin.value = await NoticeBoardApi.getAllNoitceForAdmin(keyword, dateParamStart, dateParamEnd, popup, page)
 }

 async function findAllNoitce() {
  listNotice.value = await NoticeBoardApi.findAllNoitce()
 }

 async function getNoticeById(id) {
  noticeBoard.value = await NoticeBoardApi.getNoticeById(id)
 }

 async function deleteNotice(id) {
  responseDeleteNotice.value = await NoticeBoardApi.deleteDataById(id);
 }

 async function updateNotice(noticeBoard) {
  responseEditNotice.value = await NoticeBoardApi.updateNotice(noticeBoard);
 }

 async function addNotice(noticeBoard) {
  responseAddNotice.value = await NoticeBoardApi.addNotice(noticeBoard);
 }


 return {
  listOfNoticeUser,
  listOfNoticeAdmin,
  noticeBoard,
  listNotice,
  responseAddNotice,
  responseEditNotice,
  responseDeleteNotice,
  getAllNoitceForUser,
  getAllNoitceForAdmin,
  getNoticeById,
  findAllNoitce,
  deleteNotice,
  updateNotice,
  addNotice
 };
})