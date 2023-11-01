<script setup lang="ts">
import { onMounted, ref, Ref, computed, ComputedRef } from "vue";
import { storeToRefs } from "pinia";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { FormField } from "@/enums/FormField";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import moment from "moment";
import { useOnboardingWOTC8850Store as useOnboardingWOTC8850SEssStore } from "@/stores/WOTC/onboardingHrWOTC8850EssStore";
import { useOnboardingWOTC8850Store as useOnboardingWOTC8850SHrStore } from "@/stores/WOTC/onboardingHrWOTC8850HrStore";
import { useOnboardingWOTC9061Store as useOnboardingWOTC9061EssStore } from "@/stores/WOTC/onboardingHrWOTC9061EssStore";
import { useOnboardingWOTC9061Store as useOnboardingWOTC9061HrStore } from "@/stores/WOTC/onboardingHrWOTC9061HrStore";
import { useRoute } from 'vue-router';
import { OnboardingWOTC8850Ess } from "@/models/onboarding/WOTC/HrOnboardingWOTC8850Ess";
import { OnboardingWOTC9061Ess } from "@/models/onboarding/WOTC/HrOnboardingWOTC9061Ess";
import { useLoadingStore } from "@/stores/loadingStore";
import { OnboardingWOTC8850Hr } from "@/models/onboarding/WOTC/HrOnboardingWOTC8850Hr";
import { OnboardingWOTC9061Hr } from "@/models/onboarding/WOTC/HrOnboardingWOTC9061Hr";
import { FormatSsn, truncateFileName } from "@/utilities/formatUtils"
import { useEmployeeStore } from '@/stores/employeeStore';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { useOnboardingQuickHireWOTCStore } from '@/stores/WOTC/onboardingQuickHireWOTCStore'
import OnboardingQuickHireWOTC, { FormT } from '@/models/onboarding/WOTC/OnboardingQuickHireWOTC';
import { FileInputData } from "@/models/onboarding/W4/W4FormFile";
import { useOnboardingHrWOTCStore } from '@/stores/WOTC/onboardingHrWOTCStore';

library.add(faEye, faEyeSlash);
const { getOnboardingHrWOTC } = useOnboardingHrWOTCStore();
const { onboardingHrWOTC } = storeToRefs(useOnboardingHrWOTCStore())
const { onboardingQuickHireWOTC } = storeToRefs(useOnboardingQuickHireWOTCStore());
const { getOnboardingQuickHireWOTC } = useOnboardingQuickHireWOTCStore();
const { setLoading } = useLoadingStore();
const route = useRoute();
const form8850EssId = FormField.WOTC8850Employee
const form9061EssId = FormField.WOTC9061Employee
const form8850HrId = FormField.WOTC8850Employer
const form9061HrId = FormField.WOTC9061Employer
const employeeId: ComputedRef<number> = computed(() => Number(route.params.id));
const store8850Ess = useOnboardingWOTC8850SEssStore();
const store8850Hr = useOnboardingWOTC8850SHrStore();
const store9061Ess = useOnboardingWOTC9061EssStore();
const store9061Hr = useOnboardingWOTC9061HrStore();
const state8850Ess = storeToRefs(useOnboardingWOTC8850SEssStore());
const state8850Hr = storeToRefs(useOnboardingWOTC8850SHrStore());
const state9061Ess = storeToRefs(useOnboardingWOTC9061EssStore());
const state9061Hr = storeToRefs(useOnboardingWOTC9061HrStore());
const { employeeDetails } = storeToRefs(useEmployeeStore());
const hqSuiteStore = useHQSuiteStore();

const formFileId = ref(null)
const isFormDoneId = ref(null)
const noteId = ref(null)
const isShowSecurity = ref(false);

const formData = ref({
    note: '',
    formFiles: '',
    isFormDone: false,
    uploadFileStateForms: [],
})

const viewFormData8850Ess = ref<OnboardingWOTC8850Ess>({
  status: "",
  isFormDone: false,
  lastName: "",
  firstName: "",
  middleInitial: "",
  socialSecurityNumber: "",
  address1: "",
  address2: "",
  city: "",
  state: {
    value: "",
    text: ""
  },
  zipCode: "",
  county: "",
  telePhone: "",
  isUnderForty: true,
  dateOfBirth: "",
  isReceivedAConditional: false,
  isStatementsApply: false,
  isVeteranAndUnemployed: false,
  isVeteranEntitledUSArmed: false,
  isVeteranEntitledSixMonths: false,
  isMemberOfFamily: false,
  isPeriodOfUnemployment: false,
  employeeSignaturePath: "",
  dateSignatureUTC: "",
  formFiles: ""
})
const viewFormData8850Hr = ref<OnboardingWOTC8850Hr>({
  status: "",
  isFormDone: false,
  name: "",
  phone: "",
  ein: "",
  address: "",
  city: "",
  state: {
    value: "",
    text: ""
  },
  zipCode: "",
  otherPerson: "",
  otherPhone: "",
  otherAddress: "",
  otherCity: "",
  otherState: {
    value: "",
    text: ""
  },
  otherZipCode: "",
  group: {
    value: "",
    text: ""
  },
  gaveInformationDate: "",
  offeredJobDate: "",
  hiredDate: "",
  startedJobDate: "",
  employeeSignaturePath: "",
  employeeSignature: "",
  dateSignatureUTC: "",
})
const viewFormData9061Ess = ref<OnboardingWOTC9061Ess>({
  status: "",
  isActive: true,
  isFormDone: false,
  lastName: "",
  firstName: "",
  middleInitial: "",
  socialSecurityNumber: "",
  isHaveWorkedBefore: true,
  lastDateEmployment: "",
  isLastAgeSixteenUnderForty: true,
  dateOfBirth1: "",
  dateOfBirth2: "",
  isVeteranUSAForces: true,
  isUSAVeteranStatus: true,
  cityBenefitReceived1: "",
  stateBenefitReceived1: {
    value: "",
    text: ""
  },
  isVeteranServiceConnected: false,
  isDischargedOrReleased: false,
  isUnemployedCombinedPeriod: false,
  isMemberOfFamily: false,
  isNoLongerReceiving: false,
  namePrimaryRecipient1: "",
  cityBenefitReceived2: "",
  stateBenefitReceived2: {
    value: "",
    text: ""
  },
  isIsReferredToEmployer: false,
  isEmploymentNetwork: false,
  isDepartmentVeteransAffairs: false,
  isReceivedTANFAssistance: false,
  isReceivedTANFBenefit: false,
  isFamilyStopEligibleTANF: false,
  isMemberFamilyReceivedTANF: false,
  namePrimaryRecipient2: "",
  cityBenefitReceived3: "",
  stateBenefitReceived3: {
    value: "",
    text: ""
  },
  isConvictedFelonyOrReleasedFrom: false,
  dateOfConvicted: "",
  dateOfRelease: "",
  isFederalState: null,
  isLiveEmpowermentZoneRRC: false,
  isLiveEmpowermentZone: false,
  isReceiveSupplementalSecurity: false,
  isVeteranUnemployedSixMonth: false,
  isVeteranUnemployedFourWeek: false,
  isIndividualPeriodUnemployment: false,
  receivedUnemployment: {
    value: "",
    text: ""
  },
  employeeSignaturePath: "",
  dateSignatureUTC: "",
  uploadFileStateForms: [],
  formFiles: "",
});
const viewFormData9061Hr = ref<OnboardingWOTC9061Hr>({
  status: "",
  isActive: true,
  isFormDone: false,
  name: "",
  address: "",
  city: "",
  state: {
    value: "",
    text: ""
  },
  zipCode: "",
  phone: "",
  federalId: "",
  startDate: "",
  startWage: "",
  position: "",
  employerSignaturePath: "",
  dateSignatureUTC: ""
});
const signature8850Ess = ref("");
const signature9061Ess = ref("");
const signature9061Hr = ref("");
const formFileData: Ref<FileInputData[]> = ref([]);

const form8850ListFiles = computed(() => {
  const _files = formData.value.uploadFileStateForms.filter((file) => {
    return file.payload.type === FormT.upload8850
  })

  return _files
})
const form9061ListFiles = computed(() => {
  return formData.value.uploadFileStateForms.filter((file) => {
    return file.payload.type === FormT.upload9061
  })
})
const form9062ListFiles = computed(() => {
  return formData.value.uploadFileStateForms.filter((file) => {
    return file.payload.type === FormT.upload9062
  })
})
const note = computed(() => {
  return onboardingHrWOTC.value?.fieldModels.find(x => x.fieldKey == 'noteForm8850')?.fieldValue
})

async function convertToBase64(path: string, base64Url: Ref<string>) {
  try {
    const fileGot = await hqSuiteStore.getFile(path);
    const reader = new FileReader();
    reader.readAsDataURL(fileGot.data);
    reader.onloadend = async function () {
      base64Url.value = reader.result as string;
    };
  } catch (error) {
    base64Url.value = "";
  }
}

const hiddenValue = (value: string, isShow: boolean) => {
  let text = "";
  for (let index = 0; index < value?.length; index++) {
    if (index === 3 || index === 5) text += "-";
    text += "X";
  }
  return isShow ? value : text;
};

onMounted(async () => {
  setLoading(true);
  if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.Onboard) {
    await Promise.all([
      store8850Ess.fetchForm8850Data(employeeId.value, form8850EssId),
      store8850Hr.fetchForm8850Data(employeeId.value, form8850HrId),
      store9061Ess.fetchForm9061Data(employeeId.value, form9061EssId),
      store9061Hr.fetchForm9061Data(employeeId.value, form9061HrId),
      getOnboardingHrWOTC(employeeId.value, FormField.WOTCOnboardSummary),
    ]).finally(
      setLoading(false)
    )

    // hr-onboard
    onboardingHrWOTC.value.uploadFileStateForms.forEach((file) => {
      formFileData.value.push({
        fileName: file.fileName,
        filePath: file.filePath
      })
    })

    //8850Ess
    state8850Ess.form8850Data.value.fieldModels.forEach((item) => {
      const newKey = item.fieldKey as keyof OnboardingWOTC8850Ess
      viewFormData8850Ess.value[newKey] = item.fieldValue as never;
    })
    viewFormData8850Ess.value.dateSignatureUTC = state8850Ess.form8850Data.value.fieldModels.find((item) => item.fieldKey === 'dateSignatureUTC').fieldValue.toString()
    convertToBase64(viewFormData8850Ess.value.employeeSignaturePath, signature8850Ess);

    //8850Hr
    state8850Hr.form8850Data.value.fieldModels.forEach((item) => {
      const newKey = item.fieldKey as keyof OnboardingWOTC8850Hr
      viewFormData8850Hr.value[newKey] = item.fieldValue as never;
    })
    viewFormData8850Hr.value.dateSignatureUTC = state8850Hr.form8850Data.value.fieldModels.find((item) => item.fieldKey === 'dateSignatureUTC').fieldValue.toString()
    
    //9061Ess
    state9061Ess.form9061Data.value.fieldModels.forEach((item) => {
      const newKey = item.fieldKey as keyof OnboardingWOTC9061Ess
      if (!['status', 'isFormDone'].includes(newKey)) {
        viewFormData9061Ess.value[newKey] = item.fieldValue as never;
      }
    })
    viewFormData9061Ess.value.dateSignatureUTC = state9061Ess.form9061Data.value.fieldModels.find((item) => item.fieldKey === 'dateSignatureUTC').fieldValue.toString()
    convertToBase64(viewFormData9061Ess.value.employeeSignaturePath, signature9061Ess);


    //9061Hr
    state9061Hr.form9061Data.value.fieldModels.forEach((item) => {
      const newKey = item.fieldKey as keyof OnboardingWOTC9061Hr
      if (!['status', 'isFormDone'].includes(newKey)) {
        viewFormData9061Hr.value[newKey] = item.fieldValue as never;
      }
    })
    viewFormData9061Hr.value.dateSignatureUTC = state9061Hr.form9061Data.value.fieldModels.find((item) => item.fieldKey === 'dateSignatureUTC').fieldValue.toString()
    convertToBase64(viewFormData9061Hr.value.employerSignaturePath, signature9061Hr);


  } else if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.QuickHire) {
    await getOnboardingQuickHireWOTC(employeeId.value, FormField.WOTCQuickHire)
    // quick-hire
    onboardingQuickHireWOTC.value.fieldModels.forEach((item) => {
      const newKey = item.fieldKey as keyof OnboardingQuickHireWOTC
      formData.value[newKey] = item.fieldValue as never
    })
    formData.value.uploadFileStateForms = [...onboardingQuickHireWOTC.value.uploadFileStateForms]
  }

  setLoading(false);
});

function enforcePhoneFormat(str: string) {
  const x = str?.replace(/\D/g, "")?.match(/(\d{0,3})(\d{0,3})(\d{0,4})/) || [];

  return !x[2] ? x[1] : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
}

function handlePreviewFile(file: FileInputData) {
  if (!file) return;
  if (file?.fileObject) {
    const newTab = window.open('', '_blank');
    newTab.document.write('<iframe src="' + file?.fileUrl + '" width="100%" height="100%"></iframe>');
  } else {
    // CHECK FILE TYPE
    let fileType = '';
    const parts = file.fileName.split('.');
    if (parts.length > 1) {
      fileType = parts[parts.length - 1].toLowerCase();
    } else {
      fileType = '';
    }
    const filePath = `${file.filePath}/${file.fileName}`;
    // WITH TYPE PDF
    if (fileType === 'pdf') {
      hqSuiteStore.previewPDFFile(filePath);
    } else if (['png', 'jpg', 'jpeg'].includes(fileType)) {
      //WITH TYPE IMAGE
      hqSuiteStore.previewImageFile(filePath)
    }
  }

}
</script>
<template>
  <div>
    <div class="mb-3 px-3"> 
    <fs-row>
      <fs-col cols="2" class="fw-bold">
        Note
      </fs-col>
      <fs-col cols="10">
        {{ note }}
      </fs-col>
    </fs-row>
  </div>

    <template v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.Onboard">
      <div id="summarySection" class="mb-2" v-if="formFileData.length || note">
        <div v-for="document in formFileData" :key="document.filePath" class="file_item d-flex align-items-center mb-1">
          <font-awesome-icon :icon="['fal', 'paperclip']" />
          <fs-link @click="handlePreviewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
            <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
          </fs-link>
        </div>

      </div>
    </template>

    <div class="py-3 cyan-label">Form 8850</div>
    <template v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.Onboard">
      <div class="border border-status-inactive rounded-lg overflow-hidden">
        <div class="py-2 px-3 bg-status-inactive text-white fw-bold">FORM 8850 | EMPLOYEE'S SECTION</div>
        <div class="px-3 py-2">
          <fs-row>
            <fs-col cols="3" class="label">Full Name</fs-col>
            <fs-col>{{ viewFormData8850Ess?.firstName }} {{ viewFormData8850Ess?.lastName }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Social Security Number</fs-col>
            <fs-col>{{ hiddenValue(FormatSsn(Number(viewFormData8850Ess?.socialSecurityNumber)), isShowSecurity) }}
              <font-awesome-icon @click="isShowSecurity = !isShowSecurity" class="icon-eye"
                :icon="['fal', isShowSecurity ? 'eye' : 'eye-slash']" /></fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Address</fs-col>
            <fs-col>
              <div>{{ viewFormData8850Ess?.address1 }}</div>
              <div>{{ viewFormData8850Ess?.address2 }}</div>
              <div>
                {{ viewFormData8850Ess?.city }}, {{ viewFormData8850Ess?.state.value }} {{ viewFormData8850Ess?.zipCode }}
              </div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">County</fs-col>
            <fs-col>
              {{ viewFormData8850Ess?.county }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Telephone Number</fs-col>
            <fs-col>
              {{ enforcePhoneFormat(viewFormData8850Ess?.telePhone) }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Date of Birth
              <span style="margin-bottom: 0px; font-weight: normal; font-size: small">(if you are under age
                40)</span></fs-col>
            <fs-col v-if="viewFormData8850Ess?.dateOfBirth">
              {{ moment(viewFormData8850Ess?.dateOfBirth).format("MM/DD/yyyy") }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Selected Checkboxes</fs-col>
            <fs-col>
              <div v-if="viewFormData8850Ess?.isReceivedAConditional">
                you received a conditional certification from the state
                workforce agency (SWA) or a participating local agency for the work
                opportunity credit.
              </div>
              <div class="label">Any of the following statements apply to you.</div>
              <div v-if="viewFormData8850Ess?.isStatementsApply">
                <ul class="mt-2">
                  <li>
                    I am a member of a family that has received assistance from
                    Temporary Assistance for Needy Families (TANF) for any 9 months
                    during the past 18 months.
                  </li>
                  <li>
                    I am a veteran and a member of a family that received Supplemental
                    Nutrition Assistance Program (SNAP) benefits (food stamps) for at
                    least a 3-month period during the past 15 months.
                  </li>
                  <li>
                    I was referred here by a rehabilitation agency approved by the
                    state, an employment network under the Ticket to Work program, or
                    the Department of Veterans Affairs.
                  </li>
                  <li>
                    <div>
                      I am at least age 18 but not age 40 or older and I am a member
                      of a family that:
                    </div>
                    <div>
                      a. Received SNAP benefits (food stamps) for the past 6 months;
                      or
                      <br />
                      b. Received SNAP benefits (food stamps) for at least 3 of the
                      past 5 months, but is no longer eligible to receive them.
                    </div>
                  </li>
                  <li>
                    During the past year, I was convicted of a felony or released from
                    prison for a felony.
                  </li>
                  <li>
                    I received supplemental security income (SSI) benefits for any
                    month ending during the past 60 days.
                  </li>
                  <li>
                    I am a veteran and I was unemployed for a period or periods
                    totaling at least 4 weeks but less than 6 months during the past
                    year.
                  </li>
                </ul>
              </div>
              <div v-if="viewFormData8850Ess?.isVeteranAndUnemployed">
                You are a veteran and you were unemployed for a period
                or periods totaling at least 6 months during the past year.
              </div>
              <div v-if="viewFormData8850Ess?.isVeteranEntitledUSArmed">
                You are a veteran entitled to compensation for a
                service-connected disability and you were discharged or released from
                active duty in the U.S. Armed Forces during the past year.
              </div>
              <div v-if="viewFormData8850Ess?.isVeteranEntitledSixMonths">
                You are a veteran entitled to compensation for a
                service-connected disability and you were unemployed for a period or
                periods totaling at least 6 months during the past year.
              </div>
              <div v-if="viewFormData8850Ess?.isMemberOfFamily">
                any of the following statements apply to you.
                <ul class="mt-2">
                  <li>
                    Received TANF payments for at least the past 18 months;
                    <strong>or</strong>
                  </li>
                  <li>
                    Received TANF payments for any 18 months beginning after August 5,
                    1997, <strong>and</strong> the earliest 18-month period beginning
                    after August 5, 1997, ended during the past 2 years; or
                  </li>
                  <li>
                    Stopped being eligible for TANF payments during the past 2 years
                    because federal
                    <strong>or</strong>
                    state law limited the maximum time those payments could be made
                  </li>
                </ul>
              </div>
              <div v-if="viewFormData8850Ess?.isPeriodOfUnemployment">
                You are in a period of unemployment that is at least 27
                consecutive weeks and for all or part of that period you received
                unemployment compensation.
              </div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="12" class="label">Job Applicant's Signature</fs-col>
            <fs-col>
              <div class="border w-100 mt-2">
                <img class="img-fluid" :src="signature8850Ess" alt="employee signature" />
              </div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Date</fs-col>
            <fs-col>
              <div v-if="viewFormData8850Ess?.dateSignatureUTC">
                {{ moment(viewFormData8850Ess?.dateSignatureUTC).format("MM/DD/yyyy") }} -
                {{ moment(viewFormData8850Ess?.dateSignatureUTC).format("hh:mm A") }}
              </div>
            </fs-col>
          </fs-row>
        </div>
      </div>

      <div class="mt-3 border border-cerulean rounded-lg overflow-hidden">
        <div class="py-2 px-3 bg-cerulean text-white fw-bold">FORM 8850 | EMPLOYER'S SECTION</div>
        <div class="px-3 py-2">
          <fs-row>
            <fs-col cols="3" class="label">Employer’s Name</fs-col>
            <fs-col>{{ viewFormData8850Hr?.name }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Telephone No.</fs-col>
            <fs-col>{{ viewFormData8850Hr?.phone }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">EIN</fs-col>
            <fs-col>
              <div>{{ viewFormData8850Hr?.ein }}</div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Address</fs-col>
            <fs-col>
              {{ viewFormData8850Hr?.address }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">People to Contact</fs-col>
            <fs-col>
              {{ viewFormData8850Hr?.otherPerson }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Address
            </fs-col>
            <fs-col>
              {{ viewFormData8850Hr?.otherAddress }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Group Number
            </fs-col>
            <fs-col>
              {{ viewFormData8850Hr?.group.value }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Gave Information
            </fs-col>
            <fs-col>
              {{ viewFormData8850Hr?.gaveInformationDate }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Was Offered Job
            </fs-col>
            <fs-col>
              {{ viewFormData8850Hr?.offeredJobDate }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Was Hired
            </fs-col>
            <fs-col>
              {{ viewFormData8850Hr?.hiredDate }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Started Job
            </fs-col>
            <fs-col>
              {{ viewFormData8850Hr?.startedJobDate }}
            </fs-col>
          </fs-row>
        </div>
      </div>
    </template>
    <template v-else-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.QuickHire">
      <div v-for="document in form8850ListFiles" :key="document.filePath"
        class="file_item d-flex align-items-center mb-1 p">
        <font-awesome-icon :icon="['fal', 'paperclip']" />
        <fs-link @click="handlePreviewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
          <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
        </fs-link>
      </div>
      <div v-if="!form8850ListFiles.length">No file submitted.</div>
    </template>

    <div class="py-3 cyan-label">Form 9061</div>
    <template v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.Onboard">
      <div class="border border-status-inactive rounded-lg overflow-hidden">
        <div class="py-2 px-3 bg-status-inactive text-white fw-bold">FORM 9061 | EMPLOYEE'S SECTION</div>
        <div class="px-3 py-2">
          <strong>Applicant Information</strong>
          <fs-row>
            <fs-col cols="3" class="label">Full Name</fs-col>
            <fs-col>{{ viewFormData9061Ess?.firstName }} {{ viewFormData9061Ess?.lastName }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Social Security Number</fs-col>
            <fs-col>{{ hiddenValue(FormatSsn(Number(viewFormData9061Ess?.socialSecurityNumber)), isShowSecurity) }}
              <font-awesome-icon @click="isShowSecurity = !isShowSecurity" class="icon-eye"
                :icon="['fal', isShowSecurity ? 'eye' : 'eye-slash']" /></fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Prior Employment For This Employer</fs-col>
            <fs-col>{{ viewFormData9061Ess?.isHaveWorkedBefore ? "Yes" : "No" }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Last date of Employment </fs-col>
            <fs-col v-if="viewFormData9061Ess?.lastDateEmployment">
              {{ moment(viewFormData9061Ess?.lastDateEmployment).format("MM/DD/yyyy") }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="4" class="label" style="margin-top: 10px">Applicant characteristics for WOTC TARGET GROUP
              CERTIFICATION
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">1</span>
              <div>Date of Birth
                <span style="margin-bottom: 0px; font-weight: normal; font-size: small">(If you at least age 16, but under
                  age
                  40)</span>
              </div>
            </fs-col>
            <fs-col v-if="viewFormData9061Ess?.dateOfBirth1">
              {{ moment(viewFormData9061Ess?.dateOfBirth1).format("MM/DD/yyyy") }}
            </fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">2</span>
              <div>Are you a Veteran of the U.S. Armed Forces</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isVeteranUSAForces ? "Yes" : "No" }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">Are you a member of a family that received Supplemental Nutrition
              Assistance Program (SNAP) benefits (Food Stamps) for at least 3 months
              during the 15 months before you were hired?</fs-col>
            <fs-col>{{ viewFormData9061Ess?.isUSAVeteranStatus ? "Yes" : "No" }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">Your date of birth</fs-col>
            <fs-col v-if="viewFormData9061Ess?.dateOfBirth2">{{
              moment(viewFormData9061Ess?.dateOfBirth2).format("MM/DD/yyyy")
            }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">City where benefits were received</fs-col>
            <fs-col>{{ viewFormData9061Ess?.cityBenefitReceived1 }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">State where benefits were received</fs-col>
            <fs-col>{{ viewFormData9061Ess?.stateBenefitReceived1.value }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">3</span>
              <div>Are you a member of a family that received
                Supplemental
                Nutrition Assistance Program (SNAP) (formerly Food Stamps) benefits for
                the 6 months before you were hired?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isMemberOfFamily ? "Yes" : "No" }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">Name of primary recipient</fs-col>
            <fs-col>{{ viewFormData9061Ess?.namePrimaryRecipient1 }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">City where benefits were received</fs-col>
            <fs-col>{{ viewFormData9061Ess?.cityBenefitReceived2 }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">State where benefits were received</fs-col>
            <fs-col>{{ viewFormData9061Ess?.stateBenefitReceived2.value }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">4</span>
              <div>Were you referred to an employer by a Vocational
                Rehabilitation Agency approved by a State?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isIsReferredToEmployer ? "Yes" : "No" }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">5</span>
              <div>Did your family stop being eligible for TANF
                assistance
                within
                2 years before you were hired because a Federal or state law limited the
                maximum time those payments could be made?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isReceivedTANFAssistance ? "Yes" : "No" }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">Name of primary recipient</fs-col>
            <fs-col>{{ viewFormData9061Ess?.namePrimaryRecipient2 }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">City where benefits were received</fs-col>
            <fs-col>{{ viewFormData9061Ess?.cityBenefitReceived3 }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">State where benefits were received</fs-col>
            <fs-col>{{ viewFormData9061Ess?.stateBenefitReceived3.value }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">6</span>
              <div>Were you convicted of a felony or released from
                prison
                after a
                felony conviction during the year before you were hired?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isConvictedFelonyOrReleasedFrom ? "Yes" : "No" }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">Date of Conviction</fs-col>
            <fs-col v-if="viewFormData9061Ess?.dateOfConvicted">{{
              moment(viewFormData9061Ess?.dateOfConvicted).format("MM/DD/yyyy")
            }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">Date of release</fs-col>
            <fs-col v-if="viewFormData9061Ess?.dateOfRelease">{{
              moment(viewFormData9061Ess?.dateOfRelease).format("MM/DD/yyyy")
            }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">Conviction by</fs-col>
            <fs-col>{{ viewFormData9061Ess?.isFederalState }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">7</span>
              <div>Do you live in an Empowerment Zone or Rural Renewal
                County
                (RRC)?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isLiveEmpowermentZoneRRC ? "Yes" : "No" }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">8</span>
              <div>Do you live in an Empowerment Zone and are at least
                age
                16,
                but not yet 18, on your hiring date?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isLiveEmpowermentZone ? "Yes" : "No" }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">9</span>
              <div>Did you receive Supplemental Security Income (SSI)
                benefits
                for any month ending within 60 days before you were hired?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isReceiveSupplementalSecurity ? "Yes" : "No" }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">10</span>
              <div class="ml-10">Are you a veteran unemployed for a combined period
                of
                at
                least 6 months (whether or not consecutive) during the year before you
                were hired?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isVeteranUnemployedSixMonth ? "Yes" : "No" }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">11</span>
              <div class="ml-10">Are you a veteran unemployed for a combined period
                of
                at
                least 4 weeks but less than 6 months (whether or not consecutive) during
                the year before you were hired?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isVeteranUnemployedFourWeek ? "Yes" : "No" }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">12</span>
              <div class="ml-10">Are you an individual who is or was in a period of
                unemployment that is at least 27 consecutive weeks and for all or part
                of that period you received unemployment compensation?</div>
            </fs-col>
            <fs-col>{{ viewFormData9061Ess?.isIndividualPeriodUnemployment ? "Yes" : "No" }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="7">State where unemployment compensation was received</fs-col>
            <fs-col>{{ viewFormData9061Ess?.receivedUnemployment.text }}</fs-col>
          </fs-row>

          <fs-row>
            <fs-col cols="7" class="label d-flex"><span class="me-2">13</span>
              <div class="ml-10">Sources used to document eligibility</div>
            </fs-col>
            <fs-col>
              <span v-for="file in state9061Ess.form9061Data.value?.uploadFileStateForms" :key="file.uploadDateUTC"
                class="text-success file">
                {{ truncateFileName(file.fileName) }}
              </span>
            </fs-col>
          </fs-row>
          <div v-if="!viewFormData9061Hr.employerSignaturePath">
            <fs-row>
              <fs-col cols="12" class="label">Job Applicant's Signature</fs-col>
              <fs-col>
                <div class="border w-100 mt-2">
                  <img class="img-fluid" :src="signature9061Ess" alt="employee signature" />
                </div>
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col cols="3" class="label">Date</fs-col>
              <fs-col>
                <div v-if="viewFormData9061Ess?.dateSignatureUTC">
                  {{ moment(viewFormData9061Ess?.dateSignatureUTC).format("MM/DD/yyyy") }} -
                  {{ moment(viewFormData9061Ess?.dateSignatureUTC).format("hh:mm A") }}
                </div>
              </fs-col>
            </fs-row>
          </div>
        </div>
      </div>

      <div class="mt-3 border border-cerulean rounded-lg overflow-hidden">
        <div class="py-2 px-3 bg-cerulean text-white fw-bold">FORM 9061 | EMPLOYER'S SECTION</div>
        <div class="px-3 py-2">
          <fs-row>
            <fs-col cols="3" class="label">Employer’s Name</fs-col>
            <fs-col>{{ viewFormData9061Hr?.name }}</fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Address</fs-col>
            <fs-col>{{ viewFormData9061Hr?.address }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Employer Telephone No.</fs-col>
            <fs-col>
              <div>{{ viewFormData9061Hr?.phone }}</div>
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Employer Federal ID Number (EIN)</fs-col>
            <fs-col>
              {{ viewFormData9061Hr?.federalId }}
            </fs-col>
          </fs-row>
          <div class="label my-2">APPLICANT CHARACTERISTICS FOR WOTC TARGET GROUP CERTIFICATION</div>
          <fs-row>
            <fs-col cols="3" class="label">Employment Start Date</fs-col>
            <fs-col v-if="viewFormData9061Hr?.startDate">
              {{ moment(viewFormData9061Hr?.startDate).format("MM/DD/yyyy") }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Starting Wage
            </fs-col>
            <fs-col v-if="viewFormData9061Hr?.startWage">
              ${{ viewFormData9061Hr?.startWage.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }}
            </fs-col>
          </fs-row>
          <fs-row>
            <fs-col cols="3" class="label">Position</fs-col>
            <fs-col>
              {{ viewFormData9061Hr?.position }}
            </fs-col>
          </fs-row>
          <div v-if="!viewFormData9061Ess.employeeSignaturePath && viewFormData9061Hr.employerSignaturePath">
            <fs-row>
              <fs-col>
                <div class="border w-100 mt-2">
                  <img class="img-fluid" :src="signature9061Hr" alt="employer signature" />
                </div>
              </fs-col>
            </fs-row>

            <fs-row>
              <fs-col cols="3" class="label">Date</fs-col>
              <fs-col>
                <div v-if="viewFormData9061Hr?.dateSignatureUTC">
                  {{ moment(viewFormData9061Hr?.dateSignatureUTC).format("MM/DD/yyyy") }} -
                  {{ moment(viewFormData9061Hr?.dateSignatureUTC).format("hh:mm A") }}
                </div>
              </fs-col>
            </fs-row>
          </div>

        </div>
      </div>
    </template>
    <template v-else-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.QuickHire">
      <div v-for="document in form9061ListFiles" :key="document.filePath"
        class="file_item d-flex align-items-center mb-1 p">
        <font-awesome-icon :icon="['fal', 'paperclip']" />
        <fs-link @click="handlePreviewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
          <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
        </fs-link>
      </div>
      <div v-if="!form9061ListFiles.length">No file submitted.</div>
    </template>

    <template v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.QuickHire">
      <div class="py-3 cyan-label">Form 9062</div>
      <div v-for="document in form9062ListFiles" :key="document.filePath"
        class="file_item d-flex align-items-center mb-1 p">
        <font-awesome-icon :icon="['fal', 'paperclip']" />
        <fs-link @click="handlePreviewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
          <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
        </fs-link>
      </div>
      <div v-if="!form9062ListFiles.length">No file submitted.</div>
    </template>

  </div>
</template>

<style scoped lang="scss">
.row {
  margin-top: 10px;
}

.label {
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
}

.icon-eye {
  color: #1abc9c;
  cursor: pointer;
  margin-left: 5px;
}

.cyan-label {
  font-weight: 600;
  font-size: 16px;
  line-height: 22px;
  text-transform: uppercase;
  color: #03a9f4;
}

.bg-blue-grey {
  background-color: #6E7C8F;
}

.rounded-lg {
  border-radius: 10px;
}

#summarySection {
  padding: 12px;
  border-radius: 10px;
}

.file {
  cursor: pointer;
  text-decoration: underline;
}
</style>