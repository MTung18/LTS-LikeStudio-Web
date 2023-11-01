<script lang="ts" setup>
import { Ref, ref, computed, onMounted } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faFileCircleExclamation, faFilePdf, faPaperclip, faTrashCan, faArrowUpFromBracket, faLandmark } from "@fortawesome/pro-light-svg-icons";
import { faUpload, faUser, faDownload, faMemo, faFileSpreadsheet } from '@fortawesome/pro-light-svg-icons';
import { faCircleEllipsis, faCircleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
//For Uploading Documents , Folder, etc....
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { FileInputData, W4FormFile, W4FormFileInput } from '@/models/onboarding/W4/W4FormFile'
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useAlerts } from "@/composables/useAlerts";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { faFloppyDisk } from '@fortawesome/pro-regular-svg-icons';
import { useOnboardingQuickHireTaxWithHoldingInfoStore } from '@/stores/onboardingQuickHireTaxWithHoldingInfoStore';
import { storeToRefs } from "pinia";
import OnboardingQuickHireTaxWithHoldingInfo, { UploadFileStateForm } from "@/models/onboarding/OnboardingQuickHireTaxWithHoldingInfo";
import { FormField } from "@/enums/FormField";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useLoadingStore } from '@/stores/loadingStore';
import { STATES as stateList, MAX_FILE_NAME_LENGTH } from '@/constants/common';
import { truncateFileName } from '@/utilities/formatUtils';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { StaticFiles } from '@/enums/StaticFiles';
import { OnboardingSummariesUrl } from '@/enums/OnboardingSummariesUrl';
import { fileExists, isFileSizeValid, previewFile } from '@/utilities/fileUtils';
import { useEmployeeStore } from '@/stores/employeeStore';

library.add(faCircleEllipsis, faCircleExclamation, faFileSpreadsheet, faLandmark, faMemo, faDownload, faUser, faEyeSlash, faPaperclip, faEye, faFileCircleExclamation, faFilePdf, faFloppyDisk, faTrashCan, faArrowUpFromBracket, faUpload);

const { responsive } = useBreakpoints();
const route = useRoute();
const { setLoading } = useLoadingStore();
const { fetchEmployment } = useEmployeeStore();
const { employment } = storeToRefs(useEmployeeStore());

const employeeId = computed(
  () => route.params.id
);
const formData = ref(null);

const { notifyError, notifySuccess } = useAlerts();
const W4FormFileData: Ref<W4FormFile[]> = ref([]);
const W4StateForm: Ref<W4FormFileInput[]> = ref([])
const W4FederalForm: Ref<FileInputData[]> = ref([]);
const W4StateFileInput = ref(null);
const W4FederalFileInput = ref(null);
const deletedFromStorageFileList: Ref<string[]> = ref([]);

// FORM REFS
const isDoneId = ref(null);
const formFileId = ref(null);
const noteId = ref(null);
const formNote = ref('');
const formId = FormField.TaxWithholdingInfoQuickHire;
// HANDLE GUARD ROUTING MODAL
const isFormChanged = ref(false);
const openSaveChangeModal = ref(false);
const toPath = ref('');
const isForcePush = ref(false);
const router = useRouter();
const currentNavItem = ref(null);

const quickHireTaxWithHoldingInfoFormData = ref<OnboardingQuickHireTaxWithHoldingInfo>({
  fieldModels: [
    {
      formFieldId: isDoneId.value,
      fieldKey: 'isDone',
      fieldValue: false,
    },
    {
      formFieldId: formFileId.value,
      fieldKey: 'formFiles',
      fieldValue: "form files"
    },
    {
      formFieldId: noteId.value,
      fieldKey: 'note',
      fieldValue: ''
    }
  ],
  uploadFileStateForms: [],
  formId: formId
})


// Upload Store
const hqSuiteStore = useHQSuiteStore();
const azureB2CAuthStore = useAzureB2CAuthStore();
const { getOnboardingQuickHireTaxWithHoldingInfo, updateOnboardingQuickHireTaxWithHoldingInfo } = useOnboardingQuickHireTaxWithHoldingInfoStore();
const { onboardingQuickHireTaxiWithHoldingInfo } = storeToRefs(useOnboardingQuickHireTaxWithHoldingInfoStore());
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems } = useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { stateDocuments } = storeToRefs(useReportTemplate());
const { getDocumentTemplate, getStateDocuments } = useReportTemplate();

// Related to calculating
const clientId = computed(() => azureB2CAuthStore?.activeUserClient?.clientGuid ?? 'Shared');

//Functions
function isFileTypeSupported(fileName: string) {
  const supportedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];
  const fileExtension = fileName.split('.').pop().toLowerCase();
  return supportedExtensions.includes(fileExtension);
}

const onStateW4FileChange = ($event: Event, record: W4FormFile) => {
  const target = $event.target as HTMLInputElement;
  [...target.files].forEach((file) => {
    if (!isFileSizeValid(file)) return;
    if (!isFileTypeSupported(file.name)) {
      notifyError('Upload JPEG, JPG, PDF, PNG only!', null, 'Uploaded Failed')
      return;
    }
    if (file.name.length > MAX_FILE_NAME_LENGTH) {
      notifyError(`The maximum file name is ${MAX_FILE_NAME_LENGTH} characters.`);
      return;
    }

    if (fileExists(getFileData(record.stateEnum), file.name)) {
      notifyError('This file name already exists.');
      return;
    }

    uploadW4StateForm(file, record.stateEnum)
    isFormChanged.value = true;
  })
}

const onFederalW4FileChange = ($event: Event) => {
  const target = $event.target as HTMLInputElement;
  [...target.files].forEach((file) => {
    if (!isFileSizeValid(file)) return;
    if (!isFileTypeSupported(file.name)) {
      notifyError('Upload JPEG, JPG, PDF, PNG only!', null, 'Uploaded Failed')
      return;
    }

    if (file.name.length > MAX_FILE_NAME_LENGTH) {
      notifyError(`The maximum file name is ${MAX_FILE_NAME_LENGTH} characters.`);
      return;
    }

    if (fileExists(W4FederalForm.value, file.name)) {
      notifyError('This file name already exists.');
      return;
    }

    uploadW4FederalForm(file);
    isFormChanged.value = true;
  })
}

const uploadW4FederalForm = async (file: File) => {
  const pathforEmployeeDoc = await makeDocumentPath(
    DocumentTypes.EmployeeW4ByState,
    clientId.value,
    employeeId.value.toString(),
  );
  const reader = new FileReader();
  reader.onload = () => {
    const fileUrl = reader.result.toString();
    const data: FileInputData = {
      fileName: file.name,
      filePath: `${pathforEmployeeDoc}`,
      fileObject: new File([file], file.name),
      fileUrl: fileUrl
    }

    W4FederalForm.value.push(data);
  }
  reader.readAsDataURL(file);
}

const uploadW4StateForm = async (file: File, stateId: number | string) => {
  const uploadedState = stateList.find((state) => state.value === stateId).value;

  const pathforEmployeeDoc = await makeDocumentPath(
    DocumentTypes.EmployeeW4ByState,
    clientId.value,
    employeeId.value.toString(),
    uploadedState
  );
  const reader = new FileReader();

  const isExisted = W4StateForm.value.some((form) => form.stateId === stateId);

  if (!isExisted) {
    W4StateForm.value.push({
      stateId: stateId,
      fileData: []
    })
  }


  reader.onload = () => {
    const fileUrl = reader.result.toString();
    const data: FileInputData = {
      fileName: file.name,
      filePath: `${pathforEmployeeDoc}`,
      fileObject: new File([file], file.name),
      fileUrl: fileUrl
    }

    W4StateForm.value.forEach((w4Form) => {
      if (w4Form.stateId === stateId) {
        w4Form.fileData.push(data);
      }
    })
  }
  reader.readAsDataURL(file);
}

const handleDeleteFile = (stateId: number | string, file: FileInputData) => {
  const matchingObj = W4StateForm.value.find((form) => form.stateId === stateId);
  const newFileArray = matchingObj.fileData.filter((fileItem) => fileItem.fileName !== file.fileName);
  W4StateForm.value.forEach((form) => {
    if (form.stateId === stateId) {
      form.fileData = newFileArray;
    }
  });
  deletedFromStorageFileList.value.push(`${file.filePath}/${file.fileName}`);

  isFormChanged.value = true;
};

const getW4FileData = async (states: Array<string>) => {
  const localData: W4FormFile[] = [];
  const localDataFile: W4FormFileInput[] = [];

  states.forEach(async element => {
    const foundState = stateList.find(item => item.value === element);
    await getStateDocuments(foundState.text.replace(/\s+/g, ''));
    const result = stateDocuments.value.reduce((acc, file) => {
      if (file.includes("Form")) {
        acc.form = file;
      } if (file.includes("Worksheet")) {
        acc.worksheet = file;
      } else if (file.includes("Instructions")) {
        acc.instruction = file;
      }
      return acc;
    }, {} as any);

    if (foundState) {
      const data: W4FormFile = {
        stateName: foundState?.text,
        stateEnum: foundState?.value,
        fileName: `${foundState?.text} W-4 Form.pdf `,
        filePath: foundState?.file,
        fileWorkSheetName: result.worksheet || '',
        filePathWorkSheet: foundState?.worksheet,
        fileInstructName: result.instruction || '',
        filePathInstruct: foundState?.instruction,
      }
      localDataFile.push({
        stateId: foundState.value,
        fileData: []
      })
      localData.push(data)
    }
    W4FormFileData.value = [...localData];
  });
}

const handleButtonUploadClick = (stateEnum: string) => {
  if (stateEnum) {
    const inputElement = document.querySelector(`input[data-id="${stateEnum}-input"]`) as HTMLInputElement;
    inputElement.value = "";
    inputElement.click();
  } else {
    W4FederalFileInput.value.value = "";
    W4FederalFileInput.value.click();
  }
}

const formatStateName = (filename: string) => {
  return `State_${filename.replace(/\s+/g, '')}_W4_Form.pdf`;
}

const getFileData = (stateId: number | string) => {
  const matchingObj = W4StateForm.value.find((form) => form.stateId === stateId);

  if (matchingObj) {
    return matchingObj.fileData
  }
  return [];
}

const handleDeleteW4FederalFile = (file: FileInputData) => {
  if (!file) return;
  const newFileArray = W4FederalForm.value.filter((fileItem) => fileItem.fileName !== file.fileName);
  deletedFromStorageFileList.value.push(`${file.filePath}/${file.fileName}`);
  if (newFileArray) {
    W4FederalForm.value = newFileArray;
  }
  isFormChanged.value = true;
}

const saveFile = async (filePath: string, file: File) => {
  await hqSuiteStore.uploadDocument(
    { path: filePath, file: file, fileName: file.name },
    true
  )
};

// Submit Form
const handleSubmitForm = async (isNextForm: boolean) => {
  setLoading(true);
  try {
    const fileStateForm: UploadFileStateForm[] = [];
    // Cannot upload form if none of file is uploaded
    const isFormEmpty = W4StateForm.value.every((state) => state.fileData.length === 0) && W4FederalForm.value.length === 0;

    if (isFormEmpty) {
      notifyError('Please upload at least 1 file.');
      return;
    }

    if (W4FederalForm.value.length > 0) {
      W4FederalForm.value.forEach((file) => {
        fileStateForm.push({
          formFieldId: formFileId.value,
          filePath: file.filePath,
          fileName: file.fileName,
          payload: {
            fileType: 'Federal',
          },
          description: '',
          documentCategory: null
        });
        saveFile(file.filePath, file.fileObject)
      })
    }

    if (W4StateForm.value.length > 0) {
      W4StateForm.value.forEach((form) => {
        if (form.fileData.length > 0) {
          form.fileData.forEach((file) => {
            fileStateForm.push({
              formFieldId: formFileId.value,
              filePath: file.filePath,
              fileName: file.fileName,
              payload: {
                fileType: 'State',
                fileStateId: form.stateId
              },
              description: '',
              documentCategory: null
            });
            saveFile(file.filePath, file.fileObject);
          })
        }
      })
    }

    quickHireTaxWithHoldingInfoFormData.value = {
      fieldModels: [
        {
          formFieldId: isDoneId.value,
          fieldKey: 'isDone',
          fieldValue: false,
        },
        {
          formFieldId: formFileId.value,
          fieldKey: 'formFiles',
          fieldValue: "form files"
        },
        {
          formFieldId: noteId.value,
          fieldKey: 'note',
          fieldValue: formNote.value
        }
      ],
      uploadFileStateForms: [...fileStateForm],
      formId: formId
    }

    // DELETE FILES FROM STORAGE
    deletedFromStorageFileList.value.forEach((file: string) => {
      hqSuiteStore.deleteFile(file);
      deletedFromStorageFileList.value = [];
    })
    await updateOnboardingQuickHireTaxWithHoldingInfo(Number(employeeId.value), quickHireTaxWithHoldingInfoFormData.value);
    W4StateForm.value.forEach((state) => {
      if (state.fileData.length > 0 && W4FederalForm.value.length > 0) {
        markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId.value));
      } else {
        markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, false, Number(employeeId.value));
      }
    })
    notifySuccess('Information updated.');
    isFormChanged.value = false;
    if (isNextForm) {
      router.push({ name: 'onboardingFormI9' })
    }
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
  }

}

onMounted(async () => {
  setLoading(true);
  try {
    await getOnboardingSideNavItems(Number(employeeId.value));
    await fetchEmployment(Number(employeeId.value));
    await getW4FileData(employment.value.workLocations);
    await getOnboardingQuickHireTaxWithHoldingInfo(Number(employeeId.value), quickHireTaxWithHoldingInfoFormData.value.formId);

    currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === OnboardingSummariesUrl.onboardingFormW4.trim().toLocaleLowerCase());

    isDoneId.value = onboardingQuickHireTaxiWithHoldingInfo.value.fieldModels.find((model) => model.fieldKey === 'isDone').formFieldId;
    formFileId.value = onboardingQuickHireTaxiWithHoldingInfo.value.fieldModels.find((model) => model.fieldKey === 'formFiles').formFieldId;
    noteId.value = onboardingQuickHireTaxiWithHoldingInfo.value.fieldModels.find((model) => model.fieldKey === 'note').formFieldId;
    formNote.value = onboardingQuickHireTaxiWithHoldingInfo.value.fieldModels.find((model) => model.fieldKey === 'note').fieldValue as string || '';

    const uploadedFiles = [...onboardingQuickHireTaxiWithHoldingInfo.value.uploadFileStateForms];
    for (const file of uploadedFiles) {
      if (file.payload.fileType === 'Federal') {
        W4FederalForm.value.push({
          fileName: file.fileName,
          fileObject: null,
          filePath: file.filePath,
          fileUrl: null,
        })
      } else if (file.payload.fileType === 'State') {
        const stateForm = W4StateForm.value.find((form) => form.stateId === file.payload.fileStateId);
        if (stateForm) {
          stateForm.fileData.push({
            fileName: file.fileName,
            fileObject: null,
            filePath: file.filePath,
            fileUrl: null,
          });
        } else {
          W4StateForm.value.push({
            stateId: file.payload.fileStateId,
            fileData: [{
              fileName: file.fileName,
              fileObject: null,
              filePath: file.filePath,
              fileUrl: null,
            }],
          });
        }
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
  }
});

const handleDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
  isForcePush.value = true;
  router.push(toPath.value)
}

const handleCancelDiscardOnRouteChange = () => {
  openSaveChangeModal.value = false;
}

onBeforeRouteLeave((to, from, next) => {
  if (!isFormChanged.value) {
    next();
    return true;
  } else {
    openSaveChangeModal.value = true;
    toPath.value = to.fullPath;
    if (isForcePush.value) {
      next();
      return true;
    }
    next(false);
    return false;
  }
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

</script>
<template>
  <div class="position-relative">
    <VeeForm ref="formData" @submit.prevent="handleSubmitForm(false)">
      <div class="d-flex align-items-center px-4 justify-content-between form_header">
        <div v-if="!responsive.mobile" class="title font-weight-bold">Form W-4 | Employee's Withholding Certificate</div>
        <div v-if="responsive.mobile" class="title font-weight-bold">Form W-4</div>
        <div class="d-flex align-items-center">
          <fs-button class="d-flex align-items-center" type="submit" variant="outline-primary" :disabled="!isFormChanged"
            @click="handleSubmitForm(false)">
            <font-awesome-icon :icon="['far', 'floppy-disk']" />
            <span v-if="!responsive.mobile">Save</span>
          </fs-button>
          <fs-button type="submit" variant="primary" @click="handleSubmitForm(true)" :disabled="!isFormChanged">Save
            &#38; next</fs-button>
        </div>
      </div>
      <div v-if="!responsive.mobile" class="p-4">
        <div class="tax-withholding-label">A. State W-4 Form</div>
        <hr />
        <div>
          <div v-if="W4FormFileData.length > 0">
            <div v-for="(item, index) in W4FormFileData" :key="index">
              <fs-row class="card state_card mx-0 mb-3">
                <fs-col class="state_card_left" cols="4">
                  <div class="d-flex align-items-center gap-3">
                    <div v-if="item.fileName" class="text-black font-weight-bold" style="textDecoration: none">{{
                      item.fileName }}</div>
                    <div v-else class="tax-text-red">No Data Found.</div>
                  </div>
                  <div class="d-flex align-items-center gap-3 mt-3">
                    <fs-link v-if="item.fileWorkSheetName"
                      @click="handleDownloadStaticFile(item.fileWorkSheetName, true)">Worksheet</fs-link>
                    <fs-link v-if="item.fileInstructName"
                      @click="handleDownloadStaticFile(item.fileInstructName, false)">Instruction</fs-link>
                    <fs-link @click="handleDownloadStaticFile(formatStateName(item.stateName), false)">Download</fs-link>
                  </div>
                </fs-col>
                <fs-col cols="8" class="state_card_right">
                  <div v-if="getFileData(item.stateEnum).length > 0" class="w-100">
                    <div>
                      <div class="d-flex align-items-center gap-2 justify-content-between"
                        v-for="(file) in getFileData(item.stateEnum)" :key="file.fileName">
                        <fs-link class="d-flex my-2 align-items-center text-black text-decoration-none"
                          @click="previewFile(file)" style=" width: 240px;">
                          <font-awesome-icon :icon="['fal', 'paperclip']" class="text-task-blue" />
                          <span class="ms-2">
                            <div>
                              {{ truncateFileName(file.fileName) }}
                            </div>
                          </span>
                          &nbsp;
                        </fs-link>
                        <div style="display: inline; cursor: pointer;" @click="handleDeleteFile(item.stateEnum, file)">
                          <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div v-else class="d-flex align-items-center justify-content-between w-100">
                    <div class="text-gray">
                      No file has been uploaded.
                    </div>
                    <fs-button variant="outline-green" @click="handleButtonUploadClick(item.stateEnum)">
                      <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                      Upload</fs-button>
                    <input type="file" v-show="false" :data-id="item.stateEnum + '-input'" multiple ref="W4StateFileInput"
                      @change="onStateW4FileChange($event, item)" />
                  </div>
                </fs-col>
              </fs-row>
              <div v-if="getFileData(item.stateEnum).length > 0" class="my-3">
                <fs-button variant="outline-green" @click="handleButtonUploadClick(item.stateEnum)">
                  <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                  Upload </fs-button>
                <input type="file" v-show="false" :data-id="item.stateEnum + '-input'" multiple ref="W4StateFileInput"
                  @change="onStateW4FileChange($event, item)" />
              </div>
            </div>
          </div>
          <div v-else>
            <div> Emloyee's work location not found.</div>
          </div>
        </div>
        <div class="tax-withholding-label mt-4">B. Federal W-4 Form</div>
        <hr />
        <fs-row class="card state_card mx-0 mb-3">
          <fs-col class="state_card_left" cols="4">
            <div class="text-black font-weight-bold">
              Federal W-4 Form
            </div>
            <div class="d-flex align-items-center gap-3 mt-3">
              <fs-link @click="handleDownloadStaticFile(StaticFiles.FEDERAL_W4_INSTRUCTIONS, false)">Instruction</fs-link>
              <fs-link @click="handleDownloadStaticFile(StaticFiles.FEDERAL_W4_FORM, false)">Download</fs-link>
            </div>
          </fs-col>
          <fs-col class="state_card_right align-items-center" cols="8">
            <div v-if="W4FederalForm.length > 0" class="w-100">
              <div v-for="file in W4FederalForm" :key="file.fileName" class="mb-2">
                <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                  <fs-link @click="previewFile(file)"
                    class="d-flex gap-2 align-items-center text-decoration-none text-black">
                    <font-awesome-icon :icon="['fal', 'paperclip']" class="text-task-blue" />
                    <span style="flex: 1"> {{ truncateFileName(file.fileName) }}</span>
                  </fs-link>
                  <div style="display: inline; cursor: pointer" @click="handleDeleteW4FederalFile(file)">
                    <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="d-flex align-items-center justify-content-between w-100">
              <div class="text-gray">
                No file has been uploaded.
              </div>
              <fs-button variant="outline-green" @click="handleButtonUploadClick(null)">
                <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                Upload</fs-button>
              <input type="file" name="files" multiple id="upload_file" @change="onFederalW4FileChange($event)"
                ref="W4FederalFileInput" hidden />
            </div>
          </fs-col>
        </fs-row>
        <div v-if="W4FederalForm.length > 0">
          <fs-button variant="outline-green" @click="handleButtonUploadClick(null)">
            <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
            Upload</fs-button>
          <input type="file" name="files" multiple id="upload_file" @change="onFederalW4FileChange($event)"
            ref="W4FederalFileInput" hidden />
        </div>
        <div class="mt-4">
          <fs-input type="FsTextArea" label="Note" name="note" v-model="formNote" :rules="{ required: false }"
            :required="false" @input="isFormChanged = true"></fs-input>
        </div>
      </div>
      <div v-if="responsive.mobile" class="p-4">
        <!-- STATES -->
        <div v-if="W4FormFileData.length > 0">
          <div v-for="(item, index) in W4FormFileData" :key="index">
            <fs-card no-body class="h-100 mb-4">
              <fs-card-header class="title font-weight-bold p-3 d-flex align-items-center justify-content-between">
                <div class="d-flex align-items-center gap-2">
                  <font-awesome-icon :icon="['fal', 'user']" class="text-cornflower-blue-dark" size="lg" />
                  {{ item.stateName }}
                </div>
                <div class="d-flex align-items-center">
                  <fs-button v-if="W4FormFileData.length > 0" variant="link" class="text-decoration-none"
                    @click="handleButtonUploadClick(item.stateEnum)">Upload</fs-button>
                  <input type="file" name="files" multiple id="upload_file" @change="onStateW4FileChange($event, item)"
                    hidden :data-id="item.stateEnum + '-input'" />
                  <fs-dropdown size="lg" variant="link" no-caret>
                    <template #button-content>
                      <font-awesome-icon :icon="['fas', 'circle-ellipsis']" size="lg" />
                    </template>
                    <fs-dropdown-item v-if="item.fileWorkSheetName" class="dropdown-item"
                      @click="handleDownloadStaticFile(item.fileWorkSheetName, true)">
                      <font-awesome-icon :icon="['fal', 'file-spreadsheet']" class="me-2" />
                      Worksheet</fs-dropdown-item>
                    <fs-dropdown-item v-if="item.fileInstructName"
                      @click="handleDownloadStaticFile(item.fileInstructName, false)">
                      <font-awesome-icon :icon="['fal', 'memo']" class="me-2" />
                      Instructions</fs-dropdown-item>
                    <fs-dropdown-item @click="handleDownloadStaticFile(formatStateName(item.stateName), false)">
                      <font-awesome-icon :icon="['fal', 'download']" class="me-2" />
                      Download</fs-dropdown-item>
                  </fs-dropdown>
                </div>
              </fs-card-header>
              <fs-card-body class="p-0">
                <div v-if="getFileData(item.stateEnum).length > 0" class="p-3">
                  <div v-for="file in getFileData(item.stateEnum)" :key="file.fileName" class="mb-2">
                    <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                      <fs-link @click="previewFile(file)"
                        class="d-flex gap-2 align-items-center text-decoration-none text-black">
                        <span style="flex: 1"> {{ truncateFileName(file.fileName) }}</span>
                      </fs-link>
                      <div style="display: inline; cursor: pointer" @click="handleDeleteFile(item.stateEnum, file)">
                        <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                      </div>
                    </div>
                  </div>
                </div>
                <div v-else class="p-3 d-flex flex-column align-items-center gap-3">
                  <div class="text-status-inactive">
                    No file has been uploaded.
                  </div>
                  <fs-button variant="outline-green" @click="handleButtonUploadClick(item.stateEnum)">
                    <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                    Upload</fs-button>
                  <input type="file" name="files" multiple id="upload_file" @change="onStateW4FileChange($event, item)"
                    hidden :data-id="item.stateEnum + '-input'" />
                </div>
              </fs-card-body>
            </fs-card>
          </div>
        </div>
        <!-- FEDERAL -->
        <fs-card no-body class="h-100 mb-4">
          <fs-card-header class="title font-weight-bold p-3 d-flex align-items-center justify-content-between">
            <div class="d-flex align-items-center gap-2">
              <font-awesome-icon :icon="['fal', 'landmark']" class="text-task-violet" size="lg" />
              Federal W-4
            </div>
            <div class="d-flex align-items-center">
              <fs-button v-if="W4FormFileData.length > 0" variant="link" class="text-decoration-none"
                @click="handleButtonUploadClick(null)">Upload</fs-button>
              <input type="file" name="files" multiple id="upload_file" ref="W4FederalFileInput"
                @change="onFederalW4FileChange($event)" hidden />
              <fs-dropdown size="lg" variant="link" no-caret>
                <template #button-content>
                  <font-awesome-icon :icon="['fas', 'circle-ellipsis']" size="lg" />
                </template>
                <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.FEDERAL_W4_INSTRUCTIONS, false)">
                  <font-awesome-icon :icon="['fal', 'memo']" class="me-2" />
                  Instructions</fs-dropdown-item>
                <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.FEDERAL_W4_FORM, false)">
                  <font-awesome-icon :icon="['fal', 'download']" class="me-2" />
                  Download</fs-dropdown-item>
              </fs-dropdown>
            </div>
          </fs-card-header>
          <fs-card-body class="p-0">
            <div v-if="W4FederalForm.length > 0" class="p-3">
              <div v-for="file in W4FederalForm" :key="file.fileName" class="mb-2">
                <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                  <fs-link @click="previewFile(file)"
                    class="d-flex gap-2 align-items-center text-decoration-none text-black">
                    <span style="flex: 1"> {{ truncateFileName(file.fileName) }}</span>
                  </fs-link>
                  <div style="display: inline; cursor: pointer" @click="handleDeleteW4FederalFile(file)">
                    <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="p-3 d-flex flex-column align-items-center gap-3">
              <div class="text-status-inactive">
                No file has been uploaded.
              </div>
              <fs-button variant="outline-green" @click="handleButtonUploadClick(null)">
                <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                Upload</fs-button>
              <input type="file" name="files" multiple id="upload_file" ref="W4FederalFileInput"
                @change="onFederalW4FileChange($event)" hidden />
            </div>
          </fs-card-body>
        </fs-card>
        <div class="mt-4">
          <fs-input type="FsTextArea" label="Note" name="note" v-model="formNote" :rules="{ required: false }"
            :required="false" @input="isFormChanged = true"></fs-input>
        </div>
      </div>

    </VeeForm>
  </div>

  <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved changes" okText="YES, LEAVE"
    okTextVariant="danger" cancelText="STAY" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
    @ok="handleDiscardOnRouteChange">
    <template #content>
      <span class="d-flex py-3">
        <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
        <div>
          Are you sure you want to leave this page?
          <br />
          You have unsaved changes, your data will be lost.
        </div>
      </span>
    </template>
  </dark-theme-modal>
</template>
<style lang="scss" scoped>
.form_header {
  height: 80px;
  border-bottom: 1px solid #e1e4e8;
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 2;
}

.font-weight-bold {
  font-weight: 700;
}

.tax-withholding-label {
  color: #03A9F4;
  font-size: 16px;
  font-weight: 700;
}

.state_card {
  display: flex;
  flex-direction: row;

  &_left {
    border-right: 1px solid #e1e4e8;
    padding: 20px;
  }

  &_right {
    padding: 20px;
    display: flex;
  }
}

.text-gray {
  color: #6e7c8f;
}

.label {
  font-size: 14px;
  font-weight: 700;
}

.title {
  font-size: 14px;
}
</style>