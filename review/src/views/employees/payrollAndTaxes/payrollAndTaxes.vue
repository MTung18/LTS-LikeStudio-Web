<script lang="ts" setup>
import EmployeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';
import DirectDepositTab from "@/components/viewComponents/employees/payrollAndTaxes/directDepositTab.vue";
import PaycheckTab from "@/components/viewComponents/employees/payrollAndTaxes/paycheckTab.vue";
import PayrollTab from "@/components/viewComponents/employees/payrollAndTaxes/payrollTab.vue";
import TaxInfoTab from "@/components/viewComponents/employees/payrollAndTaxes/taxInfoTab.vue";
import ViewTaxInfoModal from "@/components/viewComponents/employees/payrollAndTaxes/viewTaxInfoModal.vue";
import W2Tab from "@/components/viewComponents/employees/payrollAndTaxes/w2Tab.vue";
import { MESSAGE } from '@/data/message';
import EmployeeDetails from '@/models/employees/EmployeeDetails';
import { useEmployeeStore } from "@/stores/employeeStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEdit } from "@fortawesome/pro-light-svg-icons";
import { storeToRefs } from "pinia";
import { Ref, computed, inject, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGeneralClientSetting } from '@/composables/useGeneralClientSetting';
import { useEmployeePaymentMethod } from '@/composables/useEmployeePaymentMethod';
import { PayrollAndTaxTab } from '@/enums/PayrollAndTaxTab';
import PendingFoundationApprovalBanner from '@/components/shared/pendingFoundationApprovalBanner.vue';

library.add(faEdit);

const tabTitles = {
  payroll: 'Payroll',
  paycheck: 'Pay History',
  directDeposit: 'Direct Deposit',
  taxInfo: 'Tax Info',
  w2: 'W-2'
}

const route = useRoute();
const router = useRouter();
const employeeId = computed<number>(() => +route.params?.id);
const tabToSet = computed<string>(() => route.params?.tab?.toString());
const { fetchEmployeeDetails, checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync } = useEmployeeStore();
const { getEmployeeDetails, employeeHasExistingPendingFoundationApprovals } = storeToRefs(useEmployeeStore());
const activeTab = ref<string>(tabTitles.payroll);
const employeeDetails = ref<EmployeeDetails>(null);
const hasPendingFoundationApproval: Ref<boolean> = ref(false);

const permissions = inject('$providePermissions');

const { isDirectDepositEnabled, isPaperCheckAndDirectDepositEnabled } = useGeneralClientSetting();
const { isEmployeeDirectDepositEnabled } = useEmployeePaymentMethod(+employeeId.value);
const isPayrollTabActive = computed<boolean>(() => activeTab.value === tabTitles.payroll);
const isDirectDepositTabActive = computed<boolean>(() => activeTab.value === tabTitles.directDeposit);
const isTaxInfoTabActive = computed<boolean>(() => activeTab.value === tabTitles.taxInfo);

const showViewTaxInfoModal = ref<boolean>(false);

const setActiveTab = (tabTitle: string) => {
  activeTab.value = tabTitle;
}

const onManageAccountClick = () => {
  router.push({ name: 'manageAccounts', params: { id: employeeId.value } });
}

const onEditPayrollClick = () => {
  router.push({ name: 'editPayrollInformation', params: { id: employeeId.value } });
}

const onEditTaxInfoClick = () => {
  router.push({ name: 'editTaxInformation', params: { id: employeeId.value } });
}

const changePaymentMethod = () => {
  router.push({ name: 'paymentMethod', params: { id: employeeId.value } });
}

const tabIndex = ref(0);
const setTab = () => {
  switch (PayrollAndTaxTab[tabToSet.value]) {
    case PayrollAndTaxTab.PayHistory:
      setActiveTab(tabTitles.paycheck);
      tabIndex.value = 1;
      break;
    case PayrollAndTaxTab.DirectDeposit:
      setActiveTab(tabTitles.directDeposit);
      tabIndex.value = 2;
      break;
    case PayrollAndTaxTab.TaxInfo:
      setActiveTab(tabTitles.taxInfo);
      tabIndex.value = 3;
      break;
    case PayrollAndTaxTab.W2:
      setActiveTab(tabTitles.w2);
      tabIndex.value = 4;
      break;
    case PayrollAndTaxTab.Payroll:
    default:
      setActiveTab(tabTitles.payroll);
      tabIndex.value = 0;
      break;
  }
}

watch(
  () => isDirectDepositEnabled.value,
  async () => {
    setTab();
  },
);

onMounted(async () => {
  setTab();
  await Promise.all([fetchEmployeeDetails(employeeId.value), checkHRApprovalCategoryEmployeePendingFoundationStatusExistsAsync(employeeId.value)]);
  employeeDetails.value = getEmployeeDetails.value;
  hasPendingFoundationApproval.value = employeeHasExistingPendingFoundationApprovals.value;
});
</script>

<template>
  <div class="hq-pg d-flex flex-column" :class="{ 'pb-0': tabIndex === 1 || 2 }">
    <employee-header :employeeId="employeeId" class="position-relative" />

    <fs-tabs pills active-nav-item-class="bg-index-color-1 hq-pg__tab--active" v-model="tabIndex"
      nav-wrapper-class="hq-pg__header hq-pg__header--sticky justify-content-center contain" class="hq-pg__grid">

      <fs-tab :title="tabTitles.payroll" @click="setActiveTab(tabTitles.payroll)" v-if="permissions['WHQ_252_3147']"
        active title-item-class="mx-1" title-link-class="hq-pg__tab">
        <pending-foundation-approval-banner
          :hasPendingFoundationApproval="hasPendingFoundationApproval"></pending-foundation-approval-banner>
        <KeepAlive>
          <payroll-tab :employeeId="employeeId" :hasPendingFoundationApproval="hasPendingFoundationApproval" />
        </KeepAlive>
      </fs-tab>

      <fs-tab :title="tabTitles.paycheck" @click="setActiveTab(tabTitles.paycheck)" v-if="permissions['WHQ_252_3148']"
        title-item-class="mx-1" title-link-class="hq-pg__tab" class="h-100">
        <KeepAlive>
          <paycheck-tab v-if="employeeDetails" :employeeDetails="employeeDetails" />
        </KeepAlive>
      </fs-tab>

      <fs-tab :title="tabTitles.directDeposit" @click="setActiveTab(tabTitles.directDeposit)"
        v-if="permissions['WHQ_252_3149'] && isDirectDepositEnabled"
        :class="isDirectDepositTabActive ? 'position-relative d-flex flex-column flex-fill' : ''"
        title-item-class="mx-1" title-link-class="hq-pg__tab" class="h-100">
        <pending-foundation-approval-banner
          :hasPendingFoundationApproval="hasPendingFoundationApproval"></pending-foundation-approval-banner>
        <KeepAlive>
          <direct-deposit-tab />
        </KeepAlive>
      </fs-tab>

      <fs-tab :title="tabTitles.taxInfo" @click="setActiveTab(tabTitles.taxInfo)" v-if="permissions['WHQ_252_3150']"
        title-item-class="mx-1" title-link-class="hq-pg__tab">
        <pending-foundation-approval-banner
          :hasPendingFoundationApproval="hasPendingFoundationApproval"></pending-foundation-approval-banner>
        <KeepAlive>
          <tax-info-tab :employeeId="employeeId" :hasPendingFoundationApproval="hasPendingFoundationApproval" />
        </KeepAlive>
      </fs-tab>

      <fs-tab :title="tabTitles.w2" @click="setActiveTab(tabTitles.w2)" v-if="permissions['WHQ_252_3151']"
        title-item-class="mx-1" title-link-class="hq-pg__tab" class="h-100">
        <KeepAlive>
          <W2Tab v-if="employeeDetails" :employeeDetails="employeeDetails" />
        </KeepAlive>
      </fs-tab>

      <template #tabs-end>
        <fs-button v-if="isPayrollTabActive && permissions['WHQ_252_3147']" variant="outline-primary"
          :class="`ms-auto ${hasPendingFoundationApproval ? 'disabled' : ''}`" @click="onEditPayrollClick()">
          <font-awesome-icon :icon="['fal', 'edit']" />
          <span>{{ MESSAGE.COMMON.EDIT }}</span>
        </fs-button>

        <div v-if="isDirectDepositTabActive && permissions['WHQ_252_3149']" class="ms-auto">
          <fs-nav-item-dropdown v-if="isPaperCheckAndDirectDepositEnabled"
            :class="`btn ms-auto me-2 change-payment rounded-circle globalheader__item ${hasPendingFoundationApproval ? 'disabled' : ''}`"
            right v-fs-tooltip.hover title="More options">
            <template v-slot:button-content>
              <font-awesome-icon :icon="['fal', 'fa-ellipsis']" class="change-payment__icon" />
            </template>
            <fs-dropdown-item class="globalheader__dropdown-item" @click="changePaymentMethod">
              <font-awesome-icon :icon="['fal', 'fa-piggy-bank']" class="me-1" />
              {{ MESSAGE.PAYMENT_SWITCHER.CHANGE_PAYMENT_METHOD }}
            </fs-dropdown-item>
          </fs-nav-item-dropdown>

          <fs-button
            v-if="isDirectDepositEnabled && isEmployeeDirectDepositEnabled"
            variant="btn-primary" :class="`btn btn-primary ms-auto ${hasPendingFoundationApproval ? 'disabled' : ''}`"
            @click="onManageAccountClick()">
            {{ MESSAGE.PAYROLL.MANAGE_ACCOUNTS }}
          </fs-button>
        </div>

        <div v-if="isTaxInfoTabActive && permissions['WHQ_252_3150']" class="ms-auto">
          <fs-button variant="outline-primary" class="mr-2" @click="showViewTaxInfoModal = true">
            <span>{{ MESSAGE.COMMON.VIEW }}</span>
          </fs-button>
          <fs-button variant="outline-primary" :class="`${hasPendingFoundationApproval ? 'disabled' : ''}`"
            @click="onEditTaxInfoClick()">
            <font-awesome-icon :icon="['fal', 'edit']" />
            <span>{{ MESSAGE.COMMON.EDIT }}</span>
          </fs-button>
          <view-tax-info-modal :showModal="showViewTaxInfoModal" @close="showViewTaxInfoModal = false" />
        </div>
      </template>
    </fs-tabs>
  </div>
</template>

<style lang="scss" scoped>
.change-payment {
  background-color: #eff1f3;
  padding: 0;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;

  &__icon {
    font-size: 1.5rem;
    color: #a7a3a3;
  }
}

.dropdown-toggle::after {
  display: contents;
}

.change-payment:active {
  border: 1px solid #5dbfebcc;
  background-color: #eff1f3;
}

.change-payment::after {
  border: 1px solid #5dbfebcc;
}

.change-payment:focus-within {
  border: 1px solid #5dbfebcc;
}</style>