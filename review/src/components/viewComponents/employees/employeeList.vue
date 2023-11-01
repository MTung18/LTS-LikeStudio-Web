<script setup lang="ts">
import type { Ref } from "vue";
import { computed, onMounted, ref, watch } from "vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Grid, Store } from "@bryntum/grid";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import Employee from "@/models/employees/Employee";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import IconsToolbarItem from "@/models/IconsToolbarItem";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useEmployeePendingApprovalStore } from "@/stores/EmployeePendingApprovalStore";
import { storeToRefs } from "pinia";
import IconsToolbarWidget from "@/components/shared/iconsToolbarWidget.vue";
import emptyGridLayout from '@/components/shared/emptyGridLayout.vue';
import { MESSAGE } from '@/data/message';
import { useBreakpoints } from "@/composables/useBreakpoints";
import { faStamp } from "@fortawesome/pro-light-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { EmployeeStatusFilter } from "@/enums/EmployeeStatusFilter";
import { employeeStatusBadgeRenderer } from "@/components/shared/bryntumGrid/customCells/employeeStatusBadge";

library.add(faStamp, faPlus);

interface Props {
  modelValue?: Employee;
}
const { responsive } = useBreakpoints();

withDefaults(defineProps<Props>(), {
  modelValue: null,
});

const enum EmitNames {
  UPDATE = "update:modelValue",
}
const emits = defineEmits<{
  (e: EmitNames.UPDATE, value: Employee): void;
}>();

const { fetchEmployeeList } = useEmployeeStore();
const { fetchEmployeePendingApprovals } = useEmployeePendingApprovalStore();
const { employeeList } = storeToRefs(useEmployeeStore());
const { employeePendingApprovals } = storeToRefs(useEmployeePendingApprovalStore());
const gridLocalStorageKey = "employeeListGrid";
const defaultSorter = {
  field: "fullName",
  ascending: true,
};

const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);
const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  minHeight: "100%",
  emptyText: "", // TODO: empty text is displaying with data
  columns: [
    {
      flex: 2,
      text: "Name",
      id: "fullName",
      field: "fullName",
      groupable: false,
      sortable: true,
      htmlEncode: false,
      cellCls: 'ps-4',
      cls: 'ps-4',
      renderer: ({ record }) =>
        `<i class="b-fa b-icon-user me-1" style="color: rgba(26,188,156,1)"></i>${record.fullName}`,
    },
    {
      flex: 2,
      text: "Job Title",
      id: "jobTitle",
      field: "jobTitle",
      sortable: true,
      groupable: false,
    },
    {
      flex: 2,
      id: "employmentStatus",
      text: "Employment Status",
      field: "employmentStatus",
      sortable: true,
      groupable: false,
    },
    {
      flex: 2,
      text: "Employee Status",
      id: "employeeStatus",
      field: "employeeStatusName",
      sortable: true,
      groupable: false,
      htmlEncode: false,
      renderer({ record }) {
        return employeeStatusBadgeRenderer(record.employeeStatusName);
      }
    },
    {
      flex: 1,
      text: "Synced With Foundation",
      id: "synced",
      field: "isFoundationSynced",
      groupable: false,
      sortable: true,
      htmlEncode: false,
      renderer: ({ record }) =>
        record.isFoundationSynced
          ? `<i class="b-fa b-icon-check" style="color: rgba(3,169,244,1); min-width: 32px"></i>`
          : "",
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

async function populateBryntumStore() {
  gridStore.value.data = filteredEmployeeList.value;
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

const filterCount = ref(0);
const nonFilteredProps = ["id"];
const filteredEmployeeList = ref(new Array<Employee>());

function filterBryntumStore() {
  gridStore.value.data = filteredEmployeeList.value.filter((x) => x.fullName?.toLowerCase().includes(searchText.value.toLowerCase()));
}

function filterDataByToolbarButtonAndSearchText() {
  filteredEmployeeList.value = employeeList.value
    .filter(employeeTypeFilter)
    .filter(x => x.fullName?.toLowerCase().includes(searchText.value.toLowerCase()));
  gridStore.value.data = filteredEmployeeList.value;
}

const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);

watch(searchText, () => {
  filterDataByToolbarButtonAndSearchText();
});

const activeCount = ref(0);
const employeeCount = ref(0);
const onLeaveCount = ref(0);
const newHireCount = ref(0);
const inactiveCount = ref(0);
const pendingApprovalsCount = ref(0);

function populateStatusCounts(): void {
  employeeCount.value = filteredEmployeeList.value.length;
  activeCount.value = filteredEmployeeList.value.filter(e => e.employeeStatusId == EmployeeStatusEnum.Active).length;
  onLeaveCount.value = filteredEmployeeList.value.filter(e => e.employeeStatusId == EmployeeStatusEnum.OnLeave).length;
  newHireCount.value = filteredEmployeeList.value.filter(e => e.employeeStatusId == EmployeeStatusEnum.Onboard || e.employeeStatusId == EmployeeStatusEnum.QuickHire).length;
  inactiveCount.value = filteredEmployeeList.value.filter(e => e.employeeStatusId == EmployeeStatusEnum.Inactive).length;
}

function employeeTypeFilter(employee: Employee): boolean {
  switch (currentStatusFilter.value) {
    case EmployeeStatusFilter.Active   : return employee.employeeStatusId == EmployeeStatusEnum.Active;
    case EmployeeStatusFilter.OnLeave  : return employee.employeeStatusId == EmployeeStatusEnum.OnLeave;
    case EmployeeStatusFilter.NewHire  : return employee.employeeStatusId == EmployeeStatusEnum.Onboard || employee.employeeStatusId == EmployeeStatusEnum.QuickHire;
    case EmployeeStatusFilter.Inactive : return employee.employeeStatusId == EmployeeStatusEnum.Inactive;
    default: return true;
  }
}

const currentStatusFilter = ref(-1);
const previousStatusFilter = ref(-1);

watch(currentStatusFilter, () => {
  filterDataByToolbarButtonAndSearchText();
});

function onClickFilterIcon(event: any, filterId: number): void {
  if (filterId === previousStatusFilter.value) {
    currentStatusFilter.value = EmployeeStatusFilter.NonFilter;
    return;
  }
  previousStatusFilter.value = filterId;
}

const employeeIconsToolbarItems: IconsToolbarItem[] = [
  {
    id: EmployeeStatusFilter.Employee,
    icon: ["fal", "users"],
    selectedBackground: "rgba(3,169,244,1)",
    background: "rgba(3,169,244,.1)",
    selectedColor: "white",
    color: "rgba(3,169,244,1)",
    title: "All",
    label: employeeCount,
    onClickFunction: onClickFilterIcon,
  },
  {
    id: EmployeeStatusFilter.Active,
    icon: ["fal", "user"],
    selectedBackground: "rgba(26,188,156,1)",
    background: "rgba(26,188,156,.1)",
    selectedColor: "white",
    color: "rgba(26,188,156,1)",
    title: "Active",
    label: activeCount,
    onClickFunction: onClickFilterIcon,
  },
  {
    id: EmployeeStatusFilter.NewHire,
    icon: ["fal", "fa-user-plus"],
    selectedBackground: "rgba(255,80,148,1)",
    background: "rgba(255,80,148,.1)",
    selectedColor: "white",
    color: "rgba(255,80,148,1)",
    title: "New Hire",
    label: newHireCount,
    onClickFunction: onClickFilterIcon,
  },
  {
    id: EmployeeStatusFilter.OnLeave,
    icon: ["fal", "user-hard-hat"],
    selectedBackground: "rgba(3,155,177,1)",
    background: "rgba(3,155,177,.1)",
    selectedColor: "white",
    color: "rgba(3,155,177,1)",
    title: "On Leave",
    label: onLeaveCount,
    onClickFunction: onClickFilterIcon,
  },
  {
    id: EmployeeStatusFilter.Inactive,
    icon: ["fal", "user"],
    selectedBackground: "rgba(110,124,143,1)",
    background: "rgba(110,124,143,.1)",
    selectedColor: "white",
    color: "rgba(110,124,143,1)",
    title: "Inactive",
    label: inactiveCount,
    onClickFunction: onClickFilterIcon,
  },
];

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
  window.location.reload();
}

function hideFilterBar() {
  gridStore.value.clearFilters();
  gridFeatures.value.filterBar.hideFilterBar();
}

 function refreshEmployeesList() {}
// #endregion

const onCellClick = (event: any) => {
  emits(EmitNames.UPDATE, event.record.data);
};

onMounted(async () => {
  await Promise.all([ fetchEmployeeList(), fetchEmployeePendingApprovals() ]) 

  filteredEmployeeList.value = employeeList.value;
  pendingApprovalsCount.value = employeePendingApprovals.value.length;

  populateBryntumStore();
  populateStatusCounts();
  
  if (searchText.value !== "") {
    filterBryntumStore();
  }

  if (+localStorage.getItem("employeeType")) {
    currentStatusFilter.value = +localStorage.getItem("employeeType");
    localStorage.removeItem("employeeType");
  } else currentStatusFilter.value = EmployeeStatusFilter.NonFilter;
});
</script>

<template>
  <bryntum-search-bar title="Employees" 
  :local-storage-key="gridLocalStorageKey" 
  :show-settings-button="true"
    :show-search-button="false" 
    :show-filter-button="true" 
    :show-refresh-button="true" 
    :show-footer-search="true"
    @save-settings="saveGridSettings()" 
    @clear-settings="clearGridSettings()" 
    @hide-filter-bar="hideFilterBar()"
    @show-filter-bar="gridFeatures.filterBar.showFilterBar()" 
    @search-text-input="searchText = $event"
    @refresh-grid="refreshEmployeesList()">
    <template #buttons>
      <granular-security hasPermission="WHQ_247_3113">
        <fs-popper tooltip hover content="Approvals" placement="bottom" class="me-2">
          <fs-link :to="{ name: 'reviews' }">
            <fs-button variant="outline-primary" type="button" class="px-2 btn--h-40 position-relative">
              <font-awesome-icon :icon="['fal', 'stamp']" size="lg" />
              <span class="approvals-count" v-if="pendingApprovalsCount > 0">{{ pendingApprovalsCount }}</span>
            </fs-button>
          </fs-link>
        </fs-popper>
      </granular-security>

      <granular-security hasPermission="WHQ_247_3114">
        <fs-button variant="btn-primary" :class="'btn btn-primary ' + (responsive.mobile ? 'p-2' : '')"
          :to="{ name: 'createEmployee' }">
          <span v-if="responsive.mobile"><font-awesome-icon :icon="['fas', 'plus']" size="lg" /></span>
          <span v-else>Create Employee</span>
        </fs-button>
      </granular-security>
    </template>

    <template #footer>
      <icons-toolbar-widget :status-items="employeeIconsToolbarItems" v-model="currentStatusFilter" />
    </template>
  </bryntum-search-bar>

  <div class="list__table">
    <bryntum-grid v-if="employeeList?.length > 0" v-bind="gridConfig" :store="gridStore" ref="grid"
      @cellClick="onCellClick" />
    <empty-grid-layout v-else :emptyMessage="MESSAGE.COMMON.NO_DATA" />
  </div>
</template>

<style scoped>
/*This style is needed if you use the bryntumSearchBar with a footer*/
.large-header {
  grid-template-rows: 144px auto !important;
}

.approvals-count {
  position: absolute;
  top: -8px;
  right: -8px;
  min-width: 18px;
  padding: 3px;
  font-size: 12px;
  line-height: 12px;
  border-radius: 5px;
  background-color: #FF2A2A;
  color: #ffffff;
}
</style>
