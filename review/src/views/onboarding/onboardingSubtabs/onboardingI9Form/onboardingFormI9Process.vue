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
  faLandmark,
  faUpload
} from "@fortawesome/pro-light-svg-icons";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { storeToRefs } from 'pinia';
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { onBeforeRouteLeave, useRouter } from "vue-router";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useOnboardingFormINineStore } from "@/stores/onboardingFormI9Store";
import { FileForm, FileFormI9, OnboardingFormINineModel, OnboardingI9Employee, OnboardingI9Employer, OnboardingI9Summary } from "@/models/onboarding/OnboardingFormINine";
import { cloneDeep, isEqual } from "lodash";
import { truncateFileName } from "@/utilities/formatUtils";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { FormField } from "@/enums/FormField";
import { useEmployeeStore } from "@/stores/employeeStore";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import { ONBOARDING_FORM_STATUS } from "@/constants/common";
import { useAlerts } from '@/composables/useAlerts';
import { useReportTemplate } from "@/stores/reportTemplateStore";
import { useBreakpoints } from "@/composables/useBreakpoints";
import onboardingI9MobileButton from "@/views/onboarding/onboardingSubtabs/onboardingI9Form/onboardingI9MobileButton.vue";
import { useClickOutside } from "@/composables/useClickOutside";
import { StaticFiles } from '@/enums/StaticFiles';

const { responsive } = useBreakpoints();
const azureB2CAuthStore = useAzureB2CAuthStore();
const { notifyError } = useAlerts();
const clientId = computed(
  () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
const router = useRouter();
const employeeStatus: Ref<number> = ref();
const formType: Ref<number> = ref();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const { fetchEmployeeDetails } = useEmployeeStore();

const formDataI9: Ref<OnboardingFormINineModel> = ref();
const FormI9DataClone: Ref<OnboardingFormINineModel> = ref();
const formModel: Ref<OnboardingI9Summary> = ref();
const formModelClone: Ref<OnboardingI9Summary> = ref();
const container = ref(null);
const employeeId = router.currentRoute.value.params.id;
const isEmployeeFormSubmitted = ref(false);
const mobileButton = ref(null);
const isCloseMobileButton = ref(0);

useClickOutside(mobileButton, () => {
  isCloseMobileButton.value++;
});

const hqSuiteStore = useHQSuiteStore();
const onboardingFormINineStore = useOnboardingFormINineStore();

const { setLoading } = useLoadingStore();
const { dataOnboardingFormINine } = storeToRefs(useOnboardingFormINineStore());

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
  faLandmark,
  faUpload
);

const TYPE = {
  UPDATE: "Update",
  DELETE: "Delete"
}
const FORM_TYPE = {
  Employee: "Employee",
  Employer: "Employer"
}
const FILE_TYPE_DESCRIPTION = {
  UPLOAD_DOCUMENT: 0,
  SUPPORTING_DOCUMENT: 1
}

const FormI9FileData: Ref<FileForm[]> = ref([]);
const FormI9FileNameDelete: Ref<string[]> = ref([]);
const FormI9FilePathDelete: Ref<string[]> = ref([]);

const chooseFile = (fileType: number) => {
  if (fileType === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT) {
    const element = document.getElementById("upload_file") as HTMLInputElement;
    element.value = '';
    element.click();
  } else if (fileType === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT) {
    const element = document.getElementById("upload_document_support") as HTMLInputElement;
    element.value = '';
    element.click();
  }
};

const mapFieldModelToFormModel = () => {
  const data = formDataI9.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModel.value = data;
  formModelClone.value = { ...formModel.value };
}

const mapFormModelToFieldModel = () => {
  const mappedFieldModels = formDataI9.value.fieldModels.map((fieldModel) => {
    const fieldValue = formModel.value[fieldModel.fieldKey] || ""; // Set fieldValue to an empty string if fieldKey does not exist in data
    return { ...fieldModel, fieldValue };
  });
  formDataI9.value.fieldModels = mappedFieldModels;
}

const formFieldI9Employer: Ref<OnboardingFormINineModel> = ref();
const formFieldI9Employee: Ref<OnboardingFormINineModel> = ref();
const formModelI9Employer: Ref<OnboardingI9Employer> = ref();
const formModelI9Employee: Ref<OnboardingI9Employee> = ref();

const handleGetEmpFormData = async () => {
  await onboardingFormINineStore.fetchFormINine(Number(employeeId), FormField.I9Employer)
  formFieldI9Employer.value = dataOnboardingFormINine.value

  await onboardingFormINineStore.fetchFormINine(Number(employeeId), FormField.I9Employee)
  formFieldI9Employee.value = dataOnboardingFormINine.value

  mapFieldModelToFormModelEmp();
}

const mapFieldModelToFormModelEmp = () => {
  const data = formFieldI9Employer.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModelI9Employer.value = data;
  if (formModelI9Employer.value.status == "") formModelI9Employer.value.status = 1;

  const dataEmployee = formFieldI9Employee.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
    if (fieldValue !== undefined) {
      acc[fieldKey] = fieldValue;
    }
    return acc as any;
  }, {});
  formModelI9Employee.value = dataEmployee;
  if (formModelI9Employee.value.status == "") formModelI9Employee.value.status = 0;
}

const isDisableEmployerForm = ref(true);
const getEmployeeFormStatus = (formSubmittedStatus: number): number => {
  let statusId: number;
  if (formSubmittedStatus == 0) {
    statusId = ONBOARDING_FORM_STATUS.NOT_STARTED;
    isDisableEmployerForm.value = true
  } else {
    if (isEmployeeFormSubmitted.value) {
      statusId = ONBOARDING_FORM_STATUS.COMPLETED;
      isDisableEmployerForm.value = false
    } else {
      statusId = ONBOARDING_FORM_STATUS.IN_PROGRESS;
      isDisableEmployerForm.value = true
    }
  }
  return statusId;
}

const currentNavItem = ref(null)
const handleCheckSideBar = async (firstLoad: boolean) => {
  await handleGetEmpFormData();
  if (onboardingSideNavItem.value.length == 0) {
    await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId));
  }
  const employeeFormStatus = getEmployeeFormStatus(Number(formModelI9Employee.value.status))
  if (!firstLoad) {
    currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLowerCase() === 'onboardingFormI9'.trim().toLocaleLowerCase());
    if ((formModelI9Employer.value.status == ONBOARDING_FORM_STATUS.COMPLETED && employeeFormStatus == ONBOARDING_FORM_STATUS.COMPLETED) ||
      (formDataI9.value.uploadFileStateForms.length > 0 && formDataI9.value.uploadFileStateForms.find(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT) != undefined)) {
      await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId))
    } else {
      await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, false, Number(employeeId))
    }
  }
}

const handleGetFormI9 = async (firstLoad: boolean) => {
  FormI9FileData.value = [];
  FormI9FileNameDelete.value = [];
  FormI9FilePathDelete.value = [];
  await onboardingFormINineStore.fetchFormINine(Number(employeeId), formType.value)
  formDataI9.value = dataOnboardingFormINine.value
  FormI9DataClone.value = cloneDeep(dataOnboardingFormINine.value)
  mapFieldModelToFormModel();
  isFormChanged.value = false;
  await handleCheckSideBar(firstLoad);
}

const handleRemoveFileItem = (file: FileFormI9) => {
  FormI9FileNameDelete.value.push(file.fileName);
  FormI9FilePathDelete.value.push(file.filePath);
  FormI9FileData.value = FormI9FileData.value.filter(x => !FormI9FileNameDelete.value.includes(x.fileName))
  fillData(null, FormI9FileNameDelete.value, TYPE.DELETE);
};

// UPLOAD FILES
const isFileTypeSupported = (fileName: string) => {
  const supportedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return supportedExtensions.includes(fileExtension);
}

const handleCheckFileSize = (fileSize: number) => {
  const limitSize = 10000000 // Max file upload 10MbB = 10000000 Bytes.
  return fileSize <= limitSize;
}

const handleCheckFileNameLength = (fileName: string) => {
  if (fileName.length > 50) {
    return false;
  }
  return true;
}

const handleCheckDuplicateFileName = (fileName: string) => {
  return formDataI9.value.uploadFileStateForms.every(file => file.fileName !== fileName ? true : false);
}

const handleUploadFile = async (event: Event, fileType: number) => {
  const target = event.target as HTMLInputElement;
  [...target.files].forEach((file) => {
    if (!isFileTypeSupported(file.name)) {
      notifyError('Wrong file format, upload PDF, PNG, JPEG or JPG only!')
      return;
    }
    if (!handleCheckFileSize(file.size)) {
      notifyError('The maximum upload size is 10MB!');
      return;
    }
    if (!handleCheckFileNameLength(file.name)) {
      notifyError('File name must not exceed 50 characters!');
      return;
    }
    if (!handleCheckDuplicateFileName(file.name)) {
      notifyError('This file name is already exists.');
      return;
    }
    uploadFormI9FileData(file, fileType);
  });
  setLoading(false);
};

const generateTemplate = (formType: string, progressStatus: number, formSubmitted: boolean): string => {
  let color: string;
  let status: string;
  let statusId: number;
  if (formType == FORM_TYPE.Employee) {
    if (progressStatus == 0) {
      statusId = ONBOARDING_FORM_STATUS.NOT_STARTED;
    } else {
      if (formSubmitted) {
        statusId = ONBOARDING_FORM_STATUS.COMPLETED;
      } else {
        statusId = ONBOARDING_FORM_STATUS.IN_PROGRESS;
      }
    }
  } else {
    statusId = progressStatus;
  }


  switch (statusId) {
    case ONBOARDING_FORM_STATUS.COMPLETED:
      color = '#1ABC9C';
      status = 'Completed';
      break;
    case ONBOARDING_FORM_STATUS.NOT_STARTED:
      color = '#6E7C8F';
      status = 'Not Started';
      break;
    case ONBOARDING_FORM_STATUS.IN_PROGRESS:
      color = '#FF6600';
      status = 'In Progress';
      break;
    default:
      color = '#000000'; // Default color if the progress status is not recognized
      status = 'unknown';
      break;
  }
  const template = `<div style="display: flex; align-items: center">
    <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background-color: ${color}; margin-right: 5px;"></span>
    ${status}
  </div>`;

  return template;
}

const uploadFormI9FileData = async (file: File, fileType: number) => {
  const pathforEmployeeDoc = await makeDocumentPath(
    DocumentTypes.EmployeeI9,
    `${clientId.value}`,
    `${employeeId}`
  );
  const data: FileForm = {
    fileName: file.name,
    filePath: `${pathforEmployeeDoc}`,
    fileObject: new File([file], file.name),
    description: '',
    payload: {
      type: fileType
    }
  };

  FormI9FileData.value.push(data);
  fillData(FormI9FileData.value, null, TYPE.UPDATE);
}

const fillData = (data: FileForm[], listDelete: string[], type: string) => {
  if (type === TYPE.UPDATE) {
    formDataI9.value.uploadFileStateForms = [...FormI9DataClone.value.uploadFileStateForms];
    formDataI9.value.uploadFileStateForms = formDataI9.value.uploadFileStateForms.filter(x => !FormI9FileNameDelete.value.includes(x.fileName))
    const mapData = data.map((x) => ({
      fileName: x.fileName,
      filePath: x.filePath + '/' + x.fileName,
      formFieldId: formDataI9.value.fieldModels.filter(field => field.fieldKey === "formFiles")[0].formFieldId,
      description: x.description,
      payload: {
        type: x.payload.type
      }
    }))
    mapData.forEach((item: FileFormI9) => {
      formDataI9.value.uploadFileStateForms.push(item);
    })
  } else {
    const newArr = [...formDataI9.value.uploadFileStateForms.filter(file => !listDelete.includes(file.fileName))];
    formDataI9.value.uploadFileStateForms = newArr;
  }
}

const pushToRoute = (name: string) => {
  router.push({ name: name });
}

watch(() => !isEqual(formDataI9.value?.uploadFileStateForms, FormI9DataClone.value?.uploadFileStateForms), () => {
  if (isFinishLoading.value) {
    if (!isEqual(formDataI9.value?.uploadFileStateForms, FormI9DataClone.value?.uploadFileStateForms)) {
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
  await hqSuiteStore.uploadDocument(
    { path: filepath, file: file, fileName: file.name },
    true
  );
};

const deleteFile = async (filepath: string) => {
  await hqSuiteStore.deleteFile(filepath)
}

const saveFormI9Data = async () => {
  await onboardingFormINineStore.editFormINine(formDataI9.value, formType.value);
  await handleGetFormI9(false);
}

const handleFile = async () => {
  await Promise.all(
    //File for upload
    FormI9FileData.value.map(async (item) => {
      await saveFile(item.filePath, item.fileObject);
    })
  );
  //File for delete
  await Promise.all(
    FormI9FilePathDelete.value.map(async (item) => {
      await deleteFile(item);
    })
  )
}

const handleDownloadFile = async (filePath: string) => {
  await hqSuiteStore.downloadFile(filePath);
}

const handleSubmitForm = async (isNext: boolean) => {
  try {
    setLoading(true);
    //upload file
    if (isFormChanged.value) {
      mapFormModelToFieldModel();
      await handleFile();
      await saveFormI9Data();
      isFormChanged.value = false;
    }
  } catch (error) {
    console.error(error);
  } finally {
    openSaveFormModal.value = false;
    isFormChanged.value = false;
    setLoading(false);
    if (isNext) {
      router.push({ name: 'onboardingEEOSelfIdentification' });
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

// CHECK EMPLOYEE CURRENT STATUS
const getEmployeeDetails = async () => {
  await fetchEmployeeDetails(employeeId as string);
  employeeStatus.value = employeeDetails.value.employeeStatusId;
}

onMounted(async () => {
  try {
    setLoading(true);
    isEmployeeFormSubmitted.value = await onboardingNavStore.getEmployeeFormSubmit(Number(employeeId))
    await getEmployeeDetails();
    if (employeeStatus.value == EmployeeStatusEnum.Onboard) {
      formType.value = FormField.I9Summary
    } else if (employeeStatus.value == EmployeeStatusEnum.QuickHire) {
      formType.value = FormField.I9QuickHire
    }
    await handleGetFormI9(true);
    isFinishLoading.value = true;
    setLoading(false);
  } catch (error) {
    notifyError('There was an error fetching Form I9');
    console.error(error);
  } finally {
    isFinishLoading.value = true;
    setLoading(false)
  }
})

const { getDocumentTemplate } = useReportTemplate();
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
</script>

<template>
  <div ref="container" v-if="isFinishLoading">
    <fs-container fluid id="form-i9" :style="{ paddingBottom: '100px' }" class="p-0"
      v-if="employeeStatus == EmployeeStatusEnum.Onboard && isFinishLoading">
      <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain mb-4" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
        <fs-row align-v="center">
          <fs-col class="text-truncate">
            <h2 class="hq-pg__title">Form I-9 <span v-if="responsive.breakpoint !== 'sm'"> | Employment
                Eligibility Verification</span></h2>            
          </fs-col>
          <fs-col cols="auto" class="ms-auto">
            <fs-button class="" type="submit" variant="outline-primary" :disabled="!isFormChanged"
              @click="handleSubmitForm(false)">
              <font-awesome-icon :icon="['fal', 'floppy-disk']" />
              <span v-if="responsive.breakpoint !== 'sm'">Save</span></fs-button>
            <fs-button type="submit" variant="primary" :disabled="!isFormChanged" @click="handleSubmitForm(true)">Save
              &#38;
              next</fs-button>            
          </fs-col>
        </fs-row>


      </fs-container>
      <div class="px-4 pt-2">
        <fs-col class="d-flex justify-content-between mb-3">
          <div v-if="responsive.breakpoint !== 'sm'"><span class="fw-bold">Form I-9 | </span>Employment Eligibility
            Verification</div>
          <div><fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_I9, false)" class="text-cyan">Form I-9
              Instructions</fs-link></div>
        </fs-col>
        <fs-col v-if="responsive.breakpoint !== 'sm'">
          <div class="mb-3 section">
            <div class="d-flex justify-content-between">
              <div class="fw-bold align-self-center">
                <font-awesome-icon :icon="['fal', 'user']" size="lg" class="me-2" />
                SECTION 1: Employee Information and Attestation
              </div>
              <div class="d-flex justify-content-between align-items-center m-0 gap-1">
                <div class="me-4"
                  v-html="generateTemplate(FORM_TYPE.Employee, Number(formModelI9Employee.status), isEmployeeFormSubmitted)">
                </div>
                <fs-button @click="pushToRoute('onboardingI9Employee')" class="d-flex align-items-center w-70"
                  variant="outline-primary">
                  View</fs-button>
              </div>
            </div>
          </div>
          <div class="mb-3 section">
            <div class="d-flex justify-content-between">
              <div class="fw-bold align-self-center">
                <font-awesome-icon :icon="['fal', 'city']" size="lg" class="me-2" />
                SECTION 2 & 3: Employment Eligibility Verification
              </div>
              <div class="d-flex justify-content-between align-items-center m-0 gap-1">
                <div class="me-4"
                  v-html="generateTemplate(FORM_TYPE.Employer, Number(formModelI9Employer.status), isEmployeeFormSubmitted)">
                </div>
                <fs-button @click="pushToRoute('onboardingI9Employer')" class="d-flex align-items-center w-70"
                  variant="primary" :disabled="isDisableEmployerForm">
                  {{ formModelI9Employer.status === ONBOARDING_FORM_STATUS.COMPLETED ? 'Edit' : 'Start' }}</fs-button>
              </div>
            </div>
          </div>
          <div class="mb-3"
            v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT).length">
            <div class="section-upload d-flex">
              <fs-col cols="4" class="p-4 align-self-center">
                <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2 text-cornflower-blue" />
                <span class="fw-bold">Form I-9 Upload</span>
              </fs-col>
              <fs-col class="p-3">
                <div>
                  <a v-for="document in formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"
                    :key="document.filePath" class="text-success d-block my-2">
                    <font-awesome-icon :icon="['fal', 'paperclip']" class="text-cyan" /><span class="ms-2"
                      @click="handleDownloadFile(document.filePath)">{{ truncateFileName(document.fileName)
                      }}</span>
                    &nbsp;
                    <div style="display: inline; float: right" @click="handleRemoveFileItem(document)">
                      <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                    </div>
                  </a>
                </div>
              </fs-col>
            </div>
          </div>
          <div class="mb-3"
            v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT).length">
            <div class="section-upload d-flex">
              <fs-col cols="4" class="p-4 align-self-center">
                <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2 text-cornflower-blue" />
                <span class="fw-bold">Supporting Documents</span>
              </fs-col>
              <fs-col class="p-3">
                <div>
                  <a v-for="document in formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"
                    :key="document.filePath" class="text-success d-block my-2">
                    <font-awesome-icon :icon="['fal', 'paperclip']" class="text-cyan" /><span class="ms-2"
                      @click="handleDownloadFile(document.filePath)">{{ truncateFileName(document.fileName)
                      }}</span>
                    &nbsp;
                    <div style="display: inline; float: right" @click="handleRemoveFileItem(document)">
                      <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                    </div>
                  </a>
                </div>
              </fs-col>
            </div>
          </div>
          <div class="d-flex">
            <div class="mb-3 me-2">
              <fs-col>
                <span>
                  <input type="file" multiple id="upload_file"
                    @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)" ref="fileInput" hidden />
                </span>
                <fs-button variant="outline-primary"
                  @click="chooseFile(FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"><font-awesome-icon
                    :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Form I-9</fs-button>
              </fs-col>
            </div>
            <div class="mb-3">
              <fs-col>
                <span>
                  <input type="file" multiple id="upload_document_support"
                    @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)" ref="fileInput"
                    hidden />
                </span>
                <fs-button variant="outline-primary"
                  @click="chooseFile(FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"><font-awesome-icon
                    :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Supporting Documents</fs-button>
              </fs-col>
            </div>
          </div>
          <div>
            <fs-input type="fsTextArea" v-model="formModel.note" label="Note" rows="5" />
          </div>
        </fs-col>
        <fs-col id="onboard-mobile" v-else>
          <div class="mb-3 section">
            <div>
              <div class="p-2 pl-0 d-flex justify-content-between m-0">
                <div class="fw-bold align-self-center">
                  <font-awesome-icon :icon="['fal', 'user']" size="lg" class="me-2" />
                  Section 1
                </div>
                <fs-button @click="pushToRoute('onboardingI9Employee')" class="d-flex align-items-center w-70"
                  variant="outline-primary">
                  View</fs-button>
              </div>
              <div class="p-3 d-flex align-items-center b-top">
                <div
                  v-html="generateTemplate(FORM_TYPE.Employee, Number(formModelI9Employee.status), isEmployeeFormSubmitted)">
                </div>
              </div>
            </div>
          </div>
          <div class="mb-3 section">
            <div class="p-2 pl-0 d-flex justify-content-between m-0">
              <div class="fw-bold align-self-center">
                <font-awesome-icon :icon="['fal', 'city']" size="lg" class="me-2" />
                Section 2 & 3
              </div>
              <fs-button @click="pushToRoute('onboardingI9Employer')" class="d-flex align-items-center w-70"
                variant="primary" :disabled="isDisableEmployerForm">
                Start</fs-button>
            </div>
            <div class="p-3 d-flex align-items-center b-top">
              <div
                v-html="generateTemplate(FORM_TYPE.Employer, Number(formModelI9Employer.status), isEmployeeFormSubmitted)">
              </div>
            </div>
          </div>
          <div class="mb-3 section"
            v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT).length">
            <div class="p-2 pl-0 d-flex justify-content-between m-0">
              <div>
                <font-awesome-icon :icon="['fal', 'upload']" class="me-2 text-cornflower-blue" />
                <span class="fw-bold">Form I-9 Upload</span>
              </div>
              <span>
                <input type="file" multiple id="upload_file"
                  @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)" ref="fileInput" hidden />
              </span>
              <fs-link class="text-decoration-none"
                @click="chooseFile(FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)">Upload</fs-link>
            </div>
            <div class="align-items-center b-top">
              <a v-for="document in formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"
                :key="document.filePath" class="d-block my-2">
                <span class="ms-2" @click="handleDownloadFile(document.filePath)">{{ truncateFileName(document.fileName)
                }}</span>
                &nbsp;
                <div style="display: inline; float: right" class="me-3" @click="handleRemoveFileItem(document)">
                  <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                </div>
              </a>
            </div>
          </div>
          <div class="mb-3 section"
            v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT).length">
            <div class="p-2 pl-0 d-flex justify-content-between m-0">
              <div>
                <font-awesome-icon :icon="['fal', 'upload']" class="me-2 text-cornflower-blue" />
                <span class="fw-bold">Supporting Documents</span>
              </div>
              <span>
                <input type="file" multiple id="upload_document_support"
                  @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)" ref="fileInput" hidden />
              </span>
              <fs-link class="text-decoration-none"
                @click="chooseFile(FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)">Upload</fs-link>
            </div>
            <div class="align-items-center b-top">
              <a v-for="document in formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"
                :key="document.filePath" class="d-block my-2">
                <span class="ms-2" @click="handleDownloadFile(document.filePath)">{{ truncateFileName(document.fileName)
                }}</span>
                &nbsp;
                <div style="display: inline; float: right" class="me-3" @click="handleRemoveFileItem(document)">
                  <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                </div>
              </a>
            </div>
          </div>
          <div class="d-flex justify-content-between">
            <div class="mb-3 me-2"
              v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT).length == 0">
              <fs-col>
                <span>
                  <input type="file" multiple id="upload_file"
                    @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)" ref="fileInput" hidden />
                </span>
                <fs-button variant="outline-primary" size="sm" class="text-uppercase p-2"
                  @click="chooseFile(FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"><font-awesome-icon
                    :icon="['fal', 'arrow-up-from-bracket']" class="me-1" /><span>Form I-9</span></fs-button>
              </fs-col>
            </div>
            <div class="mb-3"
              v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT).length == 0">
              <fs-col>
                <span>
                  <input type="file" multiple id="upload_document_support"
                    @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)" ref="fileInput"
                    hidden />
                </span>
                <fs-button variant="outline-primary" size="sm" class="text-uppercase p-2"
                  @click="chooseFile(FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"><font-awesome-icon
                    :icon="['fal', 'arrow-up-from-bracket']" class="me-1" />Supporting Documents</fs-button>
              </fs-col>
            </div>
          </div>
          <div>
            <fs-input type="fsTextArea" v-model="formModel.note" label="Note" rows="5" />
          </div>
        </fs-col>
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
      </div>
    </fs-container>
    <fs-container fluid class="p-0" id="form-i9" :style="{ paddingBottom: '100px' }"
      v-if="employeeStatus == EmployeeStatusEnum.QuickHire && isFinishLoading">
      <div class="tax-withholding-header d-flex align-items-center py-3 px-4 sticky-header">
        <div v-if="responsive.breakpoint !== 'sm'" class="tax-withholding-header__title">Form I-9 | Employment Eligibility
          Verification</div>
        <div v-else class="tax-withholding-header__title">Form I-9</div>
        <div class="d-flex align-items-center">
          <fs-button class="d-flex align-items-center" type="submit" variant="outline-primary"
            :disabled="!isFormChanged || formDataI9?.uploadFileStateForms.length == 0" @click="handleSubmitForm(false)">
            <font-awesome-icon :icon="['fal', 'floppy-disk']" />
            <span v-if="responsive.breakpoint !== 'sm'">Save</span></fs-button>
          <fs-button type="submit" variant="primary"
            :disabled="!isFormChanged || formDataI9?.uploadFileStateForms.length == 0"
            @click="handleSubmitForm(true)">Save
            &#38;
            next</fs-button>
        </div>
      </div>
      <div :class="responsive.breakpoint == 'sm' ? 'px-4 pt-4' : 'px-4'">
        <div class="mb-3 mt-3" v-if="responsive.breakpoint !== 'sm'">
          <div><span class="fw-bold">Form I-9 | </span>Employment Eligibility Verification</div>
        </div>
        <div v-if="responsive.breakpoint !== 'sm'">
          <div class="mb-3">
            <div class="section-upload d-flex">
              <fs-col cols="4" class="p-4 align-self-center">
                <fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_I9_PAPER_VERSION, false)"
                  class="desc-link me-3">Download</fs-link>
                <fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_I9, false)" class="desc-link">Instructions</fs-link>
              </fs-col>
              <fs-col class="p-3">
                <div
                  v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT).length">
                  <a v-for="document in formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"
                    :key="document.filePath" class="text-success d-block my-2">
                    <font-awesome-icon :icon="['fal', 'paperclip']" style="color: rgba(0, 0, 0, 0.45);" /><span
                      class="ms-2" @click="handleDownloadFile(document.filePath)">{{ truncateFileName(document.fileName)
                      }}</span>
                    &nbsp;
                    <div style="display: inline; float: right" @click="handleRemoveFileItem(document)">
                      <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                    </div>
                  </a>
                </div>
                <div class="d-flex justify-content-between" v-else>
                  <div class="align-self-center">
                    <small>No file has been uploaded</small>
                  </div>
                  <div>
                    <span>
                      <input type="file" multiple id="upload_file"
                        @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)" ref="fileInput"
                        hidden />
                    </span>
                    <fs-button variant="outline-primary"
                      @click="chooseFile(FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"><font-awesome-icon
                        :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Form i-9</fs-button>
                  </div>
                </div>
              </fs-col>
            </div>
          </div>
          <div class="mb-3">
            <div class="section-upload d-flex">
              <fs-col cols="4" class="p-4 align-self-center">
                <fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_I9_PAPER_VERSION, false)"
                  class="desc-link me-3">Download</fs-link>
                <fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_I9, false)" class="desc-link">Instructions</fs-link>
              </fs-col>
              <fs-col class="p-3">
                <div
                  v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT).length">
                  <a v-for="document in formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"
                    :key="document.filePath" class="text-success d-block my-2">
                    <font-awesome-icon :icon="['fal', 'paperclip']" style="color: rgba(0, 0, 0, 0.45);" /><span
                      class="ms-2" @click="handleDownloadFile(document.filePath)">{{ truncateFileName(document.fileName)
                      }}</span>
                    &nbsp;
                    <div style="display: inline; float: right" @click="handleRemoveFileItem(document)">
                      <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                    </div>
                  </a>
                </div>
                <div class="d-flex justify-content-between" v-else>
                  <div class="align-self-center">
                    <small>No file has been uploaded</small>
                  </div>
                  <div>
                    <span>
                      <input type="file" multiple id="upload_document_support"
                        @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)" ref="fileInput"
                        hidden />
                    </span>
                    <fs-button variant="outline-primary"
                      @click="chooseFile(FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"><font-awesome-icon
                        :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Supporting documents</fs-button>
                  </div>
                </div>
              </fs-col>
            </div>
          </div>
          <fs-col class="d-flex">
            <div class="mb-3 me-4"
              v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT).length">
              <fs-col>
                <span>
                  <input type="file" multiple id="upload_file"
                    @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)" ref="fileInput" hidden />
                </span>
                <fs-button variant="outline-primary"
                  @click="chooseFile(FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"><font-awesome-icon
                    :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Form i-9</fs-button>
              </fs-col>
            </div>
            <div class="mb-3"
              v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT).length">
              <fs-col>
                <span>
                  <input type="file" multiple id="upload_document_support"
                    @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)" ref="fileInput"
                    hidden />
                </span>
                <fs-button variant="outline-primary"
                  @click="chooseFile(FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"><font-awesome-icon
                    :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Supporting documents</fs-button>
              </fs-col>
            </div>
          </fs-col>
        </div>
        <div v-else>
          <div class="upload-form-quick-hire mb-3">
            <div class="d-flex justify-content-between p-2">
              <div class="fw-bold align-self-center"><font-awesome-icon :icon="['fal', 'landmark']"
                  class="me-2 text-user-permission-purple" />Form I-9</div>
              <div class="d-flex">
                <span>
                  <input type="file" multiple id="upload_file"
                    @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)" ref="fileInput" hidden />
                </span>
                <div
                  v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT).length"
                  @click="chooseFile(FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)" class="text-success me-3 align-self-center">
                  Upload</div>
                <div ref="mobileButton">
                  <onboardingI9MobileButton :isClose="isCloseMobileButton" />
                </div>
              </div>
            </div>
            <div>
              <div
                v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT).length">
                <a v-for="document in formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"
                  :key="document.filePath" class="text-success d-block my-2 p-2 py-1">
                  <span @click="handleDownloadFile(document.filePath)">{{ truncateFileName(document.fileName)
                  }}</span>
                  &nbsp;
                  <div style="display: inline; float: right" @click="handleRemoveFileItem(document)">
                    <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                  </div>
                </a>
              </div>
              <div class="text-center" v-else>
                <div class="my-2">
                  <small>No file has been uploaded.</small>
                </div>
                <div class="my-2">
                  <span>
                    <input type="file" multiple id="upload_file"
                      @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)" ref="fileInput" hidden />
                  </span>
                  <fs-button variant="outline-primary"
                    @click="chooseFile(FILE_TYPE_DESCRIPTION.UPLOAD_DOCUMENT)"><font-awesome-icon
                      :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Upload</fs-button>
                </div>
              </div>
            </div>
          </div>
          <div class="upload-form-quick-hire mb-3">
            <div class="d-flex justify-content-between p-2">
              <div class="fw-bold align-self-center"><font-awesome-icon :icon="['fal', 'landmark']"
                  class="me-2 text-user-permission-purple" />Supporting documents</div>
              <div class="d-flex">
                <span>
                  <input type="file" multiple id="upload_document_support"
                    @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)" ref="fileInput"
                    hidden />
                </span>
                <div
                  v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT).length"
                  @click="chooseFile(FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"
                  class="text-success me-3 align-self-center">
                  Upload</div>
              </div>
            </div>
            <div>
              <div
                v-if="formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT).length">
                <a v-for="document in formDataI9?.uploadFileStateForms.filter(file => file.payload?.type === FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"
                  :key="document.filePath" class="text-success d-block my-2 p-2 py-1">
                  <span @click="handleDownloadFile(document.filePath)">{{ truncateFileName(document.fileName)
                  }}</span>
                  &nbsp;
                  <div style="display: inline; float: right" @click="handleRemoveFileItem(document)">
                    <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                  </div>
                </a>
              </div>
              <div class="text-center" v-else>
                <div class="my-2">
                  <small>No file has been uploaded.</small>
                </div>
                <div class="my-2">
                  <span>
                    <input type="file" multiple id="upload_document_support"
                      @change="handleUploadFile($event, FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)" ref="fileInput"
                      hidden />
                  </span>
                  <fs-button variant="outline-primary"
                    @click="chooseFile(FILE_TYPE_DESCRIPTION.SUPPORTING_DOCUMENT)"><font-awesome-icon
                      :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />Upload</fs-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <fs-input type="fsTextArea" v-model="formModel.note" label="Note" rows="5" />
        </div>
      </div>
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
#form-i9 {
  .sticky-header {
    position: sticky;
    top: 0;
    padding: 24px 0;
    z-index: 100;
    background-color: #FFFFFF;
    transition: all 0.3s ease;
  }

  .section-upload {
    border: 0.5px solid #E9ECEF;
    border-radius: 5px;

    .col {
      border-left: 0.5px solid #E9ECEF;
    }
  }

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

  svg {
    color: #1ABC9C;
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

  .upload-form-quick-hire {
    border: 0.5px solid #E9ECEF;

    .justify-content-between {
      border-bottom: 0.5px solid #E9ECEF;
    }
  }

  .fa-landmark {
    font-size: 17px;
  }

  #onboard-mobile {
    .section {
      border-radius: 5px;
    }

    .b-top {
      border-top: 0.5px solid #E9ECEF;
    }
  }

  .w-70 {
    width: 70px;
  }

  button:hover {
    svg {
      color: #FFFFFF
    }
  }

  button:focus {
    svg {
      color: #FFFFFF
    }
  }
}
</style>
