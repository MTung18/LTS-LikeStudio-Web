<script setup lang="ts">
import assignOnboardingPlanPanel from "@/components/viewComponents/onboarding/assignOnboardingPlanPanel.vue";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { EmployeeOnboardList } from "@/models/CurrentOnboards";
import CommonModal from "@/components/common/commonModal.vue";
import { Grid, Store } from "@bryntum/grid";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { faTriangleExclamation } from "@fortawesome/pro-light-svg-icons";
import { ref, computed, watch, onMounted, Ref } from "vue";
import { OnboardType } from "@/enums/OnboardType";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { BryntumGrid, } from "@bryntum/grid-vue-3";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { storeToRefs } from "pinia";
import { useOnboardingStore } from "@/stores/onboardingStore";
import router from "@/router";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import { useRoute } from 'vue-router'
import { useLoadingStore } from "@/stores/loadingStore";
import moment from "moment";
import { useOnboardingDirectDepositStore } from "@/stores/onboardingDirectDepositStore";
import { useAlerts } from "@/composables/useAlerts";
library.add(faCircleExclamation, faTriangleExclamation);

const { notifySuccess } = useAlerts();
const { setLoading } = useLoadingStore();
const { getOnboardingPaymentMethodSetting } = useOnboardingDirectDepositStore();
const route = useRoute();
const gridLocalStorageKey = "OnboardingList";
const defaultSorter = {
  field: "name",
  ascending: true,
};
const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);
const isFinishLoading = ref(false);
const filterCount = ref(0);
const filterCompleteGridCount = ref(0);
const showCancelPlan = ref(false);
const showSkipPlan = ref(false);
const showAssignPlan = ref(false);
const selectedRecord = ref<EmployeeOnboardList>(null);
const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(() => (grid as any).value?.instance.value.features);
const isCheckAssign = ref(false);
const isCheckSkip = ref(false);
const { employeeOnboardList } = storeToRefs(useOnboardingStore());
const { changeEmployeeStatus, updateForm, updateMultipleSidebar, fetchEmployeeOnboardList, clearOnboardingStartedDate } = useOnboardingStore();
const currentStatusFilter = ref(0);
const showAssignOnboardingPlan = ref(false);
const selectedOnboards = ref(new Array<EmployeeOnboardList>());
const onboadList: Ref<any[]> = ref(<any>[]);
const quickHireList = ref(<any>[]);
const completedList = ref(<any>[]);
const isDirectDepositEnable: Ref<boolean> = ref(true);

const formatEmployeeStatus = (status: number) => {
  if (status === EmployeeStatusEnum.PendingOnboard) {
    return `Pending Onboard`
  } else if (status === EmployeeStatusEnum.PendingQuickhire) {
    return `Pending Quick Hire`
  }
}

const completeGridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  minHeight: '50em',
  columns: [
    {
      flex: 1,
      text: "Name",
      id: "name",
      field: "fullName",
      groupable: false,
      htmlEncode: false,
      width: 100,
      renderer: ({ value }) => {
        return value;
      },
    },
    {
      flex: 1,
      text: "Status",
      id: "onboardType",
      groupable: false,
      editor: false,
      htmlEncode: false,
      width: 100,
      renderer: ({ record }) => {
        return `<div class="text-capitalize">${formatEmployeeStatus(record.data.employeeStatusId)}</div>`
      },
    },
    {
      flex: 1,
      text: "Reporting Manager",
      id: "reportingManager",
      field: "reportingManagerName",
      groupable: false,
      htmlEncode: false,
      width: 100,
    },
    {
      flex: 1,
      text: "Job Title",
      id: "jobTitle",
      field: "jobTitleName",
      groupable: false,
      htmlEncode: false,
      width: 100,
    },
    {
      flex: 1,
      text: "Date Submitted",
      id: "onboardingCompletedUTC",
      field: "onboardingCompletedUTC",
      groupable: false,
      htmlEncode: true,
      width: 100,
      renderer: ({ record }) => {
        return record.data.onboardingCompletedUTC ? moment(record.data.onboardingCompletedUTC).format("MM/DD/YYYY") : ''
      },
    }
  ]
});

const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  selectionMode: {
    triggerEvent: "",
    row: true,
    checkboxOnly: true,
    flex: 1,
    minColumnWidth: 45,
    deselectOnClick: false,
    checkbox: true,
    showCheckAll: true,
  },
  columns: [
    {
      flex: 1,
      text: "Name",
      id: "fullName",
      field: "fullName",
      groupable: false,
      htmlEncode: false,
      width: 100,
      renderer: ({ value }) => {
        return value;
      },
    },
    {
      flex: 1,
      text: "Onboarding Status",
      id: "textOnboardStatus",
      groupable: false,
      editor: false,
      htmlEncode: true,
      width: 100,
      vue: true,
      textContent: true,
      renderer: ({ record, size, cellElement }) => {
        size.height = 70;
        cellElement.style.alignItems = "center";
        return {
          is: "onboarding-button-status",
          employeeId: record.data.employeeId,
          isFormSubmit: record.data.isSubmitted,
          formDoneAmount: record.data.formHRDoneAmount,
          totalFormAmount: record.data.totalFormAmount
        };
      },
    },
    {
      flex: 1,
      text: "Progress",
      id: "nrOfCompletedTasks",
      groupable: false,
      htmlEncode: true,
      width: 100,
      vue: true,
      renderer: ({ record }) => {
        return {
          is: `hr-onboarding-tasks`,
          employeeId: record.data.employeeId,
          isRightText: true,
          formDoneAmount: !isDirectDepositEnable.value && record.data.formHRDoneAmount == 12 ? record.data.formHRDoneAmount - 1 : record.data.formHRDoneAmount,
          totalFormAmount: isDirectDepositEnable.value ? record.data.totalFormAmount : record.data.totalFormAmount - 1
        };
      },
    },
    {
      flex: 1,
      type: "action",
      id: "action",
      text: "Actions",
      groupable: false,
      htmlEncode: true,
      width: 100,
      cellCls: "b-action-cell--hover",
      actions: [
        {
          visible: true,
          renderer: () => {
            return '<div class="b-action-item b-fa b-fa-arrow-up-right-from-square btn btn-link btn-view text-success no-underline viewOnboardBtn"></div>';
          },
          onClick: ({ record }) =>
            router.push({
              name: "onboardingDetail",
              params: { id: record.data.employeeId, fullName: record.data.fullName },
            }),
        },
        {
          visible: true,
          renderer: ({ record }) => {
            if (record.data.employeeStatusId === EmployeeStatusEnum.Onboard && record.data.isSubmitted === false) {
              return '<div class="b-action-item b-fa b-fa-forward btn btn-link text-success btn-skip no-underline skipOnboardBtn"></div>';
            } else if (record.data.employeeStatusId === EmployeeStatusEnum.QuickHire) {
              return '<div class="b-action-item b-fa b-fa-file-check btn btn-link text-success btn-assign no-underline skipOnboardBtn"></div>';
            } else {
              return ""
            }
          },
          onClick: ({ record }) => {
            selectedRecord.value = record.data
            if (record.data.employeeStatusId == EmployeeStatusEnum.Onboard) showSkipPlan.value = true
            else showAssignPlan.value = true
          },
        },
        {
          visible: true,
          renderer: () => {
            return '<div class="b-action-item b-fa b-fa-times-circle btn btn-link text-red btn-cancel no-underline cancelOnboardBtn"></div>';
          },
          onClick: ({ record }) => {
            selectedRecord.value = record.data
            showCancelPlan.value = true
          },
        },
      ],
    },
  ],
  listeners: {
    selectionChange: (data) => {
      if (Array.isArray(data.selection) && data.selection.length > 0) {
        showAssignOnboardingPlan.value = true;
        selectedOnboards.value = data.selection.map((item) => item.data);
      } else {
        selectedOnboards.value = [];
        showAssignOnboardingPlan.value = false;
      }
    },
  },
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
      )
        filterCount.value = gridStore.value.filters.count;
    },
  })
);

const quickHireStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
    onFilter: () => {
      // Ensures that store is always set correctly based on search text
      if (
        searchText.value &&
        quickHireStore.value.filters.count < filterCount.value
      )
        filterCount.value = quickHireStore.value.filters.count;
    },
  })
);

const completeGridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
    onFilter: () => {
      // Ensures that store is always set correctly based on search text
      if (
        searchText.value &&
        completeGridStore.value.filters.count < filterCompleteGridCount.value
      )
        filterCompleteGridCount.value = completeGridStore.value.filters.count;
    },
  })
);

const saveGridSettings = () => {
  localStorage.setItem(
    `${gridLocalStorageKey}State`,
    JSON.stringify((gridStore.value as any).state)
  );

  localStorage.setItem(`${gridLocalStorageKey}SearchText`, searchText.value);
}

const clearGridSettings = () => {
  gridStore.value.clearFilters();
  gridStore.value.clearSorters();
  quickHireStore.value.clearFilters();
  quickHireStore.value.clearSorters();
  completeGridStore.value.clearFilters();
  completeGridStore.value.clearSorters();
  localStorage.removeItem(`${gridLocalStorageKey}State`);
  localStorage.removeItem(`${gridLocalStorageKey}SearchText`);
}

const onCancelListPlan = async (type: number) => {
  if (selectedRecord.value) {
    const listEmployeeId = [selectedRecord.value.employeeId]
    await changeEmployeeStatus(listEmployeeId, type).then(() => {
      selectedRecord.value = null;
      notifySuccess("Onboarding Canceled!");
      refreshOnboardingPlan();
    });
  }
};

const onChangeEmployeeStatus = async (statusType: number) => {
  if (selectedRecord.value) {
    setLoading(true);
    const ids = [selectedRecord.value];
    const listCurrentOnboardId = statusType === EmployeeStatusEnum.QuickHire ? ids.filter((item) => !item.isSubmitted).map(x => x.employeeId) :
      ids.map((item) => item.employeeId);
    if (listCurrentOnboardId.length > 0) {
      //remove all data when change status
      await updateForm(listCurrentOnboardId, isCheckSkip.value || isCheckAssign.value);
      //Change all sidebar menu to not done when remove all data
      if (isCheckSkip.value || isCheckAssign.value) {
        await Promise.all([updateMultipleSidebar(listCurrentOnboardId), clearOnboardingStartedDate(listCurrentOnboardId)]);
      }
      await changeEmployeeStatus(listCurrentOnboardId, statusType).then(() => {
        selectedRecord.value = null;
        refreshOnboardingPlan();
      });
      handleResetAssignCheckBox();
      handleResetSkipCheckBox();
    }
    setLoading(false);
  }
}

const refreshOnboardingPlan = async () => {
  await fetchEmployeeOnboardList(OnboardType.ONBOARDS + 1);
  populateDataByStatus(OnboardType.ONBOARDS);
}

const hideFilterBar = () => {
  gridStore.value.clearFilters();
  quickHireStore.value.clearFilters();
  completeGridStore.value.clearFilters();
  gridFeatures.value.filterBar.hideFilterBar();
}

watch(() => currentStatusFilter.value, async () => {
  setLoading(true);
  selectedRecord.value = null;
  await fetchEmployeeOnboardList(currentStatusFilter.value + 1);
  populateDataByStatus(currentStatusFilter.value);
  showAssignOnboardingPlan.value = false;
  setLoading(false);
}, {
  deep: true
});

const populateDataByStatus = (tabNumber: number) => {

  if (tabNumber === OnboardType.ONBOARDS) {
    gridStore.value.data = [...employeeOnboardList.value];
  } else if (tabNumber === OnboardType.COMPLETED){
    completeGridStore.value.data = [...employeeOnboardList.value];
  } else if (tabNumber === OnboardType.QUICK_HIRES){
    quickHireStore.value.data = [...employeeOnboardList.value];
  }
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

const handleResetAssignCheckBox = () => {
  isCheckAssign.value = false;
}

const handleResetSkipCheckBox = () => {
  isCheckSkip.value = false;
  showSkipPlan.value = false;
}

onMounted(async () => {
  setLoading(true);
  const paymentMethodSetting = await getOnboardingPaymentMethodSetting() as { isDirectDeposit: boolean, isPaperCheck: boolean };
  isDirectDepositEnable.value = paymentMethodSetting.isDirectDeposit;
  await fetchEmployeeOnboardList(currentStatusFilter.value + 1);
  if (route.query.status != undefined && route.query.status != null) currentStatusFilter.value = Number(route.query.status)
  populateDataByStatus(OnboardType.ONBOARDS);
  isFinishLoading.value = true;
  setLoading(false);
});
</script>

<template>
  <div class="hq-pg pb-0 d-flex flex-column" v-if="isFinishLoading">
    <div class="hq-pg__grid">

      <bryntum-search-bar title="Current Onboards" :local-storage-key="gridLocalStorageKey" :show-settings-button="true"
        :show-filter-button="true" @save-settings="saveGridSettings()" @clear-settings="clearGridSettings()"
        @hide-filter-bar="hideFilterBar()" @show-filter-bar="gridFeatures.filterBar.showFilterBar()">
      </bryntum-search-bar>

      <fs-tabs v-model="currentStatusFilter" pills active-nav-item-class="bg-cyan hq-pg__tab--active"
      nav-wrapper-class="hq-pg__header hq-pg__header--sticky justify-content-center contain" class="hq-pg__grid">
        <fs-tab 
          title="Onboards" 
          active 
          lazy 
          title-item-class="mx-1" 
          title-link-class="hq-pg__tab"
          class="h-100 position-relative flex-column flex-fill"
          :class="{'d-flex' : currentStatusFilter == OnboardType.ONBOARDS}">
              <div class="action-grid list__table list__table--onpage list__b-grid--hover">
                <bryntum-grid ref="grid" v-bind="gridConfig" :store="gridStore" />
              </div>
        </fs-tab>
        <fs-tab 
          title="Quick Hires" 
          lazy 
          title-item-class="mx-1" 
          title-link-class="hq-pg__tab"
          class="h-100 position-relative flex-column flex-fill"
          :class="{'d-flex' : currentStatusFilter == OnboardType.QUICK_HIRES}">
              <div class="action-grid list__table list__table--onpage list__b-grid--hover">
                <bryntum-grid ref="grid" v-bind="gridConfig" :store="quickHireStore" />
              </div>
        </fs-tab>
        <fs-tab title="Pending" lazy title-item-class="mx-1" title-link-class="hq-pg__tab">
          <div v-if="currentStatusFilter == OnboardType.COMPLETED">
            <fs-card-body class="dashboard-card__content list__table">
              <div class="action-grid list__table list__table--onpage list__b-grid--hover">
                <bryntum-grid ref="grid" v-bind="completeGridConfig" :store="completeGridStore" />
              </div>
              </fs-card-body>
              </div>
        </fs-tab>
      </fs-tabs>
    </div>

    <assignOnboardingPlanPanel v-model="showAssignOnboardingPlan"
      @update:show-assign-onboarding-plan="showAssignOnboardingPlan = false"
      @refresh-onboarding-plan="refreshOnboardingPlan" :listCurrentOnboard="selectedOnboards" />

    <Teleport to="body">
      <common-modal v-model="showCancelPlan" @emitParent="onCancelListPlan(EmployeeStatusEnum.Cancelled)"
        :data="selectedRecord" centered okText="Yes, Cancel" cancelText="No, Go back" title="Cancel Onboarding"
        okTextVariant="danger" buttonCancelCustomClass="custom-btn">
        <template #content>
          <div class="message-content">
            <div v-if="selectedRecord">
              Are you sure you want to cancel onboarding for <span class="fw-bold">{{ selectedRecord.fullName }}</span>?
              <br /><font-awesome-icon class="text-danger"
                :icon="['fal', 'triangle-exclamation']"></font-awesome-icon>
              <span class="fw-bold p-1">This action will remove {{ selectedRecord.fullName }} from the current list of Onboards.</span>
            </div>
          </div>
        </template>
      </common-modal>
      <common-modal v-model="showSkipPlan" @emitParent="onChangeEmployeeStatus(EmployeeStatusEnum.QuickHire)"
        @emitCloseParent="handleResetSkipCheckBox" :data="selectedRecord" centered okText="Yes, Skip" cancelText="No"
        title="Skip Onboarding" buttonCancelCustomClass="custom-btn" okTextVariant="success">
        <template #content>
          <div class="message-content">
            <font-awesome-icon class="text-warning top-5" :icon="['fas', 'circle-exclamation']"></font-awesome-icon>
            <div>
              Are you sure you want to skip onboarding?
              <br />This action will prevent the employee(s) from entering their own information!
              <div class="mt-2">
                <!-- TODO: Merge branch Onboarding to resolve it -->
                <input v-model="isCheckSkip" type="checkbox" id="clearInformationSkipBoard" /> <label
                  for="clearInformationSkipBoard">Clear all entered information.</label>
              </div>
            </div>
          </div>
        </template>
      </common-modal>

      <common-modal v-model="showAssignPlan" @emitParent="onChangeEmployeeStatus(EmployeeStatusEnum.Onboard)"
        @emitCloseParent="handleResetAssignCheckBox" :data="selectedRecord" centered okText="Yes, Assign Plan"
        cancelText="No" title="Assign Onboarding Plan" okTextVariant="success" buttonCancelCustomClass="custom-btn">
        <template #content>
          <div class="message-content">
            <font-awesome-icon class="text-warning top-5" :icon="['fas', 'circle-exclamation']"></font-awesome-icon>
            <div>
              Are you sure you want to assign onboarding plan?
              <br />This action will allow the employee(s) to enter their own information!
              <div class="mt-2">
                <input v-model="isCheckAssign" type="checkbox" id="clearInformationAssignBoard" /> <label
                  for="clearInformationAssignBoard">Clear all entered information.</label>
              </div>
            </div>
          </div>
        </template>
      </common-modal>
    </Teleport>
  </div>
</template>
