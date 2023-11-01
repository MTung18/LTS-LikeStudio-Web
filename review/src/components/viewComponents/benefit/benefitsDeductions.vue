<script lang="ts" setup>
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Grid, Store, Popup } from "@bryntum/grid";
import { computed, onMounted, Ref, ref, watch } from "vue";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { useDeductionStore } from "@/stores/deductionStore";
import { Deduction } from "@/models/benefitsDeductions/Deduction";
import UpsertBenefitPanel from "@/components/viewComponents/benefit/upsertBenefitPanel.vue";
import { DeductionMode } from "@/enums/DeductionMode";
import { DeductionType } from "@/enums/DeductionType";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { useAlerts } from "@/composables/useAlerts";
import { deductionTabOption } from "@/constants/benefitDeduction";
import { cloneDeep } from 'lodash';

library.add(faPlus);

const tableKey = ref(0);
const notify = useAlerts();
const deductionStore = useDeductionStore();

const currentTab = ref(DeductionType.BENEFIT);
const childComponent = ref<InstanceType<typeof UpsertBenefitPanel>>(null);
const showAssignOnboardingPlan = ref(false);
const gridLocalStorageKey = "benefitsDeductionsId";
const defaultSorter = {
  field: "updatedDate",
  ascending: false,
};
const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);

const filterCount = ref(0);
const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);
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

const filteredDeductionList = ref(new Array<Deduction>());

function filterBryntumStore() {
  gridStore.value.data = (filteredDeductionList.value || []).filter(
    requestStateFilter
  );
}

const requestStateFilter = (request: Deduction): boolean => {
  return true;
};

const saveGridSettings = () => {
  localStorage.setItem(
    `${gridLocalStorageKey}State`,
    JSON.stringify((gridStore.value as any).state)
  );
};

const clearGridSettings = () => {
  gridStore.value.clearFilters();
  gridStore.value.clearSorters();
  localStorage.removeItem(`${gridLocalStorageKey}State`);
};
function hideFilterBar() {
  gridStore.value.clearFilters();
  gridFeatures.value.filterBar.hideFilterBar();
}

const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  minHeight: "100%",
  emptyText: "",
  columns: [
    {
      flex: 2,
      text: "Name",
      id: "customizedName",
      field: "customizedName",
      sortable: true,
      htmlEncode: false,
      cellTooltip: true,
      cellCls: 'ps-4',
      cls: 'ps-4'
    },
    {
      flex: 2,
      text: "Foundation Deduction",
      id: "foundationDisplayName",
      field: "foundationDisplayName",
      sortable: true,
      hidden: true,
      htmlEncode: false,
      responsiveLevels: {
        large: {
          hidden: false,
        }
      },
    },
    {
      flex: 2,
      columnWidth: 100,
      text: "Viewable to Employee",
      id: "isViewInESS",
      align: "center",
      field: "isViewInESS",
      sortable: true,
      hidden: true,
      htmlEncode: false,
      responsiveLevels: {
        large: {
          hidden: false,
        }
      },
      renderer: ({ record }) => {
        if (record.isViewInESS == true) {
          return `<i class="b-fa b-icon-check"></i>`;
        }

        return `<i class="b-fa b-fa-xmark"></i>`;
      },
    },
    {
      flex: 1,
      type: "action",
      locked: false,
      id: "action",
      text: "Actions",
      htmlEncode: false,
      columnDragToolbar: false,
      enableHeaderContextMenu: false,
      enableCellContextMenu: false,
      cellCls: "b-action-cell--hover",
      actions: [
        {
          renderer: () => {
            return `<i class="b-action-item b-fa b-fa-edit btn btn-link text-green no-underline btn-deduction"><span>Edit</span></i>`;
          },
          onClick: ({ record }) => editDeduction(record.id),
        },
        {
          renderer: () => {
            return `<i class="b-action-item b-fa b-fa-trash btn btn-link text-red no-underline btn-deduction"><span>Delete</span></i>`;
          },
          onClick: ({ record }) => deleteDeduction(record),
        },
      ],
    },
  ],
  subGridConfigs: { left: { flex: "1" }, right: { width: 120 } },
});

async function populateBryntumStore() {
  gridStore.value.data = filteredDeductionList.value;
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}
watch(currentTab, () => {
  reloadGrid(currentTab.value);
});

const reloadGrid = async (currentTab: number) => {
  filteredDeductionList.value = await deductionStore.getDeductionList(currentTab);
  populateBryntumStore();
  if (searchText.value !== "") {
    filterBryntumStore();
  }
};
const resetGrid = () => {
  reloadGrid(currentTab.value);
  showAssignOnboardingPlan.value = !showAssignOnboardingPlan.value;
}

onMounted(async () => {
  await reloadGrid(DeductionType.BENEFIT);
});

const addNewDeduction = async () => {
  const dataOption = await deductionStore.getDeductionOptionList(DeductionMode.ADD);
  childComponent.value.deductionModeActive = DeductionMode.ADD;
  childComponent.value.listOfFoundationDeduction = dataOption.map((item) => {
    return {
      text: `${item.miscellaneousDeductionId} - ${item.description}`,
      value: item.miscellaneousDeductionId,
    };
  });
  childComponent.value.selectedDeductionType = currentTab.value;
  showAssignOnboardingPlan.value = !showAssignOnboardingPlan.value;
};

const editDeduction = async (deductionId: number) => {
  const response = await deductionStore.getDeductionDetail(deductionId);
  let dataOption;

  if (response.deductionFsNo != '') {
    dataOption = await deductionStore.getDeductionOptionList(DeductionMode.EDIT);
  }
  else {
    dataOption = await deductionStore.getDeductionOptionList(DeductionMode.ADD);
  }

  childComponent.value.listOfFoundationDeduction = dataOption.map((item) => {
    return {
      text: `${item.miscellaneousDeductionId} - ${item.description}`,
      value: item.miscellaneousDeductionId,
    };
  });
  const foundItem = childComponent.value.listOfFoundationDeduction.find(item => item.value === response.deductionFsNo);

  childComponent.value.formData = { ...response, foundationDeduction: foundItem };
  childComponent.value.selectedDeductionType = response.deductionTypeId;
  childComponent.value.deductionModeActive = DeductionMode.EDIT;
  childComponent.value.originalFormData = cloneDeep(childComponent.value.formData)

  showAssignOnboardingPlan.value = !showAssignOnboardingPlan.value;
};

const deleteDeduction = async (deduction: Deduction) => {
  const popup = new Popup({
    header: `Delete ${deduction.deductionTypeId == DeductionType.BENEFIT ? "Benefit" : "Deduction"}`,
    autoShow: false,
    centered: true,
    closeAction: "destroy",
    closable: true,
    autoClose: false,
    width: "500px",
    cls: "popup-delete",
    modal: true,
    bbar: {
      items: {
        cancel: {
          text: "CANCEL",
          minWidth: 100,
          onAction: () => {
            popup.close();
          },
        },
        delete: {
          text: "DELETE",
          minWidth: 100,
          cls: "b-raised b-red",
          onAction: async () => {
            try {
              const response = await deductionStore.deactivateDeduction(deduction.id, deduction.deductionName);
              if (response.success) {
                notify.notifySuccess(response.errorMessage)
              }
              else {
                notify.notifyError(response.errorMessage);
              }
              reloadGrid(currentTab.value);
            } catch (error) {
              console.log(error);
            }
            popup.close();
          },
        },
      },
    },
    html: `<div class="d-flex align-items-center h-100">
                <i class="b-fa b-fa-exclamation-circle icon-exclamation-circle"></i>
                Are you sure you want to delete the ${deduction.deductionName} ${deduction.deductionTypeId == DeductionType.BENEFIT ? "benefit" : "deduction"}?
                </br>This process cannot be undone.</div>`,
  });
  popup.show();
};

</script>
<template>
  <div class="hq-pg list" id="deductionTable">
    <div class="hq-pg__header hq-pg__header--sticky contain">
      <fs-row align-v="center">
        <fs-col>
          <h2 class="hq-pg__title">
            Benefits & Deductions
          </h2>
        </fs-col>
      </fs-row>
    </div>
    <div>
      <bryntum-search-bar :local-storage-key="gridLocalStorageKey" :show-settings-button="true" :show-filter-button="true"
        :show-search-button="false" :show-footer-search="false" @save-settings="saveGridSettings()"
        @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
        @show-filter-bar="gridFeatures.filterBar.showFilterBar()">
        <template #headers>
          <div class="py-2">
            <fs-button v-for="tab in deductionTabOption" :key="tab.id" pill
              :variant="currentTab === tab.id ? 'index-color-3 ' : 'link'"
              :class="currentTab === tab.id ? 'rounded-pill' : 'hq-pg__tab text-decoration-none'"
              @click="currentTab = tab.id">
              {{ tab.name }}
            </fs-button>
          </div>
        </template>
        <template #buttons>
          <fs-button variant="btn-primary" class="btn btn-primary ms-2" @click="addNewDeduction">
            {{ currentTab === DeductionType.BENEFIT ? 'Add Benefit' : 'Add Deduction' }} </fs-button>
        </template>
      </bryntum-search-bar>
    </div>
    <div class="action-grid list__table list__table--onpage list__b-grid--hover">
      <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
    </div>
    <upsert-benefit-panel :showAssignOnboardingPlan="showAssignOnboardingPlan" @reload="resetGrid"
      @close-form="showAssignOnboardingPlan = !showAssignOnboardingPlan" ref="childComponent" />
  </div>
</template>
