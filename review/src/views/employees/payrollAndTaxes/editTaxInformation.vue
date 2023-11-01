<script setup lang="ts">
import CommonModal from '@/components/common/commonModal.vue';
import EmployeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';
import { useAlerts } from "@/composables/useAlerts";
import { ADD_ON_OPTIONS, FEDERAL_FILING_STATUS_OPTIONS, OVERRIDE_OPTIONS, STATE_FILING_STATUS_OPTIONS, YES_NO_OPTIONS } from '@/constants/taxInformation';
import DropdownOption from '@/models/DropdownOptions';
import loadingWave from '@/assets/images/Loading_Wave.svg';
import {
  EmployeePayrollLocalTaxCodeDetails,
  EmployeePayrollStateTaxCodeDetails,
  EmployeeTaxInformation,
  FederalFilingStatus,
  PayrollTaxAddOn,
  PayrollTaxOverride,
  StateFilingStatus
} from '@/models/employees/EmployeeTaxInformation';
import { LocalTaxCode } from '@/models/foundationIntegration/LocalTaxCode';
import PayrollStateTaxCode from '@/models/foundationIntegration/PayrollStateTaxCode';
import { useEmployeeTaxInformationStore } from '@/stores/employeeTaxInformationStore';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { cloneDeep } from 'lodash';
import { storeToRefs } from 'pinia';
import { FormContext } from 'vee-validate';
import { computed, nextTick, onBeforeMount, ref, ComputedRef, Ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { DocumentCategory as DocumentCategoryEnum } from "@/enums/DocumentCategory";
import { DocumentMetadata } from '@/models/documents/documentMetadata';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { formatPath } from '@/helper/hqSuite/formatHelper';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { MESSAGE } from '@/data/message';
import { useDocumentMetadataStore } from '@/stores/documentMetadataStore';
import { PayrollAndTaxTab } from '@/enums/PayrollAndTaxTab';
import { isFileSizeValid } from '@/utilities/fileUtils';
import { supportedExtensions } from '@/constants/supportedExtensions'
import ScrollToTop from '@/components/shared/scrollToTop.vue';
import { focusOnFirstError } from '@/functions/ValidationUtilityFunctions';
import { fsCurrencyConfig } from "@/utilities/formatUtils";

library.add(faPlus);

const { notifySuccess, notifyError } = useAlerts();
const route = useRoute();
const router = useRouter();
const routeRequestedPath = ref<string>('');
const needConfirmBeforeNavigate = ref<boolean>(true);
const employeeId = computed<number>(() => +route.params?.id);
const employeeTaxInformationStore = useEmployeeTaxInformationStore();

const isLoading = ref(false);
const {
  fetchEmployeeTaxInformation,
  fetchPayrollLocalTaxCodeOptions,
  fetchPayrollLocalTaxGroupOptions,
  fetchPayrollStateTaxCodeOptions,
  editEmployeeTaxInformation
} = employeeTaxInformationStore;

const {
  employeeTaxInformation,
  payrollLocalTaxCodeOptions,
  payrollLocalTaxGroupOptions,
  payrollStateTaxCodeOptions,
} = storeToRefs(employeeTaxInformationStore);
const documentMetadataStore = useDocumentMetadataStore();
const hqSuiteStore = useHQSuiteStore();
const azureB2CAuthStore = useAzureB2CAuthStore();
const clientId: ComputedRef<string> = computed(() => azureB2CAuthStore?.activeUserClient?.clientGuid ?? 'Shared');

const initialState: EmployeeTaxInformation = {
  employeeId: employeeId.value,
  employeePayrollFederalTaxDetail: {
    id: 0,
    employeeId: employeeId.value,
    useXxxxOrLaterW4Version: true,
    federalFilingStatus: null,
    hasCheckboxWithholding: false,
    claimDependents: 0,
    otherIncome: 0,
    deductions: 0,
    extraWithholding: 0,
    payrollTaxOverride: null,
    federalW4: '',
    exemptions: 0,
    amount: 0,
    percent: 0,
    isResident: false,
    resident: null,
    payrollTaxAddOn: null,
  },
  employeePayrollStateTaxCodeDetails: [
    {
      id: 0,
      employeeId: employeeId.value,
      payrollStateTaxCode: null,
      stateFilingStatus: null,
      exemptions: 0,
      amount: 0,
      percent: 0,
      payrollTaxOverride: null,
      payrollTaxAddOn: null,
      isResident: false,
      resident: null,
      isStateLocalMakeup: false,
      stateLocalMakeup: null,
      stateW4: ''
    }
  ],
  employeePayrollLocalTaxCodeDetails: [],
  payrollLocalTaxGroup: null,
  isResidenceTax: false
};
const form = ref<FormContext>(null);
const formData = ref<EmployeeTaxInformation>(cloneDeep(initialState));
const formOriginalData = ref<EmployeeTaxInformation>(new EmployeeTaxInformation());
const isFormChanged = computed<boolean>(() => JSON.stringify(formData.value) !== JSON.stringify(formOriginalData.value));
const federalFilingStatusOptions: FederalFilingStatus[] = FEDERAL_FILING_STATUS_OPTIONS;
const stateFilingStatusOptions: StateFilingStatus[] = STATE_FILING_STATUS_OPTIONS;
const overrideOptions: PayrollTaxOverride[] = OVERRIDE_OPTIONS;
const addOnOptions: PayrollTaxAddOn[] = ADD_ON_OPTIONS;
const yesNoOptions: DropdownOption[] = YES_NO_OPTIONS;
const file = ref<File | null>({ name: '' } as File);
const w4FolderPath: Ref<string> = ref('');
const uploadedDocumentInfo: Ref<any> = ref(null);
const documentMetadataInput = ref(new DocumentMetadata());

const useXxxxOrLaterW4Version = computed<boolean>(() => formData.value.employeePayrollFederalTaxDetail.useXxxxOrLaterW4Version);
const showCancelConfirmationModal = ref<boolean>(false);
const showDeleteStateConfirmationModal = ref<boolean>(false);
const showDeleteLocalConfirmationModal = ref<boolean>(false);
const stateId = ref<number>(0);
const localId = ref<number>(0);
const federalW4Input = ref<HTMLInputElement>(null);
const stateW4Inputs = ref<HTMLInputElement[]>(null);

const title = "W-4";

function openConfirmCancelModal() {
  if (isFormChanged.value) {
    showCancelConfirmationModal.value = true;
  }

  router.push({ name: 'payrollAndTaxes', params: { id: employeeId.value, tab: PayrollAndTaxTab.TaxInfo } });
}

function onCloseClick() {
  needConfirmBeforeNavigate.value = false;

  if (routeRequestedPath.value) {
    router.push(routeRequestedPath.value);
  } else {
    router.push({ name: 'payrollAndTaxes', params: { id: employeeId.value, tab: PayrollAndTaxTab.TaxInfo } });
  }
}

const handleAddStateSection = () => {
  const states = formData.value.employeePayrollStateTaxCodeDetails;
  const lastId = states[states.length - 1]?.id || 0;
  const newState = {
    ...initialState.employeePayrollStateTaxCodeDetails[0],
    id: lastId + 1,
    isNew: true,
    employeeId: employeeId.value,
  }
  formData.value.employeePayrollStateTaxCodeDetails.push(newState);

  nextTick(() => {
    const newStateElement: HTMLElement = document?.getElementById(`section_state_container-${newState.id}`) as HTMLElement;
    newStateElement && newStateElement?.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'nearest' })
  });
}

const handleAddLocalSection = () => {
  const locals = formData.value.employeePayrollLocalTaxCodeDetails;
  const lastId = locals[locals.length - 1]?.id || 0;

  const newLocal = {
    ...initialState.employeePayrollLocalTaxCodeDetails[0],
    id: lastId + 1,
    isNew: true,
    employeeId: employeeId.value,
    payrollLocalTaxCodeOptions: [],
  };
  formData.value.employeePayrollLocalTaxCodeDetails.push(newLocal);

  nextTick(() => {
    const newLocalElement: HTMLElement = document.getElementById(`section_local_container-${newLocal.id}`) as HTMLElement;
    newLocalElement && newLocalElement?.scrollIntoView({ block: 'center', behavior: 'smooth', inline: 'nearest' });
  });
}

const handleDeleteState = () => {
  const remainingStates = formData.value.employeePayrollStateTaxCodeDetails
    .filter((state: EmployeePayrollStateTaxCodeDetails) => state.id !== stateId.value);
  formData.value.employeePayrollStateTaxCodeDetails = remainingStates;
}

const handleDeleteLocal = () => {
  formData.value.employeePayrollLocalTaxCodeDetails = formData.value.employeePayrollLocalTaxCodeDetails
    .filter((local: EmployeePayrollLocalTaxCodeDetails) => local.id !== localId.value);
}

const openConfirmDeleteState = (id: number) => {
  stateId.value = id;
  showDeleteStateConfirmationModal.value = true;
}

const openConfirmDeleteLocal = (id: number) => {
  localId.value = id;
  showDeleteLocalConfirmationModal.value = true;
}

const onDeleteState = () => {
  handleDeleteState();
  showDeleteStateConfirmationModal.value = false;
  notifySuccess('"[State]" has been deleted.');
}

const onDeleteLocal = () => {
  handleDeleteLocal();
  showDeleteLocalConfirmationModal.value = false;
  notifySuccess('"[Locality]" has been deleted.');
}

function filterLocality(local: EmployeePayrollLocalTaxCodeDetails, stateId: number) {
  // Reset selected locality
  if (local.payrollLocalTaxCode) {
    local.payrollLocalTaxCode = null;
  }

  // Update locality options
  const filteredLocalities = payrollLocalTaxCodeOptions.value
    .filter((item: LocalTaxCode) => item?.payrollStateTaxCodeId === stateId)
    .map(item => ({ ...item }));
  local.payrollLocalTaxCodeOptions = filteredLocalities;
}

async function updateTaxInfo() {
  const formValidation = await form.value.validate();

  if (!formValidation.valid) {
    focusOnFirstError('form');
    return;
  }

  // Update the form data to match the API
  const data = cloneDeep(formData.value) as EmployeeTaxInformation;
  const federalData = data.employeePayrollFederalTaxDetail;
  const stateData = data.employeePayrollStateTaxCodeDetails;
  const localData = data.employeePayrollLocalTaxCodeDetails;
  federalData.federalFilingStatusId = federalData.federalFilingStatus.id;
  federalData.payrollTaxOverrideId = federalData.payrollTaxOverride.id;
  for (const state of stateData) {
    if (state.isNew) {
      state.id = 0;
    }
    state.payrollStateTaxCodeId = state.payrollStateTaxCode.id;
    state.stateFilingStatusId = data.employeePayrollStateTaxCodeDetails[0].stateFilingStatus.id;
    state.payrollTaxOverrideId = state.payrollTaxOverride.id;
    state.payrollTaxAddOnId = state.payrollTaxAddOn.id;
    state.isResident = state.resident.id === YES_NO_OPTIONS[0].id;
    state.isStateLocalMakeup = state.stateLocalMakeup.id === YES_NO_OPTIONS[0].id;
  }
  for (const local of localData) {
    if (local.isNew) {
      local.id = 0;
    }
    local.payrollLocalTaxCodeId = local.payrollLocalTaxCode.id;
    local.payrollTaxOverrideId = local.payrollTaxOverride.id;
    local.payrollTaxAddOnId = local.payrollTaxAddOn.id;
    local.isResident = local.resident.id === YES_NO_OPTIONS[0].id;
  }

  let isDuplicateState = hasDuplicates(data.employeePayrollStateTaxCodeDetails.map(x => x.payrollStateTaxCodeId));
  let isDuplicateLocality = hasDuplicates(data.employeePayrollLocalTaxCodeDetails.map(x => x.payrollLocalTaxCodeId));

  if (isDuplicateState) {
    notifyError("Duplicated records of State");
    for (let index = 0; index < data.employeePayrollStateTaxCodeDetails.length; index++) {
      form.value.setFieldError("stateState" + index.toString(), "Duplicated records of State");
    }
  }

  if (isDuplicateLocality) {
    notifyError("Duplicated records of Locality");
    for (let index = 0; index < data.employeePayrollLocalTaxCodeDetails.length; index++) {
      form.value.setFieldError("localLocality" + index.toString(), "Duplicated records of Locality");
    }
  }

  if (isDuplicateState || isDuplicateLocality) {
    setTimeout(() => {
      focusOnFirstError('form');
    }, 200);
    return;
  }

  try {
    await editEmployeeTaxInformation(data);
    notifySuccess('Edit Successful! Your changes have been saved.');
  } catch (error) {
    notifyError(error);
    return;
  }

  needConfirmBeforeNavigate.value = false;
  router.push({ name: 'payrollAndTaxes', params: { id: employeeId.value, tab: PayrollAndTaxTab.TaxInfo } });
}

async function uploadFederalW4($event) {
  var result = await uploadDocument($event);
  if(result) {
    formData.value.employeePayrollFederalTaxDetail.federalW4 = federalW4Input.value.files[0]?.name || '';
  }
}

async function uploadStateW4(index: number, $event) {
  const fileInput: HTMLInputElement = stateW4Inputs.value[index];
  var result = await uploadDocument($event);
  if(result) {
    formData.value.employeePayrollStateTaxCodeDetails[index].stateW4 = fileInput?.files[0]?.name || '';
  }
}

async function uploadDocument($event): Promise<boolean>{
  const target = $event.target as HTMLInputElement;
  if (target && target.files && target.files.length > 0) {
      file.value = target.files[0];
      if (!isFileTypeSupported(file.value.name)) {
        notifyError(`File type must be in ${supportedExtensions.map(ext => ext.toUpperCase()).join(', ')}`)
        return false;
      }
      if (!isFileSizeValid(file.value)) {
        return false;
      }
      await saveFileAndDocument();
      return true;
  }
}

const isFileTypeSupported = (fileName: string) => {
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return supportedExtensions.includes(fileExtension);
}

function hasDuplicates(array) {
  return new Set(array).size !== array.length;
}

async function saveFileAndDocument() {
  try {
    await saveFile();
    await saveDocumentMetaData();
  } catch (error: any) {
    notifyError(MESSAGE.COMMON.UPLOAD_ERROR);
  }
}

async function saveFile(): Promise<void> {
  if (file.value) {
    await hqSuiteStore.uploadDocument({ path: formatPath(w4FolderPath.value), file: file.value, fileName: file.value.name }, true);
    uploadedDocumentInfo.value = hqSuiteStore.uploadedDocumentDetails;
  }
}

async function saveDocumentMetaData(): Promise<void> {
  documentMetadataInput.value.documentCategoryId = DocumentCategoryEnum.General;
  documentMetadataInput.value.name = file.value.name;
  documentMetadataInput.value.description = title;
  if (employeeId.value) {
    documentMetadataInput.value.employeeId = employeeId.value;
  }

  if (uploadedDocumentInfo.value?.path && uploadedDocumentInfo.value?.path != '') {
    documentMetadataInput.value.filePath = uploadedDocumentInfo.value.path;
    await documentMetadataStore.addDocumentMetadata(documentMetadataInput.value);
    notifySuccess(MESSAGE.DOCUMENT_META.SAVE_SUCCESS);
  }
}

async function getDocumentFolderPath(): Promise<void> {
  const w4Promise = Promise.resolve(makeDocumentPath(DocumentTypes.EmployeeW4, clientId.value, employeeId.value.toString()));
  await Promise.all([w4Promise]).then(([w4Path]) => {
    w4FolderPath.value = w4Path;
  });
}

watch([employeeId, clientId], () => {
  getDocumentFolderPath();
}, { deep: true });

onBeforeMount(async () => {
  isLoading.value = true;
  await getDocumentFolderPath();
  await Promise.all([
    fetchPayrollStateTaxCodeOptions(),
    fetchPayrollLocalTaxCodeOptions(),
    fetchPayrollLocalTaxGroupOptions(),
  ]);

  await fetchEmployeeTaxInformation(employeeId.value);
  formData.value = { ...formData.value, ...employeeTaxInformation.value };
  if (!formData.value.employeePayrollFederalTaxDetail) {
    formData.value.employeePayrollFederalTaxDetail = { ...initialState.employeePayrollFederalTaxDetail };
  }
  if (formData.value.employeePayrollStateTaxCodeDetails.length === 0) {
    formData.value.employeePayrollStateTaxCodeDetails = [{ ...initialState.employeePayrollStateTaxCodeDetails[0] }];
  }

  // Set value for YES/NO dropdowns (don't set when value is null or undefined)
  if (formData.value.employeePayrollFederalTaxDetail.isResident === true) {
    formData.value.employeePayrollFederalTaxDetail.resident = YES_NO_OPTIONS[0];
  } else if (formData.value.employeePayrollFederalTaxDetail.isResident === false) {
    formData.value.employeePayrollFederalTaxDetail.resident = YES_NO_OPTIONS[1];
  }
  formData.value.employeePayrollStateTaxCodeDetails.map((item: EmployeePayrollStateTaxCodeDetails) => {
    if (item.isResident === true) {
      item.resident = YES_NO_OPTIONS[0];
    } else if (item.isResident === false) {
      item.resident = YES_NO_OPTIONS[1];
    }

    if (item.isStateLocalMakeup === true) {
      item.stateLocalMakeup = YES_NO_OPTIONS[0];
    } else if (item.isStateLocalMakeup === false) {
      item.stateLocalMakeup = YES_NO_OPTIONS[1];
    }
  });
  formData.value.employeePayrollLocalTaxCodeDetails.map((item: EmployeePayrollLocalTaxCodeDetails) => {
    if (item.isResident === true) {
      item.resident = YES_NO_OPTIONS[0];
    } else if (item.isResident === false) {
      item.resident = YES_NO_OPTIONS[1];
    }

    item.payrollStateTaxCode = item.payrollLocalTaxCode?.payrollStateTaxCode;
  });

  for (let local of formData.value.employeePayrollLocalTaxCodeDetails) {
    local.payrollLocalTaxCodeOptions = payrollLocalTaxCodeOptions.value
                                        .filter((item: LocalTaxCode) => item?.payrollStateTaxCodeId === 
                                        local.payrollStateTaxCode?.id)
  }

  // Store original data to compare
  formOriginalData.value = cloneDeep(formData.value);
  isLoading.value = false;
})

function reaffirmValidate(){
  form.value.validate();
}

onBeforeRouteLeave(async (to) => {
  if (!needConfirmBeforeNavigate.value || !isFormChanged.value) {
    return true;
  }

  // Open confirm modal before leave
  routeRequestedPath.value = to.fullPath;
  showCancelConfirmationModal.value = true;
  return false;
});
</script>

<template>
  <fs-overlay :show="isLoading" class="fsi-pg__overlay" no-wrap>
    <template #overlay>
      <div class="text-center">
        <img :src="loadingWave" />
      </div>
    </template>
  </fs-overlay>
  <div class="hq-pg d-flex flex-column" v-if="!isLoading">
    <employee-header :employeeId="employeeId" class="position-relative" />

    <VeeForm ref="form" id="form">
      <fs-container fluid class="contain hq-pg__header">
        <fs-row align-v="center">
          <fs-col>
            <h2 class="hq-pg__title">Edit Tax Information</h2>
          </fs-col>
          <fs-col cols="auto" class="ms-auto">
            <fs-button variant="outline-secondary" @click="openConfirmCancelModal()">Cancel</fs-button>
            <fs-button variant="primary" @click="updateTaxInfo()" :disabled="!isFormChanged">Save</fs-button>
          </fs-col>
        </fs-row>

        <common-modal :showModal="showCancelConfirmationModal" title="CLOSE PAYROLL FORM" okText="CLOSE"
          cancelText="CANCEL" okTextVariant="primary" @emitParent="onCloseClick()"
          @emitCloseParent="showCancelConfirmationModal = false">
          <template #content>
            <div class="message-content">
              Are you sure you want to close this form? Any unsaved changes will be lost.
            </div>
          </template>
        </common-modal>
      </fs-container>

      <fs-container fluid class="contain mt-4">
        <!-- FEDERAL SECTION -->
        <div class="section mb-4">
          <h3 class="section-title text-cerulean mb-4">Federal</h3>

          <fs-row class="mb-3">
            <fs-col sm="3">
              <fs-form-radio :value="true" v-model="formData.employeePayrollFederalTaxDetail.useXxxxOrLaterW4Version"
                :disabled="!useXxxxOrLaterW4Version">
                <span>2020 or later</span>
              </fs-form-radio>
            </fs-col>

            <fs-col>
              <fs-form-radio :value="false" v-model="formData.employeePayrollFederalTaxDetail.useXxxxOrLaterW4Version"
                :disabled="useXxxxOrLaterW4Version">
                <span class="mt-3">Pre-2020</span>
              </fs-form-radio>
            </fs-col>
          </fs-row>

          <fs-row>
            <fs-col md="6" xs="12">
              <fs-input type="fsMultiselectList" name="federalFilingStatus" label="Filing Status"
                v-model="formData.employeePayrollFederalTaxDetail.federalFilingStatus" typeaheadvalueattribute="id"
                typeaheadkey="federalFilingStatusDescription" :typeaheaddata="federalFilingStatusOptions"
                :rules="{ required: useXxxxOrLaterW4Version }" :disabled="!useXxxxOrLaterW4Version" />
            </fs-col>

            <fs-col md="6" xs="12" class="d-flex align-items-center">
              <fs-form-group v-if="useXxxxOrLaterW4Version" class="mb-2">
                <fs-form-checkbox v-model="formData.employeePayrollFederalTaxDetail.hasCheckboxWithholding">
                  Multiple Jobs or Spouse Works
                </fs-form-checkbox>
              </fs-form-group>

              <fs-input v-else type="fsNumber" name="federalExemptions" label="Exemptions"
                v-model="formData.employeePayrollFederalTaxDetail.exemptions" disabled />
            </fs-col>
          </fs-row>

          <fs-row>
            <fs-col md="6" xs="12">
              <fs-input v-if="useXxxxOrLaterW4Version" 
                type="fsCurrencyInput" 
                name="federalClaimDependents"
                label="Claim Dependent and Other Credits"
                v-model="formData.employeePayrollFederalTaxDetail.claimDependents"
                prepend="$"
                :config="{
                  ...fsCurrencyConfig,
                  valueRange: {
                    min: 0.00,
                    max: 9999999999.99
                  }
                }"/>
                
              <fs-input v-else type="fsCurrencyInput" name="federalAmount" label="Extra Federal Withholding Amount"
                v-model="formData.employeePayrollFederalTaxDetail.amount" disabled />
            </fs-col>

            <fs-col md="6" xs="12">
              <fs-input v-if="useXxxxOrLaterW4Version" type="fsCurrencyInput" name="federalOtherIncome"
                label="Other Income (not from jobs)" 
                v-model="formData.employeePayrollFederalTaxDetail.otherIncome" 
                prepend="$"
                :config="{
                  ...fsCurrencyConfig,
                  valueRange: {
                    min: 0.00,
                    max: 9999999999.99
                  }
                }"/>

              <fs-input v-else type="fsNumber" name="federalPercent" label="Extra Federal Withholding Percent"
                v-model="formData.employeePayrollFederalTaxDetail.percent" disabled />
            </fs-col>
          </fs-row>

          <fs-row>
            <fs-col xs="12" md="6">
              <fs-input v-if="useXxxxOrLaterW4Version" type="fsCurrencyInput" name="federalDeductions" label="Deductions"
                v-model="formData.employeePayrollFederalTaxDetail.deductions" 
                prepend="$"
                :config="{
                  ...fsCurrencyConfig,
                  valueRange: {
                    min: 0.00,
                    max: 9999999999.99
                  }
                }"/>

              <fs-input v-else type="fsMultiselectList" name="federalPayrollTaxOverride" label="Override"
                v-model="formData.employeePayrollFederalTaxDetail.payrollTaxOverride" typeaheadvalueattribute="id"
                typeaheadkey="payrollTaxOverrideDescription" :typeaheaddata="overrideOptions" disabled />
            </fs-col>

            <fs-col xs="12" md="6">
              <fs-input v-if="useXxxxOrLaterW4Version" type="fsCurrencyInput" name="federalExtraWithholding"
                label="Extra Withholding" 
                v-model="formData.employeePayrollFederalTaxDetail.extraWithholding" 
                prepend="$"
                :config="{
                  ...fsCurrencyConfig,
                  valueRange: {
                    min: 0.00,
                    max: 9999999999.99
                  }
                }"/>

              <fs-input v-else type="fsMultiselectList" name="federalPayrollTaxAddOn" label="Add On"
                v-model="formData.employeePayrollFederalTaxDetail.payrollTaxAddOn" typeaheadvalueattribute="id"
                typeaheadkey="payrollTaxAddOnDescription" :typeaheaddata="addOnOptions" disabled />
            </fs-col>
          </fs-row>

          <fs-row>
            <fs-col xs="12" md="6">
              <div>
                <div class="d-flex">
                  <fs-input v-if="useXxxxOrLaterW4Version" type="fsMultiselectList" name="federalPayrollTaxOverride"
                    label="Override" v-model="formData.employeePayrollFederalTaxDetail.payrollTaxOverride"
                    typeaheadvalueattribute="id" typeaheadkey="payrollTaxOverrideDescription"
                    :typeaheaddata="overrideOptions" :rules="{ required: true }" />

                  <fs-input v-else type="fsMultiselectList" name="federalResident" label="Residence"
                    v-model="formData.employeePayrollFederalTaxDetail.resident" typeaheadvalueattribute="id"
                    typeaheadkey="name" :typeaheaddata="yesNoOptions" disabled />
                </div>
              </div>
            </fs-col>

            <fs-col xs="12" md="6" class="input-upload p-relative">
              <fs-input type="fsTextInput" name="federalW4" label="Upload Federal-W4"
                v-model="formData.employeePayrollFederalTaxDetail.federalW4" disabled />
              <input type="file" ref="federalW4Input" v-show="false" @change="uploadFederalW4($event)" />
              <fs-button variant="primary" size="md" class="btn btn-primary btn-upload" @click="federalW4Input?.click()">
                <span>Upload</span>
              </fs-button>
            </fs-col>
          </fs-row>
        </div>

        <!-- STATE SECTION -->
        <div class="section mb-5">
          <h3 class="section-title text-cerulean mb-4">State</h3>

          <div v-for="(stateWithholdingInfo, index) in formData.employeePayrollStateTaxCodeDetails"
            :key="stateWithholdingInfo.id" class="section-container"
            :class="{ last: index !== 0 && index === formData.employeePayrollStateTaxCodeDetails.length - 1 }"
            :id="`section_state_container-${stateWithholdingInfo.id}`">
            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="'stateState' + index.toString()" label="State"
                  v-model="stateWithholdingInfo.payrollStateTaxCode" typeaheadvalueattribute="id"
                  typeaheadkey="payrollStateTaxCodeName" :typeaheaddata="payrollStateTaxCodeOptions"
                  @select="reaffirmValidate"
                  :dropdownSearchable="true" :showClear="true" :rules="{ required: true }" />
              </fs-col>

              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`filingStatus${stateWithholdingInfo.id}`" label="Filing Status"
                  v-model="formData.employeePayrollStateTaxCodeDetails[0].stateFilingStatus" typeaheadvalueattribute="id"
                  typeaheadkey="stateFilingStatusDescription" :typeaheaddata="stateFilingStatusOptions"
                  :dropdownSearchable="true" :showClear="true" :rules="{ required: true }" />
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsNumber" :name="`stateExemptions${stateWithholdingInfo.id}`" label="Exemptions"
                  v-model="stateWithholdingInfo.exemptions" 
                  :rules="{
                    precisionAndScale: {
                      precision: 3,
                      scale: 0,
                      message: 'Must have a maximum of 3 digits and should not contain any decimals',
                    }
                  }" />
              </fs-col>

              <fs-col xs="12" md="6">
                <fs-input type="fsCurrencyInput" :name="`extraStateWithholdingAmount${stateWithholdingInfo.id}`"
                  label="Extra State Withholding Amount" 
                  v-model="stateWithholdingInfo.amount" 
                  prepend="$"
                  :config="{
                    ...fsCurrencyConfig,
                    valueRange: {
                      min: 0.00,
                      max: 9999999999.99
                    }
                  }"/>
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsCurrencyInput"
                  :name="`extraStateWithholdingPercent${stateWithholdingInfo.id}`" label="Extra State Withholding Percent"
                  v-model="stateWithholdingInfo.percent" 
                  prepend="%"
                  :config="{
                  ...fsCurrencyConfig,
                  valueRange: {
                    min: 0.00,
                    max: 100.00
                  }
                }"/>
              </fs-col>

              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`stateOverride${stateWithholdingInfo.id}`" label="Override"
                  v-model="stateWithholdingInfo.payrollTaxOverride" typeaheadvalueattribute="id"
                  typeaheadkey="payrollTaxOverrideDescription" :typeaheaddata="overrideOptions"
                  :rules="{ required: true }" />
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`stateAddOn${stateWithholdingInfo.id}`" label="Add On"
                  v-model="stateWithholdingInfo.payrollTaxAddOn" typeaheadvalueattribute="id"
                  typeaheadkey="payrollTaxAddOnDescription" :typeaheaddata="addOnOptions" :rules="{ required: true }" />
              </fs-col>

              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`stateResidence${stateWithholdingInfo.id}`" label="Residence"
                  v-model="stateWithholdingInfo.resident" typeaheadvalueattribute="id" typeaheadkey="name"
                  :typeaheaddata="yesNoOptions" :rules="{ required: true }" />
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`stateStLocMakeup${stateWithholdingInfo.id}`"
                  label="St-Loc Makeup" v-model="stateWithholdingInfo.stateLocalMakeup" typeaheadkey="name"
                  typeaheadvalueattribute="id" :typeaheaddata="yesNoOptions" :rules="{ required: true }" />
              </fs-col>

              <fs-col xs="12" md="6" class="input-upload p-relative">
                <fs-input type="fsTextInput" :name="`stateW4${stateWithholdingInfo.id}`" label="Upload State-W4"
                  v-model="stateWithholdingInfo.stateW4" disabled />
                <input type="file" ref="stateW4Inputs" v-show="false" @change="uploadStateW4(index, $event)" />
                <fs-button variant="primary" size="md" class="btn btn-primary btn-upload"
                  @click="stateW4Inputs[index]?.click()">
                  <span>Upload</span>
                </fs-button>
              </fs-col>
            </fs-row>

            <fs-button v-if="index !== 0" variant="link" class="text-decoration-none text-red mb-2 ps-0"
              @click="openConfirmDeleteState(stateWithholdingInfo.id)">
              Delete State
            </fs-button>
          </div>

          <fs-button variant="outline-primary" class="d-flex align-items-center"
            :class="{ 'mt-5': formData.employeePayrollStateTaxCodeDetails.length > 1 }" @click="handleAddStateSection">
            <font-awesome-icon :icon="['far', 'plus']" size="lg" />
            Add State
          </fs-button>

          <common-modal :showModal="showDeleteStateConfirmationModal" title="Confirm Delete State" okText="DELETE"
            cancelText="CANCEL" okTextVariant="danger" @emitParent="onDeleteState"
            @emitCloseParent="showDeleteStateConfirmationModal = false">
            <template #content>
              <div class="message-content">
                Are you sure you want to delete this State and all information associated to it?
              </div>
            </template>
          </common-modal>
        </div>

        <!-- LOCAL SECTION -->
        <div class="section mb-5">
          <h3 class="section-title text-cerulean mb-4">Local</h3>

          <div v-for="(localWithholdingInfo, index) in formData.employeePayrollLocalTaxCodeDetails"
            :key="localWithholdingInfo.id" class="section-container"
            :class="{ last: index !== 0 && index === formData.employeePayrollLocalTaxCodeDetails.length - 1 }"
            :id="`section_local_container-${localWithholdingInfo.id}`">
            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`localState${localWithholdingInfo.id}`" label="State"
                  v-model="localWithholdingInfo.payrollStateTaxCode" typeaheadvalueattribute="id"
                  typeaheadkey="payrollStateTaxCodeName" :typeaheaddata="payrollStateTaxCodeOptions"
                  :dropdownSearchable="true" :showClear="true" :rules="{ required: true }"
                  @select="(item: PayrollStateTaxCode) => filterLocality(localWithholdingInfo, item.id)" />
              </fs-col>

              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="'localLocality' + index.toString()" label="Locality"
                  v-model="localWithholdingInfo.payrollLocalTaxCode" typeaheadvalueattribute="id"
                  typeaheadkey="payrollLocalTaxCodeName" :typeaheaddata="localWithholdingInfo.payrollLocalTaxCodeOptions"
                  @select="reaffirmValidate"
                  :dropdownSearchable="true" :showClear="true" :rules="{ required: true }" />
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsNumber" :name="`localExemptions${localWithholdingInfo.id}`" label="Exemptions"
                  v-model="localWithholdingInfo.exemptions" 
                  :rules="{
                    precisionAndScale: {
                      precision: 3,
                      scale: 0,
                      message: 'Must have a maximum of 3 digits and should not contain any decimals',
                    }
                  }" />
              </fs-col>

              <fs-col xs="12" md="6">
                <fs-input type="fsCurrencyInput" :name="`extraLocalWithholdingAmount${localWithholdingInfo.id}`"
                  label="Extra Local Withholding Amount" 
                  v-model="localWithholdingInfo.amount" 
                  prepend="$"
                  :config="{
                    ...fsCurrencyConfig,
                    valueRange: {
                      min: 0.00,
                      max: 9999999999.99
                    }
                  }"/>
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsCurrencyInput"
                  :name="`extraLocalWithholdingPercent${localWithholdingInfo.id}`" label="Extra Local Withholding Percent"
                  v-model="localWithholdingInfo.percent" 
                  prepend="%"
                  :config="{
                  ...fsCurrencyConfig,
                  valueRange: {
                    min: 0.00,
                    max: 100.00
                  }
                }"/>
              </fs-col>

              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`localOverride${localWithholdingInfo.id}`" label="Override"
                  v-model="localWithholdingInfo.payrollTaxOverride" typeaheadvalueattribute="id"
                  typeaheadkey="payrollTaxOverrideDescription" :typeaheaddata="overrideOptions"
                  :rules="{ required: true }" />
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`localAddOn${localWithholdingInfo.id}`" label="Add On"
                  v-model="localWithholdingInfo.payrollTaxAddOn" typeaheadvalueattribute="id"
                  typeaheadkey="payrollTaxAddOnDescription" :typeaheaddata="addOnOptions" :rules="{ required: true }" />
              </fs-col>

              <fs-col xs="12" md="6">
                <fs-input type="fsMultiselectList" :name="`localResidence${localWithholdingInfo.id}`" label="Residence"
                  v-model="localWithholdingInfo.resident" typeaheadvalueattribute="id" typeaheadkey="name"
                  :typeaheaddata="yesNoOptions" :rules="{ required: true }" />
              </fs-col>
            </fs-row>

            <fs-button variant="link" class="text-decoration-none text-red mb-2 ps-0"
              @click="openConfirmDeleteLocal(localWithholdingInfo.id)">
              Delete Local
            </fs-button>
          </div>

          <fs-button variant="outline-primary" class="d-flex align-items-center mt-5" @click="handleAddLocalSection">
            <font-awesome-icon :icon="['far', 'plus']" size="lg" />
            Add Local
          </fs-button>

          <common-modal :showModal="showDeleteLocalConfirmationModal" title="Confirm Delete Local" okText="DELETE"
            cancelText="CANCEL" okTextVariant="danger" @emitParent="onDeleteLocal"
            @emitCloseParent="showDeleteLocalConfirmationModal = false">
            <template #content>
              <div class="message-content">
                Are you sure you want to delete this Locality and all information associated to it?
              </div>
            </template>
          </common-modal>
        </div>

        <!-- OTHER SECTION -->
        <div class="section mb-4">
          <h3 class="section-title text-cerulean mb-4">Other</h3>

          <fs-row class="align-items-center">
            <fs-col md="6">
              <fs-input type="fsMultiselectList" name="otherPayrollTaxGroup" label="Payroll Tax Group"
                v-model="formData.payrollLocalTaxGroup" typeaheadvalueattribute="id"
                typeaheadkey="payrollLocalTaxGroupName" :typeaheaddata="payrollLocalTaxGroupOptions"
                :dropdownSearchable="true" :showClear="true" :rules="{ required: true }" />
            </fs-col>
          </fs-row>

          <fs-row class="align-items-center">
            <fs-col>
              <fs-form-checkbox name="isResidenceTax" v-model="formData.isResidenceTax">
                Residence
              </fs-form-checkbox>
            </fs-col>
          </fs-row>
        </div>
      </fs-container>
    </VeeForm>

    <ScrollToTop />
  </div>
</template>

<style scoped lang="scss">
.section {
  max-width: 700px;

  .section-container {
    margin-bottom: 20px;

    &.last {
      background-color: #eff1f3;
      margin: -10px;
      padding: 10px;
      border-radius: 5px;
    }
  }
}

.section-title {
  font-size: 16px;
  font-weight: bold;
  line-height: 1.6;
  border-bottom: 2px solid #e2e2e2;
}

.input-upload {
  position: relative;

  .btn-upload {
    position: absolute;
    top: 16px;
    right: 10px;
  }
}
</style>
