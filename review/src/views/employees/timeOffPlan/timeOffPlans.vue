<script lang="ts" setup>
import { onMounted, ref, computed, watch, ComputedRef } from "vue";
import type { Ref } from "vue";
import { storeToRefs } from "pinia";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Grid, Store } from "@bryntum/grid";
import { TimeOffPlanTree } from "@/models/employees/timeOff/TimeOffPlan";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { useTimeOffPlanStore } from "@/stores/timeOffPlanStore";
import historyOfPlan from "@/components/viewComponents/employees/historyOfPlanType.vue";
import timeOffPlanPanel from "@/components/viewComponents/employees/timeOffPlans/timeOffPlanPanel.vue";
import { faCircleCheck, faCircleXmark } from "@fortawesome/pro-solid-svg-icons";
import { useRoute } from "vue-router";
import { DateHelper, Model } from "@bryntum/grid";
import { useEmployeeStore } from "@/stores/employeeStore";
import employeeHeader from "@/components/navigation/EmployeesHeader/employeeHeader.vue";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { filterBlank } from '@/utilities/filterBlankValue';
import { useLoadingStore } from "@/stores/loadingStore";

import PendingFoundationApprovalBanner from '@/components/shared/pendingFoundationApprovalBanner.vue';
const { setLoading } = useLoadingStore();

library.add(faCircleCheck, faCircleXmark);
const employeeDetails = ref(null);
const { fetchEmployeeDetails, checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync } = useEmployeeStore();
const { getEmployeeDetails, employeeHasExistingPendingFoundationApprovals } = storeToRefs(useEmployeeStore());
const employeeId: ComputedRef<string> = computed(() =>
  route.params?.id?.toString()
);
const hasPendingFoundationApproval: Ref<boolean> = ref(false);

const tableKey = ref(0);
const { responsive } = useBreakpoints();
const store = useTimeOffPlanStore();
const { timeOffPlanTree } = storeToRefs(store);
const { fetchTimeOffPlantList } = store;
const route = useRoute();

const timeOffPlan = ref<InstanceType<typeof timeOffPlanPanel>>(null);

const gridLocalStorageKey = "timeOffPlansGrid";

const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);
const defaultSorter = {
  field: "planType",
  ascending: true,
};
class statusModel extends Model {
  static idField = "name";
  static fields = ["name", "region", "value"];
}
const statusCombo = {
  type: "combo",
  valueField: "name",
  displayField: "name",
  chipView: {
    iconTpl: () => '<i class="b-icon b-fa-city"></i>',
  },
  listItemTpl: ({ name }) => {
    return `<div style="margin-left:20px;">${name}</div>`;
  },
  picker: {
    allowGroupSelect: false,
  },
  store: {
    modelClass: statusModel,
    groupers: [{ field: "region", ascending: true }],
    data: [
      { name: "Active", region: "Status", value: true },
      { name: "Inactive", region: "Status", value: false },
    ],
  },
};

const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  autoHeight: true,
  emptyText: "",
  features: {
    tree: true,
  },
  columns: [
    {
      flex: 2,
      text: "Plan",
      id: "plan",
      type: "tree",
      leafIconCls: "",
      field: "planName",
      touchConfig: { editor: false },
      hidden: false,
      collapseIconCls: "b-fa b-fa-circle-minus",
      expandOnCellClick: true,
      expandIconCls: "b-fa b-fa-circle-plus",
      cellCls: 'ps-4',
      cls: 'ps-4',
      renderer: ({ record }) => {
        return filterBlank(record.data.planName)
      }
    },
    {
      flex: 2,
      text: "Start date for calculation",
      type: "date",
      id: "startDate",
      field: "startDate",
      groupable: false,
      htmlEncode: false,
      filterable: {
        filterFn: ({ record, value }) => {
          const selectedDate = DateHelper.format(new Date(value), "MM/DD/YYYY");
          if (selectedDate == record.data.startDate) {
            return record;
          }
        },
      },
      responsiveLevels: {
        small: {
          hidden: true
        }
      }
    },
    {
      flex: 2,
      text: "Active",
      id: "isActive",
      field: "isActive",
      groupable: false,
      htmlEncode: false,
      editor: statusCombo,
      align: "center",
      filterable: {
        filterField: Object.assign(statusCombo, { multiSelect: false }),
        filterFn: ({ record, value }) => {
          if (value === "Active" && record.data.isActive) {
            return record;
          }
          if (value === "Inactive" && !record.data.isActive) {
            return record;
          }
        },
      },
      renderer: ({ record }) => {
        if (record.data.parentId === null) {
          return "";
        } else {
          if (record.data.isActive) {
            return `<i class="b-fa b-fa-check text-success"></i>`;
          } else {
            return `<i class="b-fa b-fa-xmark text-danger"></i>`;
          }
        }
      },
    },
    {
      flex: 1,
      text: "Actions",
      type: "action",
      id: "action",
      field: "action",
      columnDragToolbar: false,
      enableHeaderContextMenu: false,
      enableCellContextMenu: false,
      cellCls: "b-action-cell--hover",
      actions: [
        {
          visible: true,
          renderer: ({ record }) => {
            if (record.data.parentId === null) {
              return "";
            }
            return `
          <div class="b-action-item b-fa b-fa-arrow-up-right-from-square btn-edit updateContactBtn btn-link"><span>Edit</span></div>`;
          },
          onClick: ({ record }) => {
            updateTimeOffPlanAssigned(record);
          },
        },
      ],
    },
  ],
});

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

async function populatedTimeOffPlanListData() {
  gridStore.value.data = [...timeOffPlanTree.value];
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

watch(
  () => responsive.breakpoint,
  () => {
    if (responsive.breakpoint === "sm") {
      gridConfig.value.columns.forEach((col) => {
        if (["startDate"].includes(col.id)) {
          col.hidden = true;
        }
      });
    }
    tableKey.value++;
  }
);

onMounted(async () => {
  try {
    setLoading(true);
    await fetchTimeOffPlantList(route.params.id);
    populatedTimeOffPlanListData();
    await Promise.all([fetchEmployeeDetails(employeeId.value), checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync(+employeeId.value)]);
    employeeDetails.value = getEmployeeDetails.value;
    hasPendingFoundationApproval.value = employeeHasExistingPendingFoundationApprovals.value;
  }
  finally {
    setLoading(false);
  }
});

const filterCount = ref(0);
const nonFilteredProps = ["id"];
const filteredTimeOffPlanList = ref(new Array<TimeOffPlanTree>());
function filterBryntumStore() {
  filterStoreDataBySearchText(
    filteredTimeOffPlanList.value,
    nonFilteredProps,
    searchText.value,
    gridStore.value
  );
}

const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);
watch(searchText, () => {
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
const showAssignTimeOffPlan = ref(null);
const isEdit = ref(null);

async function refreshEmployeesList() {
  await fetchTimeOffPlantList(route.params.id);
  populatedTimeOffPlanListData();
}

const updateTimeOffPlanAssigned = async (record: any) => {
  timeOffPlan.value.isOpen = true;
  showAssignTimeOffPlan.value = { ...record.data };
  isEdit.value = true;
};

function openSidePanelForAssign() {
  timeOffPlan.value.isOpen = true;
  isEdit.value = false;
}
</script>

<template>
  <div class="hq-pg">
    <employeeHeader :employeeId="employeeId" class="position-relative" />

    <!-- Start Time Off list -->
    <div class="list-table b-stripe-vertical b-stripe-horizontal b-grid-header-no-border mb-4">
      <div class="large-header" id="assigned-time-off-plans">
        <bryntum-search-bar title="Assigned Plans" :local-storage-key="gridLocalStorageKey" :show-settings-button="true"
          :show-search-button="false" :show-filter-button="true" @save-settings="saveGridSettings()"
          @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
          @show-filter-bar="gridFeatures.filterBar.showFilterBar()" @search-text-input="searchText = $event"
          @refresh-grid="refreshEmployeesList()">
          <template #buttons>
            <fs-button variant="btn-primary"
              :class="`ms-2 btn btn-primary ${hasPendingFoundationApproval ? 'disabled' : ''}`"
              @click="openSidePanelForAssign()">Assign
              plan</fs-button>
          </template>
        </bryntum-search-bar>
        <pending-foundation-approval-banner
          :hasPendingFoundationApproval="hasPendingFoundationApproval"></pending-foundation-approval-banner>
        <div class="action-grid list__table list__table--onpage list__b-grid--hover container-fluid">
          <bryntum-grid ref="grid" v-bind="gridConfig" :store="gridStore" :key="tableKey" />
        </div>
      </div>

      <timeOffPlanPanel ref="timeOffPlan" :showAssignTimeOffPlan="showAssignTimeOffPlan" :isEdit="isEdit"
        @refresh-employees-list="refreshEmployeesList" />

      <historyOfPlan />
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.b-last-leaf) {
  justify-content: flex-start;
}

:deep(.text-success) {
  position: relative;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: #03a9f4;
}

:deep(.text-success::before) {
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
}

:deep(.text-danger) {
  position: relative;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  background: #fc5555;
}

:deep(.text-danger::before) {
  position: absolute;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: white;
  font-size: 14px;
}

.btn-primary {
  margin-left: 10px;
}

:deep(.b-textfield .b-fieldtrigger) {
  right: 0;
}

:deep(.b-icon-remove) {
  right: 30px !important;
}

:deep(.b-tree-leaf-cell) {
  .b-tree-cell-inner {
    padding-inline-start: 10px !important;
  }
}
</style>
