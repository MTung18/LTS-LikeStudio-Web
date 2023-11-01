<script lang="ts" setup>
import CommonModal from '@/components/common/commonModal.vue';
import moment from 'moment';
import { onMounted, ref, ComputedRef, computed, Ref, watch } from 'vue';
import { useEmployeeDocumentationStore } from '@/stores/employeeDocumentationStore';
import { storeToRefs } from 'pinia';
import { useRoute, useRouter } from 'vue-router';
import { DocumentMetadata } from '@/models/documents/documentMetadata';
import { HQSuiteRecordItem } from "@/models/hqSuite/HQSuiteRecordItem";
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { EmployeeDocumentState } from "@/enums/EmployeeDocumentState";
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { useAlerts } from '@/composables/useAlerts';
import { useLoadingStore } from "@/stores/loadingStore";
import { useEmployeeStore } from "@/stores/employeeStore";
import { ReportCriteriaParameters } from '@/models/ReportCriteriaParameters';
import { ReportCriteria } from '@/models/ReportCriteria';

const router = useRouter();
const route = useRoute();
const { setLoading } = useLoadingStore();
const hqSuiteStore = useHQSuiteStore();
const { fetchEmployeeW4RenderedDocumentInformation } = useEmployeeStore();
const { employeeW4RenderedDocumentInformation } = storeToRefs(useEmployeeStore());
const { notifySuccess, notifyError } = useAlerts();
const activeTab: Ref<EmployeeDocumentState> = ref(EmployeeDocumentState.Rendered);
const employeeDocumentationStore = useEmployeeDocumentationStore();
const { employeeDocumentations } = storeToRefs(employeeDocumentationStore);
const azureB2CAuthStore = useAzureB2CAuthStore();
const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());
const clientId: ComputedRef<string> = computed(() => azureB2CAuthStore?.activeUserClient?.clientGuid ?? 'Shared');
const w4Documents: Ref<HQSuiteRecordItem[]> = ref([]);
const filteredData: Ref<DocumentMetadata[]> = ref([]);
const w4FolderPath: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);

interface Props {
  showModal: boolean,
}
const props = withDefaults(defineProps<Props>(), {
  showModal: false,
});

const emit = defineEmits(['close']);

const tableFields = [
  {
    key: "select",
    label: "Select",
    thStyle: { width: "10%", textAlign: "center", padding: "0.5rem" },
    tdClass: "px-3 py-2",
  },
  {
    key: "name",
    label: "Name",
    thStyle: { width: "45%", padding: "0.5rem 1rem" },
    tdClass: "px-3 py-2",
  },
  {
    key: "uploadDate",
    label: "Upload Date",
    thStyle: { width: "45%", padding: "0.5rem 1rem" },
    tdClass: "px-3 py-2",
  },
];

async function refreshDocumentList() {
  await fetchDocumentList();
  filteredData.value = employeeDocumentations.value.filter(empDoc => empDoc.filePath.includes(w4FolderPath.value));

  await fetchEmployeeW4RenderedDocumentInformation(+employeeId.value);
  await fetchW4Documents();
}

async function fetchW4Documents() {
  const folderItems = await hqSuiteStore.fetchRecordItems(w4FolderPath.value);
  w4Documents.value.push(...folderItems.filter((item) => !item.isFolder));

  const fetchAndAppendItemsFromFolder = async (folderItem) => {
    if (folderItem.isFolder) {
      const folderPath = folderItem.path;
      const fetchedItems = await hqSuiteStore.fetchRecordItems(folderPath);
      w4Documents.value.push(...fetchedItems.filter((item) => !item.isFolder));
    }
  };

  for (const folderItem of folderItems) {
    await fetchAndAppendItemsFromFolder(folderItem);
  }
}

async function getDocumentFolderPath(): Promise<void> {
  const w4Promise = Promise.resolve(makeDocumentPath(DocumentTypes.EmployeeW4, clientId.value, employeeId.value));
  await Promise.all([w4Promise]).then(([w4Path]) => {
    w4FolderPath.value = w4Path;
  });
}

async function fetchDocumentList() {
  await employeeDocumentationStore.fetchEmployeeDocumentations(+employeeId.value);
}

watch([employeeId, clientId], () => {
  getDocumentFolderPath();
}, { deep: true });

onMounted(async () => {
  isLoading.value = true;
  await getDocumentFolderPath();
  await refreshDocumentList();
  isLoading.value = false;
});
const selectedPath = ref<string>();
const selectedReportGuid = ref<string>();

function switchTab(tab: EmployeeDocumentState): void {
  activeTab.value = tab;
}

const onViewClick = async () => {
  const fileData = w4Documents.value.find(x => x.path === selectedPath.value);
  if (activeTab.value === EmployeeDocumentState.Uploaded) {
    try {
      setLoading(true);
      await hqSuiteStore.downloadFile(fileData.path);
      notifySuccess("File(s) Download successfully.");
    } catch (error) {
      notifyError('Download fail.')
    } finally {
      setLoading(false)
    }
  } else {
    const reportGuid = selectedReportGuid.value;
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
      name: "reportGenerate",
      params: {
        guid: reportGuid,
      },
    });
  }
}

const onCancelClick = () => {
  emit('close');
}
</script>

<template>
  <common-modal :showModal="showModal" size="lg" title="View Tax Withholding Information" okText="VIEW"
    cancelText="CANCEL" okTextVariant="primary" @emitParent="onViewClick()" @emitCloseParent="onCancelClick()">
    <template #content>
      <div class="mx-2">
        <fs-row class="modal__header px-1 py-0">
          <fs-col cols="7" class="mt-auto mb-auto fw-bold py-3 title">W-4 Documents</fs-col>
          <fs-col cols="5" class="mt-auto pe-0 ps-0 d-flex justify-content-end tab">
            <span class="px-3 py-1" :class="{ 'active': activeTab === EmployeeDocumentState.Rendered }"
              @click="switchTab(EmployeeDocumentState.Rendered)">Rendered</span>
            <span class="px-3 py-1" :class="{ 'active': activeTab === EmployeeDocumentState.Uploaded }"
              @click="switchTab(EmployeeDocumentState.Uploaded)">Uploaded</span>
          </fs-col>
        </fs-row>

        <fs-row class="modal__table">
          <fs-col class="p-0">
            <fs-table v-if="activeTab === EmployeeDocumentState.Uploaded" :items="w4Documents.map(e => ({
              ...e,
              uploadDate: moment(e.lastEdited).format('MM/DD/YYYY')
            }))" :fields="tableFields" small bordered>
              <template v-slot:cell(select)="data">
                <fs-form-radio name="choose-view-pdf" class="d-flex justify-content-center align-items-center"
                  v-model="selectedPath" :value="data.item.path" />
              </template>
            </fs-table>
            <fs-table v-else :items="employeeW4RenderedDocumentInformation.map(e => ({
              ...e,
              uploadDate: moment(e.DateSignatureUTC).format('MM/DD/YYYY')
            }))" :fields="tableFields" small bordered>
              <template v-slot:cell(select)="data">
                <fs-form-radio name="choose-view-pdf" class="d-flex justify-content-center align-items-center"
                  v-model="selectedReportGuid" :value="data.item.reportGuid" />
              </template>
            </fs-table>
          </fs-col>
        </fs-row>
      </div>
    </template>
  </common-modal>
</template>

<style lang="scss" scoped>
.modal {
  &__header {
    border: 1px solid rgb(222, 226, 230);
    border-bottom: none;
    border: solid 1px #B5B5B5;
    border-radius: 5px;
    height: 60px;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: 0;
    font-size: 16px;

    .title {
      font-size: 16px;
    }

    .tab {
      cursor: pointer;

      .active {
        border-bottom: solid 2px #03A9F4;
        color: #15181c;
        font-weight: bold;
      }
    }
  }

  &__table {
    border: solid 1px #B5B5B5;
    border-radius: 5px;
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }



  #my-table {
    padding: 0px !important;
    border-bottom: none;

    :deep(table.table.fs-table) {
      margin-bottom: 0 !important;

      th,
      td {
        padding: 10px !important
      }

      tr:last-child td {
        border-bottom-width: 0px
      }


      .table> :not(caption)>div:last-child {
        border-bottom: none;
      }
    }
  }
}

:deep(.modal-body) {
  min-height: 500px !important;
}

:deep(.modal__table) {
  height: 484px;
  overflow-y: scroll;
}

:deep(table.table thead tr) {
  position: sticky;
  top: 0;
  background: white;
}
</style>
