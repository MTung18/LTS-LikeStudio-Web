import { defineStore } from "pinia";
import NoticeBoardApi from "../axios/noticeBoardApi";
import { ref } from "vue";

export const noticeBoardStore = defineStore("notice", () => {
 const listOfNoticeUser = ref([]);
 const listNoticeUser = ref([]);
 const noticeBoard = ref();

 async function getAllNoitceForUser(param) {
  listOfNoticeUser.value = await NoticeBoardApi.getAllNoitceForUser(param)
 }

 async function findAllNoitceForUser() {
  listNoticeUser.value = await NoticeBoardApi.findAllNoitceForUser()
 }

 async function getNoticeById(id) {
  noticeBoard.value = await NoticeBoardApi.getNoticeById(id)
 }

 return {
  listOfNoticeUser,
  noticeBoard,
  listNoticeUser,
  getAllNoitceForUser,
  getNoticeById,
  findAllNoitceForUser
 };
})