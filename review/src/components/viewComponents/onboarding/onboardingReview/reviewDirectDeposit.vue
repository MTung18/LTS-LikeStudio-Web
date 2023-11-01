<template>
  <div>
    <div v-if="selectedPayMethod === PAYMENT_METHODS.directDeposit" :class="accountList.length === 0 &&
      'flex-grow-1 d-flex justify-content-center align-items-center text-center'
      ">
      <div v-if="accountList.length !== 0">
        <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
      </div>
      <div v-if="accountList.length === 0">
        <div>
          <img :src="directDepositImg" />
        </div>
        <div class="mt-3">No Bank Accounts.</div>
      </div>
    </div>
    <div v-else-if="selectedPayMethod === PAYMENT_METHODS.paperCheck"
      class="flex-grow-1 d-flex justify-content-center align-items-center text-center">
      <div>
        <div>
          <img :src="directDepositImg" />
        </div>
        <div class="mt-3">You have chosen receive Paper Checks.</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onBeforeMount, ref, Ref } from "vue";
import { useRoute } from "vue-router"
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingDirectDepositStore } from "@/stores/onboardingDirectDepositStore";
import DirectDepositAccount from "@/models/onboarding/OnboardingDirectDeposit";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { DISTRIBUTION_METHODS } from "@/constants/common";
import directDepositImg from "@/assets/images/direct-deposit.svg";

import { formatCurrency, showLastNChar } from "@/utilities/formatUtils";

import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { Store } from "@bryntum/grid";

const { getPaymentMethod, fetchAccount } =
  useOnboardingDirectDepositStore();
const { accountList, isPending } = storeToRefs(
  useOnboardingDirectDepositStore()
);
const { setLoading } = useLoadingStore();
const route = useRoute();
const employeeId = Number(route.params.id)
const PAYMENT_METHODS = {
  directDeposit: "directDeposit",
  paperCheck: "paperCheck",
};
const selectedPayMethod = ref(PAYMENT_METHODS.directDeposit);
const gridLocalStorageKey = "onboardingDirectDepositListGrid";

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
          : `<i class="bg-status-inactive p-1 rounded-circle"></i><span class="ms-1">Inactive</span>`;
      },
    },
  ],
  readOnly: true,
});

const latestSelectedPayMethod = ref("");
const isVisible = ref("hidden");
const tableKey = ref(0);
const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
  })
);

onBeforeMount(async () => {
  try {
    setLoading(true);
    if (accountList.value.length === 0) {
      await fetchAccount(employeeId);
    }
    await populateBryntumStore();
    const isDirectDeposit = await getPaymentMethod(employeeId);
    if (isDirectDeposit) {
      selectedPayMethod.value = PAYMENT_METHODS.directDeposit;
      latestSelectedPayMethod.value = PAYMENT_METHODS.directDeposit;
    } else {
      selectedPayMethod.value = PAYMENT_METHODS.paperCheck;
      latestSelectedPayMethod.value = PAYMENT_METHODS.paperCheck;
    }
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
  isVisible.value = isPending.value ? "hidden" : "visible";
});

async function populateBryntumStore() {
  gridStore.value.data = accountList.value;
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}
</script>

<style scoped></style>
