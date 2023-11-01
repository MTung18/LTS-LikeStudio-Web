<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import type { Ref } from 'vue';
import { useOnboardingTaxWithholdingInfoHRStore } from '@/stores/onboardingTaxWithholdingInfoHRStore';
import { storeToRefs } from 'pinia';
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { FormField as FormFieldEnum } from '@/enums/FormField';
import FormFieldModel from '@/models/onboarding/FormField'
import { useLoadingStore } from '@/stores/loadingStore';
import { useBreakpoints } from "@/composables/useBreakpoints";
import { library } from '@fortawesome/fontawesome-svg-core';
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import {
  faPenToSquare,
  faArrowUpRightFromSquare,
  faUser,
  faCity,
  faFloppyDisk,
  faTrashCan,
  faPlus
} from "@fortawesome/pro-regular-svg-icons";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { faArrowUpFromBracket, faPaperclip } from "@fortawesome/pro-light-svg-icons";
import { useAlerts } from '@/composables/useAlerts';
import { OnboardingTaxWithholdingHRState, OnboardingTaxWithholdingHRLocal, LocalTaxAuthorityDropdown, TaxGroupDropdown, StateInfo } from '@/models/onboarding/OnboardingTaxWithholdingInfoHR';
import { cloneDeep } from 'lodash';
import { FormValidationResult } from 'vee-validate';
import { focusOnFirstError } from '@/functions/ValidationUtilityFunctions';
import { useEmployeeStore } from '@/stores/employeeStore';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { useOnboardingStore } from '@/stores/onboardingStore';
import TaxWithholdingInfoHRWaitingImage from '@/assets/images/tax_withholding_info_hr_waiting.svg';
import { useOnboardingEmployeeWithholdingCertificateStore } from '@/stores/onboardingEmployeeWithholdingCertificateStore'
import { FormField } from '@/enums/FormField';
import { IntegrationFunction } from '@/enums/IntegrationFunction';
import { useFoundationIntegrationFactory } from '@/factories/foundationIntegrationFactory';
import { TaxGroup } from '@/models/foundationIntegration/TaxGroup';
import { LocalTaxCode } from '@/models/foundationIntegration/LocalTaxCode';
import { fsCurrencyConfig } from '@/utilities/formatUtils';
library.add(faFloppyDisk, faCircleExclamation, faPaperclip, faPenToSquare, faArrowUpFromBracket, faArrowUpRightFromSquare, faUser, faCity, faTrashCan, faPlus);

const { notifyError, notifySuccess } = useAlerts();
// REFS
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

const formData = ref(initialState);

const payloadUploadForm: Ref<FormFieldModel> = ref(undefined);

const openSaveChangeModal = ref(false);
const router = useRouter();
const isForcePush = ref(false);
const toPath = ref("");
const isChange = ref(false);
const formHasValidated = ref(false);
const currentData: Ref<IFormData> = ref(null);
const observer = ref();
const isEmployeeFormSubmitted = ref(false);
const employeeStatus = ref(null);
const currentNavItem = ref(null);

// STORES
const { onboardingTaxWithholdingInfoHR, formattedStateOptions } = storeToRefs(useOnboardingTaxWithholdingInfoHRStore());
const { getEmployeeDetails } = storeToRefs(useEmployeeStore());
const { onboardingEmployeeWitholdingCertificate } = storeToRefs(useOnboardingEmployeeWithholdingCertificateStore());

const { 
  getOnboardingTaxWithHoldingInfoHR, 
  updateOnboardingTaxWithHoldingInfoHR, 
  stateFilingStatusOptions, 
  federalFilingStatusOptions, 
  federalOverrideOptions,
  nonFederalOverrideOptions, 
  addOnOptions, 
  yesNoOptions, 
  getStateTaxCodes 
} = useOnboardingTaxWithholdingInfoHRStore();

const { fetchEmployeeDetails } = useEmployeeStore();
const { getEmployeeFormSubmit, markOnboardingSidenavItemAsDone, getOnboardingSideNavItems } = useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { getOnboardingEmployeeWitholdingCertificate } = useOnboardingEmployeeWithholdingCertificateStore();
const localTaxAuthorityService = useFoundationIntegrationFactory(IntegrationFunction.LocalTaxAuthority)();
const taxGroupService = useFoundationIntegrationFactory(IntegrationFunction.TaxGroup)();

const route = useRoute();
const { setLoading } = useLoadingStore();
const { responsive } = useBreakpoints();

const dropdownDataLocality = ref([])
const localTaxAuthorityOptionsList = ref<Array<LocalTaxAuthorityDropdown[]>>([[]])

const localityList = computed(() => {
  return dropdownDataLocality.value.map((localTaxAuthority: LocalTaxCode) => ({ payrollStateTaxCode: localTaxAuthority.payrollStateTaxCode, id: localTaxAuthority.id, payrollLocalTaxCodeName: localTaxAuthority.payrollLocalTaxCodeName }))
})

const filterLocality = (index: number, stateId: number) => {
  localTaxAuthorityOptionsList.value[index] = localityList.value.filter((item: LocalTaxCode) => {
    return item.payrollStateTaxCode?.id === stateId
  })
  const stateListId = localTaxAuthorityOptionsList.value[index].map((item: LocalTaxCode) => item.payrollStateTaxCode.id)
    if (!stateListId.includes(stateId)){
    formData.value.locals[index].locality = '';
  }
}

const taxGroupOptions = ref<TaxGroupDropdown[]>([]);

// CONSTANTS
const employeeId = computed(
  () => route.params.id
);
const onboardingTaxWithholdingInfoHRFormId = FormFieldEnum.TaxWithholdingInfoHR;

const EMPLOYEE_STATUS_FORM = {
  quickHire: 1,
  onboardsAndNotSubmitted: 2,
  onboardsAndSubmitted: 3
}

// SUBMIT FORM
const handleSubmitForm = async (isNextForm: boolean) => {
  setLoading(true);
  try {
    const result: FormValidationResult<any> = await observer.value.validate();
    formHasValidated.value = true;
    if (!result.valid) {
      focusOnFirstError('observer');
      return;
    }
    formData.value.states.forEach((state) => {
      state.filingStatus = formData.value.states[0].filingStatus;
    });

    const mappedFieldModels = payloadUploadForm.value.fieldModels.map((fieldModel) => {
      const fieldValue = formData.value[fieldModel.fieldKey] || ""; // Set fieldValue to an empty string if fieldKey does not exist in data
      return { ...fieldModel, fieldValue };
    });
    payloadUploadForm.value.fieldModels = mappedFieldModels;

    let isDuplicateState = false
    if (formData.value.states.length > 1) {
      isDuplicateState = hasDuplicates(formData.value.states.map(x => x.stateInfo.value));
    }

    let isDuplicateLocality = false
    if (formData.value.locals.length > 1) {
      isDuplicateLocality = hasDuplicates(formData.value.locals.map(x => x.stateInfo.value));
    }

    if (isDuplicateState) {
      notifyError("Duplicated records of State");
      for (let index = 0; index < formData.value.states.length; index++) {
        observer.value.setFieldError("stateState" + index.toString(), "Duplicated records of State");
      }
    }

    if (isDuplicateLocality) {
      notifyError("Duplicated records of Locality");
      for (let index = 0; index < formData.value.locals.length; index++) {
        observer.value.setFieldError("localLocality" + index.toString(), "Duplicated records of Locality");
      }
    }

    if (isDuplicateState || isDuplicateLocality) {
      setTimeout(() => {
        focusOnFirstError('form');
      }, 200);
      return;
    }

    await updateOnboardingTaxWithHoldingInfoHR(Number(employeeId.value), payloadUploadForm.value);
    await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId.value));
    isChange.value = false
    if (isNextForm) {
      router.push({ name: 'onboardingVacation' })
    } else {
      notifySuccess("Information updated.", 1000);
    }
  } catch (error) {
    notifyError('There was something wrong saving Tax Withholding Info')
    console.debug(error);
  } finally {
    setLoading(false);
  }
}

// FUNCTIONS
onMounted(async () => {
  setLoading(true);
  try {
    const dropdownData = await Promise.all([taxGroupService.getData(true), localTaxAuthorityService.getData(true)]);
    dropdownDataLocality.value = dropdownData[1];
    localTaxAuthorityOptionsList.value.push(dropdownData[1].map((localTaxAuthority: LocalTaxCode) => ({ id: localTaxAuthority.id, payrollLocalTaxCodeName: localTaxAuthority.payrollLocalTaxCodeName })));
    taxGroupOptions.value = dropdownData[0].map((taxGroup: TaxGroup) => ({ id: taxGroup.id, payrollLocalTaxGroupName: taxGroup.payrollLocalTaxGroupName }));

    await fetchEmployeeDetails(Number(employeeId.value));
    await getOnboardingSideNavItems(Number(employeeId.value));
    await getStateTaxCodes();

    currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === 'onboardingTaxWithHoldingInfoHR'.trim().toLocaleLowerCase());

    isEmployeeFormSubmitted.value = await getEmployeeFormSubmit(Number(employeeId.value));

    // Check employee's status, if Quick Hire, return a blank form, if Onboards, return a waiting page if employee Onboarding ESS is not submitted, otherwise return a populated form.
    if (getEmployeeDetails.value.employeeStatusId === EmployeeStatusEnum.QuickHire) {
      employeeStatus.value = EMPLOYEE_STATUS_FORM.quickHire
    } else if (getEmployeeDetails.value.employeeStatusId === EmployeeStatusEnum.Onboard && isEmployeeFormSubmitted.value) {
      employeeStatus.value = EMPLOYEE_STATUS_FORM.onboardsAndSubmitted
    } else if (getEmployeeDetails.value.employeeStatusId === EmployeeStatusEnum.Onboard && !isEmployeeFormSubmitted.value) {
      employeeStatus.value = EMPLOYEE_STATUS_FORM.onboardsAndNotSubmitted
    }

    if (getEmployeeDetails.value.employeeStatusId === EmployeeStatusEnum.QuickHire) {
      await getOnboardingTaxWithHoldingInfoHR(Number(employeeId.value), onboardingTaxWithholdingInfoHRFormId);
      payloadUploadForm.value = onboardingTaxWithholdingInfoHR.value;
      const data = payloadUploadForm.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
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

      currentData.value = cloneDeep(data);
      formData.value = cloneDeep(data);
    }


    if (getEmployeeDetails.value.employeeStatusId === EmployeeStatusEnum.Onboard && isEmployeeFormSubmitted.value) {
      await getOnboardingEmployeeWitholdingCertificate(Number(employeeId.value), FormField.TaxWithholdingInfoEmployee);
      await getOnboardingTaxWithHoldingInfoHR(Number(employeeId.value), onboardingTaxWithholdingInfoHRFormId);
      payloadUploadForm.value = onboardingTaxWithholdingInfoHR.value;

      const data = payloadUploadForm.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
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

      formData.value = cloneDeep(data);
      currentData.value = cloneDeep(data);

      const mappedFieldModels = onboardingEmployeeWitholdingCertificate.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
          acc[fieldKey] = fieldValue;
        }
        return acc as any;
      }, {});

      if (!formData.value.federalFilingStatus) {
        formData.value.federalFilingStatus = federalFilingStatusOptions.find((option) => option.id == mappedFieldModels.filingStatusId)
        currentData.value.federalFilingStatus = federalFilingStatusOptions.find((option) => option.id == mappedFieldModels.filingStatusId)
      }

      if (!formData.value.federalIsMultipleJobsOrSpouseWorks) {
        formData.value.federalIsMultipleJobsOrSpouseWorks = mappedFieldModels.isTwoJobs || initialState.federalIsMultipleJobsOrSpouseWorks;
        currentData.value.federalIsMultipleJobsOrSpouseWorks = mappedFieldModels.isTwoJobs || initialState.federalIsMultipleJobsOrSpouseWorks;
      }

      if (!formData.value.federalClaimDependentAndOtherCredits) {
        formData.value.federalClaimDependentAndOtherCredits = mappedFieldModels.numberQualifyingChildren || initialState.federalClaimDependentAndOtherCredits;
        currentData.value.federalClaimDependentAndOtherCredits = mappedFieldModels.numberQualifyingChildren || initialState.federalClaimDependentAndOtherCredits;
      }

      if (!formData.value.federalOtherIncome) {
        formData.value.federalOtherIncome = mappedFieldModels.otherIncome || initialState.federalOtherIncome;
        currentData.value.federalOtherIncome = mappedFieldModels.otherIncome || initialState.federalOtherIncome;
      }

      if (!formData.value.federalDeductions) {
        formData.value.federalDeductions = mappedFieldModels.deductionsWorksheet || initialState.federalDeductions;
        currentData.value.federalDeductions = mappedFieldModels.deductionsWorksheet || initialState.federalDeductions;
      }

      if (!formData.value.federalExtraWithholding) {
        formData.value.federalExtraWithholding = mappedFieldModels.extraWithHolding || initialState.federalExtraWithholding;
        currentData.value.federalExtraWithholding = mappedFieldModels.extraWithHolding || initialState.federalExtraWithholding;
      }
    }

    setTimeout(() => {
      if (observer.value) {
        observer.value.setErrors([])
      }
    })

    isChange.value = false;
  } catch (error) {
    console.error(error);
    notifyError('There was an error getting Tax Withholding Info HR')
  } finally {
    setLoading(false);
  }
});

const handleStay = () => {
  openSaveChangeModal.value = false;
};
const handleLeavePage = () => {
  openSaveChangeModal.value = false;
  isForcePush.value = true;
  router.push(toPath.value);
};

const handleAddState = () => {
  const currentStateId = formData.value.states[formData.value.states.length - 1].stateId;
  const newState: OnboardingTaxWithholdingHRState = {
    ...initialState.states[0],
    stateId: currentStateId + 1,
  }
  formData.value.states.push(newState);
  nextTick(() => {
    const newStateElement: HTMLElement = document?.getElementById(`section_state_container-${newState.stateId}`) as HTMLElement;
    newStateElement && newStateElement?.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'nearest' })
  })
}

const handleAddLocal = () => {
  const currentLocalId = formData.value.locals[formData.value.locals.length - 1].localId;
  const newLocal: OnboardingTaxWithholdingHRLocal = {
    ...initialState.locals[0],
    localId: currentLocalId + 1,
  };
  localTaxAuthorityOptionsList.value.push([]);
  formData.value.locals.push(newLocal);
  nextTick(() => {
    const newLocalElement: HTMLElement = document?.getElementById(`section_local_container-${newLocal.localId}`) as HTMLElement;
    newLocalElement && newLocalElement?.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'nearest' })
  })
}

const handleDeleteLocal = (localId: number) => {
  if (!localId) return;

  const remainingLocals = formData.value.locals.filter((local) => local.localId !== localId);
  formData.value.locals = remainingLocals;
}

const handleDeleteState = (stateId: number) => {
  if (!stateId) return;

  const remainingStates = formData.value.states.filter((state) => state.stateId !== stateId);
  formData.value.states = remainingStates;
}

watch(() => formData.value, async (value) => {
  if (value) {
    if (!(JSON.stringify(currentData.value) === JSON.stringify(value))) {
      isChange.value = true
    } else {
      isChange.value = false
    }
  }
}, {
  deep: true,
  immediate: true
});

onBeforeRouteLeave((to, from, next) => {
  if (isForcePush.value) {
    next();
    return;
  }
  if (isChange.value) {
    openSaveChangeModal.value = true
    toPath.value = to.fullPath;
    next(false);
    return false;
  } else {
    next()
    return true
  }
});

function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}



</script>

<template>
  <div v-if="employeeStatus === EMPLOYEE_STATUS_FORM.onboardsAndNotSubmitted" class="d-flex flex-column h-100">
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
      <!-- <div v-if="false" class="d-flex flex-column w-100 h-100"> -->
        <fs-row align-v="center">
          <fs-col>
            <h2 class="hq-pg__title">
                Tax Withholding Info </h2>
          </fs-col>
        </fs-row>


    </fs-container>
    <fs-container class="flex-fill d-flex py-4" >
      <fs-row align-v="center" align-h="center" class="flex-fill">
        <fs-col cols="auto"  >
          <img :src="TaxWithholdingInfoHRWaitingImage" />
        </fs-col>        
      </fs-row>

    </fs-container>
</div>
<div v-else>
    <VeeForm @submit.prevent="handleSubmitForm(false)" ref="observer" id="observer" v-slot="{ meta }">
      <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
        <fs-row>
          <fs-col class="text-truncate">
            <h2 class="hq-pg__title">Tax Withholding Info</h2>
          </fs-col>
          <fs-col cols="auto">
            <fs-button :disabled="!isChange" type="submit" variant="outline-primary"
            @click.prevent="handleSubmitForm(false)">
            <font-awesome-icon :icon="['far', 'floppy-disk']" />
            <span v-if="!responsive.mobile">Save</span>
            </fs-button>
            <fs-button :disabled="!isChange" type="submit" variant="primary" @click.prevent="handleSubmitForm(true)">Save
              &#38; next</fs-button>
          </fs-col>
        </fs-row>
      </fs-container>
      <fs-container class="contain">
        <div class="tax-withholding-label text-cerulean" :style="{ fontWeight: 'bold', fontSize: '16px' }">Federal</div>
        <hr />
        <div :style="{ maxWidth: '700px' }">
          <fs-row class="mb-3">
            <fs-col md="3">
              <fs-form-radio disabled :checked="true">
                <span>2020 or later</span>
              </fs-form-radio>
            </fs-col>
            <fs-col>
              <fs-form-radio disabled>
                <span class="-mt-3">Pre-2020</span>
              </fs-form-radio>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col md="6" xs="12">
              <fs-input v-model="formData.federalFilingStatus" type="fsMultiselectList" labelId="prefixLabelId"
                typeaheadkey="name" typeaheadvalueattribute="id" name="prefix" :showClear="true"
                :typeaheaddata="federalFilingStatusOptions" autocomplete="donotfill" :dropdownSearchable="true"
                :formMeta="{ ...meta, validated: formHasValidated }" label="Filing Status" :required="true" />
            </fs-col>
            <fs-col md="6" xs="12" class="d-flex align-items-center">
              <VeeField name="federalIsMultipleJobsOrSpouseWorks" v-model="formData.federalIsMultipleJobsOrSpouseWorks">
                <fs-form-group class="form_group">
                  <fs-form-checkbox rules="required" v-model="formData.federalIsMultipleJobsOrSpouseWorks">
                    Multiple Jobs or Spouse Works
                  </fs-form-checkbox>
                </fs-form-group>
              </VeeField>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col md="6" xs="12">
              <fs-input type="fsCurrencyInput" v-model="formData.federalClaimDependentAndOtherCredits"
                name="claimDependentAndOtherCredits" defaultEmptyValue="" label="Claim Dependent and Other Credits"
                id="claimDependentAndOtherCredits" prepend="$"
                :formMeta="{ ...meta, validated: formHasValidated }" :config="fsCurrencyConfig" />
            </fs-col>
            <fs-col md="6" xs="12">
              <fs-input type="fsCurrencyInput" v-model="formData.federalOtherIncome" name="federalOtherIncome"
                :defaultEmptyValue="0" label="Other Income (not from jobs)" id="federalOtherIncome"
                prepend="$" :formMeta="{ ...meta, validated: formHasValidated }" :config="fsCurrencyConfig" />
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col xs="12" md="6">
              <fs-input type="fsCurrencyInput" v-model="formData.federalDeductions" name="federalDeductions"
                 label="Deductions" id="federalDeductions" prepend="$"
                :formMeta="{ ...meta, validated: formHasValidated }" :config="fsCurrencyConfig" />
            </fs-col>
            <fs-col xs="12" md="6">
              <fs-input type="fsCurrencyInput" v-model="formData.federalExtraWithholding" name="federalExtraWithholding"
                :defaultEmptyValue="0" label="Extra Withholding" id="federalExtraWithholding" prepend="$"
                :formMeta="{ ...meta, validated: formHasValidated }" :config="fsCurrencyConfig" />
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col xs="12" md="6">
              <div>
                <div class="d-flex">
                  <fs-input v-model="formData.federalOverride" type="fsMultiselectList" typeaheadkey="name"
                    typeaheadvalueattribute="id" name="label-input" :showClear="true"
                    :typeaheaddata="federalOverrideOptions" autocomplete="donotfill" :dropdownSearchable="true"
                    :formMeta="{ ...meta, validated: formHasValidated }" label="Override" :rules="{ required: true }"
                    :required="true" />
                </div>
              </div>
            </fs-col>
          </fs-row>
        </div>

        <!-- STATE SECTION -->
        <div class="mb-4">
          <div class="tax-withholding-label text-cerulean" :style="{ fontWeight: 'bold', fontSize: '16px' }">State</div>
          <hr />
          <div :style="{ maxWidth: '700px' }">
            <div v-if="formData.states.length === 1">
              <fs-row>
                <fs-col xs="12" md="6">
                  <!-- STATE -->
                  <fs-input v-model="formData.states[0].stateInfo" type="fsMultiselectList" id="stateState"
                    typeaheadvalueattribute="value" name="stateState" typeaheadkey="name"
                    :typeaheaddata="formattedStateOptions" :dropdownSearchable="true" :rules="{ required: true }"
                    :required="true" label="State" :showClear="true"
                    :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
                <fs-col xs="12" md="6">
                  <!-- FILING STATUS -->
                  <fs-input v-model="formData.states[0].filingStatus" type="fsMultiselectList" id="stateFillingStatus"
                    labelId="prefixLabelId" typeaheadkey="name" typeaheadvalueattribute="id" name="Filing Status"
                    :showClear="true" :typeaheaddata="stateFilingStatusOptions" autocomplete="donotfill"
                    :dropdownSearchable="true" :rules="{ required: true }" label="Filing Status" :required="true"
                    :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col xs="12" md="6">
                  <!-- EXEMPTIONS -->
                  <fs-input v-model="formData.states[0].exemptions" type="fsTextInput" input-type="number" name="stateExemptions"
                     label="Exemptions" :maxlength="3" id="stateExemptions" defaultValue="0"
                    :formMeta="{ ...meta, validated: formHasValidated }" 
                    :rules="{
                      between: {
                          min: 0,
                          max: 999,
                          maxMessage: 'Must be less than or equal to 999',
                          minMessage: 'Must be greater than or equal to 0'
                      },
                    }"
                    mask-format="###" :minvalue="0"
                    />
                </fs-col>
                <fs-col xs="12" md="6">
                  <!-- EXTRA STATE WITHHOLDING AMOUNT -->
                  <fs-input type="fsNumber" v-model="formData.states[0].extraStateWithholdingAmount"
                    name="stateExtraLocalWithholdingAmount" :defaultEmptyValue="0" label="Extra State Withholding Amount"
                    id="stateExtraLocalWithholdingAmount" prepend="$"
                    :formMeta="{ ...meta, validated: formHasValidated }" 
                    :rules="{
                          precisionAndScale: {
                              precision: 12,
                              scale: 2,
                              message: 'Can only contain 2 decimals',
                              precisionMesage: 'Allowed format is (12,2)XXXXXXXXXX.XX'
                          }
                      }"
                      :isDecimal="true" :allowedDigits="2" :minvalue="0"
                    />
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col xs="12" md="6">
                  <!-- EXTRA STATE WITHHOLDING PERCENT -->
                  <fs-input v-model="formData.states[0].extraStateWithholdingPercent" type="fsNumber"
                    name="stateExtraStateWithholdingPercent"  inputType="number"
                    :rules="{
                          between: {
                              min: 0.00,
                              max: 100.00,
                              maxMessage: 'Must be less than or equal to 100.00%',
                              minMessage: 'Must be greater than or equal to 0.00%'
                          },
                          precisionAndScale: {
                              precision: 5,
                              scale: 2,
                              message: 'Can only contain 2 decimals',
                              precisionMesage: 'Allowed format is (3,2)XXX.XX'
                          }
                      }"
                      :minvalue="0" :step="0.01" append="%"
                      :isDecimal="true" :allowedDigits="2" 
                    label="Extra State Withholding Percent" id="stateExtraStateWithholdingPercent"
                    :required="false" :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
                <fs-col xs="12" md="6">
                  <fs-input :rules="{ required: true }" v-model="formData.states[0].override" type="fsMultiselectList"
                    id="stateOverride" typeaheadkey="name" typeaheadvalueattribute="id" name="stateOverride"
                    :showClear="true" :typeaheaddata="nonFederalOverrideOptions" autocomplete="donotfill"
                    :dropdownSearchable="true" :required="true" label="Override"
                    :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col xs="12" md="6">
                  <fs-input v-model="formData.states[0].addOn" type="fsMultiselectList" id="prefixId"
                    labelId="prefixLabelId" typeaheadkey="name" typeaheadvalueattribute="id" name="stateAddOn"
                    :showClear="true" :typeaheaddata="addOnOptions" autocomplete="donotfill" :dropdownSearchable="true"
                    label="Add-on" :rules="{ required: true }" :required="true"
                    :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
                <fs-col xs="12" md="6">
                  <fs-input :rules="{ required: true }" :required="true" v-model="formData.states[0].residence"
                    type="fsMultiselectList" id="prefixId" labelId="prefixLabelId" typeaheadkey="name"
                    typeaheadvalueattribute="id" name="stateResidence" :showClear="true" :typeaheaddata="yesNoOptions"
                    autocomplete="donotfill" :dropdownSearchable="true" label="Residence"
                    :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col xs="12" md="6">
                  <fs-input :rules="{ required: true }" :required="true" v-model="formData.states[0].stLocMakeup"
                    type="fsMultiselectList" id="prefixId" labelId="prefixLabelId" typeaheadkey="name"
                    typeaheadvalueattribute="id" name="stateStLocMakeup" :showClear="true" :typeaheaddata="yesNoOptions"
                    autocomplete="donotfill" :dropdownSearchable="true" label="St-Loc Makeup"
                    :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
              </fs-row>
            </div>
            <div v-else>
              <div v-for="state in formData.states" :key="state.stateId" class="section_container"
                :id="`section_state_container-${state.stateId}`">

                <fs-row>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="state.stateInfo" type="fsMultiselectList" id="stateState"
                      typeaheadvalueattribute="value" typeaheadkey="name" :name="'stateState' + state.stateId"
                      :typeaheaddata="formattedStateOptions" :dropdownSearchable="true" :rules="{ required: true }"
                      :required="true" label="State" :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="formData.states[0].filingStatus" type="fsMultiselectList" id="stateFillingStatus"
                      labelId="prefixLabelId" typeaheadkey="name" typeaheadvalueattribute="id"
                      :name="'Filing Status' + state.stateId" :showClear="true" :typeaheaddata="stateFilingStatusOptions"
                      autocomplete="donotfill" :dropdownSearchable="true" :rules="{ required: true }"
                      label="Filing Status" :required="true" :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                </fs-row>
                <fs-row>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="state.exemptions" type="fsTextInput" :name="`stateExemptions${state.stateId}`"
                       label="Exemptions" :maxlength="3" id="stateExemptions" input-type="number"
                      :formMeta="{ ...meta, validated: formHasValidated }" defaultValue="0" 
                      :rules="{
                        between: {
                            min: 0,
                            max: 999,
                            maxMessage: 'Must be less than or equal to 999',
                            minMessage: 'Must be greater than or equal to 0'
                        },
                      }"
                      mask-format="###" :minvalue="0"
                      />
                  </fs-col>
                  <fs-col xs="12" md="6">
                    <!-- EXTRA  -->
                    <fs-input type="fsNumber" v-model="state.extraStateWithholdingAmount"
                      :name="`extraStateWithholdingAmount${state.stateId}`" :defaultEmptyValue="0"
                      label="Extra State Withholding Amount" id="extraStateWithholdingAmount" prepend="$"
                      :formMeta="{ ...meta, validated: formHasValidated }" defaultValue="0"
                      :rules="{
                          precisionAndScale: {
                              precision: 12,
                              scale: 2,
                              message: 'Can only contain 2 decimals',
                              precisionMesage: 'Allowed format is (12,2)XXXXXXXXXX.XX'
                          }
                      }"
                      :isDecimal="true" :allowedDigits="2" :minvalue="0"
                      />
                  </fs-col>
                </fs-row>
                <fs-row>
                  <fs-col xs="12" md="6">
                    <!-- EXTRA STATE WITHHOLDING PERCENT -->
                    <fs-input v-model="state.extraStateWithholdingPercent" type="fsNumber"
                      :name="`extraStateWithholdingPercent${state.stateId}`" inputType="number"
                      :rules="{
                          between: {
                              min: 0.00,
                              max: 100.00,
                              maxMessage: 'Must be less than or equal to 100.00%',
                              minMessage: 'Must be greater than or equal to 0.00%'
                          },
                          precisionAndScale: {
                              precision: 5,
                              scale: 2,
                              message: 'Can only contain 2 decimals',
                              precisionMesage: 'Allowed format is (3,2)XXX.XX'
                          }
                      }"
                      label="Extra State Withholding Percent" id="extraStateWithholdingPercent"
                      :required="false" :isDecimal="true" :allowedDigits="2"
                      :minvalue="0" :step="0.01" append="%" :formMeta="{ ...meta, validated: formHasValidated }"
                      defaultValue="0" mask-format="###,###" />
                  </fs-col>
                  <fs-col xs="12" md="6">
                    <fs-input :rules="{ required: true }" v-model="state.override" type="fsMultiselectList"
                      id="stateOverride" typeaheadkey="name" typeaheadvalueattribute="id"
                      :name="`stateOverride${state.stateId}`" :showClear="true" :typeaheaddata="nonFederalOverrideOptions"
                      autocomplete="donotfill" :dropdownSearchable="true" :required="true" label="Override"
                      :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                </fs-row>
                <fs-row>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="state.addOn" type="fsMultiselectList" id="prefixId" labelId="prefixLabelId"
                      typeaheadkey="name" typeaheadvalueattribute="id" :name="`stateAddOn${state.stateId}`"
                      :showClear="true" :typeaheaddata="addOnOptions" autocomplete="donotfill" :dropdownSearchable="true"
                      label="Add-on" :rules="{ required: true }" :required="true"
                      :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                  <fs-col xs="12" md="6">
                    <fs-input :rules="{ required: true }" :required="true" v-model="state.residence"
                      type="fsMultiselectList" id="prefixId" labelId="prefixLabelId" typeaheadkey="name"
                      typeaheadvalueattribute="id" :name="`stateResidence${state.stateId}`" :showClear="true"
                      :typeaheaddata="yesNoOptions" autocomplete="donotfill" :dropdownSearchable="true" label="Residence"
                      :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                </fs-row>
                <fs-row>
                  <fs-col xs="12" md="6">
                    <fs-input :rules="{ required: true }" :required="true" v-model="state.stLocMakeup"
                      type="fsMultiselectList" id="prefixId" labelId="prefixLabelId" typeaheadkey="name"
                      typeaheadvalueattribute="id" :name="`stateStLocMakeup${state.stateId}`" :showClear="true"
                      :typeaheaddata="yesNoOptions" autocomplete="donotfill" :dropdownSearchable="true"
                      label="St-Loc Makeup" :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                </fs-row>
                <fs-link class="text-danger text-decoration-none" @click="handleDeleteState(state.stateId)">
                  Delete State
                </fs-link>
              </div>
            </div>
            <fs-button variant="outline-primary" class="d-flex align-items-center gap-2" @click="handleAddState">
              <font-awesome-icon :icon="['far', 'plus']" size="lg" />
              Add State
            </fs-button>
          </div>
        </div>

        <div class="mb-4">
          <div class="tax-withholding-label text-cerulean" :style="{ fontWeight: 'bold', fontSize: '16px' }">Local</div>
          <hr />
          <div :style="{ maxWidth: '700px' }">
            <div v-if="formData.locals.length === 1">
              <fs-row>
                <fs-col xs="12" md="6">
                  <fs-input v-model="formData.locals[0].stateInfo" type="fsMultiselectList" id="localState"
                    typeaheadvalueattribute="value" name="localState" typeaheadkey="name" :required="true"
                    :rules="{ required: true }" :typeaheaddata="formattedStateOptions" :dropdownSearchable="true"
                    label="State" :formMeta="{ ...meta, validated: formHasValidated }" :showClear="true"
                    @select="(item: StateInfo) => filterLocality(0, item.value)" />
                </fs-col>
                <fs-col xs="12" md="6">
                  <fs-input v-model="formData.locals[0].locality" type="fsMultiselectList" :required="true"
                    :rules="{ required: true }" typeaheadkey="payrollLocalTaxCodeName" typeaheadvalueattribute="id"
                    name="localLocality" :showClear="true" :typeaheaddata="localTaxAuthorityOptionsList[0]"
                    autocomplete="donotfill" :dropdownSearchable="true" label="Locality"
                    :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col xs="12" md="6">
                  <fs-input v-model="formData.locals[0].exemptions" type="fsTextInput" name="localExemptions"
                    label="Exemptions" maxlength="3" id="localExemptions" defaultValue="0" input-type="number"
                    :formMeta="{ ...meta, validated: formHasValidated }" 
                    :rules="{
                      between: {
                          min: 0,
                          max: 999,
                          maxMessage: 'Must be less than or equal to 999',
                          minMessage: 'Must be greater than or equal to 0'
                      },
                    }"
                    mask-format="###" :minvalue="0"
                    />
                </fs-col>
                <fs-col xs="12" md="6">
                  <fs-input type="fsNumber" input-type="number" v-model="formData.locals[0].extraLocalWithholdingAmount"
                    name="extraLocalWithholdingAmount" label="Extra Local Withholding Amount"
                    id="extraLocalWithholdingAmount" prepend="$" :minvalue="0"
                    :formMeta="{ ...meta, validated: formHasValidated }"
                    :rules="{
                          precisionAndScale: {
                              precision: 12,
                              scale: 2,
                              message: 'Can only contain 2 decimals',
                              precisionMesage: 'Allowed format is (12,2)XXXXXXXXXX.XX'
                          }
                      }"
                      :isDecimal="true" :allowedDigits="2"
                    />
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col xs="12" md="6">
                  <fs-input v-model="formData.locals[0].extraLocalWithholdingPercent" type="fsNumber"
                    name="extraLocalWithholdingPercent"  label="Extra Local Withholding Percent"
                    id="extraLocalWithholdingPercent" :required="false" input-type="number"
                    :formMeta="{ ...meta, validated: formHasValidated }" mask-format="###,##"
                    :rules="{
                          between: {
                              min: 0.00,
                              max: 100.00,
                              maxMessage: 'Must be less than or equal to 100.00%',
                              minMessage: 'Must be greater than or equal to 0.00%'
                          },
                          precisionAndScale: {
                              precision: 5,
                              scale: 2,
                              message: 'Can only contain 2 decimals',
                              precisionMesage: 'Allowed format is (3,2)XXX.XX'
                          }
                      }"
                      :minvalue="0" :step="0.01" append="%"
                      :isDecimal="true" :allowedDigits="2"
                    />
                </fs-col>
                <fs-col xs="12" md="6">
                  <fs-input v-model="formData.locals[0].override" type="fsMultiselectList" id="localOverride"
                    :required="true" :rules="{ required: true }" typeaheadkey="name" typeaheadvalueattribute="id"
                    name="localOverride" :showClear="true" :typeaheaddata="nonFederalOverrideOptions"
                    autocomplete="donotfill" :dropdownSearchable="true" label="Override"
                    :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col xs="12" md="6">
                  <fs-input v-model="formData.locals[0].addOn" type="fsMultiselectList" id="prefixId" :required="true"
                    :rules="{ required: true }" labelId="prefixLabelId" typeaheadkey="name" typeaheadvalueattribute="id"
                    name="localAddOn" :showClear="true" :typeaheaddata="addOnOptions" autocomplete="donotfill"
                    :dropdownSearchable="true" label="Add-on" :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
                <fs-col xs="12" md="6">
                  <fs-input v-model="formData.locals[0].residence" type="fsMultiselectList" id="prefixId" :required="true"
                    :rules="{ required: true }" labelId="prefixLabelId" typeaheadkey="name" typeaheadvalueattribute="id"
                    name="localResidence" :showClear="true" :typeaheaddata="yesNoOptions" autocomplete="donotfill"
                    :dropdownSearchable="true" label="Residence" :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
              </fs-row>
            </div>

            <div v-else>
              <div v-for="local, index in formData.locals" :key="local.localId" class="section_container"
                :id="`section_local_container-${local.localId}`">

                <fs-row>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="local.stateInfo" type="fsMultiselectList" id="localState" :required="true"
                      :rules="{ required: true }" typeaheadvalueattribute="value" typeaheadkey="name"
                      :name="`localState${local.localId}`" :typeaheaddata="formattedStateOptions"
                      :dropdownSearchable="true" label="State" :formMeta="{ ...meta, validated: formHasValidated }"
                      @select="(item: StateInfo) => filterLocality(index, item.value)" />
                  </fs-col>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="local.locality" type="fsMultiselectList" typeaheadkey="payrollLocalTaxCodeName"
                      :required="true" :rules="{ required: true }" typeaheadvalueattribute="id"
                      :name="`localLocality${local.localId}`" :showClear="true"
                      :typeaheaddata="localTaxAuthorityOptionsList[index]" autocomplete="donotfill"
                      :dropdownSearchable="true" label="Locality" :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                </fs-row>
                <fs-row>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="local.exemptions" type="fsTextInput" input-type="number"  :name="`localExemptions${local.localId}`"
                       label="Exemptions" defaultValue="0" :maxlength="3" id="localExemptions"
                      :formMeta="{ ...meta, validated: formHasValidated }" 
                      :rules="{
                        between: {
                            min: 0,
                            max: 999,
                            maxMessage: 'Must be less than or equal to 999',
                            minMessage: 'Must be greater than or equal to 0'
                        },
                      }"
                      mask-format="###" :minvalue="0"
                      />
                  </fs-col>
                  <fs-col xs="12" md="6">
                    <fs-input type="fsNumber" input-type="number" v-model="local.extraLocalWithholdingAmount"
                      :name="`extraLocalWithholdingAmount${local.localId}`" 
                      label="Extra Local Withholding Amount" id="extraLocalWithholdingAmount" prepend="$"
                      :formMeta="{ ...meta, validated: formHasValidated }" 
                      :rules="{
                          precisionAndScale: {
                              precision: 12,
                              scale: 2,
                              message: 'Can only contain 2 decimals',
                              precisionMesage: 'Allowed format is (12,2)XXXXXXXXXX.XX'
                          }
                      }"
                      :isDecimal="true" :allowedDigits="2" :minvalue="0"
                      />
                  </fs-col>
                </fs-row>
                <fs-row>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="local.extraLocalWithholdingPercent" type="fsNumber"
                      :name="`extraLocalWithholdingPercent${local.localId}`" 
                      label="Extra Local Withholding Percent" id="extraLocalWithholdingPercent"
                      :required="false" input-type="number" :formMeta="{ ...meta, validated: formHasValidated }"
                      mask-format="###,##" 
                      :rules="{
                          between: {
                              min: 0.00,
                              max: 100.00,
                              maxMessage: 'Must be less than or equal to 100.00%',
                              minMessage: 'Must be greater than or equal to 0.00%'
                          },
                          precisionAndScale: {
                              precision: 5,
                              scale: 2,
                              message: 'Can only contain 2 decimals',
                              precisionMesage: 'Allowed format is (3,2)XXX.XX'
                          }
                      }"
                      :minvalue="0" :step="0.01" append="%"
                      :isDecimal="true" :allowedDigits="2"
                      />
                  </fs-col>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="local.override" type="fsMultiselectList" id="localOverride" typeaheadkey="name"
                      :required="true" :rules="{ required: true }" typeaheadvalueattribute="id"
                      :name="`localOverride${local.localId}`" :showClear="true" :typeaheaddata="nonFederalOverrideOptions"
                      autocomplete="donotfill" :dropdownSearchable="true" label="Override"
                      :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                </fs-row>
                <fs-row>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="local.addOn" type="fsMultiselectList" id="prefixId" labelId="prefixLabelId"
                      :required="true" :rules="{ required: true }" typeaheadkey="name" typeaheadvalueattribute="id"
                      :name="`localAddOn${local.localId}`" :showClear="true" :typeaheaddata="addOnOptions"
                      autocomplete="donotfill" :dropdownSearchable="true" label="Add-on"
                      :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                  <fs-col xs="12" md="6">
                    <fs-input v-model="local.residence" type="fsMultiselectList" id="prefixId" labelId="prefixLabelId"
                      :required="true" :rules="{ required: true }" typeaheadkey="name" typeaheadvalueattribute="id"
                      :name="`localResidence${local.localId}`" :showClear="true" :typeaheaddata="yesNoOptions"
                      autocomplete="donotfill" :dropdownSearchable="true" label="Residence"
                      :formMeta="{ ...meta, validated: formHasValidated }" />
                  </fs-col>
                </fs-row>
                <fs-link class="text-danger text-decoration-none" @click="handleDeleteLocal(local.localId)">
                  Delete Local
                </fs-link>
              </div>
            </div>
            <fs-button variant="outline-primary" class="d-flex align-items-center gap-2" @click="handleAddLocal">
              <font-awesome-icon :icon="['far', 'plus']" size="lg" />
              Add Local
            </fs-button>
          </div>


        </div>

        <div class="mb-4">
          <div class="tax-withholding-label text-cerulean" :style="{ fontWeight: 'bold', fontSize: '16px' }">Other</div>
          <hr />
          <div :style="{ maxWidth: '700px' }">
            <fs-row class="align-items-center">
              <fs-col md="6" xs="12">
                <fs-input v-model="formData.otherPayrollTaxGroup" type="fsMultiselectList" id="prefixId"
                  labelId="prefixLabelId" typeaheadkey="payrollLocalTaxGroupName" typeaheadvalueattribute="id"
                  name="otherPayrollTaxGroup" :showClear="true" :typeaheaddata="taxGroupOptions" autocomplete="donotfill"
                  :dropdownSearchable="true" label="Payroll Tax Group"
                  :formMeta="{ ...meta, validated: formHasValidated }" />
              </fs-col>
              <fs-col ms="6" xs="12">
                <fs-form-checkbox v-model="formData.otherIsResidence" name="otherIsResidence">
                  Residence
                </fs-form-checkbox>
              </fs-col>
            </fs-row>
          </div>
        </div>
      </fs-container>
    </VeeForm>

    <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved Changes" okText="YES, LEAVE"
      okTextVariant="danger" cancelText="STAY" cancelBtnVariant="light" @close="handleStay" @ok="handleLeavePage">
      <template #content>
        <span class="d-flex">
          <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
          <div style="font-size: 14px">
            <p>Are you sure you want to leave this page?</p>
            <p>You have unsaved changes, your data will be lost.</p>
          </div>
        </span>
      </template>
    </dark-theme-modal>
  </div>
</template>

<style lang="scss" scoped>
.header {
  border-bottom: 1px solid #e1e4e8;
}

.sticky-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: #FFFFFF;

  &.scrolled {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
}

.form-check-label {
  padding-top: 0.35em;
}

.form_group {
  margin-bottom: 0px;

  .form_label {
    display: flex;
  }

  label {
    color: #15181c;
    transition: all 0.1s linear;
    font-size: 14px;
    font-weight: bold;

    border-radius: 3px;
    line-height: 1;
    display: flex;
    white-space: nowrap;
    margin-bottom: 4px;
  }

  :deep(svg) {
    color: #fc5555;
    font-size: 11px;
    margin-left: 3px;
    font-size: 60%;
    margin-bottom: 2px;
    height: 1em;
  }
}

.text-box {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  color: #212529;
  text-align: center;
  white-space: nowrap;
}

.add-prepend {
  .box-input {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    height: 2.85em;
    margin-top: 1.15em;
    color: #212529;
    text-align: center;
    white-space: nowrap;
    background-color: #e9ecef;
    border: 1px solid #a7b0bc;
    border-radius: 4px 0 0 4px;
  }

  .multiselect__tags {
    border-radius: 0 4px 4px 0 !important;
  }
}

.add-prepend-text {
  .box-input {
    display: flex;
    align-items: center;
    padding: 0.375rem 0.75rem;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    height: 2.85em;
    margin-top: 1.15em;
    color: #212529;
    text-align: center;
    white-space: nowrap;
    background-color: #e9ecef;
    border: 1px solid #a7b0bc;
    border-radius: 4px 0 0 4px;
  }

  .form-control {
    border-radius: 0 4px 4px 0 !important;
    border: 0 1px 1px 1px solid #a7b0bc !important;
  }
}

.form-check-label {
  margin-top: -4px;
}

.form_input {
  min-height: 40px;
  margin-top: 0;
  height: unset;
  font-size: unset;
}

.label-input {
  color: #15181c;
  transition: all 0.1s linear;
  font-size: 0.75rem;
  font-weight: bold;
  margin-bottom: -1em;
  width: 100%;
  border-radius: 3px;
  line-height: 1;
  display: flex;
  white-space: nowrap
}

.form_error-message {
  color: #fc5555;
  font-size: 12px;
  font-weight: bold;
}

.-mt-3 {
  margin-top: -10px;
}

.icon-start {
  color: #FB4040;
  margin-left: 5px;
  font-size: 18px;
}

.section_container {
  border: 1px solid #ddd;
  padding: 20px;
  border-radius: 5px;
  background-color: #e9ecef;
  margin-bottom: 20px;
}
</style>
