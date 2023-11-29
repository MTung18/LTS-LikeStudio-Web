import { defineStore } from "pinia";
import PermisstionApi from "../axios/permisstionApi";
import { ref } from "vue";

export const permisstionStore = defineStore("permisstion", () => {
 const listPermisstion = ref([])
 const createRes = ref()
 const updateRes = ref()
 const deleteRes = ref()
 const listUser = ref([])
 const listRole = ref([])
 
 async function getAllPermisstion(keyword, page) {
  listPermisstion.value = await PermisstionApi.getAllPermisstion(keyword, page)
 }

 async function deleteDataById(id) {
  deleteRes.value = await PermisstionApi.deleteDataById(id);
 }

 async function update(param) {
  updateRes.value = await PermisstionApi.update(param);
 }

 async function addPermisstion(data) {
  createRes.value = await PermisstionApi.addPermisstion(data);
 }

 async function getAllUser(keyword, page) {
  listUser.value = await PermisstionApi.getAllUser(keyword, page)
 }

 async function getListRole() {
  listRole.value = await PermisstionApi.getListRole()
 }

 return {
  listPermisstion,
  createRes,
  updateRes,
  deleteRes,
  listUser,
  listRole,
  getAllPermisstion,
  deleteDataById,
  addPermisstion,
  update,
  getAllUser,
  getListRole
 };
})