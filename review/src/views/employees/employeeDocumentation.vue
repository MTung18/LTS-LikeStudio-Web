<script setup lang="ts">
import {
  computed,
  ComputedRef,
  onMounted,
  Ref,
  ref,
  watch,
  inject
} from "vue";
import { storeToRefs } from "pinia";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faExclamationCircle,
  faFileDownload,
  faFilter,
  faSliders,
  faTrashAlt,
  faUpload,
} from "@fortawesome/pro-light-svg-icons";
import { faExclamationTriangle } from "@fortawesome/pro-solid-svg-icons";
import { useEmployeeDocumentationStore } from "@/stores/employeeDocumentationStore";
import { DocumentTypes, makeDocumentPath } from "@/helper/hqSuite/pathHelper";
import { useRoute } from "vue-router";
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import { formatUTCToLocalDate } from "@/functions/DateUtilityFunctions";
import { useDocumentMetadataStore } from "@/stores/documentMetadataStore";
import { useAlerts } from "@/composables/useAlerts";
import deleteConfirmationModal from "@/components/shared/deleteConfirmationModal.vue";
import actionPanel from "@/components/shared/actionPanel.vue";
import addDocumentPanel from "@/components/viewComponents/documents/addDocumentPanel.vue";
import federalStateDocumentationWidget from "@/components/viewComponents/employees/federalStateDocumentationWidget.vue";
import { DocumentMetadata } from "@/models/documents/documentMetadata";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import employeeHeader from "@/components/navigation/EmployeesHeader/employeeHeader.vue";
import { MESSAGE } from "@/data/message";
import { useBryntumSelector } from "@/composables/useBryntumSelector";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { Grid } from "@bryntum/grid";
import { useBryntumGridSearchFilter } from "@/composables/useBryntumGridSearchFilter";
import { useEmployeeStore } from "@/stores/employeeStore";
import darkThemeModal from "@/components/shared/darkThemeModal.vue";
import PendingFoundationApprovalBanner from "@/components/shared/pendingFoundationApprovalBanner.vue";
import { useRouter } from "vue-router";
import { ReportCriteriaParameters } from '@/models/ReportCriteriaParameters';
import { ReportCriteria } from '@/models/ReportCriteria';
import { isNotEmptyGuid } from '@/functions/ValidationUtilityFunctions';

const permissions = inject<Record<string, boolean>>("$providePermissions");

library.add(
  faFilter,
  faSliders,
  faExclamationCircle,
  faFileDownload,
  faTrashAlt,
  faUpload,
  faExclamationTriangle
);
const employeeDetails = ref(null);
const {
  fetchEmployeeDetails,
  fetchEmployeeW4RenderedDocumentInformation,
  fetchEmployeeFederalRenderedDocumentInformation,
  checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync
} = useEmployeeStore();
const {
  getEmployeeDetails,
  employeeW4RenderedDocumentInformation,
  employeeFederalRenderedDocumentInformation,
  employeeHasExistingPendingFoundationApprovals
} = storeToRefs(useEmployeeStore());
const employeeDocumentationStore = useEmployeeDocumentationStore();
const { employeeDocumentations } = storeToRefs(employeeDocumentationStore);
const documentMetadataStore = useDocumentMetadataStore();
const { isDocumentDeleted } = storeToRefs(documentMetadataStore);
const route = useRoute();
const azureB2CAuthStore = useAzureB2CAuthStore();
const isHRM = computed(() => permissions.value["WHQ_254_3155"]);
const employeeId: ComputedRef<string> = computed(() =>
  route.params?.id?.toString()
);
const clientId: ComputedRef<string> = computed(
  () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
const isGeneralTabActive: ComputedRef<boolean> = computed(
  () => currentTab.value === "General"
);
const hasPendingFoundationApproval: Ref<boolean> = ref(false);

const { notifySuccess, notifyError } = useAlerts();

const hqSuiteStore = useHQSuiteStore();
const router = useRouter();
const {
  currentSelectedRows,
  selectedRowCount,
  isRowSelected,
  bryntumSelectedRowHandler,
} = useBryntumSelector<DocumentMetadata>();

const showActionPanel = ref(false);

const showPanel: Ref<boolean> = ref(false);
const isLoading: Ref<boolean> = ref(false);
const isMultipleDelete: Ref<boolean> = ref(false);

const folderPath: Ref<string> = ref("");
const w4FolderPath: Ref<string> = ref("");
const federalReportingFolderPath: Ref<string> = ref("");
const w4Documents: Ref<DocumentMetadata[]> = ref([]);
const federalReportingDocuments: Ref<DocumentMetadata[]> = ref([]);
const showDeleteModal: Ref<boolean> = ref(false);
const deleteDocumentMetadata: Ref<DocumentMetadata> = ref();
const openConfirmModal = ref(false);
const w4ReportGuid: Ref<string> = ref("");
const hideCancelButton: Ref<boolean> = ref(false);

let currentTab: Ref<string> = ref("General");
const filterOptions: Ref<
  { text: string; value: string; uiFieldTag: string }[]
> = ref([
  { id: 1, text: "General", value: "General", uiFieldTag: "WHQ_254_3154" },
  {
    id: 2,
    text: "Federal/State",
    value: "Federal/State",
    uiFieldTag: "WHQ_254_3156",
  },
]);
const documentNameField = {
  flex: 2,
  text: "Name",
  id: "name",
  field: "name",
  groupable: false,
};

const dateField = {
  flex: 1,
  text: "Date",
  id: "updatedOn",
  field: "updatedOn",
  renderer: ({ row, value }) => {
    return formatUTCToLocalDate(value);
  },
  groupable: false,
};

const dateRenderedField = {
  flex: 1,
  text: "Date",
  id: "dateSignatureUTC",
  field: "dateSignatureUTC",
  renderer: ({ row, value }) => {
    return formatUTCToLocalDate(value);
  },
  groupable: false,
};

const actionsField = {
  flex: 1,
  type: "action",
  id: "action",
  text: "Actions",
  columnDragToolbar: false,
  enableHeaderContextMenu: false,
  enableCellContextMenu: false,
  cellCls: "b-action-cell--hover",
  actions: [
    {
      visible: true,
      renderer: () => {
        return '<i class="b-action-item b-fa b-fa-download btn btn-link text-success no-underline"> Download</i>';
      },
      onClick: onDocumentDownloadClick,
    },
    {
      visible: isHRM.value,
      renderer: () => {
        return `<i class="b-action-item b-fa b-fa-trash-alt btn btn-link text-red no-underline ${
          hasPendingFoundationApproval.value ? 'disabled' : ''
        }">Delete</i>`;
      },
      onClick: onDocumentDeleteClick,
    },
  ],
};

function generateReport(guid) {
  // Get the existing reportCriteriaList from localStorage, if it exists
  var reportCriteriaList = JSON.parse(localStorage.getItem("report") || "[]");
  const reportCriteriaParams = new ReportCriteriaParameters();

  // Set the name property
  reportCriteriaParams.name = "employeeId";
  const reportCriteriaItem = new ReportCriteria({
    id: Number(employeeId.value),
    name: "",
    guid: "",
    default: false,
    referenceInformation: "",
    sortByField: "",
  });
  reportCriteriaParams.value = [reportCriteriaItem];

  const existingIndex = reportCriteriaList.findIndex(item => item.name === reportCriteriaParams.name);
  if (existingIndex !== -1) {
    // If it exists, replace it with reportCriteriaItem
    reportCriteriaList[existingIndex] = reportCriteriaParams;
  } else {
    // If it doesn't exist, push the new reportCriteriaParams into the list
    reportCriteriaList.push(reportCriteriaParams);
  }

  // Save the updated reportCriteriaList back to localStorage
  localStorage.setItem("report", JSON.stringify(reportCriteriaList));
  router.push({
    name: "employeeReportGenerate",
    params: {
      id: employeeId.value,
      guid: guid
    },
  });
}

const actionsRenderedFederalField = {
  flex: 1,
  type: "action",
  id: "action",
  text: "Actions",
  columnDragToolbar: false,
  enableHeaderContextMenu: false,
  enableCellContextMenu: false,
  cellCls: "b-action-cell--hover",
  actions: [
    {
      visible: true,
      renderer: () => {
        return '<i class="b-action-item b-fa b-fa-external-link btn btn-link text-success no-underline"> View</i>';
      },
      onClick: async ({ record }) => {
        if (isNotEmptyGuid(record.data.reportGuid)){
          generateReport(record.data.reportGuid);
        }
      },
    },
  ],
};

const actionsW4RenderedField = {
  flex: 1,
  type: "action",
  id: "action",
  text: "Actions",
  columnDragToolbar: false,
  enableHeaderContextMenu: false,
  enableCellContextMenu: false,
  cellCls: "b-action-cell--hover",
  field: "typeId",
  actions: [
    {
      visible: true,
      renderer: ({ row, value }) => {
        return '<i class="b-action-item b-fa b-fa-external-link btn btn-link text-success no-underline"> View</i>';
      },
      onClick: onDocumentViewClickOpenModal,
    },
  ],
};

const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);
const gridLocalStorageKey = "employeeDocumentListGrid";
const defaultSorter = {
  field: "name",
  ascending: true,
};
const {
  filteredData,
  defaultGridConfig,
  statefulFilterFeature,
  statefulSortFeature,
  searchText,
  gridStore,
  saveGridSettings,
  clearGridSettings,
  hideFilterBar,
  populateBryntumStore,
} = useBryntumGridSearchFilter<DocumentMetadata>(
  gridFeatures,
  gridLocalStorageKey,
  defaultSorter,
  filterBryntumStore
);

const gridConfig = ref({
  ...defaultGridConfig,
  ...statefulFilterFeature,
  ...statefulSortFeature,
  minHeight: "40em",
  emptyText: MESSAGE.DOCUMENT_META.NO_RECORD,
  selectionMode: {
    cell: false,
    row: false,
    autoWidth: true,
    toggleable: true,
    checkboxOnly: true,
    showCheckAll: true,
  },
  columns: [
    documentNameField,
    {
      flex: 2,
      text: "Description",
      id: "description",
      field: "description",
      groupable: false,
    },
    {
      flex: 1,
      text: "Contains Restricted Info",
      id: "isRestricted",
      field: "isRestricted",
      hidden: !isHRM.value,
      htmlEncode: false,
      renderer({ record, widgets, cellElement, value }: any): void {
        const classList = [
          "d-flex",
          "justify-content-center",
          "b-fa",
          "b-fa-exclamation-circle",
          "text-warning",
        ];
        if (value === true) {
          if (widgets && widgets[0]) widgets[0].hidden = true;
          classList.forEach((ele: any) => {
            cellElement.classList.add(ele);
          });
        } else {
          if (widgets && widgets[0]) widgets[0].hidden = false;
          classList.forEach((ele: any) => {
            cellElement.classList.remove(ele);
          });
        }
      },
      groupable: false,
    },
    dateField,
    {
      flex: 1,
      text: "Uploaded By",
      id: "updatedBy",
      field: "updatedBy",
      groupable: false,
    },
    actionsField,
  ],
  listeners: {
    selectionChange: (data) =>
      bryntumSelectedRowHandler(currentSelectedRows, data),
  },
});

const nonFilteredProps = [];
const dropdownProps = [];
const dropdownPropsValue = [];

function filterBryntumStore() {
  const filteredResult = filterStoreDataBySearchText(
    filteredData.value,
    nonFilteredProps,
    searchText.value,
    gridStore.value,
    dropdownProps,
    dropdownPropsValue
  );
  gridStore.value.data = filteredResult;
}

async function refreshDocumentList() {
  await fetchDocumentList();
  if (isHRM.value) {
    filteredData.value = employeeDocumentations.value.filter((empDoc) =>
      empDoc.filePath.includes(folderPath.value)
    );
  } else {
    filteredData.value = employeeDocumentations.value.filter(
      (empDoc) =>
        !empDoc.isRestricted && empDoc.filePath.includes(folderPath.value)
    );
  }
  w4Documents.value = employeeDocumentations.value.filter(empDoc => empDoc.filePath.includes(w4FolderPath.value));
  federalReportingDocuments.value = employeeDocumentations.value.filter(empDoc => empDoc.filePath.includes(federalReportingFolderPath.value));
  await fetchEmployeeW4RenderedDocumentInformation(employeeId.value);
  await fetchEmployeeFederalRenderedDocumentInformation(employeeId.value);
  await populateBryntumStore();
  if (searchText.value !== "") {
    filterBryntumStore();
  }
}

async function fetchDocumentList() {
  await employeeDocumentationStore.fetchEmployeeDocumentations(
    +employeeId.value
  );
}

async function onDocumentDownloadClick(event: any): Promise<void> {
    if (event.record.data.isRestricted && !isHRM.value) {
        notifyError('Only HRM Admin can download this item');
        return;
    }
    notifySuccess(MESSAGE.COMMON.DOWNLOADING);
    var fileToDownloadPath = event.record.data.filePath ?? event.record.data.path;
    await hqSuiteStore.downloadFile(fileToDownloadPath);
}

async function onDocumentViewClickOpenModal(event: any): Promise<void> {
    w4ReportGuid.value = event.record.data.reportGuid;
    openConfirmModal.value = true;
    hideCancelButton.value = true;
}

const handleConfirmButtonClick = async () => {
  try {
    if (isNotEmptyGuid(w4ReportGuid.value)){
      generateReport(w4ReportGuid.value);
    }
  } catch (error) {
    notifyError(
      "There was an error while generating W4 Rendered report, please try again later."
    );
  }
  openConfirmModal.value = false;
};

async function getDocumentFolderPath(): Promise<void> {
  const generalPromise = Promise.resolve(
    makeDocumentPath(
      DocumentTypes.EmployeeDocument,
      clientId.value,
      employeeId.value
    )
  );
  const w4Promise = Promise.resolve(
    makeDocumentPath(DocumentTypes.EmployeeW4, clientId.value, employeeId.value)
  );
  const federalReportingPromise = Promise.resolve(
    makeDocumentPath(
      DocumentTypes.EmployeeFederalReporting,
      clientId.value,
      employeeId.value
    )
  );
  await Promise.all([generalPromise, w4Promise, federalReportingPromise]).then(
    ([generalPath, w4Path, federalReportingPath]) => {
      folderPath.value = generalPath;
      w4FolderPath.value = w4Path;
      federalReportingFolderPath.value = federalReportingPath;
    }
  );
}

watch(
  [employeeId, clientId],
  () => {
    getDocumentFolderPath();
  },
  { deep: true }
);

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

onMounted(async () => {
  isLoading.value = true;
  await getDocumentFolderPath();
  await refreshDocumentList();
  isLoading.value = false;
  await Promise.all([
    fetchEmployeeDetails(employeeId.value),
    checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync(
      +employeeId.value
    ),
  ]);
  employeeDetails.value = getEmployeeDetails.value;
  hasPendingFoundationApproval.value =
    employeeHasExistingPendingFoundationApprovals.value;
});

const federalStateGridConfig = ref({
  columns: [documentNameField, dateField, actionsField],
});

const federalStateRenderedGridConfig = ref({
  columns: [documentNameField, dateRenderedField, actionsRenderedFederalField],
});

const federalStateW4RenderedGridConfig = ref({
  columns: [documentNameField, dateRenderedField, actionsW4RenderedField],
});

watch(currentTab, (newValue) => {
  currentTab.value = newValue;
});

function onDocumentDeleteClick(event: any): void {
  if (!isHRM.value) {
    notifyError("Only HRM Admin can delete this item");
    return;
  }

  deleteDocumentMetadata.value = event.record.data;
  isMultipleDelete.value = false;
  showDeleteModal.value = true;
}

async function proceedDelete(): Promise<void> {
  if (isMultipleDelete.value) {
    await multipleDelete();
  } else {
    if (deleteDocumentMetadata.value) {
      if (
        await deleteDocumentMeta(
          deleteDocumentMetadata.value.id,
          deleteDocumentMetadata.value.filePath
        )
      ) {
        notifySuccess(MESSAGE.DOCUMENT_META.DELETE_SUCCESS);
        await refreshDocumentList();
      } else {
        notifyError(MESSAGE.DOCUMENT_META.DELETE_ERROR);
      }
    }
  }
  isMultipleDelete.value = false;
}

async function deleteDocumentMeta(
  id: number,
  filePath: string
): Promise<boolean> {
  try {
    showDeleteModal.value = false;
    // deleting file from doc storage
    if (await hqSuiteStore.deleteFile(filePath)) {
      await documentMetadataStore.deleteDocument(id);
      return isDocumentDeleted.value;
    } else {
      notifyError(`${MESSAGE.DOCUMENT_META.DELETE_ERROR} - ${filePath}`);
      return false;
    }
  } catch (error) {
    return false;
  }
}

function onPanelDownloadClick(): void {
  const filePath = currentSelectedRows.value.map((row) => row.filePath);
  showActionPanel.value = false;
  hqSuiteStore.downloadFilesAsZip(filePath);
}

async function onPanelDeleteClick(): Promise<void> {
  isMultipleDelete.value = true;
  showDeleteModal.value = true;
}

async function multipleDelete(): Promise<void> {
  const promises: Array<Promise<boolean>> = [];
  currentSelectedRows.value.forEach((row) => {
    promises.push(deleteDocumentMeta(row.id, row.filePath));
  });
  var deletePromise = await Promise.all(promises);
  showActionPanel.value = false;
  // Partial Successs or Successs
  if (!deletePromise.every((v: boolean) => v === false))
    notifySuccess(MESSAGE.DOCUMENT_META.DELETE_SUCCESS);
  await refreshDocumentList();
}
</script>

<template>
    <div class="hq-pg" :class="{ 'bg-grey--000': !isGeneralTabActive, 'list': isGeneralTabActive }">
        <employeeHeader :employeeId="employeeId" class="position-relative">
        </employeeHeader>

        <bryntumSearchBar :sticky="true" title="" :local-storage-key="gridLocalStorageKey"
            :show-settings-button="isGeneralTabActive" :show-search-button="isGeneralTabActive"
            :show-filter-button="isGeneralTabActive" :show-refresh-button="false" :show-footer-search="false"
            @save-settings="saveGridSettings()" @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
            @show-filter-bar="gridFeatures.filterBar.showFilterBar()" @search-text-input="searchText = $event">
            <template #headers>
                <template v-for="(item, index) in filterOptions" :key="item.id">
                    <fs-form-radio v-if="permissions[item.uiFieldTag]" v-model="currentTab" :value="item.value" button
                        :button-variant="currentTab === item.value ? 'index-color-5 ' : 'link'"
                        :class="currentTab === item.value ? 'rounded-pill' : 'hq-pg__tab text-decoration-none'"
                        :key="index">
                        {{ item.text }}
                    </fs-form-radio>
                </template>
            </template>
            <template #buttons v-if="isGeneralTabActive && permissions['WHQ_254_3154']">
                <fs-button variant="btn-primary" @click="showPanel = true" class="btn btn-primary ms-0">{{
                    MESSAGE.DOCUMENT_META.ADD_DOCUMENT }}</fs-button>
            </template>
        </bryntumSearchBar>
        <pending-foundation-approval-banner
            :hasPendingFoundationApproval="hasPendingFoundationApproval"></pending-foundation-approval-banner>
        <div v-if="isGeneralTabActive && permissions['WHQ_254_3154']" class="list__table">
            <div class="list__table list__table--onpage list__b-grid--hover">
                <bryntum-grid :readOnly="true" v-bind="gridConfig" :store="gridStore" ref="grid" />
            </div>
        </div>
        <fs-container v-else-if="permissions['WHQ_254_3156']" fluid class="contain py-3">

            <federalStateDocumentationWidget title="W-4 Documents" :federalStateGridConfig="federalStateGridConfig"
                :federalStateGridRenderedConfig="federalStateW4RenderedGridConfig" :folderPath="w4FolderPath"
                :employeeId="+employeeId" @documentUploaded="refreshDocumentList" :dataForGrid="w4Documents" class="mb-4"
                :hasPendingFoundationApproval="hasPendingFoundationApproval" :dataForRenderedGrid="employeeW4RenderedDocumentInformation">
            </federalStateDocumentationWidget>
            <federalStateDocumentationWidget title="Federal Reporting" :federalStateGridConfig="federalStateGridConfig"
                :federalStateGridRenderedConfig="federalStateRenderedGridConfig" :folderPath="federalReportingFolderPath"
                :employeeId="+employeeId" @documentUploaded="refreshDocumentList" :dataForGrid="federalReportingDocuments"
                :hasPendingFoundationApproval="hasPendingFoundationApproval" :dataForRenderedGrid="employeeFederalRenderedDocumentInformation">
            </federalStateDocumentationWidget>

        </fs-container>
        <addDocumentPanel v-if="!isLoading" v-model:showPanel="showPanel" :docType="DocumentTypes.EmployeeDocument"
            :folderPath="folderPath" :employeeId="+employeeId" @documentUploaded="refreshDocumentList" />

    <deleteConfirmationModal
      v-model:showDeleteModal="showDeleteModal"
      @OK="proceedDelete()"
      @CANCEL="showDeleteModal = false"
    >
      <span>
        {{ MESSAGE.DOCUMENT_META.DELETE_MESSAGE }}
        <div v-if="isMultipleDelete" class="scroll-y-auto scroll--xs pt-2">
          <p
            v-for="(row, index) in currentSelectedRows"
            :key="index"
            class="mb-1"
          >
            <i class="b-fa b-fa-file-contract"></i>
            <span class="ps-2">{{ row.name }}</span>
          </p>
        </div>
      </span>
    </deleteConfirmationModal>

    <action-panel
      :number-of-items-selected="selectedRowCount"
      v-model:showPanel="showActionPanel"
    >
      <fs-list-group>
        <fs-list-group-item button @click="onPanelDownloadClick">
          <i v-if="permissions['WHQ_254_3155']" class="b-fa b-fa-download">
            <span class="ps-2">{{ MESSAGE.COMMON.DOWNLOAD }}</span>
          </i>
        </fs-list-group-item>
        <fs-list-group-item button @click="onPanelDeleteClick">
          <i
            :class="`b-fa b-fa-trash-alt ${
              hasPendingFoundationApproval ? 'disabled' : ''
            }`"
          >
            <span class="ps-2">{{ MESSAGE.COMMON.DELETE }}</span>
          </i>
        </fs-list-group-item>
      </fs-list-group>
    </action-panel>

        <darkThemeModal title="Warning!" :show-modal="openConfirmModal" :hideCancelButton="hideCancelButton" okText="OK"
            okTextVariant="primary" @ok="handleConfirmButtonClick">
            <template #content>
                <div class="d-flex my-2">
                    <font-awesome-icon :icon="['fas', 'triangle-exclamation']" class="text-warning me-2 mt-1" />
                    <span class="text-lg">
                        The document you have selected has been electronically rendered. If providing this form to a
                        government entity,
                        please review and determine if it should be filled out manually before submitting.
                    </span>
                </div>
            </template>
        </darkThemeModal>
    </div>
</template>

<style scoped>
#documentDeleteModalTable td,
#documentDeleteModalTable th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}
</style>