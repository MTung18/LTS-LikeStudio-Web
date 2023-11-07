import { defineStore } from "pinia";
import NoticeBoardApi from "../axios/noticeBoardApi";
import { ref } from "vue";

export const noticeBoardStore = defineStore("notice", () => {
 const listOfNoticeUser = ref([]);

 async function getAllNoitceForUser(param) {
  listOfNoticeUser.value = await NoticeBoardApi.getAllNoitceForUser(param)
 }

 return {
  listOfNoticeUser,
  getAllNoitceForUser
 };
})