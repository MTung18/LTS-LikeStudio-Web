<script lang="ts" setup>
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { ref, Ref, computed, watch, onMounted, defineProps, toRefs } from "vue";
import { Grid, Store } from "@bryntum/grid";
import { Payroll } from "@/models/payroll/Payroll";
import { usePayrollStore } from "@/stores/payrollStore";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import PayrollEditSidebar from "@/components/viewComponents/employees/payrollAndTaxes/payrollEditSidebar.vue";
import { formatTime } from "@/utilities/formatUtils";
import { useBreakpoints } from "../../../../composables/useBreakpoints";
import { filterBlank } from '@/utilities/filterBlankValue';

import moment from "moment";

const { responsive } = useBreakpoints();
const route = useRoute();
const router = useRouter();

const props = defineProps(["employeeDetails"]);

const { employeeDetails } = toRefs(props);

const getYear = (time: string) => {
  return time?.split("-")[0];
};

const currentDate = new Date(Date.now());

const START_YEAR = Number(getYear(employeeDetails?.value?.hireDate))
const CURRENT_YEAR = new Date().getFullYear();

const selectedYear = ref(CURRENT_YEAR);
const showSidebar = ref(false);

const gridLocalStorageKey = "payrollListGrid";

const filteredPayrollList = ref(new Array<Payroll>());

const { fetchPayrollList, updateAvailablePayrollDateToEmployee } = usePayrollStore();
const { payrollList } = storeToRefs(usePayrollStore());

const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);

const { id: employeeId } = route.params;
const tableKey = ref(0)
const nonFilteredProps = ["id"];

const defaultSorter = {
  field: "payDate",
  descending: true,
};

const grid: Ref<Grid> = ref(null);

const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);

const filterCount = ref(0);

const payHistoryDetail = ref(null);

const handleUpdateAvailableDate = async (data) => {
  const payload = {
    availableToEmployeeOnDate: data.availableDate,
    employeeId: payHistoryDetail.value.employeeId,
    payDate: payHistoryDetail.value.filterPayDate,
    year: selectedYear.value
  };
  try {
    if (data.availableDate) {
      await updateAvailablePayrollDateToEmployee(payload);
      await refreshPayrollList(selectedYear.value);
      showSidebar.value = false;
    }
  } catch (error) {
    console.log(error);
  }
};

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
    onFilter: async (event) => {
      if (event.removed.length === 0 && event.added.length > 0) {
        await fetchPayrollList(employeeId as string, selectedYear.value);
        gridStore.value.data = payrollList.value;
      }

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

const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  minHeight: "46em",
  emptyText: "",
  columns: [
    {
      hidden: false,
      flex: 3,
      text: "Pay Stub",
      id: "namePayStub",
      field: "namePayStub",
      groupable: false,
      sortable: false,
      htmlEncode: false,
      cellCls: 'ps-3',
      cls: 'ps-3',
      renderer: ({ record }) => {
        return filterBlank(record.data.namePayStub);
      },
    },
    {
      hidden: false,
      flex: 2,
      text: "Pay Date",
      id: "payDate",
      field: "filterPayDate",
      groupable: false,
      sortable: true,
      htmlEncode: false,
      renderer: ({ record }) => {
        return `<span>${filterBlank(formatTime(record.data.payDate))}</span>`;
      },
    },
    {
      flex: 3,
      text: "Pay Period",
      id: "payPeriod",
      field: "payPeriod",
      hidden: true,
      responsiveLevels: {
        large: {
          hidden: false,
        }
      },
      groupable: false,
      sortable: true,
      htmlEncode: false,
    },
    {
      flex: 2,
      text: "Available To Employee On",
      id: "availableToEmployeeOnDate",
      field: "filterAvailableToEmployeeOnDate",
      hidden: true,
      responsiveLevels: {
        large: {
          hidden: false,
        }
      },
      groupable: false,
      sortable: true,
      htmlEncode: false,
      renderer: ({ record }) => {
        return `<span>${filterBlank(formatTime(
          record.data.availableToEmployeeOnDate
        ))}</span>`;
      },
    },
    {
      hidden: false,
      flex: 1,
      id: "action",
      type: "action",
      text: "Actions",
      field: "actions",
      minWidth: 120,
      groupable: false,
      align: 'left',
      sortable: false,
      htmlEncode: false,
      cellCls: "b-action-cell--hover",
      actions: [
        {
          visible: true,
          renderer: ({ record }) => {
            return '<i class="b-action-item b-fa b-fa-arrow-up-right-from-square btn btn-link no-underline"><span class="text-primary">View</span></i>'
          },
          onClick: ({ record }) => {
            const date = `${moment(record.payDate).format('YYYY-MM-DD')}`
            router.push({ name: "payrollDetails", params: { checkDate: date }, query: { year: selectedYear.value } });
          }
        },
        {
          visible: true,
          renderer: ({ record }) => {
            const payDate = new Date(record.data.payDate);
            const availableToEmployeeOnDate = new Date(
              record.data.availableToEmployeeOnDate
            );
            if (
              payDate > currentDate ||
              availableToEmployeeOnDate > currentDate
            ) {
              return '<i class="b-action-item b-fa b-fa-edit btn btn-link no-underline"><span class="text-primary">Edit</span></i>';
            } else {
              return "";
            }
          },
        },
      ],
    },
  ],
  listeners: {
    cellClick: ({ record, column }) => {
      if (column.type === "action") {
        const payDate = new Date(record.data.payDate);
        const availableToEmployeeOnDate = new Date(
          record.data.availableToEmployeeOnDate
        );
        if (payDate > currentDate ||
          availableToEmployeeOnDate > currentDate) {
          showSidebar.value = true;
          payHistoryDetail.value = record.data;
        }

      }
    },
  },
});

async function populateBryntumStore() {
  gridStore.value.data = [];
  gridStore.value.data = filteredPayrollList.value;
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

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

const refreshPayrollList = async (year: number) => {
  await fetchPayrollList(employeeId as string, year);
  filteredPayrollList.value = payrollList.value;
  await populateBryntumStore();
  filterBryntumStore();
};

function filterBryntumStore() {
  filterStoreDataBySearchText(
    filteredPayrollList.value,
    nonFilteredProps,
    searchText.value,
    gridStore.value
  );
  gridStore.value.data = filteredPayrollList.value;
}

const getListOfYears = () => {
  let totalYears = 0;
  let startYear = 0;
  if (!START_YEAR || isNaN(START_YEAR)) {
    totalYears = 0;
  } else {
    totalYears = CURRENT_YEAR - START_YEAR + 1;
    startYear = START_YEAR;
  }
  return Array(totalYears)
    .fill(startYear)
    .map((n, i) => n + i);
};

const handleCloseSidebar = () => {
  showSidebar.value = false;
};

watch(selectedYear, async (newSelectedYear) => {
  await fetchPayrollList(employeeId as string, newSelectedYear);
  filteredPayrollList.value = payrollList.value;
  await populateBryntumStore();
  filterBryntumStore();
});

watch(() => responsive.breakpoint, () => {
  if (responsive.breakpoint === 'sm') {
    gridConfig.value.columns.forEach((col) => {
      if (['payPeriod', 'availableToEmployeeOnDate'].includes(col.id)) {
        col.hidden = true
      }
      col.flex = 1;
    })
  }

  tableKey.value++
})

onMounted(async () => {
  await refreshPayrollList(selectedYear.value);
});
</script>

<template>
  <div class="hq-pg__grid">
    <bryntum-search-bar title="Pay History" :local-storage-key="gridLocalStorageKey" :show-settings-button="true"
      :show-search-button="false" :show-filter-button="true" @save-settings="saveGridSettings()"
      @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
      @show-filter-bar="gridFeatures.filterBar.showFilterBar()" @search-text-input="searchText = $event"
      @refresh-grid="refreshPayrollList(selectedYear)">
      <template #headers>
        <span class='py-4'>
          <fs-form-select class="form-select" v-model="selectedYear" :options="getListOfYears()"></fs-form-select>
        </span>
      </template>
    </bryntum-search-bar>

    <div class="action-grid list__table list__b-grid--hover">
      <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
    </div>
  </div>

  <PayrollEditSidebar v-if="showSidebar" :isShowSidebar="showSidebar" :payHistoryDetail="payHistoryDetail"
    @close-sidebar="handleCloseSidebar" @update-available-date="handleUpdateAvailableDate" />
</template>

