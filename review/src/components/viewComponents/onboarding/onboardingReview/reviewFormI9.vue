<script lang="ts" setup>
import { useOnboardingFormINineStore } from '@/stores/onboardingFormI9Store';
import { Ref, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { FormField } from "@/enums/FormField";
import { storeToRefs } from 'pinia';
import { OnboardingFormINineModel, OnboardingI9Employee, OnboardingI9Employer, OnboardingI9Summary } from '@/models/onboarding/OnboardingFormINine';
import moment from 'moment'
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { CitizenStatus, CitizenChildStatus } from '@/enums/citizenStatus'
import { useEmployeeStore } from '@/stores/employeeStore';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { FileInputData } from "@/models/onboarding/W4/W4FormFile";
import { truncateFileName, FormatPhoneNumberUs } from '@/utilities/formatUtils';
import { faPaperclip, faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useLoadingStore } from "@/stores/loadingStore";

library.add(faPaperclip, faEye, faEyeSlash);

const { fetchEmployeeDetails } = useEmployeeStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const formFileData: Ref<FileInputData[]> = ref([]);

const LIST_SELECTED_TYPE = {
  "A": 1,
  "BC": 2
}

const childStatusTitle = (status: number) => {
  let statusTxt = ""
  if (status == CitizenChildStatus.ALIEN_REGISTRATION_NUMBER) {
    statusTxt = "Alien Registration Number/USCIS Number"
  } else if (status == CitizenChildStatus.FORM_ADMISSION_NUMBER) {
    statusTxt = "Form I-94 Admission Number"
  } else if (status == CitizenChildStatus.FOREIGN_PASSPORT_NUMBER) {
    statusTxt = "Foreign Passport Number"
  }
  return statusTxt;
}

const childStatusData = (status: number) => {
  let statusTxt = ""
  if (status == CitizenChildStatus.ALIEN_REGISTRATION_NUMBER) {
    statusTxt = formModelI9Employee?.value.alienRegistrationNumber
  } else if (status == CitizenChildStatus.FORM_ADMISSION_NUMBER) {
    statusTxt = formModelI9Employee?.value.formAdmissionNumber
  } else if (status == CitizenChildStatus.FOREIGN_PASSPORT_NUMBER) {
    statusTxt = formModelI9Employee?.value.foreignPassportNumber
  }
  return statusTxt;
}

const hqSuiteStore = useHQSuiteStore();
const { setLoading } = useLoadingStore();

const router = useRouter();
const employeeId = router.currentRoute.value.params.id;
const onboardingFormINineStore = useOnboardingFormINineStore();
const { dataOnboardingFormINine } = storeToRefs(useOnboardingFormINineStore());

const formFieldI9QuickHire: Ref<OnboardingFormINineModel> = ref();
const formFieldI9Onboard: Ref<OnboardingFormINineModel> = ref();
const formFieldI9MappedOnboard: Ref<OnboardingI9Summary> = ref();
const formFieldI9Employer: Ref<OnboardingFormINineModel> = ref();
const formFieldI9Employee: Ref<OnboardingFormINineModel> = ref();
const formModelI9Employer: Ref<OnboardingI9Employer> = ref();
const formModelI9Employee: Ref<OnboardingI9Employee> = ref();

const signatureEmployeeBase64Url = ref("");
const signatureTranslatorBase64Url = ref("");
const signatureEmployerAuthorizedBase64Url = ref("");
const signatureReverificationRehiresBase64Url = ref("");

const isShowSecurity = ref(false);
const hiddenSocialSecurityValue = (value: string, isShow: boolean) => {
  let text = "";
  for (let index = 0; index < value?.length; index++) {
    if (index === 3 || index === 5) text += "-";
    text += "X";
  }
  return isShow ? value : text;
};

const isShowDate = ref(false);
const hiddenDateValue = (value: string, isShow: boolean) => {
  let text = "";
  const sliceOriginalText = value.slice(0, value.length - 4);
  for (let index = value.length - 4; index < value?.length; index++) {
    text += "X";
  }
  return isShow ? value : sliceOriginalText + text;
};

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

const handleGetOnboardFormData = async () => {
  await onboardingFormINineStore.fetchFormINine(Number(employeeId), FormField.I9Employer)
  formFieldI9Employer.value = dataOnboardingFormINine.value

  await onboardingFormINineStore.fetchFormINine(Number(employeeId), FormField.I9Employee)
  formFieldI9Employee.value = dataOnboardingFormINine.value

  await onboardingFormINineStore.fetchFormINine(Number(employeeId), FormField.I9Summary)
  formFieldI9Onboard.value = dataOnboardingFormINine.value

  mapFieldModelToFormModelOnboard();
}

const handleGetQuickHireFormData = async () => {
  await onboardingFormINineStore.fetchFormINine(Number(employeeId), FormField.I9QuickHire)
  formFieldI9QuickHire.value = dataOnboardingFormINine.value
}

const mapFieldModelToFormModelOnboard = () => {
  const dataOnboard = formFieldI9Onboard.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formFieldI9MappedOnboard.value = dataOnboard;

  const data = formFieldI9Employer.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModelI9Employer.value = data;
  if (formModelI9Employer.value.employeeMiddleName == "N/A") {
    formModelI9Employer.value.employeeMiddleName = ""
  }

  const dataEmployee = formFieldI9Employee.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});

  formModelI9Employee.value = dataEmployee;
  if (formModelI9Employee.value.middleName == "N/A") {
    formModelI9Employee.value.middleName = ""
  }
  if (formModelI9Employee.value.lastNameUsed == "N/A") {
    formModelI9Employee.value.lastNameUsed = ""
  }
  if (formModelI9Employee.value.aptNumber == "N/A") {
    formModelI9Employee.value.aptNumber = ""
  }
  if (formModelI9Employee.value.emailAddress == "N/A") {
    formModelI9Employee.value.emailAddress = ""
  }
  if (formModelI9Employee.value.telePhone == "N/A") {
    formModelI9Employee.value.telePhone = ""
  }
}

const handlePreviewFile = (file: FileInputData) => {
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
};

onMounted(async () => {
  setLoading(true);
  try {
    if (employeeDetails.value.id === undefined) {
      await fetchEmployeeDetails(Number(employeeId));
    }
    formFileData.value = [];
    if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.QuickHire) {
      if (!formFieldI9QuickHire.value) {
        await handleGetQuickHireFormData();
      }
      formFieldI9QuickHire.value.uploadFileStateForms.forEach((file) => {
        formFileData.value.push({
          fileName: file.fileName,
          filePath: file.filePath
        })
      })
    } else if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.Onboard) {
      if (!formFieldI9Onboard.value) {
        await handleGetOnboardFormData();
      }
      formFieldI9Onboard.value.uploadFileStateForms.forEach((file) => {
        formFileData.value.push({
          fileName: file.fileName,
          filePath: file.filePath
        })
      })
      convertToBase64(formModelI9Employee.value.employeeSignaturePath, signatureEmployeeBase64Url);
      convertToBase64(formModelI9Employee.value.translatorSignaturePath, signatureTranslatorBase64Url);
      convertToBase64(formModelI9Employer.value.employerSignaturePath, signatureEmployerAuthorizedBase64Url);
      convertToBase64(formModelI9Employer.value.reverificationRehiresSignaturePath, signatureReverificationRehiresBase64Url);
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
      <fs-col cols="2" class="fw-bold">
        Note
      </fs-col>
      <fs-col cols="10">
        {{ formFieldI9MappedOnboard?.note }}
      </fs-col>
    </fs-row>
  </div>
  <div v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.QuickHire" class="file_list"
    style="margin-top: 20px">
    <div v-for="document in formFileData" :key="document.filePath" class="file_item d-flex align-items-center mb-1 p">
      <font-awesome-icon :icon="['fal', 'paperclip']" />
      <fs-link @click="handlePreviewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
        <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
      </fs-link>
    </div>
    <div v-if="!formFileData.length">No file submitted.</div>
  </div>
  <div v-else-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.Onboard">
  <div id="summarySection" class="mb-2" v-if="formFileData.length || formFieldI9MappedOnboard?.note">
    <div v-for="document in formFileData" :key="document.filePath" class="file_item d-flex align-items-center mb-1 p">
      <font-awesome-icon :icon="['fal', 'paperclip']" />
      <fs-link @click="handlePreviewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
        <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
      </fs-link>
    </div>
  </div>
    <div class="fw-bold" style="color: #03A9F4; border-bottom: 1px solid #e1e4e8;">
      Section 1. Employee Information and Attestation
    </div>
    <div class="fw-bold pt-4">
      Employee Information and Attestation
    </div>
    <div class="pt-4 d-flex">
      <fs-col cols="4" class="fw-bold">Full name</fs-col>
      <fs-col cols="4">{{ `${formModelI9Employee?.firstName} ${formModelI9Employee?.middleName}
              ${formModelI9Employee?.lastName}` }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Address</fs-col>
      <fs-col cols="4">
        <div>{{ formModelI9Employee?.address }}</div>
        <div>{{ formModelI9Employee?.aptNumber }}</div>
        <div>{{ `${formModelI9Employee?.city}, ${formModelI9Employee?.state ? formModelI9Employee?.state?.text : ''}
                  ${formModelI9Employee?.zipCode}` }}
        </div>
      </fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Date of Birth</fs-col>
      <fs-col cols="4">
        {{ formModelI9Employee?.dateOfBirth ?
          hiddenDateValue(moment(formModelI9Employee?.dateOfBirth).format("MM/DD/YYYY"), isShowDate) : '' }}
        <font-awesome-icon @click="isShowDate = !isShowDate" class="icon-eye"
          :icon="['fal', isShowDate ? 'eye' : 'eye-slash']" /></fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">U.S. Social Security Number</fs-col>
      <fs-col cols="4">{{ formModelI9Employee?.socialSecurityNumber ?
        hiddenSocialSecurityValue(formModelI9Employee.socialSecurityNumber, isShowSecurity) : '' }}
        <font-awesome-icon @click="isShowSecurity = !isShowSecurity" class="icon-eye"
          :icon="['fal', isShowSecurity ? 'eye' : 'eye-slash']" /></fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Employee’s Telephone</fs-col>
      <fs-col cols="4">{{ formModelI9Employee?.telePhone ? FormatPhoneNumberUs(formModelI9Employee.telePhone) : ''
      }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Employee’s E-mail Address</fs-col>
      <fs-col cols="4">{{ formModelI9Employee?.emailAddress }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Citizenship or Immigration Status</fs-col>
      <fs-col cols="4" v-if="formModelI9Employee?.attestCitizenshipStatusId == CitizenStatus.CITIZEN_OF_US">A citizen of
        the United States</fs-col>
      <fs-col cols="4" v-if="formModelI9Employee?.attestCitizenshipStatusId == CitizenStatus.NON_CITIZEN_OF_US">A
        noncitizen national of the United States</fs-col>
      <fs-col cols="4" v-if="formModelI9Employee?.attestCitizenshipStatusId == CitizenStatus.LAWFUL_PERMANENT_CITIZEN">A
        lawful permanent resident</fs-col>
      <fs-col cols="4"
        v-if="formModelI9Employee?.attestCitizenshipStatusId == CitizenStatus.ALIEN_AUTHORIZE_TO_WORK_UNTIL">{{ `An alien
        authorized to work until ${moment(formModelI9Employee?.authorizedExpirationDate).format("MM/DD/YYYY")}`
        }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex"
      v-if="formModelI9Employee?.attestCitizenshipStatusId == CitizenStatus.LAWFUL_PERMANENT_CITIZEN">
      <fs-col cols="4" class="fw-bold">Alien Registration Number/USCIS Number</fs-col>
      <fs-col cols="4">{{ formModelI9Employee?.alienRegistrationUSCISNumber }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex"
      v-if="formModelI9Employee?.attestCitizenshipStatusId == CitizenStatus.ALIEN_AUTHORIZE_TO_WORK_UNTIL">
      <fs-col cols="4" class="fw-bold">{{ childStatusTitle(formModelI9Employee?.attestCitizenshipFourId) }}</fs-col>
      <fs-col cols="4">{{ childStatusData(formModelI9Employee?.attestCitizenshipFourId) }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex"
      v-if="formModelI9Employee?.attestCitizenshipStatusId == CitizenStatus.ALIEN_AUTHORIZE_TO_WORK_UNTIL && formModelI9Employee?.attestCitizenshipFourId == CitizenChildStatus.FOREIGN_PASSPORT_NUMBER">
      <fs-col cols="4" class="fw-bold">Country of Issuance</fs-col>
      <fs-col cols="4">{{ formModelI9Employee?.countryOfIssuance.name }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2">
      <fs-col class="fw-bold">Employee Signature</fs-col>
      <fs-col cols="8">
        <div class="border w-100">
          <img class="img-fluid" :src="signatureEmployeeBase64Url" alt="employee signature" />
        </div>
      </fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Date</fs-col>
      <fs-col cols="4">{{ formModelI9Employee?.dateSignatureUTC ?
        moment(formModelI9Employee?.dateSignatureUTC).format("MM/DD/YYYY - hh:mm A") : '' }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-4" v-if="formModelI9Employee?.isTranslator == '' || !formModelI9Employee?.isTranslator">
      Employee didn't use a preparer of translator.
    </div>
    <div v-if="formModelI9Employee?.isTranslator != '' || formModelI9Employee?.isTranslator">
      <div class="pt-4 fw-bold">
        Preparer and/or Translator Certification
      </div>
      <div class="pt-2">
        <fs-col class="fw-bold">Signature of Preparer or Translator</fs-col>
        <div v-if="formModelI9Employee?.translatorSignaturePath">
          <fs-col cols="8">
            <div class="border w-100">
              <img class="img-fluid" :src="signatureTranslatorBase64Url" alt="translator signature" />
            </div>
          </fs-col>
        </div>
      </div>
      <div class="pt-2 d-flex">
        <fs-col cols="4" class="fw-bold">Date</fs-col>
        <fs-col cols="4">{{ moment(formModelI9Employee?.dateSignatureUTC).format("MM/DD/YYYY - hh:mm A") }}</fs-col>
        <fs-col cols="4"></fs-col>
      </div>
      <div class="pt-4 d-flex">
        <fs-col cols="4" class="fw-bold">Full name</fs-col>
        <fs-col cols="4">{{ `${formModelI9Employee?.translatorFirstName} ${formModelI9Employee?.translatorLastName}`
        }}</fs-col>
        <fs-col cols="4"></fs-col>
      </div>
      <div class="pt-2 d-flex">
        <fs-col cols="4" class="fw-bold">Address</fs-col>
        <fs-col cols="4">
          <div>{{ formModelI9Employee?.translatorAddress }}</div>
          <div>{{ `${formModelI9Employee?.translatorCity}, ${formModelI9Employee?.translatorState ?
            formModelI9Employee?.translatorState?.text : ''}
                      ${formModelI9Employee?.translatorZipCode}` }}</div>
        </fs-col>
        <fs-col cols="4"></fs-col>
      </div>
    </div>
    <div class="fw-bold pt-4" style="color: #03A9F4; border-bottom: 1px solid #e1e4e8;">
      Section 2. Employer or Authorized Representative Review and Verification
    </div>
    <div class="fw-bold pt-4">
      Employee info from section 1
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Full name</fs-col>
      <fs-col cols="4">{{ `${formModelI9Employee?.firstName}
              ${formModelI9Employee?.middleName}
              ${formModelI9Employee?.lastName}` }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Citizenship/Immigration Status</fs-col>
      <fs-col cols="4">{{ formModelI9Employer?.employeeCitizenStatus }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-4">
      <div v-if="formModelI9Employer?.listSelected == LIST_SELECTED_TYPE.A">
        <div>
          <span class="fw-bold">LIST A</span> <small>(Identify and Employment Authorization)</small>
        </div>
        <div class="mt-2" style="border-left: 2px solid #03A9F4;">
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Title</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listAFirstDocumentTitle }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Issuing Authority</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listAFirstIssuingAuthority }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Number</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listAFirstDocumentNumber }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Expiration Date</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listAFirstExpirationDate ?
              moment(formModelI9Employer?.listAFirstExpirationDate).format("MM/DD/YYYY") : '' }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
        </div>
        <div class="mt-2" style="border-left: 2px solid #03A9F4;">
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Title</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listASecondDocumentTitle }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Issuing Authority</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listASecondIssuingAuthority }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Number</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listASecondDocumentNumber }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Expiration Date</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listASecondExpirationDate ?
              moment(formModelI9Employer?.listASecondExpirationDate).format("MM/DD/YYYY") : '' }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
        </div>
        <div class="mt-2" style="border-left: 2px solid #03A9F4;">
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Title</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listAThirdDocumentTitle }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Issuing Authority</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listAThirdIssuingAuthority }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Number</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listAThirdDocumentNumber }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Expiration Date</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listAThirdExpirationDate ?
              moment(formModelI9Employer?.listAThirdExpirationDate).format("MM/DD/YYYY") : '' }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
        </div>
      </div>
      <div v-if="formModelI9Employer?.listSelected == LIST_SELECTED_TYPE.BC">
        <div>
          <span class="fw-bold">LIST B</span> <small>(Identity)</small>
        </div>
        <div class="mt-2" style="border-left: 2px solid #03A9F4;">
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Title</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listBDocumentTitle }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Issuing Authority</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listBIssuingAuthority }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Number</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listBDocumentNumber }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Expiration Date</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listBExpirationDate ?
              moment(formModelI9Employer?.listBExpirationDate).format("MM/DD/YYYY") : '' }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
        </div>
        <div class="d-flex">
          <fs-col cols="4" class="fw-bold">Additional Information</fs-col>
          <fs-col cols="4">{{ formModelI9Employer?.listBAdditionalInformation }}</fs-col>
        </div>
        <div class="pt-4">
          <span class="fw-bold">LIST C</span> <small>(Employment Authorization)</small>
        </div>
        <div class="mt-2" style="border-left: 2px solid #03A9F4;">
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Title</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listCDocumentTitle }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Issuing Authority</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listCIssuingAuthority }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Document Number</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listCDocumentNumber }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
          <div class="d-flex px-1">
            <fs-col cols="4" class="fw-bold">Expiration Date</fs-col>
            <fs-col cols="4">{{ formModelI9Employer?.listCExpirationDate ?
              moment(formModelI9Employer?.listCExpirationDate).format("MM/DD/YYYY") : '' }}</fs-col>
            <fs-col cols="4"></fs-col>
          </div>
        </div>
      </div>
    </div>
    <div class="pt-4 fw-bold">
      CERTIFICATION
    </div>
    <div class="pt-2">
      <fs-col cols="8">
        I attest, under penalty of perjury, that (1) I have examined the document(s) presented by the above-named
        employee, (2) the above-listed document(s) appear to be genuine and to relate to the employee named, and (3) to
        the best of my knowledge the employee is authorized to work in the United States.
      </fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">The Employee’s First Day of Employment</fs-col>
      <fs-col>{{ formModelI9Employer?.employerDayOfEmployment ?
        moment(formModelI9Employer?.employerDayOfEmployment).format("MM/DD/YYYY") : '' }}</fs-col>
    </div>
    <div class="px-1 mt-2" style="border-left: 2px solid #03A9F4;">
      <div class="pt-2 fw-bold">
        Signature of Employer or Authorized Representative
      </div>
      <div v-if="formModelI9Employer?.employerSignaturePath">
        <fs-col cols="8">
          <div class="border w-100">
            <img class="img-fluid" :src="signatureEmployerAuthorizedBase64Url"
              alt="Signature of Employer or Authorized Representative" />
          </div>
        </fs-col>
      </div>
      <div class="pt-2 d-flex">
        <fs-col cols="4" class="fw-bold">Today’s Date</fs-col>
        <fs-col cols="4">{{ formModelI9Employer?.employerSignatureDate ?
          moment(formModelI9Employer?.employerSignatureDate).format("MM/DD/YYYY - hh:mm A") : '' }}</fs-col>
        <fs-col cols="4"></fs-col>
      </div>
      <div class="pt-2 d-flex">
        <fs-col cols="4" class="fw-bold">Title of Employer or Authorized Representative</fs-col>
        <fs-col cols="4">{{ formModelI9Employer?.employerTitle }}</fs-col>
        <fs-col cols="4"></fs-col>
      </div>
      <div class="pt-2 d-flex">
        <fs-col cols="4" class="fw-bold">Full Name of Employer or Authorized Representative</fs-col>
        <fs-col cols="4">{{ `${formModelI9Employer?.employeeFirstName} ${formModelI9Employer?.employeeMiddleName}
                  ${formModelI9Employer?.employeeLastName}` }}</fs-col>
        <fs-col cols="4"></fs-col>
      </div>
      <div class="pt-2 d-flex">
        <fs-col cols="4" class="fw-bold">Employer’s Business or Organization Name</fs-col>
        <fs-col cols="4">{{ formModelI9Employer?.employerBusinessOrganizeName }}</fs-col>
        <fs-col cols="4"></fs-col>
      </div>
      <div class="pt-2 d-flex">
        <fs-col cols="4" class="fw-bold">Employer’s Business or Organization Address</fs-col>
        <fs-col cols="4">
          <div>{{ formModelI9Employer?.employerBusinessOrganizeAddress }}</div>
          <div>{{ `${formModelI9Employer?.employerCityOrTown}, ${formModelI9Employer?.employerState}
                      ${formModelI9Employer?.employerZipCode}` }}</div>
        </fs-col>
        <fs-col cols="4"></fs-col>
      </div>
    </div>
    <div class="pt-4 fw-bold" style="color: #03A9F4; border-bottom: 1px solid #e1e4e8;">
      Section 3. Reverification and Rehires
    </div>
    <div class="pt-4 fw-bold">
      A. NEW NAME
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Full Name</fs-col>
      <fs-col cols="4">{{ `${formModelI9Employer?.reverificationRehiresFirstName}
              ${formModelI9Employer?.reverificationRehiresMI} ${formModelI9Employer?.reverificationRehiresLastName}` }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-4 fw-bold">
      B. DATE OF REHIRE
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Date</fs-col>
      <fs-col cols="4">{{ formModelI9Employer?.reverificationRehiresDateHire ?
        moment(formModelI9Employer?.reverificationRehiresDateHire).format("MM/DD/YYYY") : '' }}</fs-col>
    </div>
    <div class="pt-4 fw-bold">
      C. EMPLOYMENT AUTHORIZATION DOCUMENT
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Document Title</fs-col>
      <fs-col cols="4">{{ formModelI9Employer?.reverificationRehiresDocumentTitle }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Expiration Date</fs-col>
      <fs-col cols="4">{{ formModelI9Employer?.reverificationRehiresExpDate ?
        moment(formModelI9Employer?.reverificationRehiresExpDate).format("MM/DD/YYYY") : '' }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-4">
      <fs-col cols="8">I attest, under penalty of perjury, that to the best of my knowledge, this employee is authorized
        to work in the United States, and if the employee presented document(s), the document(s) I have examined appear to
        be genuine and to relate to the individual.</fs-col>
    </div>
    <div class="pt-2 fw-bold">
      Signature of Employer or Authorized Representative
    </div>
    <div v-if="formModelI9Employer?.reverificationRehiresSignaturePath != ''">
      <fs-col cols="8">
        <div class="border w-100">
          <img class="img-fluid" :src="signatureReverificationRehiresBase64Url"
            alt="Signature of Employer or Authorized Representative" />
        </div>
      </fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Today’s Date</fs-col>
      <fs-col cols="4">{{ formModelI9Employer?.reverificationRehiresSignatureDate ?
        moment(formModelI9Employer?.reverificationRehiresSignatureDate).format("MM/DD/YYYY - hh:mm A") : '' }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
    <div class="pt-2 d-flex">
      <fs-col cols="4" class="fw-bold">Name of Employer or Authorized Representative</fs-col>
      <fs-col cols="4">{{ formModelI9Employer?.reverificationRehiresName }}</fs-col>
      <fs-col cols="4"></fs-col>
    </div>
  </div>
</template>
<style scoped lang="scss">
#summarySection {
  padding: 12px;
  border-radius: 10px;
}

.icon-eye {
  color: #1abc9c;
  cursor: pointer;
  margin-left: 5px;
}
</style>