<script setup lang="ts">
import { ComputedRef, Ref, inject } from "vue";
import { computed, onMounted, ref, watch } from "vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Grid, Store } from "@bryntum/grid";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { DocumentMetadata } from "@/models/documents/documentMetadata";
import { DocumentCategory } from "@/enums/DocumentCategory";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { useDocumentMetadataStore } from "@/stores/documentMetadataStore";
import { storeToRefs } from "pinia";
import addDocumentPanel from '@/components/viewComponents/documents/addDocumentPanel.vue';
import { HQSuiteRecordItem } from '@/models/hqSuite/HQSuiteRecordItem';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { formatPath } from '@/helper/hqSuite/formatHelper';
import { library } from '@fortawesome/fontawesome-svg-core';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import {
    faInfoCircle,
    faExclamationTriangle,
    faExclamationCircle,
    faFileEdit
} from '@fortawesome/pro-solid-svg-icons';
import { stringCaseInsensitiveComparer } from "@/functions/SorterFunctions";
import { useAlerts } from '@/composables/useAlerts';
import deleteConfirmationModal from '@/components/shared/deleteConfirmationModal.vue';
import { useBryntumSelector } from "@/composables/useBryntumSelector";
import actionPanel from '@/components/shared/actionPanel.vue';
import { MESSAGE } from '@/data/message';

library.add(
    faInfoCircle,
    faExclamationTriangle,
    faExclamationCircle,
    faFileEdit
);

const permissions = inject('$providePermissions');
const showActionPanel = ref(false);

const showPanel = ref(false);
const folderPath = ref('');
const showDeleteModal = ref(false);
const deleteDocumentMetadata = ref(null);

const { notifySuccess, notifyError } = useAlerts();

const hqSuiteStore = useHQSuiteStore();
const folderItems: Ref<HQSuiteRecordItem[]> = ref(new Array<HQSuiteRecordItem>());
const azureB2CAuthStore = useAzureB2CAuthStore();
const { fetchDocumentList, deleteDocument } = useDocumentMetadataStore();
const { documentList, isDocumentDeleted } = storeToRefs(useDocumentMetadataStore());
const categories = ['General', 'Administration',
    'Company Policy', 'Employee Resource', 'Other'];

const gridLocalStorageKey = "documentListGrid";
const defaultSorter = {
    field: "name",
    ascending: true,
};

const { currentSelectedRows,
    selectedRowCount,
    isRowSelected,
    bryntumSelectedRowHandler } = useBryntumSelector<DocumentMetadata>();

const clientId = computed(() => azureB2CAuthStore?.activeUserClient?.clientGuid ?? 'Shared');
const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
    () => (grid as any).value?.instance.value.features
);

const isRestrictedCombo = {
    type: 'combo',
    valueField: 'value',
    displayField: 'label',
    cls: 'is-restricted-combo',
    listItemTpl: ({ label }) => `${label}`,
    picker: {
        cls: 'is-restricted-list'
    },
    store: {
        data: [
            { value: true, label: 'Yes' },
            { value: false, label: 'No' }
        ]
    }
};

const gridConfig = ref({
    ...fsBryntumGridConfig.gridConfig,
    ...getStatefulFilterFeature(gridLocalStorageKey),
    ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
    minHeight: "40em",
    emptyText: "", // TODO: empty text is displaying with data
    selectionMode: {
        cell: false,
        row: false,
        autoWidth: true,
        toggleable: true,
        checkboxOnly: true,
        showCheckAll: true,
    },
    columns: [
        {
            flex: 2,
            text: "Name",
            id: "name",
            field: "name",
            groupable: false,
            sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.data.name, record2.data.name),
        },
        {
            flex: 2,
            text: "Description",
            id: "description",
            field: "description",
            sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(record1.data.description, record2.data.description),
            groupable: false,
        },
        {
            flex: 1,
            text: "Contains Restricted Info",
            id: "isRestricted",
            field: "isRestricted",
            align: "center",
            sortable: true,
            groupable: false,
            htmlEncode: false,
            renderer: ({ record }) => {
                return record.isRestricted ? `<span><i class="b-fa b-fa-exclamation-circle text-warning no-underline"></i></span>` : ""
            },
            editor: isRestrictedCombo,
            filterable: {
                filterField: Object.assign(isRestrictedCombo, { multiSelect: true })
            }
        },
        {
            flex: 1,
            text: "Category",
            id: "documentCategoryId",
            field: "documentCategoryId",
            sortable: (record1: any, record2: any) => stringCaseInsensitiveComparer(getDocumentCategoryName(record1.data.documentCategoryId), getDocumentCategoryName(record2.data.documentCategoryId)),
            groupable: false,
            htmlEncode: false,
            renderer: ({ record }) => `${getDocumentCategoryColorPill(record.documentCategoryId)}`,
            filterable: {
                filterField: {
                    type: 'combo',
                    multiSelect: true,
                    items: categories.sort((a: string, b: string) => a.localeCompare(b)),
                },
                filterFn: ({ record, value }: { record: any, value: any[] }) =>
                    !value.length || value.map((x: string) => x.trim()).includes(getDocumentCategoryName(record.documentCategoryId))
            }
        },
        {
            flex: 1,
            type: "action",
            id: "action",
            text: "Actions",
            minWidth: 175,
            columnDragToolbar: false,
            enableHeaderContextMenu: false,
            enableCellContextMenu: false,
            cellCls: "b-action-cell--hover",
            actions: [
                {
                    visible: true,
                    renderer: () => {
                        return '<i class="b-action-item b-fa b-fa-download btn btn-link text-success no-underline"><span>Download</span></i>';
                    },
                    onClick: onDocumentDownloadClick,
                },
                {
                    visible: true,
                    renderer: () => {
                        return '<i class="b-action-item b-fa b-fa-trash-alt btn btn-link text-red no-underline"><span>Delete</span></i>';
                    },
                    onClick: onDocumentDeleteClick,
                },
            ],
        }
    ],
    listeners: {
        selectionChange: (data) => bryntumSelectedRowHandler(currentSelectedRows, data)
    }
});

const getDocumentCategoryColorPill = (documentCategoryId: DocumentCategory) => {
    switch (documentCategoryId) {
        case DocumentCategory.General:
            return `<span class="btn rounded-pill px-2" style="background-color: #A03AFF; color:#fff;">General</span>`;
        case DocumentCategory.Administration:
            return `<span class="btn rounded-pill px-2" style="background-color: #FF5094; color:#fff;">Administration</span>`;
        case DocumentCategory.CompanyPolicy:
            return `<span class="btn rounded-pill px-2" style="background-color: #0376F2; color:#fff;">Company Policy</span>`;
        case DocumentCategory.EmployeeResource:
            return `<span class="btn rounded-pill px-2" style="background-color: #12CBC4; color:#fff;">Employee Resource</span>`;
        case DocumentCategory.Other:
            return `<span class="btn rounded-pill px-2" style="background-color: #FF6600; color:#fff;">Other</span>`;
    }
};

const getDocumentCategoryName = (documentCategoryId: DocumentCategory) => {
    switch (documentCategoryId) {
        case DocumentCategory.General:
            return `General`;
        case DocumentCategory.Administration:
            return `Administration`;
        case DocumentCategory.CompanyPolicy:
            return `Company Policy`;
        case DocumentCategory.EmployeeResource:
            return `Employee Resource`;
        case DocumentCategory.Other:
            return `Other`;
    }
};

const gridStore: Ref<Store> = ref(
    new Store({
        ...fsBryntumGridConfig.gridStoreConfig,
        sorters: [defaultSorter],
        onFilter: () => {
            // Ensures that store is always set correctly based on search text
            if (
                searchText.value &&
                gridStore.value.filters.count < filterCount.value
            ) {
                filterBryntumStore();
            }
            filterCount.value = gridStore.value.filters.count;
        },
    })
);

async function populateBryntumStore() {
    gridStore.value.data = filteredDocumentList.value;
    const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
    if (gridState) {
        (gridStore.value as any).state = JSON.parse(gridState);
    }
}

const filterCount = ref(0);
const nonFilteredProps = ['id', 'filePath', 'isRestricted', 'employeeId'];
const dropdownProps = ['documentCategoryId'];
const dropdownPropsValue = [{
    name: 'documentCategoryId', value: [{ id: 1, name: 'General' },
    { id: 2, name: 'Administration' }, { id: 3, name: 'Company Policy' },
    { id: 4, name: 'Employee Resource' }, { id: 5, name: 'Other' }]
}];
const filteredDocumentList = ref(new Array<DocumentMetadata>());

function filterBryntumStore() {
    const filteredResult = filterStoreDataBySearchText(
        filteredDocumentList.value,
        nonFilteredProps,
        searchText.value,
        gridStore.value,
        dropdownProps, dropdownPropsValue
    );
    gridStore.value.data = filteredResult;
}

const searchText = ref(
    localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);
watch(searchText, () => {
    filterBryntumStore();
}, { deep: true });

watch(isRowSelected, (newValue, _oldValue) => {
    showActionPanel.value = newValue;
});

watch(showActionPanel, (newValue, _oldValue) => {
    if (!newValue) {
        currentSelectedRows.value = [];
        // Deselect all values in grid
        (grid as any).value?.instance.value.deselectAll();
    }
});
async function onDocumentDownloadClick(event: any): Promise<void> {
    await hqSuiteStore.downloadFile(event.record.data.filePath);
}

function onDocumentDeleteClick(event: any): void {
    deleteDocumentMetadata.value = event.record.data;
    showDeleteModal.value = true;
}

function onPanelDownloadClick(): void {
    const filePath = currentSelectedRows.value.map((row) => row.filePath);
    showActionPanel.value = false;
    hqSuiteStore.downloadFilesAsZip(filePath);
}

const proceedDelete = async () => {
    try {
        showDeleteModal.value = false;
        // deleting file from doc storage
        // await hqSuiteStore.deleteFile(deleteDocumentMetadata.value.filePath);
        await deleteDocument(deleteDocumentMetadata.value.id);
        if (isDocumentDeleted.value) {

            notifySuccess('Document has been deleted.');
            await refreshDocumentList();
        }
    } catch (error) {
        notifyError('Error occurred while deleting file.');
    }
}

const currentStatusFilter = ref(-1);

watch(currentStatusFilter, () => {
    filterBryntumStore();
});

// #region BryntumSearchBar
function saveGridSettings() {
    localStorage.setItem(
        `${gridLocalStorageKey}State`,
        JSON.stringify((gridStore.value as any).state)
    );
    localStorage.setItem(`${gridLocalStorageKey}SearchText`, searchText.value);
}

function clearGridSettings() {
    gridStore.value.clearFilters();
    gridStore.value.clearSorters();
    localStorage.removeItem(`${gridLocalStorageKey}State`);
    localStorage.removeItem(`${gridLocalStorageKey}SearchText`);
}

function hideFilterBar() {
    gridStore.value.clearFilters();
    gridFeatures.value.filterBar.hideFilterBar();
}

async function refreshDocumentList() {
    await fetchDocumentList();
    filteredDocumentList.value = documentList.value;
    await populateBryntumStore();
    if (searchText.value !== "") {
        filterBryntumStore();
    }
}
// #endregion
async function getDocumentFolderPath() {
    folderPath.value = await makeDocumentPath(DocumentTypes.ClientDocument, clientId.value);
}

onMounted(async () => {
    await refreshDocumentList();
    await getDocumentFolderPath();
});
</script>

<template>
    <div class="hq-pg__grid h-100">
        <bryntumSearchBar title="Documents" :local-storage-key="gridLocalStorageKey" :show-settings-button="true"
            :show-search-button="true" :show-filter-button="true" :show-refresh-button="false" :show-footer-search="false"
            @save-settings="saveGridSettings()" @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
            @show-filter-bar="gridFeatures.filterBar.showFilterBar()" @search-text-input="searchText = $event">
            <template #buttons>
                <fs-button variant="btn-primary" class="btn btn-primary ms-3" @click="showPanel = true">Add
                    Document</fs-button>
            </template>
        </bryntumSearchBar>
        <div class="action-grid list__table list__b-grid--hover">
            <bryntum-grid :readOnly="true" v-bind="gridConfig" :store="gridStore" ref="grid" />
        </div>
    </div>
    <addDocumentPanel v-model:showPanel="showPanel" :docType="DocumentTypes.ClientDocument" :folderPath="folderPath"
        @documentUploaded="refreshDocumentList" />
    <deleteConfirmationModal v-model:showDeleteModal="showDeleteModal" @OK="proceedDelete()"
        @CANCEL="showDeleteModal = false">
        Once a document is deleted, it cannot be retrieved. Are you sure you want to delete this document?
        <fs-row>
            <fs-col cols="12">
                <table id="documentDeleteModalTable" class="w-75">
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                    </tr>
                    <tr>
                        <td>{{ deleteDocumentMetadata.name }}</td>
                        <td>{{ deleteDocumentMetadata.description }}</td>
                    </tr>
                </table>
            </fs-col>
        </fs-row>
    </deleteConfirmationModal>


    <action-panel :number-of-items-selected="selectedRowCount" v-model:showPanel="showActionPanel">
        <fs-list-group>
            <fs-list-group-item button @click="onPanelDownloadClick">
                <i v-if="permissions['WHQ_254_3155']" class="b-fa b-fa-download">
                    <span class="ps-2">{{ MESSAGE.COMMON.DOWNLOAD }}</span>
                </i>
            </fs-list-group-item>
        </fs-list-group>
    </action-panel>
</template>

<style scoped>
/*This style is needed if you use the bryntumSearchBar with a footer*/
.large-header {
    grid-template-rows: 144px auto !important;
}

:deep(.b-grid-cell.b-checkbox-selection) {
    background-color: #fff;
}

:deep(.b-grid-row.b-selected .b-grid-cell.b-checkbox-selection) {
    background-color: rgba(3, 169, 244, 0.1);
}

#documentDeleteModalTable td,
#documentDeleteModalTable th {
    border: 1px solid #dddddd;
    text-align: left;
    padding: 8px;
}
</style>
