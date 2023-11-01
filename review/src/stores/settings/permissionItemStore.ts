import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref } from "vue";
import { whqPermissionItemsApi } from '@/axios/instances/settings/whqPermissionItemsApi';

import { PermissionItem } from '@/models/settings/PermissionItem';

export const usePermissionItemStore = defineStore("permissionItem", () => {
    const permissionItems = ref<Array<PermissionItem>>();
    const permissions = ref<Record<string, boolean>>({});

    async function fetchPermissionItems() {
        permissionItems.value = await whqPermissionItemsApi.getPermissionItems();
    }

    async function fetchPermissions() {
        permissions.value = await whqPermissionItemsApi.getPermissions();
    }

    return {
        permissionItems,
        permissions,
        fetchPermissionItems,
        fetchPermissions
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePermissionItemStore, import.meta.hot));
}
