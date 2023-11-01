<script lang="ts" setup>
import SignaturePad from "@/components/common/SignaturePad.vue";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { STATES } from "@/constants/common";
import { FormField } from "@/enums/FormField";
import { OnboardingWOTC9061Ess } from "@/models/onboarding/WOTC/HrOnboardingWOTC9061Ess";
import { UploadPayload } from "@/models/onboarding/WOTC/UploadPayload";
import { useOnboardingWOTC9061Store } from "@/stores/WOTC/onboardingHrWOTC9061EssStore";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import moment from 'moment'
import {
  faArrowUpFromBracket,
  faCircle,
  faPaperclip,
  faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import {
  faAsterisk,
  faCircleExclamation,
  faPenToSquare,
} from "@fortawesome/pro-solid-svg-icons";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import { dataUrlToFile } from "@/helper/hqSuite/formatHelper";
library.add(
  faCircle,
  faPenToSquare,
  faAsterisk,
  faArrowUpFromBracket,
  faPaperclip,
  faCircleExclamation,
  faTrashCan
);
const isFormChanged = ref(false);
const isSignatureConsent = ref(true);
const signatureFilePath = ref("");
const signatureObject = ref({
  path: '',
  fileObject: null,
  name: ''
})
const route = useRoute();
const formId = FormField.WOTC9061Employee;
const employeeId = computed(() => Number(route.params.id));
const memberOfFamilyReceiveTANFOption = [
  {
    text: "Are you a member of a family that received TANF assistance for at least the last 18 months before you were hired?",
    value: 1,
    disabled: true
  },
  {
    text: "are you a member of a family that received TANF benefits for any 18 months beginning after August 5, 1997, and the earliest 18-month period beginning after August 5, 1997, ended within 2 years before you were hired?",
    value: 2,
    disabled: true
  },
  {
    text: "did your family stop being eligible for TANF assistance within 2 years before you were hired because a Federal or state law limited the maximum time those payments could be made?",
    value: 3,
    disabled: true
  },
];

const referredToEmployerOption = [
  {
    text: "Were you referred to an employer by a Vocational Rehabilitation Agency approved by a State?",
    value: 1,
    disabled: true
  },
  {
    text: "By an Employment Network under the Ticket to Work Program?",
    value: 2,
    disabled: true
  },
  {
    text: "By the Department of Veterans Affairs?",
    value: 3,
    disabled: true
  },
];

const isFederalState = [
  {
    text: "Federal",
    value: true,
    disabled: true
  },
  {
    text: "State",
    value: false,
    disabled: true
  },
];

const baseOptions = [
  { text: "Yes", value: true, disabled: true },
  { text: "No", value: false, disabled: true },
];

const { fetchForm9061Data } = useOnboardingWOTC9061Store();
const { responsive } = useBreakpoints();
const { setLoading } = useLoadingStore();
const { form9061Data } = storeToRefs(useOnboardingWOTC9061Store());
const container = ref(null);
const formRef = ref(null);
const hideSocialSecurityNumber = ref(true);
const hqSuiteStore = useHQSuiteStore();
const fileInput = ref(null);
const isLoaded = ref(false);
const isSm = ref(false);
const isMd = ref(false);
const isLg = ref(false);
const isXl = ref(true);
const formData = ref<OnboardingWOTC9061Ess & { employeeSignature: string }>({
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
  stateBenefitReceived1: null,
  isVeteranServiceConnected: false,
  isDischargedOrReleased: false,
  isUnemployedCombinedPeriod: false,
  isMemberOfFamily: false,
  isNoLongerReceiving: false,
  namePrimaryRecipient1: "",
  cityBenefitReceived2: "",
  stateBenefitReceived2: null,
  isIsReferredToEmployer: false,
  isEmploymentNetwork: false,
  isDepartmentVeteransAffairs: false,
  isReceivedTANFAssistance: false,
  isReceivedTANFBenefit: false,
  isFamilyStopEligibleTANF: false,
  isMemberFamilyReceivedTANF: false,
  namePrimaryRecipient2: "",
  cityBenefitReceived3: "",
  stateBenefitReceived3: null,
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
  receivedUnemployment: null,
  employeeSignaturePath: "",
  dateSignatureUTC: "",
  uploadFileStateForms: [],
  employeeSignature: "",
  formFiles: "",
});

const uploadFormData = ref<Partial<UploadPayload<OnboardingWOTC9061Ess>>>({
  fieldModels: [],
  uploadFileStateForms: [],
  formId,
  employeeId: employeeId.value
})

const handlePreviewFile = async (file) => {
  setLoading(true);
  if (!file) return;
  if (file?.fileObject) {
    if (file.fileUrl) {
      const newTab = window.open('', '_blank');
      newTab?.document.write('<iframe src="' + file?.fileUrl + '" style="width: 100%; height: 100%"></iframe>');
    }
  } else {
    const fullFileName = `${file.filePath}/${file.fileName}`
    // CHECK FILE TYPE
    let fileType = '';
    const parts = file.fileName.split('.');
    if (parts.length > 1) {
      fileType = parts[parts.length - 1].toLowerCase();
    } else {
      fileType = '';
    }
    // WITH TYPE PDF
    if (fileType === 'pdf') {
      const newTab = window.open('', '_blank');
      const res = await hqSuiteStore.previewPDFFile(fullFileName);
      newTab?.document.write('<iframe src="' + res + '" style="width: 100%; height: 100%"></iframe>');
    } else if (['png', 'jpg', 'jpeg'].includes(fileType)) {
      //WITH TYPE IMAGE
      const res = await hqSuiteStore.previewImageFile(fullFileName)
      const newTab = window.open('', '_blank');
      newTab?.document.write('<iframe src="' + res + '" style="width: 100%; height: 100%"></iframe>');
    }
  }
  setLoading(false);
}

onMounted(async () => {
  setLoading(true);
  await fetchForm9061Data(employeeId.value, formId)

  form9061Data.value.fieldModels.forEach((item) => {
    const newKey = item.fieldKey as keyof OnboardingWOTC9061Ess
    formData.value[newKey] = item.fieldValue as never

    uploadFormData.value.fieldModels.push(({
      formFieldId: item.formFieldId,
      fieldKey: item.fieldKey,
      fieldValue: item.fieldValue
    }))
  })
  formData.value.employeeSignature = '';
  formData.value.dateSignatureUTC = form9061Data.value.fieldModels.find((item) => item.fieldKey === 'dateSignatureUTC').fieldValue.toString()
  formData.value.uploadFileStateForms = [...form9061Data.value.uploadFileStateForms]
  await formRef.value.setErrors([])
  isLoaded.value = true;
  setLoading(false);
});

watch(
  () => responsive.breakpoint,
  () => {
    isSm.value = responsive.breakpoint === "sm";
    isMd.value = responsive.breakpoint === "md";
    isLg.value = responsive.breakpoint === "lg";
    isXl.value = responsive.breakpoint === "xl";
  }
);

const handleClearSignature = () => {
  formData.value.employeeSignaturePath = '';
}

const handleUpdatePathSignature = async (value: string) => {
  const name = `FormWOTC9061-Signature-${new Date().getTime()}.png`;
  const File = await dataUrlToFile(value, name);
  signatureObject.value.path = signatureFilePath.value;
  signatureObject.value.name = name;
  signatureObject.value.fileObject = File;
  formData.value.employeeSignature = value;
  formData.value.employeeSignaturePath = `${signatureFilePath.value}/${name}`;
}

const handleUpdatePathEmp = (path: string) => {
  formData.value.employeeSignaturePath = path;
}

</script>
<template>
    <!-- change to use equivalent fs-input component after merge code from onboarding branch -->
  <div class="pt-0 text-justify" ref="container">
    <!-- form body -->
    <div class="form-body" :class="isXl && 'w-max'">
      <VeeForm ref="formRef">
        <div class="p-4 d-flex align-items-center gap-3 form_header bg-white">
          <span>
            <fs-link tag="a" :to="{ name: 'hrOnboardingWOTC' }"><font-awesome-icon :icon="['fal', 'circle-arrow-left']"
                size="lg" class="text-mountain-meadow" /></fs-link>
          </span>
          <h5 class="fw-bold">Form 9061 | Employee’s Section</h5>
        </div>

        <div class="fw-bold my-2 p-4">
          <span>JOB APPLICANT</span>
        </div>
        <div class="p-4">
        <!-- Applicant Information -->
        <div class="gap-3 justify-content-between" :class="isXl ? 'd-flex' : 'd-flex flex-column'">
          <div class="flex-3">
            <fs-input type="fsTextInput" v-model="formData.lastName" name="Last Name" label="Last Name"
              rules="required|max:20" disabled :required="true" />
          </div>
          <div class="flex-3">
            <fs-input type="fsTextInput" v-model="formData.firstName" name="First Name" label="First Name"
              rules="required|max:20" disabled :required="true" />
          </div>
          <div class="flex-1">
            <fs-input type="fsTextInput" v-model="formData.middleInitial" name="Middle Initial" label="Middle Initial"
              rules="required|length:1" :required="true" disabled style="min-width: 100px" />
          </div>
        </div>

        <div :class="isXl && 'w-50'">
          <fs-input type="fsTextInput" :input-type="hideSocialSecurityNumber ? 'password' : 'text'"
            v-model="formData.socialSecurityNumber" rules="required|max:11" name="Social security number"
            label="Social security number" disabled :required="true">
            <template #outside-input-group>
              <fs-button class="fs-input__overlap-button" @click="hideSocialSecurityNumber = !hideSocialSecurityNumber"
                variant="outline-secondary">
                <font-awesome-icon :icon="hideSocialSecurityNumber
                  ? 'fa-light fa-eye'
                  : 'fa-light fa-eye-slash'
                  " />
              </fs-button>
            </template>
          </fs-input>
        </div>

        <div>
          <label>Have you worked for this employer before</label><font-awesome-icon :icon="['fas', 'asterisk']" size="sm"
            class="text-danger ms-2" />

          <div class="mb-3">
            <VeeField v-model="formData.isHaveWorkedBefore" name="workedForEmployer">
              <div :class="isSm
                ? 'd-flex flex-column justify-content-start gap-2'
                : 'd-flex gap-2 justify-content-between w-100 align-items-center'
                ">
                <div>
                  <fs-form-radio disabled v-model="formData.isHaveWorkedBefore" :value="true">
                    <span class="pe-2">Yes</span>
                  </fs-form-radio>

                  <fs-form-radio disabled class="mt-2" v-model="formData.isHaveWorkedBefore" :value="false">
                    <div class="ms-1 mt-1">No</div>
                  </fs-form-radio>
                </div>
                <div class="d-flex justify-content-between align-items-center">
                  <div class="px-2" :class="isXl && 'border-left'" style="white-space: nowrap">
                    Last date of Employment
                  </div>
                  <fs-input type="fsDateInput" v-model="formData.lastDateEmployment" name="workingDate" label=""
                    :rules="formData.isHaveWorkedBefore && { required: true }" disabled style="min-width: 185px" />
                </div>
              </div>
            </VeeField>
          </div>
        </div>

        <div class="fw-bold">
          APPLICANT CHARACTERISTICS FOR WOTC TARGET GROUP CERTIFICATION
        </div>

        <!-- 1 between 16 and 40 years old -->
        <div>
          <div class="d-flex" :class="isXl ? 'justify-content-between' : 'd-flex flex-column'">
            <span>
              <label><span class="me-2">1.</span>Are you at least age 16, but under
                age 40?</label>
            </span>
            <VeeField v-model="formData.isLastAgeSixteenUnderForty" name="underForty">
              <fs-form-radio-group class="ms-3" :stacked="isSm" v-model="formData.isLastAgeSixteenUnderForty"
                :options="baseOptions"></fs-form-radio-group>
            </VeeField>
          </div>

          <fs-row class="ms-2">
            <fs-col xl="9" md="12" for="between16and40YearOld"><strong>If YES</strong>, enter your date of birth</fs-col>
            <fs-col xl="3" md="12">
              <fs-input type="fsDateInput" v-model="formData.dateOfBirth1" name="dateOfBirth1" label="" disabled />
            </fs-col>
          </fs-row>
        </div>

        <!-- 2 veteran US Force -->
        <div>
          <div class="d-flex gap-3" :class="isSm ? 'flex-column' : 'justify-content-between'">
            <span>
              <label for="USForceVeteran"><span class="me-2">2.</span>Are you a Veteran of the U.S. Armed
                Forces?</label>
            </span>

            <VeeField id="USForceVeteran" v-model="formData.isVeteranUSAForces" name="USForceVeteran">
              <fs-form-radio-group class="ms-3" :stacked="isSm" v-model="formData.isVeteranUSAForces"
                :options="baseOptions"></fs-form-radio-group>
            </VeeField>
          </div>

          <div class="my-3 ms-3"><strong>If NO</strong>, go to question 3</div>

          <div class="ms-3">
            <div class="d-flex gap-3" :class="isSm ? 'flex-column' : 'justify-content-between'">
              <div :class="isXl && 'w-75'">
                <strong>If YES</strong>, are you a member of a family that
                received Supplemental Nutrition Assistance Program (SNAP)
                benefits (Food Stamps) for at least 3 months during the 15
                months before you were hired?
              </div>
              <VeeField v-model="formData.isUSAVeteranStatus" name="isUSAVeteranStatus">
                <fs-form-radio-group :stacked="isSm" v-model="formData.isUSAVeteranStatus"
                  :options="baseOptions"></fs-form-radio-group>
              </VeeField>
            </div>


            <div>
              <div class="py-1">
                <fs-row class="align-items-center">
                  <fs-col xl="9" md="12">
                    <strong>If YES</strong>, enter your date of birth
                  </fs-col>

                  <fs-col xl="3" md="6" sm="12">
                    <fs-input type="fsDateInput" v-model="formData.dateOfBirth2" name="dateOfBirth2" label="" disabled />
                  </fs-col>
                </fs-row>

                <fs-row class="align-items-center">
                  <fs-col xl="9" md="12">City where benefits were received</fs-col>
                  <fs-col xl="3" md="6" sm="12">
                    <fs-input type="fsTextInput" v-model="formData.cityBenefitReceived1" name="cityBenefitReceived1"
                      label="" disabled />
                  </fs-col>
                </fs-row>

                <fs-row class="align-items-center">
                  <fs-col xl="9" md="12">State where benefits were received</fs-col>
                  <fs-col xl="3" md="6" sm="12">
                    <fs-input type="fsTextInput" v-model="formData.stateBenefitReceived1" name="stateBenefitReceived1"
                      label="" disabled />
                  </fs-col>
                </fs-row>
              </div>

              <div>
                <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
                  <span><strong>Or</strong>, are you a veteran entitled to
                    compensation for a service-connected disability?</span>

                  <VeeField v-model="formData.isVeteranServiceConnected" name="isVeteranServiceConnected">
                    <fs-form-radio-group :stacked="isSm" v-model="formData.isVeteranServiceConnected"
                      :options="baseOptions"></fs-form-radio-group>
                  </VeeField>
                </div>

                <div>
                  <div class="d-flex gap-3 justify-content-between mb-3 w-100" :class="isSm && 'flex-column'">
                    <div :class="isXl && 'w-75'">
                      <strong>If YES</strong>, were you discharged or released
                      from active duty within a year before you were hired?
                    </div>
                    <VeeField v-model="formData.isDischargedOrReleased" name="isDischargedOrReleased">
                      <fs-form-radio-group :stacked="isSm" v-model="formData.isDischargedOrReleased"
                        :options="baseOptions"></fs-form-radio-group>
                    </VeeField>
                  </div>


                  <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
                    <div :class="isXl && 'w-75'">
                      <strong>Or</strong>, were you unemployed for a combined
                      period of at least 6 months (whether or not consecutive)
                      during the year before you were hired?
                    </div>
                    <VeeField v-model="formData.isUnemployedCombinedPeriod" name="isUnemployedCombinedPeriod">
                      <fs-form-radio-group :stacked="isSm" v-model="formData.isUnemployedCombinedPeriod"
                        :options="baseOptions"></fs-form-radio-group>
                    </VeeField>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 member of a family that received SNAP 6 months before hired -->
        <div class="d-flex">
          <label class="me-2">3.</label>
          <div>
            <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
              <div :class="isXl && 'w-75'">
                Are you a member of a family that received Supplemental
                Nutrition Assistance Program (SNAP) (formerly Food Stamps)
                benefits for the 6 months before you were hired?
              </div>
              <VeeField v-model="formData.isMemberOfFamily" name="isMemberOfFamily">
                <fs-form-radio-group :stacked="isSm" v-model="formData.isMemberOfFamily"
                  :options="baseOptions"></fs-form-radio-group>
              </VeeField>
            </div>
            <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
              <div :class="isXl && 'w-75'">
                <strong>Or</strong>, received SNAP benefits for at least a
                3-month period within the last 5 months,
                <br />
                <strong>BUT</strong>, you are no longer receiving them?
              </div>
              <VeeField v-model="formData.isNoLongerReceiving" name="isNoLongerReceiving">
                <fs-form-radio-group :stacked="isSm" v-model="formData.isNoLongerReceiving"
                  :options="baseOptions"></fs-form-radio-group>
              </VeeField>
            </div>
            <div>
              <fs-row>
                <fs-col xl="9" md="12"><strong>IF YES</strong> to either question, enter name of
                  primary recipient</fs-col>
                <fs-col xl="3" md="12">
                  <fs-input type="fsTextInput" v-model="formData.namePrimaryRecipient1" name="namePrimaryRecipient1"
                    label="" disabled />
                </fs-col>
              </fs-row>
              <fs-row>
                <fs-col xl="9" md="12">City where benefits were received</fs-col>
                <fs-col xl="3" md="12">
                  <fs-input type="fsTextInput" v-model="formData.cityBenefitReceived2" name="cityBenefitReceived2"
                    label="" disabled />
                </fs-col>
              </fs-row>

              <fs-row>
                <fs-col xl="9" md="12">State where benefits were received</fs-col>
                <fs-col xl="3" md="12">
                  <fs-input type="fsSelect" label="" text-field="value" :options="STATES" name="stateBenefitReceived2"
                    v-model="formData.stateBenefitReceived2" disabled />
                </fs-col>
              </fs-row>
            </div>
          </div>
        </div>

        <!-- 4 referred to an employer -->
        <div class="d-flex mb-3">
          <label class="me-3">4.</label>
          <div class="w-100">
            <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
              <span :class="isXl && 'w-75'">{{
                referredToEmployerOption[0].text
              }}</span>
              <VeeField style="min-width: 115px" v-model="formData.isIsReferredToEmployer" name="isIsReferredToEmployer">
                <fs-form-radio-group :stacked="isSm" v-model="formData.isIsReferredToEmployer"
                  :options="baseOptions"></fs-form-radio-group>
              </VeeField>
            </div>

            <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
              <span :class="isXl && 'w-75'">{{
                referredToEmployerOption[1].text
              }}</span>
              <VeeField style="min-width: 115px" v-model="formData.isEmploymentNetwork" name="isEmploymentNetwork">
                <fs-form-radio-group :stacked="isSm" v-model="formData.isEmploymentNetwork"
                  :options="baseOptions"></fs-form-radio-group>
              </VeeField>
            </div>

            <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
              <span :class="isXl && 'w-75'">{{
                referredToEmployerOption[2].text
              }}</span>
              <VeeField style="min-width: 115px" v-model="formData.isDepartmentVeteransAffairs"
                name="isDepartmentVeteransAffairs">
                <fs-form-radio-group :stacked="isSm" v-model="formData.isDepartmentVeteransAffairs"
                  :options="baseOptions"></fs-form-radio-group>
              </VeeField>
            </div>
          </div>
        </div>

        <!-- 5 receive TNAF -->
        <div class="d-flex justify-content-between">
          <span>
            <label class="me-3">5</label>
          </span>
          <fs-form-group>
            <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
              <span :class="isXl && 'w-75'">{{
                memberOfFamilyReceiveTANFOption[0].text
              }}</span>
              <div style="min-width: 115px">
                <VeeField v-model="formData.isReceivedTANFAssistance" name="isReceivedTANFAssistance">
                  <fs-form-radio-group :stacked="isSm" v-model="formData.isReceivedTANFAssistance"
                    :options="baseOptions"></fs-form-radio-group>
                </VeeField>
              </div>
            </div>

            <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
              <span :class="isXl && 'w-75'"><strong>OR, </strong>{{ memberOfFamilyReceiveTANFOption[1].text }}</span>
              <div style="min-width: 115px">
                <VeeField style="min-width: 115px" v-model="formData.isReceivedTANFBenefit" name="isReceivedTANFBenefit">
                  <fs-form-radio-group :stacked="isSm" v-model="formData.isReceivedTANFBenefit"
                    :options="baseOptions"></fs-form-radio-group>
                </VeeField>
              </div>
            </div>

            <div>
              <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
                <span :class="isXl && 'w-75'"><strong>OR, </strong>{{ memberOfFamilyReceiveTANFOption[2].text }}</span>
                <div style="min-width: 115px">
                  <VeeField style="min-width: 115px" v-model="formData.isFamilyStopEligibleTANF"
                    name="isFamilyStopEligibleTANF">
                    <fs-form-radio-group :stacked="isSm" v-model="formData.isFamilyStopEligibleTANF"
                      :options="baseOptions"></fs-form-radio-group>
                  </VeeField>
                </div>
              </div>

              <div>
                <div class="d-flex justify-content-between" :class="isSm && 'flex-column'">
                  <div :class="isXl && 'w-75'">
                    <strong>IF NO</strong>, are you a member of a family that
                    received TANF assistance for any 9 months during the
                    18-month period before you were hired?
                  </div>
                  <VeeField style="min-width: 115px" v-model="formData.isMemberFamilyReceivedTANF"
                    name="isMemberFamilyReceivedTANF">
                    <fs-form-radio-group :stacked="isSm" v-model="formData.isMemberFamilyReceivedTANF"
                      :options="baseOptions"></fs-form-radio-group>
                  </VeeField>
                </div>

                <fs-row>
                  <fs-col md="12" xl="9"><strong>If YES</strong> to any question, enter name of
                    primary recipient</fs-col>
                  <fs-col sm="12" md="9" lg="6" xl="3">
                    <fs-input type="fsTextInput" v-model="formData.namePrimaryRecipient2" name="namePrimaryRecipient2"
                      label="" disabled style="min-width: 115px" />
                  </fs-col>
                </fs-row>

                <fs-row>
                  <fs-col md="12" xl="9">City where benefits were received</fs-col>
                  <fs-col sm="12" md="9" lg="6" xl="3">
                    <fs-input type="fsTextInput" v-model="formData.cityBenefitReceived3" name="cityBenefitReceived3"
                      label="" disabled style="min-width: 115px" />
                  </fs-col>
                </fs-row>

                <fs-row>
                  <fs-col md="12" xl="9">State where benefits were received</fs-col>
                  <fs-col sm="12" md="9" lg="6" xl="3">
                    <fs-input type="fsSelect" label="" text-field="value" :options="STATES" name="stateBenefitReceived3"
                      v-model="formData.stateBenefitReceived3" disabled />
                  </fs-col>
                </fs-row>
              </div>
            </div>
          </fs-form-group>
        </div>

        <!-- 6 felony , release from prison -->
        <div class="mb-3">
          <div class="d-flex justify-content-between mb-3" :class="isSm && 'flex-column'">
            <div class="d-flex" :class="isXl && 'w-75'">
              <div class="me-3">6</div>
              <div>
                Were you convicted of a felony or released from prison after a
                felony conviction during the year before you were hired?
              </div>
            </div>
            <VeeField style="min-width: 115px" v-model="formData.isConvictedFelonyOrReleasedFrom"
              name="isConvictedFelonyOrReleasedFrom">
              <fs-form-radio-group :stacked="isSm" v-model="formData.isConvictedFelonyOrReleasedFrom"
                :options="baseOptions" class="ms-4"></fs-form-radio-group>
            </VeeField>
          </div>
          <div class="ms-4 d-flex flex-column">
            <fs-row>
              <fs-col xl="9" md="12"><strong>If YES</strong>, enter date of conviction</fs-col>
              <fs-col xl="3" md="12">
                <fs-input type="fsDateInput" v-model="formData.dateOfConvicted" name="dateOfConvicted" label="" disabled
                  style="min-width: 115px" />
              </fs-col>
            </fs-row>
            <fs-row>
              <fs-col xl="9" md="12">Date of release</fs-col>
              <fs-col xl="3" md="12">
                <fs-input type="fsDateInput" v-model="formData.dateOfRelease" name="dateOfRelease" label="" disabled
                  style="min-width: 115px" />
              </fs-col>
            </fs-row>
            <div class="d-flex gap-3 justify-content-between" :class="isSm && 'flex-column'">
              <span>Conviction by</span>
              <VeeField name="convictionBy" v-model="formData.isFederalState">
                <fs-form-radio-group :stacked="isSm" v-model="formData.isFederalState"
                  :options="isFederalState"></fs-form-radio-group>
              </VeeField>
            </div>
          </div>
        </div>

        <!-- 7 EmpowerZone RRC -->
        <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
          <div class="d-flex">
            <div class="me-3">7.</div>
            <div>
              Do you live in an Empowerment Zone or Rural Renewal County (RRC)?
            </div>
          </div>
          <VeeField style="min-width: 115px" v-model="formData.isLiveEmpowermentZoneRRC" name="isLiveEmpowermentZoneRRC">
            <fs-form-radio-group class="ms-4" :stacked="isSm" v-model="formData.isLiveEmpowermentZoneRRC"
              :options="baseOptions"></fs-form-radio-group>
          </VeeField>
        </div>

        <!-- 8 EmpowerZone under 18 -->
        <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
          <div class="d-flex" :class="isXl && 'w-75'">
            <div class="me-3">8.</div>
            <div>
              Do you live in an Empowerment Zone and are at least age 16, but
              not yet 18, on your hiring date?
            </div>
          </div>
          <VeeField style="min-width: 115px" v-model="formData.isLiveEmpowermentZone" name="isLiveEmpowermentZone">
            <fs-form-radio-group :stacked="isSm" class="ms-4" v-model="formData.isLiveEmpowermentZone"
              :options="baseOptions"></fs-form-radio-group>
          </VeeField>
        </div>

        <!-- 9 SSI -->
        <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
          <div class="d-flex" :class="isXl && 'w-75'">
            <div class="me-3">9.</div>
            <div>
              Did you receive Supplemental Security Income (SSI) benefits for
              any month ending within 60 days before you were hired?
            </div>
          </div>
          <VeeField style="min-width: 115px" v-model="formData.isReceiveSupplementalSecurity"
            name="isReceiveSupplementalSecurity">
            <fs-form-radio-group :stacked="isSm" class="ms-4" v-model="formData.isReceiveSupplementalSecurity"
              :options="baseOptions"></fs-form-radio-group>
          </VeeField>
        </div>

        <!-- 10 unemployed veteran at least 6 months -->
        <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
          <div class="d-flex" :class="isXl && 'w-75'">
            <div class="me-3">10.</div>
            <div>
              Are you a veteran unemployed for a combined period of at least 6
              months (whether or not consecutive) during the year before you
              were hired?
            </div>
          </div>
          <VeeField style="min-width: 115px" v-model="formData.isVeteranUnemployedSixMonth"
            name="isVeteranUnemployedSixMonth">
            <fs-form-radio-group :stacked="isSm" class="ms-4" v-model="formData.isVeteranUnemployedSixMonth"
              :options="baseOptions"></fs-form-radio-group>
          </VeeField>
        </div>

        <!-- 11 unemployed veteran 4 weeks to 6 months -->
        <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
          <div class="d-flex" :class="isXl && 'w-75'">
            <div class="me-3">11.</div>
            <div>
              Are you a veteran unemployed for a combined period of at least 4
              weeks but less than 6 months (whether or not consecutive) during
              the year before you were hired?
            </div>
          </div>
          <VeeField style="min-width: 115px" v-model="formData.isVeteranUnemployedFourWeek"
            name="isVeteranUnemployedFourWeek">
            <fs-form-radio-group :stacked="isSm" class="ms-4" v-model="formData.isVeteranUnemployedFourWeek"
              :options="baseOptions"></fs-form-radio-group>
          </VeeField>
        </div>

        <!-- 12 unemployed veteran 27 consecutive weeks -->
        <div>
          <div class="d-flex gap-3 justify-content-between mb-3" :class="isSm && 'flex-column'">
            <div class="d-flex" :class="isXl && 'w-75'">
              <div class="me-3">12.</div>
              <div>
                Are you an individual who is or was in a period of unemployment
                that is at least 27 consecutive weeks and for all or part of
                that period you received unemployment compensation?
              </div>
            </div>
            <VeeField style="min-width: 115px" v-model="formData.isIndividualPeriodUnemployment"
              name="isIndividualPeriodUnemployment">
              <fs-form-radio-group :stacked="isSm" class="ms-4" v-model="formData.isIndividualPeriodUnemployment"
                :options="baseOptions"></fs-form-radio-group>
            </VeeField>
          </div>
          <fs-row class="mb-3 ms-3">
            <fs-col xl="9" md="12"><strong>If YES</strong>, what state did you receive unemployment
              compensation in?</fs-col>
            <fs-col xl="3" md="6">
              <fs-input type="fsSelect" label="" text-field="value" :options="STATES" name="receivedUnemployment"
                v-model="formData.receivedUnemployment" disabled style="min-width: 115px" />
            </fs-col>
            <div class="note-text">
              (Enter state where UI compensation was received)
            </div>
          </fs-row>
        </div>

        <!-- 13 document filePath -->
        <div>
          <div class="d-flex">
            <div class="me-3">13.</div>
            <div>Sources used to document eligibility</div>
          </div>
          <div class="my-3 ms-5">
            <span>
              <!--trigger file input by custom button-->
              <input type="file" multiple id="upload_file" ref="fileInput" hidden />
            </span>
            <a v-for="file in formData.uploadFileStateForms" :key="file.filePath" class="text-success d-block my-2">
              <font-awesome-icon :icon="['fal', 'paperclip']" /><span class="ms-2" @click="handlePreviewFile(file)">{{
                file.fileName }}</span>
              &nbsp;
            </a>
          </div>
        </div>

        <!-- 14 employee signature -->

        <div v-if="formData.employeeSignaturePath">
          <VeeField name="employeeSignaturePath" v-model="formData.employeeSignature" rules="required">
              <SignaturePad :isEdit="false" :isSignatureConsent="isSignatureConsent" v-if="isLoaded"
                  :path="formData.employeeSignaturePath" :isViewOnly="true" :isUpdate="isFormChanged"
                  @clear-signature="handleClearSignature" @submit-signature="handleUpdatePathSignature"
                  :isDisabledAll="true" @update-path-signature="handleUpdatePathEmp" />
          </VeeField>

          <div class="w-50" v-if="formData.dateSignatureUTC">
            <label for="dateSignatureUTC" class="d-block">Date<font-awesome-icon :icon="['fas', 'asterisk']"
                class="text-danger ms-1" size="sm" /></label>
            <div class="d-flex gap-2">
              <span class="p-2 bg-grey--000 border rounded">{{ moment(formData.dateSignatureUTC).format('YYYY/MM/DD')
              }}</span>
              <span class="p-2 bg-grey--000 border rounded">{{ moment(formData.dateSignatureUTC).format('hh:mm a')
              }}</span>
            </div>
          </div>
        </div>
      </div>
      </VeeForm>
    </div>
    <div class="my-3 px-4" :class="isXl && 'w-max'">
      I certify that this information is true and correct to the best of my
      knowledge. I understand that the information above may be subject to
      verification.
    </div>
  </div>
</template>
<style scoped>
label {
  font-style: normal;
  font-weight: 700;
  font-size: 14px;
  line-height: 22px;
}

.sub-text {
  font-style: italic;
  font-weight: 400;
  font-size: 12px;
  color: #6e7c8f;
}

.note-text {
  font-style: italic;
  font-weight: 400;
  font-size: 12px;
  line-height: 22px;
  color: #6e7c8f;
}

.main-text {
  font-style: normal;
  font-weight: 400;
  font-size: 14px;
}

.w-max {
  max-width: 700px;
}

.text-justify {
  text-align: justify;
}

.flex-1 {
  flex: 1;
}

.flex-3 {
  flex: 3;
}

.eye-icon {
  position: absolute;
  right: 0.5rem;
  cursor: pointer;
}

.border-left {
  border-left: solid 1px #e1e4e8;
}

.form-body>div {
  margin-bottom: 12px;
}

:deep(.b-icon-calendar) {
  right: 0;
}

:deep(.fa-asterisk) {
  font-size: 6px;
  height: 9px;
}

:deep(div[role="radiogroup"] > .form-check.form-check-inline) {
  margin-right: 0;
  margin-left: 1rem;
}

:deep(.b-datefield) {
  display: block;
  width: 100%;
}

:deep(.form-check-label:has(> .w-100)) {
  width: 100%;
}

:deep(div[margin="top"] > input[type="radio"]) {
  margin-top: 13px;
}

.message-error {
  color: #f23648;
  display: block;
}
.form_header {
    position: sticky; 
    top: 0; 
    z-index: 999; 
    height: 80px;
    border-bottom: 1px solid #E1E4E8;
}
</style>
