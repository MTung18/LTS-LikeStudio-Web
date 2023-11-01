<script setup lang="ts">
import CommonModal from '@/components/common/commonModal.vue';
import EmployeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';
import { IntegrationFunction } from '@/enums/IntegrationFunction';
import { PayType } from '@/enums/PayType';
import { useFoundationIntegrationFactory } from '@/factories/foundationIntegrationFactory';
import { EarnCodeDropdown, PayPeriodDropdown, PayTypeDropdown, PayrollInformation } from '@/models/employees/PayrollInformation';
import { EarnCode } from '@/models/foundationIntegration/EarnCode';
import { PayPeriod } from '@/models/foundationIntegration/PayPeriod';
import { useEmployeePayrollInformationStore } from '@/stores/employeePayrollInformationStore';
import { storeToRefs } from 'pinia';
import { FormContext } from 'vee-validate';
import { computed, onMounted, ref } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useAlerts } from "@/composables/useAlerts";
import { computedAsync } from '@vueuse/core';
import { cloneDeep } from 'lodash';

const notify = useAlerts();
const route = useRoute();
const router = useRouter();
const routeRequestedPath = ref<string>('');
const needConfirmBeforeNavigate = ref<boolean>(true);
const employeeId = computed<string>(() => route.params?.id?.toString());

const employeePayrollInformationStore = useEmployeePayrollInformationStore();
const { payrollInformation } = storeToRefs(employeePayrollInformationStore);
const { fetchPayrollInformation, editPayrollInformation } = employeePayrollInformationStore;

const earnCodeService = useFoundationIntegrationFactory(IntegrationFunction.EarnCode)();
const payPeriodService = useFoundationIntegrationFactory(IntegrationFunction.PayPeriod)();

const form = ref<FormContext>(null);
const formData = ref<PayrollInformation>(new PayrollInformation());
const formOriginalData = ref<PayrollInformation>(new PayrollInformation());
const isFormChanged = computed<boolean>(() => JSON.stringify(formData.value) !== JSON.stringify(formOriginalData.value));
const payTypeOptions: PayTypeDropdown[] = [
  {
    id: PayType.Hourly,
    payTypeName: PayType[PayType.Hourly]
  },
  {
    id: PayType.Salary,
    payTypeName: PayType[PayType.Salary]
  },
];
const earnCodeOptions = ref<EarnCodeDropdown[]>([]);
const payPeriodOptions = ref<PayPeriodDropdown[]>([]);

const showConfirmationModal = ref<boolean>(false);

function openConfirmModal() {
  showConfirmationModal.value = true;
}

function onCancelClick() {
  showConfirmationModal.value = false;
}

function onCloseClick() {
  needConfirmBeforeNavigate.value = false;

  if (routeRequestedPath.value) {
    router.push(routeRequestedPath.value);
  } else {
    router.push({ name: 'payrollAndTaxes', params: { id: employeeId.value } });
  }
}

async function updatePayrollInformation() {
  const data = formData.value;
  const payrollInformationData: PayrollInformation = {
    employeeId: +employeeId.value,
    payTypeId: +data.payType?.id || null,
    earnCodeId: +data.earnCode?.id || null,
    payPeriodId: +data.payPeriod?.id || null,
    payRate: data.payRate,
    payPeriodsPerYear: data.payPeriodsPerYear,
    isHoursRequiredForSalary: data.isHoursRequiredForSalary,
    isCertifiedPayroll: data.isCertifiedPayroll,
    isFutaSutaExempt: data.isFutaSutaExempt,
    isDirectDeposit: data.isDirectDeposit,
    isDirectDepositEnabled: data.isDirectDepositEnabled
  }

  const result = await editPayrollInformation(payrollInformationData);
  if (result) {
    needConfirmBeforeNavigate.value = false;
    router.push({ name: 'payrollAndTaxes', params: { id: employeeId.value } });
    notify.notifyModifySuccess('Edit Successful! Your changes have been saved.');
  } else {
    notify.notifyError('Failed to save changes. Please try again later.');
  }
}

onMounted(async () => {
  // Get Earn Code & Pay Period
  const dropdownData = await Promise.all([earnCodeService.getData(true), payPeriodService.getData(true)]);
  earnCodeOptions.value = dropdownData[0].map((earnCode: EarnCode) => ({ id: earnCode.id, earnCodeName: earnCode.earnCodeName }));
  payPeriodOptions.value = dropdownData[1].map((payPeriod: PayPeriod) => ({ id: payPeriod.id, payPeriodName: payPeriod.payPeriodName }));

  // Get Payroll information
  await fetchPayrollInformation(employeeId.value);
  const payTypeId = payrollInformation.value.payTypeId;
  formData.value = {
    ...payrollInformation.value,
    payType: payTypeId ? {
      id: payTypeId,
      payTypeName: PayType[payTypeId]
    } : undefined,
  };

  formOriginalData.value = cloneDeep(formData.value);
})

onBeforeRouteLeave(async (to) => {
  if (!needConfirmBeforeNavigate.value) {
    return true;
  }

  // Open confirm modal before leave
  routeRequestedPath.value = to.fullPath;
  showConfirmationModal.value = true;
  return false;
});

const showErrorMessage = ref(false);

function checkDecimalDigits() {
  if (formData.value.payRate) {
    const decimalDigits = formData.value.payRate.toString().split('.')[1]?.length || 0;
    showErrorMessage.value = decimalDigits > 5;
  }
}

const isFormValid = computedAsync<boolean>(
  async () => {
    const formValidation = await form.value.validate();
    return formValidation.valid;
  },
  false,
)
</script>

<template>
  <div class="hq-pg d-flex flex-column">
    <employee-header :employeeId="employeeId" class="position-relative" />

    <VeeForm ref="form">
      <fs-container fluid class="contain hq-pg__header">
        <fs-row align-v="center">
          <fs-col>
            <h2 class="hq-pg__title">Edit Payroll Information</h2>
          </fs-col>
          <fs-col cols="auto" class="ms-auto">
            <fs-button variant="outline-secondary" @click="openConfirmModal()">Cancel</fs-button>
            <fs-button variant="primary" @click="updatePayrollInformation()" :disabled="!isFormChanged || !isFormValid || showErrorMessage">Save</fs-button>
          </fs-col>
        </fs-row>

        <common-modal :showModal="showConfirmationModal" title="CLOSE PAYROLL FORM" okText="CLOSE" cancelText="CANCEL"
          okTextVariant="primary" @emitParent="onCloseClick()" @emitCloseParent="onCancelClick()">
          <template #content>
            <div class="message-content">
              Are you sure you want to close this payroll form? Any unsaved changes will be lost.
            </div>
          </template>
        </common-modal>
      </fs-container>

      <fs-container fluid class="contain mt-4">
        <fs-row>
          <fs-col md="4">
            <fs-input type="fsMultiselectList" name="payType" label="Pay Type" v-model="formData.payType"
              :typeaheaddata="payTypeOptions" typeaheadvalueattribute="id" typeaheadkey="payTypeName"
              :rules="{ required: true }" />
          </fs-col>

          <fs-col md="4">
            <fs-input type="fsMultiselectList" name="earnCode" label="Earn Code" v-model="formData.earnCode"
              :typeaheaddata="earnCodeOptions" typeaheadvalueattribute="id" typeaheadkey="earnCodeName"
              :rules="{ required: true }" />
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col md="4">
            <fs-input type="fsMultiselectList" name="payPeriod" label="Pay Period" v-model="formData.payPeriod"
              :typeaheaddata="payPeriodOptions" typeaheadvalueattribute="id" typeaheadkey="payPeriodName"
              :rules="{ required: true }" />
          </fs-col>

          <fs-col md="4">
            <fs-input type="fsNumber" name="payRate" label="Pay Rate Per Pay Period" v-model="formData.payRate"
              :rules="{ required: true, max: 12 }" @input="checkDecimalDigits" />
            <span v-if="showErrorMessage" style="color: red; font-size: 0.75rem;">Enter up to 5 digits after the decimal
              point.</span>
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col md="4">
            <fs-input type="fsNumber" inputType="number" name="PayPeriodsPerYear" label="Pay Periods Per Year"
              v-model="formData.payPeriodsPerYear" :rules="{ required: true, max: 6 }" />
          </fs-col>
        </fs-row>

        <fs-row>
          <fs-col md="4">
            <fs-form-checkbox v-model="formData.isHoursRequiredForSalary" class="mb-2">Hours Required for
              Salary</fs-form-checkbox>
            <fs-form-checkbox v-model="formData.isCertifiedPayroll" class="mb-2">Certified Payroll</fs-form-checkbox>
            <fs-form-checkbox v-model="formData.isFutaSutaExempt" class="mb-2">FUTA/SUTA Exempt</fs-form-checkbox>
          </fs-col>
        </fs-row>
      </fs-container>
    </VeeForm>
  </div>
</template>

<style scoped lang="scss">
:deep(.form-check-input:checked) {
  background-color: #03a9f4;
  border-color: #03a9f4;
}
</style>