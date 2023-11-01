<script lang="ts" setup>
import { ref, Ref, onMounted, computed, watch } from 'vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { useOnboardingTaxWithHoldingInfoSummaryStore } from '@/stores/onboardingTaxWithHoldingInfoSummaryStore';
import { useOnboardingEmployeeWithholdingCertificateStore } from '@/stores/onboardingEmployeeWithholdingCertificateStore';
import { useOnboardingQuickHireTaxWithHoldingInfoStore } from '@/stores/onboardingQuickHireTaxWithHoldingInfoStore';
import { useOnboardingEmployerInformationStore } from '@/stores/onboardingEmployerInformationStore';
import { FormField } from '@/enums/FormField';
import { FileInputData } from "@/models/onboarding/W4/W4FormFile";
import { faPaperclip, faFilePdf } from '@fortawesome/pro-light-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { truncateFileName, formatCurrency } from '@/utilities/formatUtils';
import { useLoadingStore } from "@/stores/loadingStore";
import { FEDERAL_FILING_STATUS_OPTIONS, STATES } from '@/constants/common';
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { previewFile } from '@/utilities/fileUtils';
import { faEye, faEyeSlash } from '@fortawesome/pro-light-svg-icons';

library.add(faPaperclip, faFilePdf, faEye, faEyeSlash);

const { employeeStatusId } = storeToRefs(useEmployeeStore());
const { fetchEmployeeStatusId } = useEmployeeStore();
const { getOnboardingTaxWithHoldingInfoSummary } = useOnboardingTaxWithHoldingInfoSummaryStore();
const { onboardingTaxWithHoldingInfoSummary } = storeToRefs(useOnboardingTaxWithHoldingInfoSummaryStore());
const { getOnboardingEmployeeWitholdingCertificate } = useOnboardingEmployeeWithholdingCertificateStore();
const { onboardingEmployeeWitholdingCertificate } = storeToRefs(useOnboardingEmployeeWithholdingCertificateStore());
const { getOnboardingQuickHireTaxWithHoldingInfo } = useOnboardingQuickHireTaxWithHoldingInfoStore();
const { getOnboardingEmployerInformation } = useOnboardingEmployerInformationStore();
const { onboardingEmployerInformation } = storeToRefs(useOnboardingEmployerInformationStore());
const { onboardingQuickHireTaxiWithHoldingInfo } = storeToRefs(useOnboardingQuickHireTaxWithHoldingInfoStore());
const route = useRoute();
const employeeId = computed(() => route.params.id);
const { setLoading } = useLoadingStore();
const hqSuiteStore = useHQSuiteStore();

const taxWithholdingInfoSummaryData = ref({
  isDone: false,
  formFiles: 'form files',
  note: '',
});
const taxWithholdingInfoSummaryFileData: Ref<FileInputData[]> = ref([]);
const employeeWithholdingCertificateData = ref({
  firstName: '',
  middleName: '',
  lastName: '',
  isSubmittedHR: false,
  address1: '',
  address2: '',
  city: '',
  state: null,
  zipcode: '',
  ssn: null,
  filingStatusId: null,
  isTwoJobs: false,
  numberQualifyingChildren: '',
  numberOtherDependents: '',
  amountAboveQualifying: '',
  otherIncome: '',
  deductionsWorksheet: '',
  extraWithHolding: '',
  employeeSignaturePath: '',
  employeeSignatureDateUTC: '',
  formStatus: null
});
const employeeWithholdingCertificateFileData: Ref<FileInputData[]> = ref([]);
const employerInformationData = ref({
  employerName: '',
  employerAddress: '',
  city: '',
  state: null,
  zipcode: '',
  firstDateOfEmployment: null,
  employerIdentificationNumber: '',
  formStatus: false,
});

const quickhireW4StateFileData: Ref<FileInputData[]> = ref([]);
const quickhireW4FederalFileData: Ref<FileInputData[]> = ref([]);

const signatureBase64Url = ref('');
const isShowSSN = ref(false);
const originalSSN = ref(null);

const getState = (stateData: any) => {
  if (!stateData) return;
  return STATES.find((state) => state.value === stateData.value).value;
}

const getFilingStatus = (filingStatusId: number) => {
  if (!filingStatusId) return;
  return FEDERAL_FILING_STATUS_OPTIONS.find((option) => option.id === filingStatusId).name;
};

const convertToBase64 = async (path: string) => {
  try {
    const res = await hqSuiteStore.getFile(path);
    const reader = new FileReader();
    reader.readAsDataURL(res.data);
    reader.onloadend = async function () {
      signatureBase64Url.value = reader.result as string;
    }
  } catch (error) {
    signatureBase64Url.value = ''
  }
};

watch(isShowSSN, () => {
  if (!isShowSSN.value) {
    employeeWithholdingCertificateData.value.ssn = originalSSN.value.replace(/\d/g, "X").replace(/X{3}-X{2}/, "XXX-XX");
  } else {
    employeeWithholdingCertificateData.value.ssn = originalSSN.value;
  }
})

onMounted(async () => {
  setLoading(true);
  try {
    if (!employeeStatusId.value) {
      await fetchEmployeeStatusId(employeeId.value as string);
    }

    if (employeeStatusId.value === EmployeeStatusEnum.QuickHire) {
      if (!onboardingQuickHireTaxiWithHoldingInfo.value) {
        await getOnboardingQuickHireTaxWithHoldingInfo(Number(employeeId.value), FormField.TaxWithholdingInfoQuickHire);
      }
      for (const file of onboardingQuickHireTaxiWithHoldingInfo.value.uploadFileStateForms) {
        if (file.payload.fileType === 'Federal') {
          quickhireW4FederalFileData.value.push({
            fileName: file.fileName,
            fileObject: null,
            filePath: file.filePath,
            fileUrl: null,
          })
        } else if (file.payload.fileType === 'State') {
          quickhireW4StateFileData.value.push({
            fileName: file.fileName,
            fileObject: null,
            filePath: file.filePath,
            fileUrl: null,
          })
        }
      }
    } else if (employeeStatusId.value === EmployeeStatusEnum.Onboard) {
      // Tax Withholding Info Summary
      if (!onboardingTaxWithHoldingInfoSummary.value) {
        await getOnboardingTaxWithHoldingInfoSummary(Number(employeeId.value), FormField.TaxWithholdingInfoSummary);
      }
      taxWithholdingInfoSummaryData.value = onboardingTaxWithHoldingInfoSummary.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
          acc[fieldKey] = fieldValue;
        }
        return acc as any;
      }, {});
      onboardingTaxWithHoldingInfoSummary.value.uploadFileStateForms.forEach((file) => {
        taxWithholdingInfoSummaryFileData.value.push({
          fileName: file.fileName,
          filePath: file.filePath
        })
      })

      // Employee Certificate
      if (!onboardingEmployeeWitholdingCertificate.value) {
        await getOnboardingEmployeeWitholdingCertificate(Number(employeeId.value), FormField.TaxWithholdingInfoEmployee);
      }
      employeeWithholdingCertificateData.value = onboardingEmployeeWitholdingCertificate.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
          acc[fieldKey] = fieldValue;
        }
        if (fieldKey === 'ssn') {
          originalSSN.value = fieldValue
        }
        return acc as any;
      }, {});
      employeeWithholdingCertificateData.value.ssn = originalSSN.value.replace(/\d/g, "X").replace(/X{3}-X{2}/, "XXX-XX");

      onboardingEmployeeWitholdingCertificate.value.uploadFileStateForms.forEach((file) => {
        employeeWithholdingCertificateFileData.value.push({
          fileName: file.fileName,
          filePath: file.filePath
        })
      });
      if (employeeWithholdingCertificateData.value.employeeSignaturePath) {
        await convertToBase64(employeeWithholdingCertificateData.value.employeeSignaturePath);
      }

      // Employer Information
      if (!onboardingEmployerInformation.value) {
        await getOnboardingEmployerInformation(Number(employeeId.value), FormField.TaxWithholdingInfoEmployer);
      }
      employerInformationData.value = onboardingEmployerInformation.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
          acc[fieldKey] = fieldValue;
        }
        return acc as any;
      }, {});
    }
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
  }
})
</script>

<template>
    <div class="mb-3 px-3"> 
    <fs-row>
      <fs-col cols="2" class="text-bold">
        Note
      </fs-col>
      <fs-col cols="10">
        {{ taxWithholdingInfoSummaryData.note }}
      </fs-col>
    </fs-row>
  </div>

  <div v-if="employeeStatusId === EmployeeStatusEnum.QuickHire" class="px-2">
    <div class="text-task-cyan section_certificate__title">
      A. State W-4 Form
    </div>
    <hr />
    <div v-for="file in quickhireW4StateFileData" :key="file.fileName" class="d-flex gap-2 align-items-center mb-2"
      :style="{ paddingLeft: '20px' }">
      <font-awesome-icon :icon="['fal', 'paperclip']" />
      <fs-link class="text-primary" @click="previewFile(file)">{{ truncateFileName(file.fileName) }}</fs-link>
    </div>
    <div class="text-task-cyan section_certificate__title" :style="{ marginTop: '40px' }">
      B. Federal W-4 Form
    </div>
    <hr />
    <div v-for="file in quickhireW4FederalFileData" :key="file.fileName" class="d-flex gap-2 align-items-center mb-2"
      :style="{ paddingLeft: '20px' }">
      <font-awesome-icon :icon="['fal', 'paperclip']" />
      <fs-link class="text-primary" @click="previewFile(file)">{{ truncateFileName(file.fileName) }}</fs-link>
    </div>
  </div>
  <div v-else-if="employeeStatusId === EmployeeStatusEnum.Onboard" class="px-2">
    <section class="section_summary mb-4">
      <div v-for="file in taxWithholdingInfoSummaryFileData" :key="file.fileName"
        class="d-flex gap-2 align-items-center mb-2" :style="{ paddingLeft: '20px' }">
        <font-awesome-icon :icon="['fal', 'paperclip']" />
        <fs-link class="text-primary" @click="previewFile(file)">{{ truncateFileName(file.fileName) }}</fs-link>
      </div>
    </section>
    <section class="section_certificate">
      <div class="mb-2">
        <div class="text-task-cyan section_certificate__title">
          A. State W-4 Form
        </div>
        <hr />
        <div v-for="file in employeeWithholdingCertificateFileData" :key="file.fileName"
          class="d-flex gap-2 align-items-center mb-4">

          <font-awesome-icon :icon="['fal', 'paperclip']" />
          <fs-link class="text-primary" @click="previewFile(file)">{{ truncateFileName(file.fileName) }}</fs-link>
        </div>
      </div>
      <div>
        <div class="text-task-cyan section_certificate__title">
          B. Federal W-4 Form
        </div>
        <hr />
        <div class="mb-4">
          <div class="text-bold mb-1">
            STEP 1: Personal Information
          </div>
          <div class="d-flex">
            <div :style="{ width: '40px' }" class="text-bold">
              (a)
            </div>
            <fs-row class="flex-grow-1 mb-2">
              <fs-col cols="1" class="text-bold">Full Name</fs-col>
              <fs-col cols="11"> {{ employeeWithholdingCertificateData.firstName }} {{
                employeeWithholdingCertificateData.middleName }} {{ employeeWithholdingCertificateData.lastName
  }}</fs-col>
            </fs-row>
          </div>
          <div class="d-flex">
            <div :style="{ width: '40px' }">
            </div>
            <fs-row class="flex-grow-1 mb-2">
              <fs-col cols="1" class="text-bold">Address</fs-col>
              <fs-col cols="11">
                <div>
                  {{ employeeWithholdingCertificateData.address1 }}
                </div>
                <div>
                  {{ employeeWithholdingCertificateData.address2 }}
                </div>
                <div>
                  {{ employeeWithholdingCertificateData.city }}, {{ getState(employeeWithholdingCertificateData.state) }}
                  {{ employeeWithholdingCertificateData.zipcode }}
                </div>
              </fs-col>
            </fs-row>
          </div>
          <div class="d-flex">
            <div :style="{ width: '40px' }" class="text-bold">
              (b)
            </div>
            <fs-row class="flex-grow-1">
              <fs-col cols="1" class="text-bold">SSN</fs-col>
              <fs-col cols="11">
                {{ employeeWithholdingCertificateData.ssn }}
                <fs-button v-if="isShowSSN" class="eye-button">
                  <font-awesome-icon :icon="['fal', 'eye']" class="text-primary eye-icon"
                    @click="isShowSSN = !isShowSSN" />
                </fs-button>
                <fs-button v-else class="eye-button">
                  <font-awesome-icon :icon="['fal', 'eye-slash']" class="text-primary eye-icon"
                    @click="isShowSSN = !isShowSSN" />
                </fs-button>
              </fs-col>
            </fs-row>
          </div>
          <div class="d-flex">
            <div :style="{ width: '40px' }" class="text-bold">
              (c)
            </div>
            <fs-row class="flex-grow-1">
              <fs-col cols="1" class="text-bold">Filing Status</fs-col>
              <fs-col cols="11">{{ getFilingStatus(employeeWithholdingCertificateData.filingStatusId) }}</fs-col>
            </fs-row>
          </div>
        </div>
        <div class="mb-3">
          <div class="mb-2 text-bold">STEP 2: Multiple Jobs or Spouse Works</div>
          <div class="mb-1">Do <strong>only one</strong> of the following:</div>
          <div class="d-flex mb-2">
            <div class="px-2 text-bold" :style="{ width: '40px' }">(a)</div>
            <div>Reserved for future use.</div>
          </div>
          <div class="d-flex mb-2">
            <div class="px-2 text-bold" :style="{ width: '40px' }">(b)</div>
            <div>Use the Multiple Jobs Worksheet on page 2 on the instruction and enter the result in Step 4(c) below;
              <strong>or</strong>
            </div>
          </div>
          <div class="d-flex mb-2">
            <div class="px-2 text-bold" :style="{ width: '40px' }">(c)</div>
            <div class="d-flex gap-2">
              <fs-form-checkbox v-model="employeeWithholdingCertificateData.isTwoJobs" :disabled="true" />
              If there are only two jobs total, you may check this box.
              Do the same on Form W-4 for the other job. This option is generally more accurate than (b) if pay at the
              lower paying job is more than half of the pay at the higher paying job. Otherwise, (b) is more accurate.
            </div>
          </div>
        </div>
        <div class="mb-4">
          <div class="mb-2 text-bold">STEP 3: Claim Dependent And Other Credits</div>
          <fs-row class="mb-2">
            <fs-col cols="2" class="text-bold">Amount of Child Tax Credit</fs-col>
            <fs-col cols="10">{{ formatCurrency(employeeWithholdingCertificateData.numberQualifyingChildren) }}</fs-col>
          </fs-row>
          <fs-row class="mb-2">
            <fs-col cols="2" class="text-bold">Amount of the Credit for Other Dependents</fs-col>
            <fs-col cols="10">{{ formatCurrency(employeeWithholdingCertificateData.numberOtherDependents) }}</fs-col>
          </fs-row>
          <fs-row class="mb-2">
            <fs-col cols="2" class="text-bold">Claimable Amount</fs-col>
            <fs-col cols="10">{{ formatCurrency(employeeWithholdingCertificateData.amountAboveQualifying) }}</fs-col>
          </fs-row>
        </div>
        <div class="mb-3">
          <div class="mb-2 text-bold">STEP 4 (optional): Other Adjustments</div>
          <div class="d-flex">
            <div :style="{ width: '40px' }" class="text-bold">
              (a)
            </div>
            <fs-row class="flex-grow-1">
              <fs-col cols="2" class="mb-2 text-bold">Other Income (Not From Jobs)</fs-col>
              <fs-col cols="10">{{ formatCurrency(employeeWithholdingCertificateData.otherIncome) }}</fs-col>
            </fs-row>
          </div>
          <div class="d-flex mb-2">
            <div :style="{ width: '40px' }" class="text-bold">
              (b)
            </div>
            <fs-row class="flex-grow-1">
              <fs-col cols="2" class="text-bold">Deductions</fs-col>
              <fs-col cols="10">{{ formatCurrency(employeeWithholdingCertificateData.deductionsWorksheet) }}</fs-col>
            </fs-row>
          </div>
          <div class="d-flex  mb-2">
            <div :style="{ width: '40px' }" class="text-bold">
              (c)
            </div>
            <fs-row class="flex-grow-1">
              <fs-col cols="2" class="text-bold">Extra Withholding</fs-col>
              <fs-col cols="10">{{ formatCurrency(employeeWithholdingCertificateData.extraWithHolding) }}</fs-col>
            </fs-row>
          </div>
        </div>
        <div class="mb-3">
          <div class="mb-2 text-bold">STEP 5: Sign Here</div>
          <div class="text-bold">Employee Signature</div>
          <img v-if="signatureBase64Url" class="img-fluid" :src="signatureBase64Url" alt="employee signature" />
          <div v-else>
            Unable to load employee's signature
          </div>
        </div>
      </div>
    </section>
    <section class="section_employer">
      <div class="text-bold mb-2">EMPLOYER INFORMATION</div>
      <fs-row class="mb-2">
        <fs-col cols="3" class="text-bold">
          Employer's Name
        </fs-col>
        <fs-col cols="9">
          {{ employerInformationData.employerName }}
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="3" class="text-bold">
          Employer’s Address
        </fs-col>
        <fs-col cols="9">
          <div>{{ employerInformationData.employerAddress }}</div>
          <div>{{ employerInformationData.city }}, {{ employerInformationData.state }} {{ employerInformationData.zipcode
          }}
          </div>
        </fs-col>
      </fs-row>
      <fs-row class="mb-2">
        <fs-col cols="3" class="text-bold">
          First Date Of Employment
        </fs-col>
        <fs-col cols="9">
          {{ employerInformationData.firstDateOfEmployment }}
        </fs-col>
      </fs-row>
      <fs-row>
        <fs-col cols="3" class="text-bold">
          Employer’s Identification Number
        </fs-col>
        <fs-col cols="9">
          {{ employerInformationData.employerIdentificationNumber }}
        </fs-col>
      </fs-row>
    </section>
  </div>
</template>

<style lang="scss" scoped>
.section_summary {
  padding: 12px;
  border-radius: 10px;

  &__note {
    font-size: 14px;
  }
}

.section_certificate {
  &__title {
    font-weight: bold;
    font-size: 16px;
  }
}

.text-bold {
  font-weight: bold;
}

.cursor-pointer {
  cursor: pointer;
}

.eye-button {
  all: unset;
  cursor: pointer;

  &:active {
    background: none;
  }
}
</style>