<!-- eslint-disable no-irregular-whitespace -->
<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue';
import type { Ref } from 'vue';
import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { FileInputData } from "@/models/onboarding/W4/W4FormFile";
import { FormField } from "@/enums/FormField";
import { truncateFileName } from '@/utilities/formatUtils';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faFileCircleExclamation, faFilePdf, faPaperclip, faTrashCan, faArrowUpFromBracket } from "@fortawesome/pro-light-svg-icons";
import { faFloppyDisk } from '@fortawesome/pro-regular-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { useOnboardingVEVRAASelfIdentificationStore } from "@/stores/onboardingVEVRAASelfIdentificationStore";
import moment from "moment";
import { VeteranStatus } from "@/enums/VeteranStatus";
import { useEmployeeStore } from '@/stores/employeeStore';
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { OnboardingVEVRAA, OnboardingFormVEVRAAModel } from "@/models/onboarding/OnboardingVEVRAASelfIdentificationUploadFile";
import { useLoadingStore } from "@/stores/loadingStore";

library.add(faEyeSlash, faPaperclip, faEye, faFileCircleExclamation, faFilePdf, faFloppyDisk, faTrashCan, faArrowUpFromBracket);

// CONST
const hqSuiteStore = useHQSuiteStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const {
  fetchVEVRAASelfIdentification,
} = useOnboardingVEVRAASelfIdentificationStore();
const { onboardingVEVRAAFileData, onboardingVEVRAASelfIdentification } = storeToRefs(useOnboardingVEVRAASelfIdentificationStore());

const route = useRoute();
const employeeId = computed(() => route.params.id);
const formFileData: Ref<FileInputData[]> = ref([]);
const formIdEmployee = FormField.VEVRAAEmployee;
const formIdHRM = FormField.VEVRAAHrm;
const formModel: Ref<OnboardingVEVRAA> = ref();
const onboardingVEVRAAUpload = reactive({
  data: {
    veteranStatusId: 0,
    isDisabledVeteran: false,
    isRecentlySeparatedVeteran: false,
    isActiveWartimeOrCampaign: false,
    isArmedForcesServiceMedal: false,
    employeeSignaturePath: "",
    dateSignatureUTC: ""
  },
});
const { setLoading } = useLoadingStore();

const signatureBase64Url = ref('');

onMounted(async () => {
  setLoading(true);
  try {
    await fetchVEVRAASelfIdentification(Number(employeeId.value), formIdEmployee);
    if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.Onboard) {
      onboardingVEVRAASelfIdentification.value.fieldModels.forEach((item) => {
        const newKey = item.fieldKey
        onboardingVEVRAAUpload.data[newKey] = item.fieldValue as never
      })

      convertToBase64(onboardingVEVRAAUpload.data.employeeSignaturePath, signatureBase64Url);
    }
    await handleGetEmpFormData();
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
})

const handleGetEmpFormData = async () => {
  await fetchVEVRAASelfIdentification(Number(employeeId.value), formIdHRM);
  formModel.value = onboardingVEVRAAFileData.value
  if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.QuickHire) {
    onboardingVEVRAAFileData.value.uploadFileStateForms.forEach((file) => {
      formFileData.value.push({
        fileName: file.fileName,
        filePath: file.filePath
      })
    })
  } else if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.Onboard) {
    onboardingVEVRAASelfIdentification.value.uploadFileStateForms.forEach((file) => {
      formFileData.value.push({
        fileName: file.fileName,
        filePath: file.filePath
      })
    })
    convertToBase64(onboardingVEVRAAUpload.data.employeeSignaturePath, signatureBase64Url);
  }
}

const note = computed(() => {
  return onboardingVEVRAASelfIdentification.value?.fieldModels.find(x => x.fieldKey == 'note')?.fieldValue
})

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

async function convertToBase64(path: string, base64Url: Ref<string>) {
  try {
    const res = await hqSuiteStore.getFile(path);
    const reader = new FileReader();
    reader.readAsDataURL(res.data);
    reader.onloadend = async function () {
      base64Url.value = reader.result as string;
    }
  } catch (error) {
    base64Url.value = ''
  }
}

</script>

<template>
  <div class="mb-3 fw-bold"> 
    <fs-row>
      <fs-col cols="1">
        Note
      </fs-col>
      <fs-col cols="11">
        {{ note }}
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
  <div v-else-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.Onboard" id="VEVRAA" class="m-2">
    <div id="summarySection" class="mb-3" v-if="formFileData.length || note">
      <div v-for="document in formFileData" :key="document.filePath" class="file_item d-flex align-items-center mb-1 p">
        <font-awesome-icon :icon="['fal', 'paperclip']" />
        <fs-link @click="handlePreviewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
          <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
        </fs-link>
      </div>
    </div>
    <fs-row class="vevraa-status">
      <fs-col cols="2">
        <strong>Veteran Status</strong>
      </fs-col>
      <fs-col v-if="onboardingVEVRAAUpload.data?.veteranStatusId === VeteranStatus.ProtectedVeteran" cols="10"
        class="vevraa-text">
        <p>
          I belong to the following classifications of protected veterans
          (Choose all that apply):
        </p>
        <ul>
          <li v-if="onboardingVEVRAAUpload.data.isDisabledVeteran">Disabled Veteran</li>
          <li v-if="onboardingVEVRAAUpload.data.isRecentlySeparatedVeteran">
            Recently Separated Veteran
          </li>
          <li v-if="onboardingVEVRAAUpload.data.isActiveWartimeOrCampaign">
            Active Wartime Or Campaign Badge Veteran
          </li>
          <li v-if="onboardingVEVRAAUpload.data.isArmedForcesServiceMedal">
            Armed Forces Service Medal Veteran
          </li>
        </ul>
      </fs-col>
      <fs-col cols="10" class="vevraa-text"
        v-if="onboardingVEVRAAUpload.data?.veteranStatusId === VeteranStatus.NotProtectedVeteran">
        <p>
          I am a protected veteran, but I choose not to self-identify the
          classifications to which I belong.
        </p>
      </fs-col>
      <fs-col cols="10" class="vevraa-text"
        v-if="onboardingVEVRAAUpload.data?.veteranStatusId === VeteranStatus.ChooseNotToIdentify">
        <p>I am NOT a protected veteran.</p>
      </fs-col>
    </fs-row>
    <fs-row class="vevraa-signature">
      <fs-col>
        <strong>Employee Signature</strong>
      </fs-col>
      <fs-col cols="8" class="border w-100 m-2">
        <div v-if="!signatureBase64Url">Loading employee's signature...</div>
        <img v-if="signatureBase64Url" class="img-fluid" :src="signatureBase64Url" />
      </fs-col>
    </fs-row>
    <fs-row class="vevraa-date">
      <fs-col cols="2">
        <strong>Date</strong>
      </fs-col>
      <fs-col cols="10">
        <p>
          {{ onboardingVEVRAAUpload.data?.dateSignatureUTC ?
            moment(onboardingVEVRAAUpload.data?.dateSignatureUTC).format("MM/DD/yyyy") : '' }} -
          {{ onboardingVEVRAAUpload.data?.dateSignatureUTC ?
            moment(onboardingVEVRAAUpload.data?.dateSignatureUTC).format("hh:mm A") : '' }}
        </p>
      </fs-col>
    </fs-row>
  </div>
</template>

<style lang="scss" scoped></style>

<style scoped lang="scss">
#VEVRAA {
  .vevraa-status {
    .vevraa-text {
      p {
        margin: 0px;
      }

      ul {
        padding-left: 24px;
      }
    }
  }

  .vevraa-signature {
    margin-top: 10px;
  }

  .vevraa-date {
    margin-top: 10px;
  }
}

#summarySection {
  padding: 12px;
  border-radius: 10px;
}
</style>
