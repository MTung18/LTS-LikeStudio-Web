<script setup lang="ts">
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { Grid, Store } from "@bryntum/grid";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { onBeforeMount, ref, Ref, watch } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCircle,
  faPenToSquare,
  faPlus,
  faTimes,
  faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import AccountDetail from "@/components/viewComponents/onboarding/onboardingDirectDeposit/accountDetail.vue";
import { faCircleDot, faExclamationCircle } from "@fortawesome/pro-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { storeToRefs } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { DISTRIBUTION_METHODS } from "@/constants/common";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingDirectDepositStore } from "@/stores/onboardingDirectDepositStore";
import DirectDepositAccount from "@/models/onboarding/OnboardingDirectDeposit";
import { formatCurrency, showLastNChar } from "@/utilities/formatUtils";
import directDepositImg from "@/assets/images/DirectDeposit.svg"
import { useOnboardingStore } from "@/stores/onboardingStore";
import { onMounted } from "vue";
import { computed } from "vue";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue"
import { useEmployeeStore } from "@/stores/employeeStore";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import { useAlerts } from "@/composables/useAlerts";
const route = useRoute();
const paymentSetting = ref()
const PAYMENT_METHODS = {
  directDeposit: "directDeposit",
  paperCheck: "paperCheck"
}
const selectedPayMethod = ref(PAYMENT_METHODS.directDeposit)
const latestSelectedPayMethod = ref('')
const currentNavItem = ref(null)
const openChangeMethodToPaperCheckModal = ref(false)
const openChangeMethodToDirectDepositModal = ref(false)
const { fetchEmployeeDetails } = useEmployeeStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const { setLoading } = useLoadingStore();
const { responsive } = useBreakpoints();
const {
  fetchAccount,
  changeStartAtMode,
  updateSelectedAccountId,
  getPaymentMethod,
  updatePaymentMethod,
  getOnboardingPaymentMethodSetting } = useOnboardingDirectDepositStore();
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems, getEmployeeFormSubmit } = useOnboardingStore();
const { accountList } = storeToRefs(useOnboardingDirectDepositStore());
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
library.add(faTimes, faPenToSquare, faTrashCan, faPlus, faExclamationCircle, faCircleDot, faCircle);
const tableKey = ref(0);
const visibility = ref('hidden');
const isEmployeeFormSubmitted = ref(false);
const isDisabledEdit = ref(false)
const showSidebar = ref(false);
const selectedAccount = ref({} as DirectDepositAccount);
const gridLocalStorageKey = "onboardingDirectDepositListGrid";
const router = useRouter();
const employeeId = computed(() => Number(route.params.id));
const { notifySuccess } = useAlerts();
const grid: Ref<Grid> = ref(null);
const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey),
  minHeight: accountList.value && accountList.value.length ? "40em" : 0,
  autoHeight: true,
  emptyText: '',
  features: {
    regionResize: false,
    columnPicker: {
      groupByRegion: true,
    },
  },
  columns: [
    {
      autoWidth: false,
      flex: 1,
      text: "Sequence",
      id: "ordinalPosition",
      field: "ordinalPosition",
      htmlEncode: false,
      renderer: ({ record }: { record: DirectDepositAccount }) => {
        return record.ordinalPosition === -1 ? DISTRIBUTION_METHODS.remaining : record.ordinalPosition;
      },
    },
    {
      autoWidth: false,
      flex: 2,
      text: "Bank account Type",
      id: "accountTypeName",
      field: "accountTypeName",
      htmlEncode: false,
    },
    {
      autoWidth: false,
      flex: 2,
      text: "Account Number",
      id: "bankAccountNumber",
      field: "bankAccountNumber",
      renderer: ({ record }: { record: DirectDepositAccount }) => {
        return showLastNChar(record.bankAccountNumber);
      },
    },
    {
      autoWidth: false,
      flex: 2,
      text: "Distribution Method",
      id: "distributionMethodName",
      field: "distributionMethodName",
    },
    {
      autoWidth: false,
      flex: 2,
      text: "Distribution Amount",
      id: "distributionAmount",
      field: "distributionAmount",
      renderer: ({ record }: { record: DirectDepositAccount }) => {
        if (record.distributionMethodName === DISTRIBUTION_METHODS.remaining) {
          return 'Remaining'
        } else {
          return record.distributionMethodName === DISTRIBUTION_METHODS.amount
            ? `${formatCurrency(record.distributionAmount)}`
            : `${record.distributionAmount}%`
        }
      },
    },
    {
      autoWidth: false,
      flex: 1,
      text: "Status",
      id: "isActive",
      field: "isActive",
      groupable: false,
      htmlEncode: false,
      renderer: ({ record }: { record: DirectDepositAccount }) => {
        return record.isActive
          ? `<i class="bg-success p-1 rounded-circle"></i><span class="ms-1">Active</span>`
          : `<i class="bg-inactive p-1 rounded-circle"></i><span class="ms-1">Inactive</span>`;
      },
    },
    {
      hidden: false,
      locked: responsive.breakpoint === "md",
      region: false,
      flex: 1,
      type: "action",
      id: "action",
      text: "Actions",
      enableHeaderContextMenu: false,
      enableCellContextMenu: false,
      cellCls: "b-action-cell",
      actions: [
        {
          visible: !isDisabledEdit.value,
          renderer: () => {
            return '<i class="b-action-item b-fa b-fa-edit cursor-pointer no-underline text-success">Edit</i>';
          },
          onClick: ({ record }) => {
            changeStartAtMode('edit');
            updateSelectedAccountId(record.data.employeeDirectDepositId);
            router.push({ name: "onboardingAccountManagement" });
          },
        },
      ],
    },
  ],
  listeners: {
    cellClick: ({ record, column }) => {
      if (column.type !== "action") {
        showSidebar.value = true;
        selectedAccount.value = record;
        updateSelectedAccountId(record.data.employeeDirectDepositId);
      }
    },
  },
  readOnly: true,
});

watch(
  () => responsive.breakpoint,
  () => {
    if (responsive.breakpoint === "sm") {
      gridConfig.value.columns.forEach(col => {
        col.autoWidth = true;
      });

      gridConfig.value.columns[gridConfig.value.columns.length - 1].hidden = true;
    } else if (responsive.breakpoint === "md") {
      gridConfig.value.columns[gridConfig.value.columns.length - 1].hidden = false;
      gridConfig.value.columns[gridConfig.value.columns.length - 1].region = "right";
    } else {
      gridConfig.value.columns.forEach(col => {
        col.autoWidth = false;
      });
    }

    tableKey.value++;
  },
);

const changeRoute = async () => {
  changeStartAtMode('add');
  await router.push({ name: "onboardingAccountManagement" });
};

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
  }),
);
onBeforeMount(async () => {
  try {
    setLoading(true);
    await fetchAccount(employeeId.value);
    await populateBryntumStore();
    paymentSetting.value = await getOnboardingPaymentMethodSetting()
    const isDirectDeposit = await getPaymentMethod(employeeId.value);
    if(!isDirectDeposit && paymentSetting.value.isDirectDeposit && !paymentSetting.value.isPaperCheck){
      await updatePaymentMethod(true, employeeId.value)
      selectedPayMethod.value = PAYMENT_METHODS.directDeposit
      latestSelectedPayMethod.value = PAYMENT_METHODS.directDeposit
    } else if(isDirectDeposit && !paymentSetting.value.isDirectDeposit && paymentSetting.value.isPaperCheck){
      await updatePaymentMethod(false, employeeId.value)
      selectedPayMethod.value = PAYMENT_METHODS.paperCheck
      latestSelectedPayMethod.value = PAYMENT_METHODS.paperCheck
    } else {
      if (isDirectDeposit) {
        selectedPayMethod.value = PAYMENT_METHODS.directDeposit
        latestSelectedPayMethod.value = PAYMENT_METHODS.directDeposit
      } else {
        selectedPayMethod.value = PAYMENT_METHODS.paperCheck
        latestSelectedPayMethod.value = PAYMENT_METHODS.paperCheck
      }
    }
    
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
  }

});

onMounted(async () => {
  setLoading(true);
  await Promise.all([
    fetchEmployeeDetails(employeeId.value),
    getOnboardingSideNavItems(employeeId.value),
    fetchAccount(employeeId.value)
  ])

  isEmployeeFormSubmitted.value = await getEmployeeFormSubmit(employeeId.value)
  if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.QuickHire) {
    isDisabledEdit.value = false
  } else {
    isDisabledEdit.value = !isEmployeeFormSubmitted.value
    visibility.value = isDisabledEdit.value ? 'hidden' : 'visible';
    tableKey.value++
  }

  currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLowerCase() === 'onboardingDirectDeposit'.trim().toLocaleLowerCase())
  if (!currentNavItem.value) {
    router.push({ name: "onboardingPersonalInformation" })
  }
  setLoading(false);
})

const populateBryntumStore = async () => {
  gridStore.value.data = accountList.value;
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

const handleCloseSidebar = async () => {
  showSidebar.value = false;
};

const handleCloseChangeToPaperModal = async () => {
  selectedPayMethod.value = PAYMENT_METHODS.directDeposit;
  openChangeMethodToPaperCheckModal.value = false;
}

const handleChangeMethodToPaperCheck = async () => {
  await updatePaymentMethod(false, employeeId.value)
  handleSavePaymentMethodState();
  notifySuccess('Payment method updated.')
  openChangeMethodToPaperCheckModal.value = false;
}

const handleChangeMethodToDirectDeposit = async () => {
  await updatePaymentMethod(true, employeeId.value);
  handleSavePaymentMethodState();
  notifySuccess('Payment method updated.')
  openChangeMethodToDirectDepositModal.value = false
}

const handleCloseChangeToDirectDepositModal = () => {
  selectedPayMethod.value = PAYMENT_METHODS.paperCheck;
  openChangeMethodToDirectDepositModal.value = false;
}

const handleSavePaymentMethodState = async () => {
  await fetchAccount(employeeId.value);
  if (selectedPayMethod.value === PAYMENT_METHODS.paperCheck
    || (selectedPayMethod.value === PAYMENT_METHODS.directDeposit && accountList.value.length > 0)) {
    markOnboardingSidenavItemAsDone(currentNavItem.value?.progressSidebarId, true, employeeId.value)
  } else {
    markOnboardingSidenavItemAsDone(currentNavItem.value?.progressSidebarId, false, employeeId.value)
  }
}

const twoMethodAvailable = computed(() => {
  return paymentSetting.value?.isDirectDeposit && paymentSetting.value?.isPaperCheck
})

const goto = (route) => {
  router.push({ name: route })
}

</script>

<template>
  <div>
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
          <fs-row align-v="center">
            <fs-col class="title">
              <h2 class="hq-pg__title">Direct Deposit</h2>
            </fs-col>
            <fs-col cols="auto" class="ms-auto">
              <fs-button variant="success" @click="goto('onboardingFormW4')">NEXT</fs-button>

            </fs-col>
          </fs-row>
        </fs-container>
        <fs-container fluid class="hq-pg__header " v-if="twoMethodAvailable">
          <div class="d-flex align-items-center h-100">
            <fs-form-group v-slot="{ ariaDescribedby }" class="mb-0">
              <fs-form-radio :disabled="isDisabledEdit" v-model="selectedPayMethod" :aria-describedby="ariaDescribedby"
                name="directDeposit" value="directDeposit"
                @click="openChangeMethodToDirectDepositModal = !isDisabledEdit">New hire prefers to receive direct
                deposits.</fs-form-radio>
              <fs-form-radio :disabled="isDisabledEdit" @click="openChangeMethodToPaperCheckModal = !isDisabledEdit"
                v-model="selectedPayMethod" :aria-describedby="ariaDescribedby" name="paperCheck" value="paperCheck">New
                hire prefers to receive paper checks.</fs-form-radio>
            </fs-form-group>
          </div>

        </fs-container>
        <fs-container fluid>
          <fs-row v-if="selectedPayMethod === PAYMENT_METHODS.directDeposit"
            class="mb-2 d-flex justify-content-between align-items-center border-bottom py-2 px-4">
            <fs-col md="6" sm="12" class="ps-4 my-2 title">
              {{ twoMethodAvailable ? 'List of Bank Accounts' : 'Direct Deposit Accounts' }}
            </fs-col>
            <hr v-if="responsive.breakpoint === 'sm'" />
            <fs-col md="6" sm="12" class="pe-4 my-2 d-flex justify-content-end">
              <fs-button :variant="twoMethodAvailable ? 'outline-success' : 'success'" class="text-capitalize"
                @click="changeRoute" :disabled="isDisabledEdit">
                ADD ACCOUNT
              </fs-button>
            </fs-col>
          </fs-row>
        </fs-container>

        <div v-if="selectedPayMethod === PAYMENT_METHODS.directDeposit"
          :class="accountList.length === 0 && 'flex-grow-1 d-flex justify-content-center align-items-center text-center'">
          <div v-if="accountList.length !== 0">
            <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
          </div>
          <div v-if="accountList.length === 0">
            <div>
              <img :src="directDepositImg" />
            </div>
            <div class='mt-3'>No Bank Accounts.</div>
          </div>
        </div>
        <div class="flex-grow-1 d-flex justify-content-center align-items-center text-center"
          v-if="selectedPayMethod === PAYMENT_METHODS.paperCheck">
          <div>
            <div>
              <img :src="directDepositImg" />
            </div>
            <div class='mt-3'>You have chosen receive Paper Checks.</div>
          </div>
        </div>
    <dark-theme-modal title="Change Payment Method" :showModal="openChangeMethodToPaperCheckModal" cancelText="Cancel"
      cancelBtnVariant="light" okText="Yes, Change" okTextVariant="danger" @ok="handleChangeMethodToPaperCheck"
      @close="handleCloseChangeToPaperModal">
      <template #content>
        <div class="d-flex py-3">
          <div class="me-2">
            <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="text-danger" />
          </div>
          <div>
            <div>Are you sure you want to change payment method?</div>
            <div v-if="accountList.length !== 0">Your bank accounts will be lost.</div>
          </div>
        </div>

      </template>

    </dark-theme-modal>
    <dark-theme-modal title="Change Payment Method" :showModal="openChangeMethodToDirectDepositModal" cancelText="Cancel"
      cancelBtnVariant="light" okText="Yes, Change" okTextVariant="danger" @ok="handleChangeMethodToDirectDeposit"
      @close="handleCloseChangeToDirectDepositModal">
      <template #content>
        <div class="d-flex">
          <div class="me-2">
            <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="text-danger" />
          </div>
          <div>
            <div>Are you sure you want to change payment method?</div>
          </div>
        </div>

      </template>

    </dark-theme-modal>
    <account-detail :accountDetail="selectedAccount" :isShowSidebar="showSidebar" @close-sidebar="handleCloseSidebar"
      :isOnboarding="false" :isDisabledEdit="isDisabledEdit" :isQuickHire="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.QuickHire" />
  </div>
</template>

<style scoped lang="scss">
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

:deep(.b-grid-cell.b-checkbox-selection) {
  background-color: #fff;
}

:deep(.content-fsModal) {
  background-color: #193755;
}

:deep(.body-fsModal) {
  height: 500px;
}

:deep(.form-check.form-check-inline) {
  display: block;
}

:deep(.b-grid-cell) {
  padding-left: 24px;
  padding-right: 24px;
}

:deep(.b-grid-header) {
  padding-left: 24px;
  padding-right: 24px;
}

:deep(.b-action-item::before) {
  display: block;
}

:deep(.b-action-item) {
  margin-right: 32px;
}

:deep(.b-grid-cell.b-action-cell) {
  visibility: hidden;
  transition: all ease-in-out 0.3s;
}

:deep(.b-grid-row:hover .b-grid-cell.b-action-cell) {
  visibility: v-bind(visibility);
}

:deep(.b-action-item:hover) {
  transform: none;
}

.tag {
  text-align: center;
  padding: 5px 10px;
  background: rgba(45, 188, 154, 0.15);
}

.name {
  font-size: 18px;
}

.notif {
  background-color: rgba(255, 102, 0, 0.1);
}

:deep(.bg-inactive) {
  background-color: rgba(110, 124, 143, 0.5);
}

.title {
  font-style: normal;
  font-weight: 700;
  font-size: 16px;
  line-height: 21px;
}

:deep(.b-grid-splitter) {
  display: none;
}

:deep(.b-grid-subgrid[data-region="right"]) {
  box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
  -webkit-box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
  -moz-box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
}

:deep(.b-empty-text) {
  width: 100%;
}

:deep(.form-check-input[type="radio"]:checked) {
  background-color: #03A9F4;
  border-color: #03A9F4;
  ;
}

.wrapper-directdeposit:first-child {
  height: 100% !important;
}

.form_header {
  height: 80px;
  border-bottom: 1px solid #e1e4e8;
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 2;
}
</style>
