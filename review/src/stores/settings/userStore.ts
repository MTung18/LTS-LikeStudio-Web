import { acceptHMRUpdate, defineStore } from 'pinia';
import { computed, inject, ref, Ref } from  "vue";
import { whqUserApi } from '@/axios/instances/settings/whqUserApi';

import User from '@/models/settings/PermissionGroupUser';
import PermissionGroupDetails from '@/models/settings/PermissionGroupDetails';

export const useUserStore = defineStore("users", () => {
    const userList: Ref<User[]> = ref(new Array<User>());
    const usersNotPartOfPermissionGroup = ref<Array<User>>();
    const permissionGroupWithUpdatedUsers = ref(new PermissionGroupDetails());

    const getUsers = computed(() => {
        return userList.value;
    })

    async function fetchUserList(): Promise<void> {
        userList.value = await whqUserApi.getUsers();
    }

    async function fetchUsersNotPartOfPermissionGroup(id: number): Promise<void>{
        const permissions: Ref<Record<string,boolean>> = inject('$providePermissions');
        const adminTag = permissions.value["WHQ_247_3115"];

        usersNotPartOfPermissionGroup.value = await whqUserApi.getUsers(id, !adminTag);
    }

    return {
        userList,
        getUsers,
        usersNotPartOfPermissionGroup,
        permissionGroupWithUpdatedUsers,
        fetchUserList,
        fetchUsersNotPartOfPermissionGroup,
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
