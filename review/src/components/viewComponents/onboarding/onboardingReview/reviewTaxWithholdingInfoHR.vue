<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from "vue-router"
import { useFoundationIntegrationFactory } from '@/factories/foundationIntegrationFactory';
import { FormField } from '@/enums/FormField';
import { useLoadingStore } from '@/stores/loadingStore';
import { useOnboardingTaxWithholdingInfoHRStore } from '@/stores/onboardingTaxWithholdingInfoHRStore';
import { IntegrationFunction } from '@/enums/IntegrationFunction';
import { LocalTaxAuthorityDropdown, OnboardingTaxWithholdingHRLocal, OnboardingTaxWithholdingHRState, TaxGroupDropdown } from '@/models/onboarding/OnboardingTaxWithholdingInfoHR';
import { storeToRefs } from 'pinia';
import { cloneDeep } from 'lodash';
import { formatCurrency } from '@/utilities/formatUtils';
import { TaxGroup } from '@/models/foundationIntegration/TaxGroup';
import { LocalTaxCode } from '@/models/foundationIntegration/LocalTaxCode';

const route = useRoute();
const { setLoading } = useLoadingStore();
const { getOnboardingTaxWithHoldingInfoHR, stateFilingStatusOptions, federalFilingStatusOptions, federalOverrideOptions, addOnOptions, yesNoOptions, getStateTaxCodes } = useOnboardingTaxWithholdingInfoHRStore();
const { onboardingTaxWithholdingInfoHR, formattedStateOptions } = storeToRefs(useOnboardingTaxWithholdingInfoHRStore());
const localTaxAuthorityService = useFoundationIntegrationFactory(IntegrationFunction.LocalTaxAuthority)();
const taxGroupService = useFoundationIntegrationFactory(IntegrationFunction.TaxGroup)();
const localTaxAuthorityOptions = ref<LocalTaxAuthorityDropdown[]>([]);
const taxGroupOptions = ref<TaxGroupDropdown[]>([]);

interface IOption {
  id: number,
  name: string
}

interface IFormData {
  federalFilingStatus: IOption,
  federalIsMultipleJobsOrSpouseWorks: boolean,
  federalClaimDependentAndOtherCredits: number | string,
  federalOtherIncome: number | string,
  federalDeductions: number | string,
  federalExtraWithholding: number | string,
  federalOverride: number,
  states: OnboardingTaxWithholdingHRState[],
  locals: OnboardingTaxWithholdingHRLocal[],
  otherPayrollTaxGroup: number,
  otherIsResidence: boolean,
}

const initialState: IFormData = {
  federalFilingStatus: null,
  federalIsMultipleJobsOrSpouseWorks: false,
  federalClaimDependentAndOtherCredits: 0,
  federalOtherIncome: 0,
  federalDeductions: 0,
  federalExtraWithholding: 0,
  federalOverride: 0,
  states: [
    {
      stateId: 1,
      stateInfo: null,
      filingStatus: null,
      exemptions: 0,
      extraStateWithholdingAmount: 0,
      extraStateWithholdingPercent: 0,
      override: null,
      addOn: null,
      residence: null,
      stLocMakeup: null
    }
  ],
  locals: [
    {
      localId: 1,
      stateInfo: null,
      locality: null,
      exemptions: 0,
      extraLocalWithholdingAmount: 0,
      extraLocalWithholdingPercent: 0,
      override: null,
      addOn: null,
      residence: null
    }
  ],
  otherPayrollTaxGroup: null,
  otherIsResidence: false
};

const taxWithholdingInfoHRData = ref(initialState);

const employeeId = computed(
  () => route.params.id
);

const formatOption = (value: any, options: any) => {
  if (!value) return;
  return options.find((option) => option.id === value.id).name;
}

const formatStateValue = (value: any) => {
  if (!value) return;
  return formattedStateOptions.value.find((option) => option.value === value.value).name;
}

const formatLocalityValue = (value: any) => {
  if (!value) return;
  return localTaxAuthorityOptions.value.find((option) => option.id === value.id).payrollLocalTaxCodeName;
}

const formatLocalTaxGroupValue = (value: any) => {
  if (!value) return;
  return taxGroupOptions.value.find((option) => option.id === value.id).payrollLocalTaxGroupName;
}

onMounted(async () => {
  setLoading(true);
  try {
    const dropdownData = await Promise.all([taxGroupService.getData(true), localTaxAuthorityService.getData(true)]);
    taxGroupOptions.value = dropdownData[0].map((taxGroup: TaxGroup) => ({ id: taxGroup.id, payrollLocalTaxGroupName: taxGroup.payrollLocalTaxGroupName }));
    localTaxAuthorityOptions.value = dropdownData[1].map((localTaxAuthority: LocalTaxCode) => ({ id: localTaxAuthority.id, payrollLocalTaxCodeName: localTaxAuthority.payrollLocalTaxCodeName }))
    await getStateTaxCodes();
    if (!onboardingTaxWithholdingInfoHR.value) {
      await getOnboardingTaxWithHoldingInfoHR(Number(employeeId.value), FormField.TaxWithholdingInfoHR);
    }
    const data = onboardingTaxWithholdingInfoHR.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
      if (fieldValue !== undefined) {
        acc[fieldKey] = fieldValue;
      }
      if (fieldKey === 'states' && fieldValue === "") {
        acc[fieldKey] = [
          ...initialState.states
        ]
      }
      if (fieldKey === 'locals' && fieldValue === "") {
        acc[fieldKey] = [
          ...initialState.locals
        ]
      }
      return acc as any;
    }, {});

    taxWithholdingInfoHRData.value = cloneDeep(data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
})
</script>
<template>
  <fs-container fluid class="p-2">
    <section class="mb-4">
      <div class="text-task-cyan title">
        Federal
      </div>
      <hr />
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold ">
          Filing Status
        </fs-col>
        <fs-col cols="6">
          {{ taxWithholdingInfoHRData?.federalFilingStatus?.name }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold ">
          Multiple Jobs or Spouse Works
        </fs-col>
        <fs-col cols="6">
          {{ taxWithholdingInfoHRData.federalIsMultipleJobsOrSpouseWorks ? 'Yes' : 'No' }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold ">
          Claim Dependent and Other Credits
        </fs-col>
        <fs-col cols="6">
          {{ formatCurrency(taxWithholdingInfoHRData.federalClaimDependentAndOtherCredits) }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold ">
          Other income (not from jobs)
        </fs-col>
        <fs-col cols="6">
          {{ formatCurrency(taxWithholdingInfoHRData.federalOtherIncome) }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold ">
          Deduction
        </fs-col>
        <fs-col cols="6">
          {{ formatCurrency(taxWithholdingInfoHRData.federalDeductions) }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold ">
          Extra Withholding
        </fs-col>
        <fs-col cols="6">
          {{ formatCurrency(taxWithholdingInfoHRData.federalExtraWithholding) }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold ">
          Override
        </fs-col>
        <fs-col cols="6">
          {{ formatOption(taxWithholdingInfoHRData.federalOverride, federalOverrideOptions) }}
        </fs-col>
      </fs-row>
    </section>
    <section>
      <div class="text-task-cyan title">
        State
      </div>
      <hr />
      <div v-for="state in taxWithholdingInfoHRData.states" :key="state.stateId" class="mb-4">
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">State</fs-col>
          <fs-col cols="6">
            {{ formatStateValue(state.stateInfo) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Filing Status
          </fs-col>
          <fs-col cols="6">
            {{ formatOption(state.filingStatus, stateFilingStatusOptions) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Exemptions
          </fs-col>
          <fs-col cols="6">
            {{ formatCurrency(state.exemptions) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Extra State Withholding Amount
          </fs-col>
          <fs-col cols="6">
            {{ formatCurrency(state.extraStateWithholdingAmount) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Extra State Withholding Percent
          </fs-col>
          <fs-col cols="6">
            {{ state.extraStateWithholdingPercent }} %
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Override
          </fs-col>
          <fs-col cols="6">
            {{ formatOption(state.override, federalOverrideOptions) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Add-on
          </fs-col>
          <fs-col cols="6">
            {{ formatOption(state.addOn, addOnOptions) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Residence
          </fs-col>
          <fs-col cols="6">
            {{ formatOption(state.residence, yesNoOptions) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            St-Loc Makeup
          </fs-col>
          <fs-col cols="6">
            {{ formatOption(state.stLocMakeup, yesNoOptions) }}
          </fs-col>
        </fs-row>
      </div>
    </section>
    <section>
      <div class="text-task-cyan title">
        Local
      </div>
      <hr />
      <div v-for="local in taxWithholdingInfoHRData.locals" :key="local.localId" class="mb-4">
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">State</fs-col>
          <fs-col cols="6">
            {{ formatStateValue(local.stateInfo) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Locality
          </fs-col>
          <fs-col cols="6">
            {{ formatLocalityValue(local.locality) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Exemptions
          </fs-col>
          <fs-col cols="6">
            {{ formatCurrency(local.exemptions) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Extra Local Withholding Amount
          </fs-col>
          <fs-col cols="6">
            {{ formatCurrency(local.extraLocalWithholdingAmount) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Extra Local Withholding Percent
          </fs-col>
          <fs-col cols="6">
            {{ local.extraLocalWithholdingPercent }} %
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Override
          </fs-col>
          <fs-col cols="6">
            {{ formatOption(local.override, federalOverrideOptions) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Add-on
          </fs-col>
          <fs-col cols="6">
            {{ formatOption(local.addOn, addOnOptions) }}
          </fs-col>
        </fs-row>
        <fs-row class="mb-2">
          <fs-col cols="6" class="text-bold">
            Residence
          </fs-col>
          <fs-col cols="6">
            {{ formatOption(local.residence, yesNoOptions) }}
          </fs-col>
        </fs-row>
      </div>
    </section>
    <section>
      <div class="text-task-cyan title">
        Other
      </div>
      <hr />
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold">
          Payroll Tax Group
        </fs-col>
        <fs-col cols="6">
          {{ formatLocalTaxGroupValue(taxWithholdingInfoHRData.otherPayrollTaxGroup) }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="6" class="text-bold">
          Residence
        </fs-col>
        <fs-col cols="6">
          {{ taxWithholdingInfoHRData.otherIsResidence ? 'Yes' : 'No' }}
        </fs-col>
      </fs-row>
    </section>
  </fs-container>
</template>

<style scoped lang="scss">
.title {
  font-weight: bold;
  font-size: 16px;
}

.text-bold {
  font-weight: bold;
}
</style>