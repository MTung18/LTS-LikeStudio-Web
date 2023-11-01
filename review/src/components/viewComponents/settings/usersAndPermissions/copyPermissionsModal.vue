<script setup lang="ts">

import { library } from '@fortawesome/fontawesome-svg-core';
import { faExclamationTriangle, faTimesCircle, faCheckCircle } from '@fortawesome/pro-light-svg-icons';
import { computed, onMounted, ref, Ref, watch } from 'vue';
import PermissionGroupSelection from '@/models/settings/PermissionGroupSelection';
import PermissionGroup from '@/models/settings/PermissionGroup';
import { storeToRefs } from "pinia";
import { usePermissionGroupStore } from "@/stores/settings/permissionGroupStore";

const { fetchPermissionGroupList } = usePermissionGroupStore();
const { permissionGroupList } = storeToRefs(usePermissionGroupStore());

library.add(
    faExclamationTriangle,
    faTimesCircle,
    faCheckCircle,
);

interface copyPermissionsModalProps {
    currentPermissionGroupId: Number,
    showModal: boolean
}

const props = defineProps<copyPermissionsModalProps>();

const emits = defineEmits<{
    (e: "update:showModal", value: boolean): void,
    (e: "onPermissionGroupSelected", value: number): void,
}>();

const showModalOpen: Ref<boolean> = ref(false);
const selectedPermissionGroupId: Ref<number> = ref(null);
const permissionGroupSelectionList: Ref<PermissionGroupSelection[]> = ref(new Array());
const doneLoading: Ref<boolean> = ref(false);

onMounted(async () => {
    doneLoading.value = false;

    await fetchPermissionGroupList();

    if (props.currentPermissionGroupId > 0) {
        permissionGroupList.value = permissionGroupList.value.filter(x => x.id !== props.currentPermissionGroupId);
    }

    mapPermissionGroupSelection(permissionGroupList.value);

    doneLoading.value = true;
})

watch(() => props.showModal,
    (newValue: any, _oldValue: any) => {
        showModalOpen.value = props.showModal;
    },
    { immediate: true, deep: true }
);

watch(() => showModalOpen,
    () => {
        emits('update:showModal', showModalOpen.value);
    },
    { immediate: true }
);

const permissionGroupSelected = computed<boolean>(() =>permissionGroupSelectionList.value.findIndex(pg => pg.isSelected === true) !== -1);

function selectPermissionGroup(permissionGroupId: number): void {
    for (let permissionGroupSelection of permissionGroupSelectionList.value) {
        if (permissionGroupSelection.id != permissionGroupId) {
            permissionGroupSelection.isSelected = false;
            continue;
        }
        if (permissionGroupSelection.isSelected == false) {
            selectedPermissionGroupId.value = null;
        }
        else {
            selectedPermissionGroupId.value = permissionGroupId;
        }
    }
}

function mapPermissionGroupSelection(permissionGroupList: PermissionGroup[]): void {
    for (let permissionGroup of permissionGroupList) {
        let permissionGroupSelection = new PermissionGroupSelection(permissionGroup);
        permissionGroupSelectionList.value.push(permissionGroupSelection);
    }
}

function clearChecked(): void {
    let selectedGroup: PermissionGroupSelection = permissionGroupSelectionList.value.find((sl: PermissionGroupSelection) => sl.isSelected == true);
    selectedGroup.isSelected = false;
    selectedPermissionGroupId.value = null;
}

const onCancelBtnClicked = async (): Promise<void> => {
    emits('update:showModal', false);

    if (selectedPermissionGroupId.value != null) {
        clearChecked();
    }

}

const onSaveBtnClicked = async (): Promise<void> => {
    emits('update:showModal', false);
    emits('onPermissionGroupSelected', selectedPermissionGroupId.value);
    
    if (selectedPermissionGroupId.value != null) {
        clearChecked();
    }
}

</script>

<template>
    <fs-modal v-model="showModalOpen"
             centered
             content-class="phq-modal min-h-220 max-vh-80"
             header-class="phq-modal__header"
             title-class="phq-modal__title"
             body-class="phq-modal__body d-flex flex-column overflow-hidden p-0"
             footer-class="phq-modal__footer"
             header-text-variant="light"
             header-bg-variant="blue--dk"
             :lazy="true"
             hide-header-close
             no-close-on-backdrop
             no-close-on-esc
             size="xl"
             title="Copy Permissions From Existing Group">
            <fs-container fluid class="contain fw-bold py-3">Select which Permission Group you would like to copy permissions from:</fs-container>
            <fs-overlay :show="!doneLoading" spinner-variant="primary" class="fsi-pg__overlay" no-wrap />
                    <fs-table-simple responsive class="mb-0">
                        <fs-thead>
                        <fs-tr class="bg-grey--000">
                            <fs-th>
                                Name
                            </fs-th>
                            <fs-th>
                                Description
                            </fs-th>
                        </fs-tr>
                        </fs-thead>
                        <fs-tbody>
                            <fs-tr v-for="(item, index) in permissionGroupSelectionList" :key="index" 
                                :style="{
                                        color: item.isSelected ? '#03A9F4' : '',
                                    }"
                                >  
                                <fs-td>
                                    <fs-form-checkbox
                                        v-model="item.isSelected"
                                        @change="selectPermissionGroup(item.id)"
                                    >
                                        {{item.name}}
                                    </fs-form-checkbox>
                                </fs-td>
                                <fs-td>
                                    {{item.description}}
                                </fs-td>
                            </fs-tr>
                        </fs-tbody>
                    </fs-table-simple>
        <template #modal-footer>
            <fs-button variant="outline-secondary" @click="onCancelBtnClicked">Cancel</fs-button>
            <fs-button variant="primary" @click="onSaveBtnClicked" :disabled="!permissionGroupSelected">Select</fs-button>
        </template>
    </fs-modal>
</template>

<style>

.form-check-input[type="checkbox"]:checked {
    opacity: 1;
    border-color: #03A9F4;
    background-color: #03A9F4;
}

</style>