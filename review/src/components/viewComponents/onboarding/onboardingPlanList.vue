<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import type { Ref } from "vue";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import OnboardingPlan from "@/models/onboarding/OnboardingPlan";
import { Grid, Store } from "@bryntum/grid";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { storeToRefs } from "pinia";

const enum EmitNames {
  ASSIGN = "assignUser",
  EDIT = "editPlan",
  VIEW_ASSIGNEES = "viewAssignees",
}

const emits = defineEmits<{
  (e: EmitNames.ASSIGN, value: OnboardingPlan): void;
  (e: EmitNames.EDIT, value: OnboardingPlan): void;
  (e: EmitNames.VIEW_ASSIGNEES, value: OnboardingPlan): void;
}>();

const { fetchOnboardingList } = useOnboardingStore();
const { onboardingPlanList } = storeToRefs(useOnboardingStore());

const gridLocalStorageKey = "onboardingPlanListGrid";
const defaultSorter = {
  field: "name",
  ascending: true,
};
const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);
const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  minHeight: "100%",
  emptyText: "", // TODO: empty text is displaying with data
  columns: [
    {
      flex: 1,
      text: "Plan Name",
      id: "name",
      field: "name",
      groupable: false,
      sortable: true,
    },
    {
      flex: 1,
      text: "Description",
      id: "description",
      field: "description",
      sortable: true,
      groupable: false,
    },
    {
      flex: 1,
      align: "center",
      text: "# of Assignees",
      id: "assigneeCount",
      field: "assigneeCount",
      sortable: true,
      groupable: false,
      htmlEncode: false,
      cellCls: "text-link-green",
      renderer: ({ record }) =>
        `<span class="text-success" style="text-decoration: underline;">${record.data.assigneeCount}</span>`,
    },
    {
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
            return '<i class="b-action-item b-fa b-fa-user-plus btn btn-link text-success no-underline"><span>Assign</span></i>';
          },
          onClick: onAssignActionClick,
        },
        {
          visible: true,
          renderer: () => {
            return '<i class="b-action-item b-fa b-fa-edit btn btn-link text-success no-underline"><span>Edit</span></i>';
          },
          onClick: onEditActionClick,
        },
      ],
    },
  ],
});

const filteredOnboardingPlanList: Ref<Array<OnboardingPlan>> = ref(
  new Array<OnboardingPlan>()
);
const nonFilteredProps = ["id"];
const filterCount: Ref<number> = ref(0);
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
  gridStore.value.data = filteredOnboardingPlanList.value;
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

function filterBryntumStore() {
  filterStoreDataBySearchText(
    filteredOnboardingPlanList.value,
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

function onAssignActionClick(event: any): void {
  emits(EmitNames.ASSIGN, event.record.data);
}

function onEditActionClick(event: any): void {
  emits(EmitNames.EDIT, event.record.data);
}

function onViewAssigneesClick(event: any): void {
  if (event.column.id === "assigneeCount") {
    emits(EmitNames.VIEW_ASSIGNEES, event.record.data);
  }
}

onMounted(async () => {
  await fetchOnboardingList();
  filteredOnboardingPlanList.value = onboardingPlanList.value;
  populateBryntumStore();
  if (searchText.value !== "") {
    filterBryntumStore();
  }
});

watch(onboardingPlanList, () => {
  filteredOnboardingPlanList.value = onboardingPlanList.value;

  populateBryntumStore();
  if (searchText.value !== "") {
    filterBryntumStore();
  }
})
</script>
<template>
  <div class="large-header">
    <bryntum-search-bar
      title="Onboarding Plans"
      :show-settings-button="false"
      :show-search-button="false"
      :show-filter-button="false"
      :show-refresh-button="false"
      :show-footer-search="false"
      :show-back-button="true"
      return-route="/onboarding"
    >
      <template #buttons>
        <fs-button variant="outline-secondary" class="btn btn-outline-green">Create Plan</fs-button>
        <fs-button variant="btn-primary" class="btn btn-primary">Assign Plan</fs-button>
      </template>
    </bryntum-search-bar>
    <div class="action-grid list__table list__table--onpage list__b-grid--hover">
      <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" @cellClick="onViewAssigneesClick" />
    </div>
  </div>
</template>
