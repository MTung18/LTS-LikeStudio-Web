import { defineStore, storeToRefs, acceptHMRUpdate } from "pinia";
import { computed, reactive, ref } from 'vue';
import { usePermissionItemStore } from "./permissionItemStore";
import PermissionGroupPermissionItem from '@/models/settings/PermissionGroupPermissionItem';

export const usePermissionItemEditorStore = defineStore('permissionItemEditor', () => {

    const { fetchPermissionItems } = usePermissionItemStore();
    const { permissionItems: storePermissionItems } = storeToRefs(usePermissionItemStore());

    // #region State 

    const permissionItems = ref([]);
    const initial = ref([]);
    const current = ref([]);

    const permissionGroupPermissionItems = reactive({
        initial,
        current,
    });

    const updatedItemsCount = computed(() => {
        if (permissionGroupPermissionItems.initial.length === permissionGroupPermissionItems.current.length) {
            return permissionGroupPermissionItems.current.filter((element, index) => {
                return permissionGroupPermissionItems.initial[index].permissionSettingId !== element.permissionSettingId
            }).length;
        } else return Math.abs(permissionGroupPermissionItems.current.length - permissionGroupPermissionItems.initial.length);
    });

    // #endregion 

    // #region Getters

    async function getPermissionGroupPermissionItem (permissionItemId: number)  {
        return permissionGroupPermissionItems.current.find(x => x.permissionItemId === permissionItemId);
    };

    // #endregion

    // #region Action 

    async function setPermissionItems() {
        await fetchPermissionItems();
        permissionItems.value = storePermissionItems.value;
    }

    async function setInitialPermissionItems(initialPermissionGroupPermissionItems: PermissionGroupPermissionItem[]) {
        let unrefArray : PermissionGroupPermissionItem[] = [];

        initialPermissionGroupPermissionItems.forEach(item => unrefArray.push(new PermissionGroupPermissionItem(item)));	

        permissionGroupPermissionItems.initial = unrefArray;
    }

    async function setCurrentPermissionItems(currentPermissionGroupPermissionItems: PermissionGroupPermissionItem[]) {
        permissionGroupPermissionItems.current = currentPermissionGroupPermissionItems;
    }

    async function updatePermissionItems(updatedPermissionGroupPermissionItem: PermissionGroupPermissionItem)
    {
        let index = permissionGroupPermissionItems.current.findIndex(object => {
            return object.permissionItemId === updatedPermissionGroupPermissionItem.permissionItemId;
        });

        if (index > -1) {
            Object.assign(permissionGroupPermissionItems.current[index], updatedPermissionGroupPermissionItem);
        } 
        else {
            console.error(`Permission item with id ${updatedPermissionGroupPermissionItem.permissionItemId} wasn't found!`)
        }
    }

    async function resetAll()
    {
        await resetPermissionItems();
        await resetInitialPermissionItems();
        await resetCurrentPermissionItems();
    }

    async function resetPermissionItems()
    {
        permissionItems.value = [];
    }

    async function resetInitialPermissionItems()
    {
        permissionGroupPermissionItems.current = [];
    }

    async function resetCurrentPermissionItems()
    {
        permissionGroupPermissionItems.initial = [];
    }   

    // #endregion 

    return {
        permissionItems,
        permissionGroupPermissionItems,
        updatedItemsCount,
        current,
        getPermissionGroupPermissionItem,
        setPermissionItems,
        setInitialPermissionItems,
        setCurrentPermissionItems,
        updatePermissionItems,
        resetAll
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePermissionItemEditorStore, import.meta.hot));
  }