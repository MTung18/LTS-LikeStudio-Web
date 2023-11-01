<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch } from "vue";
import { DocumentTypes, makeDocumentPath } from "@/helper/hqSuite/pathHelper";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faArrowUpFromBracket,
  faCircle,
  faPaperclip,
  faTrashCan,
  faArrowUpRightFromSquare,
  faPenToSquare,
  faUser,
  faCity,
  faFloppyDisk,
} from "@fortawesome/pro-light-svg-icons";
import {
  faUpload
} from "@fortawesome/pro-regular-svg-icons";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { storeToRefs } from 'pinia';
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useOnboardingVEVRAASelfIdentificationStore } from "@/stores/onboardingVEVRAASelfIdentificationStore";
import { FileForm, FileFormVEVRAA, OnboardingFormVEVRAAModel, OnboardingVEVRAA, OnboardingVEVRAASelfIdentification, VeteranStatusOption } from "@/models/onboarding/OnboardingVEVRAASelfIdentificationUploadFile";
import { cloneDeep, isEqual } from "lodash";
import { truncateFileName } from "@/utilities/formatUtils";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { FormField } from "@/enums/FormField";
import { useEmployeeStore } from "@/stores/employeeStore";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import { ONBOARDING_FORM_STATUS } from "@/constants/common";
import { useAlerts } from '@/composables/useAlerts';
import { VeteranStatus } from "@/enums/VeteranStatus";
import SignaturePad from "@/components/common/SignaturePad.vue";
import { dataUrlToFile } from '@/helper/hqSuite/formatHelper';
import { useEmployeeContactStore } from "@/stores/onboardingEmployeeContactStore";
import FsInput from "@/components/global/fsInput/fsInput.vue";
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { StaticFiles } from '@/enums/StaticFiles';
import { MAX_FILE_NAME_LENGTH } from '@/constants/common';
import { useBreakpoints } from "@/composables/useBreakpoints";

const { notifySuccess } = useAlerts();
const azureB2CAuthStore = useAzureB2CAuthStore();
const { notifyError } = useAlerts();
const clientId = computed(
  () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
const router = useRouter();
const employeeStatus: Ref<number> = ref();
const formType: Ref<number> = ref();
const showErrorCheckboxGroup = ref(false);
const { responsive } = useBreakpoints();


const { fetchEmployeeStatusId } =
  useEmployeeContactStore();
const { employeeStatusId } = storeToRefs(useEmployeeContactStore());
const { getDocumentTemplate } = useReportTemplate();
const formDataVEVRAA: Ref<OnboardingFormVEVRAAModel> = ref();
const FormVEVRAADataClone: Ref<OnboardingFormVEVRAAModel> = ref();
const formModel: Ref<OnboardingVEVRAA> = ref();
const formModelClone: Ref<OnboardingVEVRAA> = ref();
const container = ref(null);
const employeeId = router.currentRoute.value.params.id;
const isFormDirty = ref(false);
const initialOption: VeteranStatusOption = {
  id: null,
  name: ''
};
const hqSuiteStore = useHQSuiteStore();
const onboardingVEVRAASelfIdentificationStore = useOnboardingVEVRAASelfIdentificationStore();

const { setLoading } = useLoadingStore();
const { onboardingVEVRAAFileData } = storeToRefs(useOnboardingVEVRAASelfIdentificationStore());

const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const onboardingNavStore = useOnboardingStore();

const isFormChanged = ref(false);
const openSaveFormModal = ref(false);

const toPath = ref("");
const openSaveChangeModal = ref(false);
const isLeaveRoute = ref(false)
const isFinishLoading = ref(false)
library.add(
  faCircle,
  faArrowUpFromBracket,
  faPaperclip,
  faTrashCan,
  faCircleExclamation,
  faArrowUpRightFromSquare,
  faPenToSquare,
  faUser,
  faCity,
  faFloppyDisk,
  faUpload
);

const TYPE = {
  UPDATE: "Update",
  DELETE: "Delete"
}

const formVEVRAAFileData: Ref<FileForm[]> = ref([]);
const formVEVRAAFileNameDelete: Ref<string[]> = ref([]);
const formVEVRAAFilePathDelete: Ref<string[]> = ref([]);
const statusOnboard = ref('no');
const formTypeOfEss = FormField.VEVRAAEmployee;
const originalDataParse = ref(null);
const date = ref("");
const time = ref("");

const chooseFile = () => {
  const element = document.getElementById("upload_file") as HTMLElement;
  element.click();
};

const mapFieldModelToFormModel = () => {
  const data = formDataVEVRAA.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModel.value = data;

  if (formModel.value.veteranStatus === '') {
    formModel.value.veteranStatus = 'yes'; // Default value
  }

  formModelClone.value = { ...formModel.value };
}

const mapFormModelToFieldModel = () => {
  const mappedFieldModels = formDataVEVRAA.value.fieldModels.map((fieldModel) => {
    const fieldValue = formModel.value[fieldModel.fieldKey] || ""; // Set fieldValue to an empty string if fieldKey does not exist in data
    return { ...fieldModel, fieldValue };
  });
  formDataVEVRAA.value.fieldModels = mappedFieldModels;
}
const veteranStatusEssOption = [
  {
    id: 'no',
    name: 'No',
  },
  {
    id: 'yes',
    name: 'Yes'
  },
  {
    id: 'not_response',
    name: 'I do not wish to respond'
  }
];

const initialData = {
  veteranStatusId: "",
  isDisabledVeteran: false,
  isRecentlySeparatedVeteran: false,
  isActiveWartimeOrCampaign: false,
  isArmedForcesServiceMedal: false,
  employeeSignaturePath: "",
  dateSignatureUTC: "",
  employeeSignature: "",
  veteranStatusEss: null,
  veteranStatusEssOption: null
};

const formFieldVEVRAAEmployee: Ref<OnboardingFormVEVRAAModel> = ref();
const formModelVEVRAAEmployee: Ref<OnboardingVEVRAASelfIdentification> = ref();

const EssFormData: Ref<Partial<OnboardingVEVRAASelfIdentification>> = ref(initialData);

const handleGetEmpFormData = async () => {
  await onboardingVEVRAASelfIdentificationStore.fetchVEVRAASelfIdentification(Number(employeeId), FormField.VEVRAAHrm)
  formFieldVEVRAAEmployee.value = onboardingVEVRAAFileData.value

  mapFieldModelToFormModelEmp();
}

const mapFieldModelToFormModelEmp = () => {
  const dataEmployee = formFieldVEVRAAEmployee.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModelVEVRAAEmployee.value = dataEmployee;
  if (formModelVEVRAAEmployee.value.status == "") formModelVEVRAAEmployee.value.status = 1;

}

const setOptionData = (option: VeteranStatusOption, id: string, name: string) => {
  option.id = id;
  option.name = name;
};

const currentNavItem = ref(null)
const signatureFilePath = ref('');
const originalData = ref();

const fetchDataForVEVRAAESS = async () => {
  const getNameById = (id: number | string, options): string | undefined => {
    const option = options.find(option => option.id === id);
    return option?.name;
  };
  signatureFilePath.value = await makeDocumentPath(DocumentTypes.SignatureEmployeeDocument, null, '1');
  await onboardingVEVRAASelfIdentificationStore.fetchVEVRAASelfIdentification(Number(employeeId), formTypeOfEss)
  if (onboardingVEVRAAFileData.value.fieldModels.some(field => field.fieldValue !== "")) {
    statusOnboard.value = "yes";

    onboardingVEVRAAFileData.value.fieldModels.forEach((item) => {
      const newKey = item.fieldKey as keyof OnboardingVEVRAASelfIdentification
      if (EssFormData.value) {
        EssFormData.value[newKey] = item.fieldValue as never
      }
    })

    EssFormData.value.veteranStatusEssOption = { ...initialOption };
    setOptionData(
      EssFormData.value.veteranStatusEssOption,
      EssFormData.value.veteranStatusEss,
      getNameById(EssFormData.value.veteranStatusEss, veteranStatusEssOption));

    const dateSignatureUTCObject = onboardingVEVRAAFileData.value.fieldModels.find(fieldModel => fieldModel.fieldKey === 'dateSignatureUTC');
    if (dateSignatureUTCObject) {
      const dateTimeString = dateSignatureUTCObject.fieldValue;
      const dateTime = new Date(dateTimeString);
      const dateString = dateTime.toISOString().split('T')[0];
      const timeString = dateTime.toISOString().split('T')[1].slice(0, 5);
      date.value = dateString;
      time.value = timeString;
    }
  }
  originalData.value = JSON.stringify(onboardingVEVRAAFileData.value);
  originalDataParse.value = JSON.parse(originalData.value);
};

const handleCheckSideBar = async (firstLoad: boolean) => {
  await handleGetEmpFormData();
  if (onboardingSideNavItem.value.length == 0) {
    await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
  }

  if (!firstLoad) {
    currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLowerCase() === 'onboardingVEVRAASelfIdentification'.trim().toLocaleLowerCase());
    if (formModelVEVRAAEmployee.value.status == 3 || (formDataVEVRAA.value.uploadFileStateForms.length > 0) || statusOnboard.value !== "no") {
      await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId))
    } else {
      await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, false, Number(employeeId))
    }
  }
}

const isUploadEnabled = computed(() => formModel.value?.veteranStatus !== 'no');

watch(EssFormData, () => {
  if (onboardingVEVRAAFileData.value !== undefined) {
    isFormDirty.value =
      JSON.stringify(EssFormData.value) !== originalData.value;
  } else {
    isFormDirty.value =
      JSON.stringify(EssFormData.value) !==
      JSON.stringify(initialData);
  }
});

const handleClearSignature = () => {
  EssFormData.value.employeeSignaturePath = "";
}
const signatureObject = ref({
  path: '',
  fileObject: null,
  name: ''
})

const handleUpdatePathSignature = async (value: string) => {
  const name = `VEVRAASelfIdentification-Signature-${new Date().getTime()}.png`
  const File = await dataUrlToFile(value, name)
  signatureObject.value.path = signatureFilePath.value
  signatureObject.value.name = name
  signatureObject.value.fileObject = File
  EssFormData.value.employeeSignaturePath = `${signatureFilePath.value}/${name}`
}
const handleUpdatePath = (path: string) => {
  EssFormData.value.employeeSignaturePath = path;
}

const handleGetFormVEVRAA = async (firstLoad: boolean) => {
  formVEVRAAFileData.value = [];
  formVEVRAAFileNameDelete.value = [];
  formVEVRAAFilePathDelete.value = [];
  await onboardingVEVRAASelfIdentificationStore.fetchVEVRAASelfIdentification(Number(employeeId), formType.value)
  formDataVEVRAA.value = onboardingVEVRAAFileData.value
  FormVEVRAADataClone.value = cloneDeep(onboardingVEVRAAFileData.value)
  mapFieldModelToFormModel();
  isFormChanged.value = false;
  await handleCheckSideBar(firstLoad);
}

const handleRemoveFileItem = (data: string, filepath: string) => {
  formVEVRAAFileNameDelete.value.push(data);
  formVEVRAAFilePathDelete.value.push(filepath);
  formVEVRAAFileData.value = formVEVRAAFileData.value.filter(x => !formVEVRAAFileNameDelete.value.includes(x.fileName))
  fillData(null, formVEVRAAFileNameDelete.value, TYPE.DELETE);
};

const handleCheckFileSize = (fileSize: number) => {
  const limitSize = 10000000 // Max file upload 10MbB = 10000000 Bytes.
  return fileSize <= limitSize;
}

// UPLOAD FILES
function isFileTypeSupported(fileName: string) {
  const supportedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return supportedExtensions.includes(fileExtension);
}

async function uploadformVEVRAAFileData(file: File) {
  const pathforEmployeeDoc = await makeDocumentPath(
    DocumentTypes.EmployeeVEVRAAHrm,
    `${clientId.value}`
  );
  const data: FileForm = {
    fileName: file.name,
    filePath: `${pathforEmployeeDoc}`,
    fileObject: new File([file], file.name),
  };

  formVEVRAAFileData.value.push(data);
  fillData(formVEVRAAFileData.value, null, TYPE.UPDATE);
}

function fillData(data: FileForm[], listDelete: string[], type: string) {
  if (type === TYPE.UPDATE) {
    formDataVEVRAA.value.uploadFileStateForms = [...FormVEVRAADataClone.value.uploadFileStateForms];
    formDataVEVRAA.value.uploadFileStateForms = formDataVEVRAA.value.uploadFileStateForms.filter(x => !formVEVRAAFileNameDelete.value.includes(x.fileName))
    const mapData = data.map((x) => ({
      fileName: x.fileName,
      filePath: x.filePath + '/' + x.fileName,
      formFieldId: formDataVEVRAA.value.fieldModels.filter(field => field.fieldKey === "formFiles")[0].formFieldId,
      description: "File Form VEVRAA"
    }))
    mapData.forEach((item: FileFormVEVRAA) => {
      formDataVEVRAA.value.uploadFileStateForms.push(item);
    })

  } else {
    const newArr = [...formDataVEVRAA.value.uploadFileStateForms.filter(x => !listDelete.includes(x.fileName))];
    formDataVEVRAA.value.uploadFileStateForms = newArr;
  }
}

watch(() => !isEqual(formDataVEVRAA.value?.uploadFileStateForms, FormVEVRAADataClone.value?.uploadFileStateForms), () => {
  if (isFinishLoading.value) {
    if (!isEqual(formDataVEVRAA.value?.uploadFileStateForms, FormVEVRAADataClone.value?.uploadFileStateForms)) {
      isFormChanged.value = true
    } else {
      isFormChanged.value = false
    }
  }
})

watch(() => !isEqual(formModel.value, formModelClone.value), () => {
  if (isFinishLoading.value) {
    if (!isEqual(formModel.value, formModelClone.value)) {
      isFormChanged.value = true
    } else {
      isFormChanged.value = false
    }
  }
})

const saveFile = async (filepath: string, file: File) => {
  //TODO : get employeeId from Store instead of string '1'
  await hqSuiteStore.uploadDocument(
    { path: filepath, file: file, fileName: file.name },
    true
  );
};

const deleteFile = async (filepath: string) => {
  //TODO : get employeeId from Store instead of string '1'
  await hqSuiteStore.deleteFile(filepath)
}

const saveFormVEVRAAData = async () => {
  await onboardingVEVRAASelfIdentificationStore.updateVEVRAASelfIdentificationById({ employeeId: Number(employeeId), formData: formDataVEVRAA.value });
  await handleGetFormVEVRAA(false);
}

const handleFile = async () => {
  await Promise.all(
    //File for upload
    formVEVRAAFileData.value.map(async (item) => {
      await saveFile(item.filePath, item.fileObject);
    })
  );
  //File for delete
  await Promise.all(
    formVEVRAAFilePathDelete.value.map(async (item) => {
      await deleteFile(item);
    })
  )
}

const handleDownloadFile = async (filePath: string) => {
  await hqSuiteStore.downloadFile(filePath);
}

const handleSubmitForm = async (isNext: boolean) => {
  if (isUploadEnabled.value === true &&
    (formDataVEVRAA.value.uploadFileStateForms.length <= 0)) {
    showErrorCheckboxGroup.value = true;
    return;
  }
  try {
    setLoading(true);
    //upload file
    if (isFormChanged.value) {
      mapFormModelToFieldModel();
      await handleFile();
      await saveFormVEVRAAData();
      isFormChanged.value = false;
    }
  } catch (error) {
    console.error(error);
  } finally {
    openSaveFormModal.value = false;
    setLoading(false);
    notifySuccess(`Information updated.`);
    if (isNext) {
      router.push({ name: 'onboardingWOTC' });
    }
  }
}

onBeforeRouteLeave((to, from, next) => {
  if (isFormChanged.value) {
    openSaveChangeModal.value = true
    toPath.value = to.fullPath
    if (!isLeaveRoute.value) {
      next(false)
      return false
    } else {
      next()
      return true
    }
  }
  next();
});

const handleDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
  isLeaveRoute.value = true;
  router.push(toPath.value)
};

const handleCancelDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
  isLeaveRoute.value = false;
};

const handleUploadFile = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = target.files;

  for (let i = 0; i < files.length; i++) {
    if (!isFileTypeSupported(files[i].name)) {
      notifyError('Wrong file format, upload PDF, PNG, JPEG or JPG only!')
      return;
    }
    if (files[i].name.length > MAX_FILE_NAME_LENGTH) {
      notifyError('The maximum file name is 50 characters.');
      return;
    }
    if (!handleCheckFileSize(files[i].size)) {
      notifyError('The maximum upload size is 10MB!');
      return;
    }

    const isFileNameExists = formDataVEVRAA?.value.uploadFileStateForms.some(item => item.fileName === files[i].name);
    if (isFileNameExists) {
      notifyError('This file name already exists.');
      return;
    }
  }
  [...target.files].forEach((f) => {
    uploadformVEVRAAFileData(f);
  });
  setLoading(false);
};

onMounted(async () => {
  setLoading(true);
  await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
  currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === 'onboardingVEVRAASelfIdentification'.trim().toLocaleLowerCase());
  // CHECK EMPLOYEE CURRENT STATUS
  await fetchDataForVEVRAAESS();
  await fetchEmployeeStatusId(employeeId as string);
  employeeStatus.value = employeeStatusId.value;
  formType.value = FormField.VEVRAAHrm;
  await handleGetFormVEVRAA(true);
  setLoading(false);
  isFinishLoading.value = true;
})

const handleDownloadStaticFile = async (filename: string, isDownload: boolean) => {
  setLoading(true);
  try {
    await getDocumentTemplate(filename, isDownload);
  } catch (error) {
    notifyError(`${filename} is missing`)
  } finally {
    setLoading(false);
  }
}

const isSignatureConsent = ref(true);
const handleUpdateSignatureConsent = () => {
  isSignatureConsent.value = !isSignatureConsent.value;
}
</script>

<template>
  <div ref="container">
    <!-- Onboard Status -->
    <fs-container id="form-VEVRAA" class="p-0" :style="{ paddingBottom: '100px' }"
      v-if="employeeStatus == EmployeeStatusEnum.Onboard">
      <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
        <fs-row align-v="center">
          <fs-col class="text-truncate">
            <h2 class="hq-pg__title">VEVRAA Self-identification</h2>
          </fs-col>
          <fs-col cols="auto" class="ms-auto">
            <fs-button  type="submit" variant="outline-primary" :disabled="!isFormChanged"
            @click="handleSubmitForm(false)">
            <font-awesome-icon :icon="['fal', 'floppy-disk']" />
            <span class="	d-none d-sm-block">Save</span> </fs-button>
          <fs-button type="submit" variant="primary" class="saveAndNext" :disabled="!isFormChanged"
            @click="handleSubmitForm(true)">Save
            &#38;
            next</fs-button>
          </fs-col>
        </fs-row>
        
        <div class="d-flex align-items-center">
          
        </div>
      </fs-container>
      <fs-container class="contain">
        <fs-col class="onboarding-VEVRAA__sections">
          <div class="label-required">
            <div>Upload file</div>
          </div>
          <div class="mb-3">
            <span>
              <input type="file" multiple id="upload_file" :disabled="!isUploadEnabled" @change="handleUploadFile"
                ref="fileInput" hidden />
            </span>
            <fs-row class="mb-3" v-if="formDataVEVRAA?.uploadFileStateForms.length > 0">
              <fs-col md="4" class="d-flex tax-box-left display-flex justify-content-center flex-column">
                <div class="d-flex align-items-center gap-2 fw-bold text-capitalize">
                  <font-awesome-icon :icon=faUpload class="iconUpload" />
                  VEVRAA Self-identification
                </div>
              </fs-col>
              <fs-col md="8" class="tax-box-right">
                <!-- Show List of Files Uploaded -->
                <div class="flex-grow-1">
                  <div class="align-items-center gap-2">
                    <div v-for="document in formDataVEVRAA?.uploadFileStateForms" :key="document.filePath"
                      class="text-gray my-3 w-100 " style="cursor: pointer;">
                      <font-awesome-icon :icon="['fal', 'paperclip']" /><span class="ms-2"
                        v-on:click="handleDownloadFile(document.filePath)">{{
                          truncateFileName(document.fileName)
                        }}</span>
                      &nbsp;
                      <div style="display: inline; float: right;"
                        @click="handleRemoveFileItem(document.fileName, document.filePath)">
                        <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                      </div>
                    </div>
                  </div>
                </div>
              </fs-col>
            </fs-row>
            <fs-button variant="outline-primary" :disabled="!isUploadEnabled" @click="chooseFile"><font-awesome-icon
                :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />FORM VEVRAA</fs-button>
          </div>
          <div>
            <fs-input type="fsTextArea" label="Note" v-model="formModel.note" name="noteVEVRAA" :rows="3" />
          </div>
        </fs-col>
        <div class="onboarding-VEVRAA__sections mb-1 onboarding-VEVRAA__bort-1">
          <fs-input style="width: 180px;" type="fsMultiselectList" v-model="EssFormData.veteranStatusEssOption"
            :typeaheaddata="veteranStatusEssOption" typeaheadkey="name" typeaheadvalueattribute="id" rules="required"
            name="veteranStatusEss" label="Veteran Status" :required="true" disabled />
        </div>
        <div class="onboarding-VEVRAA__sections mb-0 pt-0">
          <h3 class="onboarding-VEVRAA__subTitle">Self-identfication</h3>
          <span class="onboarding-VEVRAA__text">As a Government contractor subject to VEVRAA, we are required to
            submit a report to the United States Department of Labor each year
            identifying the number of our employees belonging to each specified
            “protected veteran” category. If you believe you belong to any of
            the categories of protected veterans listed above, please indicate
            by checking the appropriate box below.</span>
          <div class="onboarding-VEVRAA__text pb-0">
            <fs-form-group class="mb-0">
              <fs-form-radio class="onboarding-VEVRAA__radio text-uppercase" disabled
                v-model="EssFormData.veteranStatusId" :value="VeteranStatus.ProtectedVeteran">
                I belong to the following classifications of protected veterans
                (Choose all that apply):
              </fs-form-radio>
              <div class="ps-3 mb-2">
                <fs-form-checkbox v-model="EssFormData.isDisabledVeteran" disabled>
                  DISABLED VETERAN
                </fs-form-checkbox>
                <fs-form-checkbox v-model="EssFormData.isRecentlySeparatedVeteran" disabled>
                  RECENTLY SEPARATED VETERAN
                </fs-form-checkbox>
                <fs-form-checkbox v-model="EssFormData.isActiveWartimeOrCampaign
                  " disabled>
                  ACTIVE WARTIME OR CAMPAIGN BADGE VETERAN
                </fs-form-checkbox>
                <fs-form-checkbox v-model="EssFormData.isArmedForcesServiceMedal
                  " disabled>
                  ARMED FORCES SERVICE MEDAL VETERAN
                </fs-form-checkbox>
              </div>
              <fs-form-radio class="onboarding-VEVRAA__radio" v-model="EssFormData.veteranStatusId"
                :value="VeteranStatus.NotProtectedVeteran" disabled>
                I am a protected veteran, but I choose not to self-identify the
                classifications to which I belong.
              </fs-form-radio>
              <fs-form-radio class="onboarding-VEVRAA__radio" v-model="EssFormData.veteranStatusId"
                :value="VeteranStatus.ChooseNotToIdentify" disabled>
                I am NOT a protected veteran.
              </fs-form-radio>
            </fs-form-group>
          </div>
        </div>
        <div class="onboarding-VEVRAA__sections">
          <SignaturePad v-if="isFinishLoading" ref="signaturePad" :path="EssFormData?.employeeSignaturePath"
            :isEdit="!isFormDirty" :isSignatureConsent="isSignatureConsent"
            @update-signature-consent="handleUpdateSignatureConsent" @clear-signature="handleClearSignature"
            @update-path-signature="handleUpdatePath" @submit-signature="handleUpdatePathSignature" />
        </div>
        <div class="onboarding-VEVRAA__sections pt-0">
          <h3 class="onboarding-VEVRAA__subTitle">Today's Date</h3>
          <div class="d-flex">
            <fs-input type="fsDateInput" label="" v-model="date" name="date" disabled class="onboarding-VEVRAA__dateInput"
              style="margin-right: 1rem;" />
            <fs-input type="fsTimeInput" label="" v-model="time" name="time" disabled
              class="onboarding-VEVRAA__timeInput" />
          </div>
        </div>
        <div class="onboarding-VEVRAA__sections onboarding-VEVRAA__bort-1">
          <h3 class="onboarding-VEVRAA__subTitle">Definitions</h3>
          <span class="onboarding-VEVRAA__text">This employer is a Government contractor subject to the Vietnam Era
            Veterans' Readjustment Assistance Act of 1974, as amended by the
            Jobs for Veterans Act of 2002, 38 U.S.C. 4212 (VEVRAA), which
            requires Government contractors to take affirmative action to employ
            and advance in employment: (1) disabled veterans; (2) recently
            separated veterans; (3) active duty wartime or campaign badge
            veterans; and (4) Armed Forces service medal veterans. These
            classifications are defined as follows:</span>

          <span class="onboarding-VEVRAA__text">A “disabled veteran” is one of the following:
            <ul>
              <li>
                A veteran of the U.S. military, ground, naval or air service who
                is entitled to compensation (or who but for the receipt of
                military retired pay would be entitled to compensation) under
                laws administered by the Secretary of Veterans Affairs; or
              </li>
              <li>
                A person who was discharged or released from active duty because
                of a service-connected disability.
              </li>
            </ul>
          </span>

          <span class="onboarding-VEVRAA__text">A “recently separated veteran” means any veteran during the
            three-year period beginning on the date of such veteran's discharge
            or release from active duty in the U.S. military, ground, naval, or
            air service.</span>
          <span class="onboarding-VEVRAA__text">An “active duty wartime or campaign badge veteran” means a veteran
            who served on active duty in the U.S. military, ground, naval or air
            service during a war, or in a campaign or expedition for which a
            campaign badge has been authorized under the laws administered by
            the Department of Defense.</span>
          <span class="onboarding-VEVRAA__text">An “Armed forces service medal veteran” means a veteran who, while
            serving on active duty in the U.S. military, ground, naval or air
            service, participated in a United States military operation for
            which an Armed Forces service medal was awarded pursuant to
            Executive Order 12985.</span>
          <span class="onboarding-VEVRAA__text">Protected veterans may have additional rights under USERRA—the
            Uniformed Services Employment and Reemployment Rights Act. In
            particular, if you were absent from employment in order to perform
            service in the uniformed service, you may be entitled to be
            reemployed by your employer in the position you would have obtained
            with reasonable certainty if not for the absence due to service. For
            more information, call the U.S. Department of Labor's Veterans
            Employment and Training Service (VETS), toll-free, at
            1-866-4-USA-DOL.</span>
        </div>
        <div class="onboarding-VEVRAA__sections onboarding-VEVRAA__bort-1">
          <h3 class="onboarding-VEVRAA__subTitle">
            Reasonable accommodation notice
          </h3>
          <span class="onboarding-VEVRAA__text">If you are a disabled veteran it would assist us if you tell us
            whether there are accommodations we could make that would enable you
            to perform the essential functions of the job, including special
            equipment, changes in the physical layout of the job, changes in the
            way the job is customarily performed, provision of personal
            assistance services or other accommodations. This information will
            assist us in making reasonable accommodations for your
            disability.</span>
          <span class="onboarding-VEVRAA__text">Submission of this information is voluntary and refusal to provide
            it will not subject you to any adverse treatment. The information
            provided will be used only in ways that are not inconsistent with
            the Vietnam Era Veterans' Readjustment Assistance Act of 1974, as
            amended.</span>
          <span class="onboarding-VEVRAA__text">The information you submit will be kept confidential, except that
            (i) supervisors and managers may be informed regarding restrictions
            on the work or duties of disabled veterans, and regarding necessary
            accommodations; (ii) first aid and safety personnel may be informed,
            when and to the extent appropriate, if you have a condition that
            might require emergency treatment; and (iii) Government officials
            engaged in enforcing laws administered by the Office of Federal
            Contract Compliance Programs, or enforcing the Americans with
            Disabilities Act, may be informed.</span>
        </div>
      </fs-container>
      <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved Changes" okText="YES, LEAVE"
        okTextVariant="danger" cancelText="stay" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
        @ok="handleDiscardOnRouteChange">
        <template #content>
          <span class="d-flex">
            <font-awesome-icon :class="['me-2', 'text-danger']" :icon="faCircleExclamation" size="lg" />
            <h5>
              Are you sure you want to leave this page?
              <br />
              You have unsaved changes, your data will be lost.
            </h5>
          </span>
        </template>
      </dark-theme-modal>
    </fs-container>

    <!-- Quick Hire Status -->

    <fs-container class="p-0" id="form-VEVRAA" :style="{ paddingBottom: '100px' }"
      v-if="employeeStatus == EmployeeStatusEnum.QuickHire && isFinishLoading">
      <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
        <fs-row align-v="center">
          <fs-col class="truncate-text">
            <h2 class="hq-pg__title">VEVRAA Self-identification <label
            class="float-end ps-1 d-none d-sm-block "> |
            Voluntary Self-Identification of Veteran
            Status</label> </h2>
          </fs-col>
          <fs-col class="ms-auto">
            <fs-button type="submit" variant="outline-primary"
            :disabled="!isFormChanged || formDataVEVRAA?.uploadFileStateForms.length == 0"
            @click="handleSubmitForm(false)">
            <font-awesome-icon :icon="['fal', 'floppy-disk']" />
            <span class="	d-none d-sm-block">Save</span> </fs-button>
            <fs-button type="submit" variant="primary" class="saveAndNext"
              :disabled="!isFormChanged || formDataVEVRAA?.uploadFileStateForms.length == 0"
              @click="handleSubmitForm(true)">Save
              &#38;
              next</fs-button>
          </fs-col>
        </fs-row>
        <div class="tax-withholding-header__title">VEVRAA Self-identification <label
            class="float-end ps-1 d-none d-sm-block "> |
            Voluntary Self-Identification of Veteran
            Status</label> </div>
        <div class="d-flex align-items-center">
          <fs-button class="d-flex align-items-center" type="submit" variant="outline-primary"
            :disabled="!isFormChanged || formDataVEVRAA?.uploadFileStateForms.length == 0"
            @click="handleSubmitForm(false)">
            <font-awesome-icon :icon="['fal', 'floppy-disk']" />
            <span class="	d-none d-sm-block">Save</span> </fs-button>
          <fs-button type="submit" variant="primary" class="saveAndNext"
            :disabled="!isFormChanged || formDataVEVRAA?.uploadFileStateForms.length == 0"
            @click="handleSubmitForm(true)">Save
            &#38;
            next</fs-button>
        </div>
      </fs-container>
      <fs-container class="contain">
        <div class="onboarding-VEVRAA__sections mb-1">
          <h3 class="onboarding-VEVRAA__uploadBtn">Veteran Status <span
              class="onboarding-employee-contact__formInput__required">*</span></h3>

          <select v-model="formModel.veteranStatus" class="form-select">
            <option value="no" default>No</option>
            <option value="yes">Yes</option>
            <option value="not_response">I do not wish to respond</option>
          </select>
        </div>
        <div class="onboarding-VEVRAA__sections mb-4">
          <fs-col class="onboarding-VEVRAA__sections pt-1">
            <div class="mb-3">
              <span>
                <input type="file" multiple id="upload_file" :disabled="!isUploadEnabled" @change="handleUploadFile"
                  ref="fileInput" hidden />
              </span>
              <fs-row class="mb-3">
                <fs-col md="4" class="d-flex tax-box-left display-flex justify-content-center flex-column">
                  <div class="d-flex align-items-center gap-3 text-capitalize">
                    <fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_VEVRAA, false)">Download</fs-link>
                  </div>
                </fs-col>
                <fs-col md="8" class="tax-box-right">
                  <!-- Show List of Files Uploaded -->
                  <div class="flex-grow-1">
                    <div class="align-items-center gap-2">
                      <div v-if="formDataVEVRAA?.uploadFileStateForms.length > 0"
                        v-for="document in formDataVEVRAA?.uploadFileStateForms" :key="document.filePath"
                        class="text-gray my-3 w-100">
                        <font-awesome-icon :icon="['fal', 'paperclip']" /><span class="ms-2"
                          v-on:click="handleDownloadFile(document.filePath)">{{
                            truncateFileName(document.fileName)
                          }}</span>
                        &nbsp;
                        <div style="display: inline; float: right;"
                          @click="handleRemoveFileItem(document.fileName, document.filePath)">
                          <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                        </div>
                      </div>
                      <div v-else>
                        <label for="noFile" class="text-gray mt-2">
                          No file has been uploaded
                        </label>
                        <fs-button variant="outline-primary" class="float-end" :disabled="!isUploadEnabled"
                          @click="chooseFile"><font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']"
                            class="me-2" />Upload</fs-button>
                      </div>
                    </div>
                  </div>
                </fs-col>
              </fs-row>
              <fs-button v-if="formDataVEVRAA?.uploadFileStateForms.length > 0" variant="outline-primary"
                :disabled="!isUploadEnabled" @click="chooseFile"><font-awesome-icon
                  :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Upload</fs-button>
            </div>
            <div v-if="showErrorCheckboxGroup === true" class="message-error">
              This field is required
            </div>
          </fs-col>
          <fs-col class="onboarding-VEVRAA__sections pt-2">
            <fs-input type="fsTextArea" label="Note" v-model="formModel.note" name="noteVEVRAA" :rows="3" />
          </fs-col>
        </div>
      </fs-container>
      <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved Changes" okText="YES, LEAVE"
        okTextVariant="danger" cancelText="stay" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
        @ok="handleDiscardOnRouteChange">
        <template #content>
          <span class="d-flex">
            <font-awesome-icon :class="['me-2', 'text-danger']" :icon="faCircleExclamation" size="lg" />
            <h5>
              Are you sure you want to leave this page?
              <br />
              You have unsaved changes, your data will be lost.
            </h5>
          </span>
        </template>
      </dark-theme-modal>
    </fs-container>
  </div>
</template>

<style scoped lang="scss">
#form-VEVRAA {
  .section {
    border: 0.5px solid #E9ECEF;
    border-radius: 10px;

    .justify-content-between {
      margin: 20px;
    }

    svg {
      color: #1ABC9C;
      padding-left: 10px;
      cursor: pointer;
    }

    .dot-success {
      border: 1px solid #1ABC9C;
      width: 6px;
      height: 6px;
      border-radius: 25px;
      background: #1ABC9C;
      margin-right: 8px
    }

    .dot-gray {
      border: 1px solid #6E7C8F;
      width: 6px;
      height: 6px;
      border-radius: 25px;
      background: #6E7C8F;
      margin-right: 8px
    }

    .fa-user {
      color: #425AFB;
      cursor: default
    }

    .fa-city {
      color: #0376F2;
      cursor: default
    }
  }

  svg.fa-paperclip {
    color: rgb(3, 169, 244);
  }

  svg {
    color: #1ABC9C;
    cursor: pointer;
  }

  svg.iconUpload {
    font-size: 1em;
    color: #A03AFF;
  }

  .btn:hover svg {
    color: white !important;
  }

  .dot-success {
    border: 1px solid #1ABC9C;
    width: 6px;
    height: 6px;
    border-radius: 25px;
    background: #1ABC9C;
    margin-right: 8px
  }

  .dot-gray {
    border: 1px solid #6E7C8F;
    width: 6px;
    height: 6px;
    border-radius: 25px;
    background: #6E7C8F;
    margin-right: 8px
  }
}
</style>