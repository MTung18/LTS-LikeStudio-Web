import { whqPermissionGroupsApi } from "@/axios/instances/settings/whqPermissionGroupsApi";
import PermissionGroup from '@/models/settings/PermissionGroup';
import PermissionGroupDetails from "@/models/settings/PermissionGroupDetails";
import PermissionGroupLookup from '@/models/settings/PermissionGroupLookup';
import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from 'vue';

export const usePermissionGroupStore = defineStore('permissionGroup', () => {
  
  // #region State 

  const permissionGroupList = ref<Array<PermissionGroup>>();
  const permissionGroupLookup = ref<Array<PermissionGroupLookup>>();
  const permissionGroupDetails = ref<PermissionGroupDetails>();

  // #endregion 

  // #region Actions

  async function fetchPermissionGroupList() {
    permissionGroupList.value = await whqPermissionGroupsApi.getPermissionGroups();
  } 

  async function fetchPermissionGroupLookup(excludeAdminGroup?: boolean) {
    permissionGroupLookup.value = await whqPermissionGroupsApi.getPermissionGroupsLookup(excludeAdminGroup);
  } 

  async function fetchPermissionGroupDetails(id: number) {
    permissionGroupDetails.value = await whqPermissionGroupsApi.getPermissionGroupDetails(id);
  } 

  async function createPermissionGroup(permissionGroup: PermissionGroupDetails): Promise<PermissionGroupDetails> {
    return await whqPermissionGroupsApi.createPermissionGroup(permissionGroup);
  }

  async function editPermissionGroup(id: number, permissionGroup: PermissionGroupDetails): Promise<boolean> {
    return await whqPermissionGroupsApi.editPermissionGroup(id, permissionGroup);
  }

  async function deletePermissionGroup(id: number): Promise<boolean> {
    return await whqPermissionGroupsApi.deletePermissionGroup(id);
  }

  async function moveUsersToPermissionGroup(userIds: Array<number>, permissionGroupId: number){
    return await whqPermissionGroupsApi.postMoveUsersToPermissionGroup(userIds, permissionGroupId);
  }

  // #endregion 

  return {
    permissionGroupList,
    permissionGroupLookup,
    permissionGroupDetails,
    fetchPermissionGroupList,
    fetchPermissionGroupLookup,
    fetchPermissionGroupDetails,
    createPermissionGroup,
    editPermissionGroup,
    deletePermissionGroup,
    moveUsersToPermissionGroup,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePermissionGroupStore, import.meta.hot));
}
