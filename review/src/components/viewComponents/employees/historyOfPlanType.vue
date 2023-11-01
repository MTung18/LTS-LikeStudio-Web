<script lang="ts" setup>
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { AccrualUsage } from "@/models/employees/timeOff/AccrualUsage";
import { HistoryOfPlanType } from "@/models/employees/timeOff/HistoryOfPlanType";
import { VacationType } from "@/models/employees/timeOff/VacationType";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { useEmployeeAssignedPlanStore } from "@/stores/EmployeeAssignedPlanStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useTimeOffPlanStore } from "@/stores/timeOffPlanStore";
import { DateHelper, Grid, Store } from "@bryntum/grid";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { library } from "@fortawesome/fontawesome-svg-core";
import { filterBlank } from '@/utilities/filterBlankValue';
import {
  faCalendarPen, faCalendarStar, faCalendarXmark
} from "@fortawesome/pro-light-svg-icons";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import { computed, onBeforeMount, ref, watch } from "vue";
import { useRoute } from "vue-router";

const { responsive } = useBreakpoints();
const tableKey = ref(0);
library.add(faCalendarStar, faCalendarPen, faCalendarXmark);
const gridLocalStorageKey = "historyPlan";
const defaultSorter = {
  field: "dateBooked",
  ascending: false,
};
const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);

const { setLoading } = useLoadingStore();
const route = useRoute();

const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  emptyText: `<div class='w-100 d-flex flex-column align-items-center'><div>No Plan Type has been selected</div><div class='sub-emptyText mt-3'>Please select a plan type to view leave history of that plan.</div></div>`,
  columns: [
    {
      id: "dateBooked",
      text: "Transaction Date",
      field: "dateBooked",
      type: "date",
      flex: 2,
      cellCls: 'ps-4',
      cls: 'ps-4',
      filterable: {
        filterFn: ({ record, value }) => {
          const selectedDate = DateHelper.format(new Date(value), "MM/DD/YYYY");
          const dateInRow = DateHelper.format(new Date(record.data.dateBooked), "MM/DD/YYYY");
          if (selectedDate == dateInRow) {
            return record;
          }
        },
      },
    },
    {
      text: "Hours Adjusted", field: "hours", flex: 2,
      renderer: ({ record }) => {
        return filterBlank(record.data.hours)
      }
    },
    {
      text: "Comments", field: "comment", flex: 2, hidden: false,
      responsiveLevels: {
        small: {
          hidden: true
        }
      },
      renderer: ({ record }) => {
        return filterBlank(record.data.comment)
      }
    }
  ],
});
const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);
watch(searchText, () => {
  filterBryntumStore();
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
    }
  })
);
const selected = ref(null);
const options: Ref<VacationType[]> = ref(new Array<VacationType>());
const dataHistoryOfPlan: Ref<AccrualUsage[]> = ref<AccrualUsage[]>(null);
const { fetchListOfEmployeePlanType } = useTimeOffPlanStore();
const { employeePlanType } = storeToRefs(useTimeOffPlanStore());
const { getPlanTypeHistories, getRestTimeOff } = useEmployeeAssignedPlanStore();
const restTimeOff = ref(null);
onBeforeMount(async () => {
  await fetchListOfEmployeePlanType(route.params.id);
  options.value = employeePlanType.value;
});

const changePlanType = (item) => {
  if (item) {
    callApiForPlanType(route.params.id, item?.code);
  }
  else {
    removePlanType();
  }
}

const removePlanType = () => {
  dataHistoryOfPlan.value = [];
  gridStore.value.data = dataHistoryOfPlan.value;
  restTimeOff.value = null;
  gridConfig.value.emptyText = `<div class='w-100 d-flex flex-column align-items-center'><div>No Plan Type has been selected</div><div class='sub-emptyText mt-3'>Please select a plan type to view leave history of that plan.</div></div>`;
}

async function callApiForPlanType(empId, accrualCodeFsNo) {
  try {
    setLoading(true);
    dataHistoryOfPlan.value = await getPlanTypeHistories(empId, accrualCodeFsNo);
    restTimeOff.value = await getRestTimeOff(empId, accrualCodeFsNo);
  }
  finally {
    gridStore.value.data = dataHistoryOfPlan.value;
    if (dataHistoryOfPlan.value.length == 0) {
      gridConfig.value.emptyText = `<div class='w-100 d-flex flex-column align-items-center'>No Data Available</div>`;
    }
    else {
      gridConfig.value.emptyText = '';
    }
    setLoading(false);
  }
}
function hideFilterBar() {
  gridStore.value.clearFilters();
  gridFeatures.value.filterBar.hideFilterBar();
}
const filterCount = ref(0);
const nonFilteredProps = ["id"];
const filteredHistoryOfPlanList = ref(new Array<HistoryOfPlanType>());
function filterBryntumStore() {
  filterStoreDataBySearchText(
    filteredHistoryOfPlanList.value,
    nonFilteredProps,
    searchText.value,
    gridStore.value
  );
}

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

</script>
<template>
  <div class="large-header" id="assigned-time-off-plans">
    <bryntum-search-bar title="History of Plan Type" :local-storage-key="gridLocalStorageKey" :show-settings-button="true"
      :show-search-button="false" :show-filter-button="true" @save-settings="saveGridSettings()"
      @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
      @show-filter-bar="gridFeatures.filterBar.showFilterBar()" @search-text-input="searchText = $event">
      <template #buttons v-if="responsive.breakpoint === 'sm'">
        <fs-popper tooltip hover id="custom-multiselect">
          <fs-input type="fsMultiselectList" label="" :typeaheaddata="options" typeaheadkey="name" v-model="selected"
            style="width: 60vw;" typeaheadvalueattribute="id" name="historyPlan" autocomplete="donotfill"
            :showClear="true" class="mb-0 pt-0 ms-2" @select="(item) => changePlanType(item)" @remove="removePlanType">
          </fs-input>
        </fs-popper>
      </template>
      <template #footer>
        <fs-row>
          <fs-col lg="12" xl="5" v-if="responsive.breakpoint !== 'sm'">
            <div class="w-50">
              <fs-input type="fsMultiselectList" label="" :typeaheaddata="options" typeaheadkey="name" v-model="selected"
                typeaheadvalueattribute="id" name="historyPlan" autocomplete="donotfill" :showClear="true" class="mb-3"
                @select="(item) => changePlanType(item)" @remove="removePlanType">
              </fs-input>
            </div>
          </fs-col>
          <fs-col lg="12" xl="7" class="overflow-auto d-flex justify-content-center flex-column" style="max-width: 96vw;">
            <div class="d-flex justify-content-between gap-6 w-100">
              <div class="block-item d-flex gap-2">
                <div class="block-item__circle block-item__circle__blue">
                  <font-awesome-icon class="icon icon__white" icon="fa-light fa-calendar-star" />
                </div>
                <div class="block-item d-flex flex-column justify-content-between">
                  <span class="block-item__title">Current Balance</span>
                  <span class="block-item__value">
                    {{ restTimeOff?.currentBalance || restTimeOff?.currentBalance == 0 ?
                      Number(restTimeOff?.currentBalance).toFixed(2) : '---' }}
                    hrs</span>
                </div>
              </div>
              <div class="block-item d-flex gap-2">
                <div class="block-item__circle block-item__circle__green">
                  <font-awesome-icon class="icon icon__green" icon="fa-light fa-calendar-pen" />
                </div>
                <div class="block-item d-flex flex-column justify-content-between">
                  <span class="block-item__title">Projected Balance</span>
                  <span class="block-item__value">
                    {{
                      restTimeOff?.projectedBalance || restTimeOff?.projectedBalance == 0 ?
                      Number(
                        restTimeOff?.projectedBalance
                      ).toFixed(2) : '---'
                    }}
                    hrs</span>
                </div>
              </div>
              <div class="block-item d-flex gap-2">
                <div class="block-item__circle block-item__circle__orange">
                  <font-awesome-icon class="icon icon__orange" icon="fa-light fa-calendar-xmark" />
                </div>
                <div class="block-item d-flex flex-column justify-content-between">
                  <span class="block-item__title">Scheduling</span>
                  <span class="block-item__value">
                    {{ restTimeOff?.projectedBalance || restTimeOff?.projectedBalance == 0 ?
                      Number(restTimeOff?.schedulingBalance).toFixed(2) : '---' }}
                    hrs</span>
                </div>
              </div>
            </div>
          </fs-col>
        </fs-row>
      </template>
    </bryntum-search-bar>

    <div class="list-table">
      <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.form-select-type {
  height: 36px;
  max-width: 352px;
}

.list-table {
  min-height: 300px;
}

.block-item {
  height: fit-content;
  margin-right: 10px;

  &__circle {
    width: 40px;
    height: 40px;
    border-radius: 100px;
    position: relative;

    &__blue {
      background: #03a9f4;
    }

    &__green {
      background: rgba(26, 188, 156, 0.1);
    }

    &__orange {
      background: rgba(255, 136, 75, 0.1);
    }

    .icon {
      font-size: 20px;
      top: 50%;
      left: 50%;
      position: absolute;
      transform: translate(-50%, -50%);

      &__white {
        color: white;
      }

      &__green {
        color: #1abc9c;
      }

      &__orange {
        color: #ff884b;
      }
    }
  }

  &__title {
    color: #95989a;
    font-size: 14px;
    line-height: 16px;
    white-space: nowrap;
  }

  &__value {
    font-weight: 500;
    font-size: 18px;
    line-height: 21px;
  }
}

:deep(.b-empty-text) {
  display: flex;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  margin-top: 22px;
  width: 100%;
}

:deep(.sub-emptyText) {
  font-weight: 400;
  font-size: 16px;
  line-height: 19px;
  color: #a8a8a8;
}

:deep(.b-grid-body-wrap) {
  min-height: 300px;
  overflow: auto;
}

:deep(#custom-button > div:first-child) {
  margin-left: unset !important;
}
</style>
