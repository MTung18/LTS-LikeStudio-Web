<script setup lang="ts">
import { Ref, watch } from "vue";
import { computed, onMounted, ref } from "vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Grid, Store } from "@bryntum/grid";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { storeToRefs } from "pinia";

import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPenToSquare,
  faPlus,
  faTimes,
  faTrashCan,
  faEdit,
  faCheckCircle,
} from "@fortawesome/pro-light-svg-icons";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import PayStubSidebar from "@/views/settings/payrollAndTax/payStubSidebar.vue";
import { PayStubDateT } from "@/models/hrmSettings/payrollAndTax/payStub/payStubDate";
import { useSettingsStore } from "@/stores/settingsStore";
import moment from "moment";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { filterBlank } from '@/utilities/filterBlankValue';
import { useAlerts } from '@/composables/useAlerts';

const { responsive } = useBreakpoints();
const { notifySuccess, notifyError } = useAlerts();
library.add(faTimes, faPenToSquare, faTrashCan, faPlus, faExclamationCircle, faEdit, faCheckCircle);

const { fetchPayStub, fetchShowSection, changeShowSection, deletePayStub } = useSettingsStore();
const { payStubList, showSection } = storeToRefs(useSettingsStore());
const showAddSidebar = ref(false);
const showEditSidebar = ref(false);
const showDeleteModal = ref(false);
const isEditingShowSection = ref(false);
const sidebarKey = ref(0);
const tableKey = ref(0);
const selectedPayDate = ref<PayStubDateT>(null);

const gridLocalStorageKey = "setupSettingsListGrid";
const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(() => (grid as any).value?.instance.value.features);

const formatDate = (input: string) => {
  const date = new Date(input);
  return (
    (date.getMonth() > 8 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1)) +
    "/" +
    (date.getDate() > 9 ? date.getDate() : "0" + date.getDate()) +
    "/" +
    date.getFullYear()
  );
};

const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey),
  autoHeight: false,
  minHeight: "33em",
  emptyText: "",
  rowHeight: 50,
  columns: [
    {
      flex: 2,
      text: "Pay Date",
      id: "payDate",
      field: "payDate",
      groupable: false,
      sortable: true,
      htmlEncode: false,
      renderer: ({ record }: { record: PayStubDateT }) => {
        return `${filterBlank(formatDate(record.payDate))}`;
      },
    },
    {
      flex: 2,
      text: "Available To Employee On",
      id: "availableToEmployeeOnDate",
      field: "availableToEmployeeOnDate",
      sortable: true,
      groupable: false,
      renderer: ({ record }: { record: PayStubDateT }) => {
        return `${filterBlank(formatDate(record.availableToEmployeeOnDate))}`;
      },
    },
    {
      flex: 1,
      type: "action",
      id: "action",
      text: "Actions",
      columnDragToolbar: false,
      enableHeaderContextMenu: false,
      enableCellContextMenu: false,
      actions: [
        {
          visible: true,
          renderer: ({ record }: { record: PayStubDateT }) => {
            return moment(record.availableToEmployeeOnDate).diff(Date.now(), "hours") > 0
              ? `<i class="b-action-item b-fa b-fa-edit cursor-pointer text-success no-underline">Edit</i>`
              : `<i class="b-action-item b-fa b-fa-edit cursor-pointer text-success no-underline invisible">Edit</i>`;
          },
          onClick: ({ record }) => {
            selectedPayDate.value = record;
            showEditSidebar.value = true;
          },
        },
        {
          visible: true,
          renderer: ({ record }: { record: PayStubDateT }) => {
            return moment(record.availableToEmployeeOnDate).diff(Date.now(), "hours") > 0
              ? `<i class="b-action-item b-fa b-fa-trash-alt cursor-pointer no-underline text-danger">Delete</i>`
              : `<i class="b-action-item b-fa b-fa-trash-alt cursor-pointer no-underline text-danger invisible">Delete</i>`;
          },
          onClick: ({ record }) => {
            selectedPayDate.value = record;
            showDeleteModal.value = true;
          },
        },
      ],
    },
  ],
});

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
  }),
);

async function populateBryntumStore() {
  gridStore.value.data = [];
  gridStore.value.data = payStubList.value;
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

const showSectionOptions = [
  {
    text: `Current Hours And Earnings`,
    value: `showCurrentHoursAndEarnings`,
  },
  {
    text: `Year To Date Hours And Earnings`,
    value: `showYearToDateHoursAndEarnings`,
  },
  {
    text: `Taxes And Deductions`,
    value: `showTaxesAndDeductions`,
  },
  {
    text: `Fringes`,
    value: `showFringes`,
  },
];

const selectedShowSections = ref<string[]>([]);

// #region BryntumSearchBar
const saveGridSettings = () => {
  localStorage.setItem(
    `${gridLocalStorageKey}State`,
    JSON.stringify((gridStore.value as any).state),
  );
};

const clearGridSettings = () => {
  gridStore.value.clearFilters();
  gridStore.value.clearSorters();
  localStorage.removeItem(`${gridLocalStorageKey}State`);
};

const hideFilterBar = () => {
  gridStore.value.clearFilters();
  gridFeatures.value.filterBar.hideFilterBar();
};

// #endregion

const refreshData = async () => {
  await fetchShowSection();
  await fetchPayStub();
  await populateBryntumStore();
  await populateShowSection();
};

const handleCloseAddSidebar = () => {
  showAddSidebar.value = !showAddSidebar.value;
  sidebarKey.value++;
};

const handleCloseEditSidebar = () => {
  showEditSidebar.value = !showEditSidebar.value;
  sidebarKey.value++;
};

const handleCancelChange = async () => {
  await refreshData();
  isEditingShowSection.value = false;
};

const handleChangeShowSections = async () => {
  const { payrollAndTaxesSettingId, ...sections } = showSection.value;
  Object.keys(sections).map(sectionKey => {
    if (selectedShowSections.value.includes(sectionKey)) {
      sections[sectionKey] = true;
    } else {
      sections[sectionKey] = false;
    }
  });

  try {
    await changeShowSection({ payrollAndTaxesSettingId, sections });
    notifySuccess('Show section updated.')
  } catch (error) {
    throw new Error("failed to update date of show sections", error);
  } finally {
    await fetchShowSection();
    populateShowSection();
    isEditingShowSection.value = false;
  }
};

const openEditShowSection = () => {
  populateShowSection();
  isEditingShowSection.value = true;
};

const handleDeletePayStubDate = async () => {
  const payDateId = selectedPayDate.value.payStubSettingId;
  try {
    await deletePayStub(payDateId);
    notifySuccess('Available Date deleted.')
  } catch (error) {
    throw new Error("failed to delete pay stub", error);
  } finally {
    await refreshData();
    showDeleteModal.value = false;
  }
};

const handleAddPayStubDate = async () => {
  await refreshData();
};

const populateShowSection = () => {
  selectedShowSections.value = [
    ...Object.keys(showSection.value).filter(benefit => showSection.value[benefit] === true),
  ];
};

const backgroundGroupCheckbox = computed(() => {
  return isEditingShowSection.value ? `#03A9F4` : `rgba(110, 124, 143, 0.31)`;
});

const bActionMargin = ref('32px')
const bGridCellPadding = ref('24px')
watch(
  () => responsive.breakpoint,
  () => {
    gridConfig.value.columns.forEach((col) => col.flex = 1)
    if (responsive.mobile) {
      bActionMargin.value = '12px';
      bGridCellPadding.value = '10px';
    }

    tableKey.value++
  }
);

onMounted(async () => {
  await refreshData();
});
</script>

<template>
  <fs-container fluid class="px-0">
    <fs-row></fs-row>
    <fs-row no-gutters="true" class="showSections">
      <div class="border-bottom d-flex justify-content-between align-items-center ">
        <div class="hq-pg__title ps-3">Show Sections</div>
        <div class="py-3">
          <div v-if="isEditingShowSection">
            <fs-button size="small" variant="outline-secondary" @click="handleCancelChange">Cancel
            </fs-button>
            <fs-button size="small" variant="success" class="mx-3" @click="handleChangeShowSections">Save
            </fs-button>
          </div>
          <div v-else>
            <fs-button size="small" variant="outline-primary" class="mx-3" @click="openEditShowSection">
              <font-awesome-icon icon="fal fa-edit" class="me-1" />
              <div v-if="!responsive.mobile">Edit</div>
            </fs-button>
          </div>
        </div>
      </div>
      <fs-row class="px-3 pt-3">
        <fs-form-group v-slot="{ ariaDescribedby }">
          <fs-form-checkbox-group :disabled="!isEditingShowSection" label="Show Sections" size="lg"
            v-model="selectedShowSections" :options="showSectionOptions"
            :aria-describedby="ariaDescribedby"></fs-form-checkbox-group>
        </fs-form-group>
      </fs-row>
    </fs-row>
    <fs-row no-gutters="true">
      <div>
        <bryntumSearchBar title="Pay Stub Available Date" :sticky="true" :local-storage-key="gridLocalStorageKey"
          :show-settings-button="true" :show-filter-button="true" :show-search-button="false" :show-footer-search="false"
          @save-settings="saveGridSettings()" @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
          @show-filter-bar="gridFeatures.filterBar.showFilterBar()" @refresh-grid="refreshData()">
          <template #buttons>
            <fs-button variant="success" @click="showAddSidebar = true" class="ms-2">
              Add Date
            </fs-button>
          </template>
        </bryntumSearchBar>
        <div class="list__table">
          <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
        </div>
      </div>
    </fs-row>
    <PayStubSidebar v-if="selectedPayDate" :sidebarType="'EDIT'" :isShowSidebar="showEditSidebar"
      :payStubId="selectedPayDate.payStubSettingId" @close-sidebar="handleCloseEditSidebar"
      @update-pay-stub="handleAddPayStubDate" :key="sidebarKey" />

    <PayStubSidebar :sidebarType="'ADD'" :isShowSidebar="showAddSidebar" @close-sidebar="handleCloseAddSidebar"
      @add-pay-stub="handleAddPayStubDate" :key="sidebarKey" />

    <fs-modal id="delete-pay-stub-modal" ref="modal" content-class="content-fsModal" body-class="body-fsModal"
      header-bg-variant="blue" header-close-variant="light" header-text-variant="white" hide-header-close="true"
      v-model="showDeleteModal" @ok="handleDeletePayStubDate">
      <template #modal-header="{ cancel }">
        <div class="w-100 d-flex align-items-center justify-content-between">
          <div class="title">Delete Pay Stub</div>
          <fs-link class="text-secondary" tag="a" @click="cancel">
            <font-awesome-icon :icon="['fal', 'times']" size="lg" class="text-white"></font-awesome-icon>
          </fs-link>
        </div>
      </template>
      <template #default>
        <span class="d-flex">
          <font-awesome-icon class="me-2 text-danger" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
          <h5>Do you want to delete this available date?</h5>
        </span>
      </template>
      <template #modal-footer="{ ok, cancel }">
        <fs-button-group>
          <fs-button @click="cancel" variant="light" class="mx-2 text-uppercase">cancel </fs-button>
          <fs-button @click="ok" variant="danger" class="mx-2 text-uppercase">ok </fs-button>
        </fs-button-group>
      </template>
    </fs-modal>
  </fs-container>
</template>

<style scoped>
:deep(.b-grid-row:hover .b-grid-cell.b-action-cell) {
  visibility: visible;
}

:deep(.b-grid-row .b-grid-cell.b-action-cell) {
  visibility: hidden;
}

:deep(.b-action-item:hover) {
  transform: none;
}
.btn-group-toggle.btn-group :deep(label) {
  margin: auto 1rem;
  border: none;
  padding: 10px 22px 10px 22px;
  border-radius: 50px !important;
}

.btn-group-toggle.btn-group :deep(label.active) {
  background: #6750a3;
  border-radius: 50px;
}

.btn-group-toggle.btn-group :deep(label):hover {
  background: rgb(150 127 210);
  transition: all ease-in-out 0.3s;
}

:deep(.form-check-label) {
  font-size: 14px;
}

:deep(.b-grid-cell.b-checkbox-selection) {
  background-color: #fff;
}

:deep(.content-fsModal) {
  background-color: #193755;
}

:deep(.body-fsModal) {
  height: 500px;
}

.title-bar {
  padding: 25px 20px;
  border-bottom: 1px solid rgb(225, 228, 232);
}

.title {
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
}

.showSections {
  border-right: 1px solid rgb(225, 228, 232);
}

:deep(.form-check.form-check-inline) {
  display: block;
  font-size: 16px;
}

:deep(.b-grid-cell) {
  padding-left: v-bind(bGridCellPadding);
  padding-right: v-bind(bGridCellPadding);
}

:deep(.b-grid-header) {
  padding-left: v-bind(bGridCellPadding);
  padding-right: v-bind(bGridCellPadding);
}

:deep(.b-action-item::before) {
  font-size: 18px;
  display: block;
}

:deep(.b-action-item) {
  margin-right: 12px;
  font-size: 12px;
}

:deep(.form-check-input:checked) {
  background-color: v-bind(backgroundGroupCheckbox);
  border-color: v-bind(backgroundGroupCheckbox);
}

:deep(.b-action-item:hover) {
  transform: none;
}

:deep(.b-hbox.b-box-center.b-panel-body-wrap.b-grid-body-wrap) {
  min-height: 33em;
}
</style>
