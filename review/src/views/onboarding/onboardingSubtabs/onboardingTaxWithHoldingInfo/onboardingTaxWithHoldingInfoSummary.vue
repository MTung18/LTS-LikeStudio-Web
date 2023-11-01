<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Ref } from 'vue';
import { useBreakpoints } from "@/composables/useBreakpoints";
import { library } from '@fortawesome/fontawesome-svg-core';
import {
    faPenToSquare,
    faArrowUpRightFromSquare,
    faUser,
    faCity,
    faFloppyDisk,
    faTrashCan
} from "@fortawesome/pro-regular-svg-icons";
import { faCircleEllipsis, faCircleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { faArrowUpFromBracket, faPaperclip, faUpload, faDownload } from "@fortawesome/pro-light-svg-icons";
import { DocumentTypes, makeDocumentPath } from "@/helper/hqSuite/pathHelper";
import { useAzureB2CAuthStore } from "@/stores/azureB2CAuthStore";
import { onBeforeRouteLeave, useRoute, useRouter, onBeforeRouteUpdate } from "vue-router";
import { truncateFileName } from '@/utilities/formatUtils';
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { FileInputData } from "@/models/onboarding/W4/W4FormFile";
import { OnboardingTaxWithholdingInfoSummary } from "@/models/onboarding/onboardingTaxWithholdingInfoSummary";
import { useOnboardingTaxWithHoldingInfoSummaryStore } from '@/stores/onboardingTaxWithHoldingInfoSummaryStore';
import { storeToRefs } from "pinia";
import { FormField } from "@/enums/FormField";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useAlerts } from '@/composables/useAlerts';
import { useOnboardingEmployeeWithholdingCertificateStore } from '@/stores/onboardingEmployeeWithholdingCertificateStore';
import { useOnboardingEmployerInformationStore } from '@/stores/onboardingEmployerInformationStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useLoadingStore } from '@/stores/loadingStore';
import { fileExists, isFileSizeValid, previewFile } from '@/utilities/fileUtils';
import { StaticFiles } from '@/enums/StaticFiles';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { MAX_FILE_NAME_LENGTH } from "@/constants/common";
import { watch } from "vue";


library.add(faUpload, faFloppyDisk, faCircleExclamation, faPaperclip, faPenToSquare, faArrowUpFromBracket, faArrowUpRightFromSquare, faUser, faCity, faTrashCan, faCircleEllipsis, faDownload);

// Constants
const clientId = computed(
    () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);

const employeeId = computed(
    () => route.params.id
);
const onboardingTaxWithHoldingInfoSummaryFormId = FormField.TaxWithholdingInfoSummary;

const isSubComp = computed(() => {
    const currentRoutes = route.path.split('/');
    if (currentRoutes.includes('employee-with-holding-certificate') || currentRoutes.includes('employer-information')) {
        return true;
    } else {
        return false;
    }
})

// Stores
const route = useRoute();
const router = useRouter();
const { responsive } = useBreakpoints();
const azureB2CAuthStore = useAzureB2CAuthStore();
const hqSuiteStore = useHQSuiteStore();
const { getOnboardingTaxWithHoldingInfoSummary, updateOnboardingQuickHireTaxWithHoldingInfo } = useOnboardingTaxWithHoldingInfoSummaryStore();
const { onboardingTaxWithHoldingInfoSummary } = storeToRefs(useOnboardingTaxWithHoldingInfoSummaryStore());
const { notifyError, notifySuccess } = useAlerts();
const { getOnboardingEmployeeWitholdingCertificate } = useOnboardingEmployeeWithholdingCertificateStore()
const { getOnboardingEmployerInformation } = useOnboardingEmployerInformationStore();
const { onboardingEmployeeWitholdingCertificate } = storeToRefs(useOnboardingEmployeeWithholdingCertificateStore());
const { onboardingEmployerInformation } = storeToRefs(useOnboardingEmployerInformationStore());
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems, getEmployeeFormSubmit } = useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { setLoading } = useLoadingStore();
const { getDocumentTemplate } = useReportTemplate();

// Refs
const errorMessage = ref('');
const isFormChanged = ref(false);
const openSaveChangeModal = ref(false);
const isForcePush = ref(false);
const toPath = ref('');

const formFileData: Ref<FileInputData[]> = ref([]);
const formData = ref({
    isDone: false,
    formFiles: 'form files',
    note: '',
});

const payloadUploadForm: Ref<OnboardingTaxWithholdingInfoSummary> = ref(undefined);

const isOnboardingEmployerInformationDone = ref('');
const isOnboardingEmployeeWitholdingCertificateFormDone = ref('');
const isBothFormDone = ref(false);
const currentNavItem = ref(null);


const deletedFromStorageFileList: Ref<string[]> = ref([]);
const isEmployeeFormSubmitted = ref(false);

////////////////////////// UPLOAD FILES FUNCTIONS //////////////////////////
function isFileTypeSupported(fileName: string) {
    const supportedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return supportedExtensions.includes(fileExtension);
}

const handleUploadFile = async (event: Event) => {
    isFormChanged.value = true;
    const target = event.target as HTMLInputElement;
    const files = target.files;
    for (let i = 0; i < files.length; i++) {
        if (!isFileSizeValid(files[i])) return;
        if (!isFileTypeSupported(files[i].name)) {
            notifyError('Wrong file format, upload PDF, PNG, JPEG or JPG only!')
            return;
        } else if (files[i].name.length > MAX_FILE_NAME_LENGTH) {
            notifyError(`The maximum file name is ${MAX_FILE_NAME_LENGTH} characters.`);
            return;
        } else if (fileExists(formFileData.value, files[i].name)) {
            notifyError('This file name already exists.');
            return;
        } else {
            errorMessage.value = '';
        }
        const pathforEmployeeDoc = await makeDocumentPath(
            DocumentTypes.EmployeeW4,
            `${clientId.value}`,
            employeeId.value.toString()
        );

        const reader = new FileReader();

        reader.onload = () => {
            const fileUrl = reader.result.toString();
            const data = {
                fileName: files[i].name,
                filePath: pathforEmployeeDoc,
                fileObject: new File([files[i]], files[i].name),
                fileUrl: fileUrl
            };

            formFileData.value.push(data);
        };

        reader.readAsDataURL(files[i]);
    }
    isFormChanged.value = true;
};

const chooseFile = () => {
    const element = document.getElementById("upload_file") as HTMLInputElement;
    element.value = ""; // Clear the value of the file input
    element.click();
};

const handleRemoveFile = (file: FileInputData) => {
    formFileData.value = formFileData.value.filter((fileItem) => fileItem.fileName !== file.fileName);
    deletedFromStorageFileList.value.push(`${file.filePath}/${file.fileName}`);
    isFormChanged.value = true;
}

const saveFile = async (filePath: string, file: File) => {
    if (file) {
        await hqSuiteStore.uploadDocument(
            { path: filePath, file: file, fileName: file.name },
            true
        )
    }
};

////////////////////////////// SUBMIT FORM //////////////////////////////
const handleSubmitForm = async (isNextForm: boolean) => {
    setLoading(true);
    try {
        const mappedFormFileData = formFileData.value.map((file) => {
            return {
                formFieldId: payloadUploadForm.value.fieldModels.find((model) => model.fieldKey === 'formFiles').formFieldId,
                fileName: file.fileName,
                filePath: file.filePath,
                description: '',
                payload: '',
                documentCategory: null
            }
        });

        payloadUploadForm.value.uploadFileStateForms = mappedFormFileData;

        formData.value.isDone = true;
        formData.value.formFiles = 'form files';

        const mappedFieldModels = payloadUploadForm.value.fieldModels.map((fieldModel) => {
            const fieldValue = formData.value[fieldModel.fieldKey] || ""; // Set fieldValue to an empty string if fieldKey does not exist in data
            return { ...fieldModel, fieldValue };
        });

        payloadUploadForm.value.fieldModels = mappedFieldModels;
        isFormChanged.value = false;
        formFileData.value.forEach(async (file) => {
            await saveFile(file.filePath, file.fileObject)
        })

        await updateOnboardingQuickHireTaxWithHoldingInfo(Number(employeeId.value), payloadUploadForm.value);

        // DELETE FILES FROM STORAGE
        deletedFromStorageFileList.value.forEach((file: string) => {
            hqSuiteStore.deleteFile(file);
            deletedFromStorageFileList.value = [];
        })

        // CHECK IS FORM CAN BE MARKED AS DONE
        if (isBothFormDone.value || formFileData.value.length > 0) {
            await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId.value))
        } else {
            await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, false, Number(employeeId.value))
        }
        notifySuccess('Information updated.')
        if (isNextForm) {
            router.push({ name: 'onboardingFormI9' })
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false)

    }
}

// //////////////////////////////////////////////////////////////////

// HELPER FUNCTIONS
const formStatus = {
    notStarted: 'notStarted',
    inProgress: 'inProgress',
    completed: 'completed'
}

function generateTemplate(progressStatus: string): string {
    let color: string;
    let status: string;

    switch (progressStatus) {
        case 'completed':
            color = '#1ABC9C';
            status = 'Completed';
            break;
        case 'notStarted':
            color = '#6E7C8F';
            status = 'Not Started';
            break;
        case 'inProgress':
            color = '#FF6600';
            status = 'In Progress';
            break;
        default:
            color = '#6E7C8F';
            status = 'Not Started';
            break;
    }
    const template = `<div style="display: flex; align-items: center">
    <span style="display: inline-block; width: 5px; height: 5px; border-radius: 50%; background-color: ${color}; margin-right: 5px;"></span>
    ${status}
  </div>`;

    return template;
}

/////////////////////////////// LEAVING GUARDS /////////////////////
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

///////////////////////////////////////////////////////////////////

async function fetchOnboardingInfo(employeeIdValue) {
    await getOnboardingEmployerInformation(Number(employeeIdValue), FormField.TaxWithholdingInfoEmployer);
    isEmployeeFormSubmitted.value = await getEmployeeFormSubmit(Number(employeeIdValue));
    await getOnboardingEmployeeWitholdingCertificate(Number(employeeIdValue), FormField.TaxWithholdingInfoEmployee);

    const employerFormStatusField = onboardingEmployerInformation.value.fieldModels.find((field) => field.fieldKey === 'formStatus')?.fieldValue;
        if (employerFormStatusField && isEmployeeFormSubmitted.value) {
            isOnboardingEmployerInformationDone.value = formStatus.completed;
        } else {
            isOnboardingEmployerInformationDone.value = formStatus.notStarted;
        }

        const isEmployeeWithholdingFormDone = onboardingEmployeeWitholdingCertificate.value.fieldModels.find((field) => field.fieldKey === "isFormDone")?.fieldValue;
        if (isEmployeeWithholdingFormDone) {
            if (isEmployeeFormSubmitted.value) {
                isOnboardingEmployeeWitholdingCertificateFormDone.value = formStatus.completed;
            } else {
                isOnboardingEmployeeWitholdingCertificateFormDone.value = formStatus.inProgress;
            }
        } else {
            isOnboardingEmployeeWitholdingCertificateFormDone.value = formStatus.notStarted;
        }
}

///////////////////////////////////////////////////////////////////

onBeforeRouteUpdate(async () => {
    setLoading(true);
    try {
         await fetchOnboardingInfo(Number(employeeId.value));
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
})

///////////////////////////////////////////////////////////////////

onMounted(async () => {
    setLoading(true);
    try {
        await fetchOnboardingInfo(Number(employeeId.value));
        const sideNavItemsPromise = getOnboardingSideNavItems(Number(employeeId.value));
        const taxWithHoldingInfoSummaryPromise = getOnboardingTaxWithHoldingInfoSummary(Number(employeeId.value), onboardingTaxWithHoldingInfoSummaryFormId);

        await sideNavItemsPromise;
        await taxWithHoldingInfoSummaryPromise;

        currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === 'onboardingFormW4'.trim().toLocaleLowerCase());

        payloadUploadForm.value = onboardingTaxWithHoldingInfoSummary.value;

        payloadUploadForm.value.uploadFileStateForms.forEach((file) => {
            formFileData.value.push({
                fileName: file.fileName,
                filePath: file.filePath
            })
        })

        const data = payloadUploadForm.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
            if (fieldValue !== undefined) {
                acc[fieldKey] = fieldValue;
            }
            return acc as any;
        }, {});

        formData.value = data;
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
})

watch([() => isOnboardingEmployerInformationDone.value, isOnboardingEmployeeWitholdingCertificateFormDone.value], () => {
    if (isOnboardingEmployerInformationDone.value === formStatus.completed && isOnboardingEmployeeWitholdingCertificateFormDone.value === formStatus.completed) {
        isBothFormDone.value = true
    } else {
        isBothFormDone.value = false
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
    <div v-if="!isSubComp">
        <div>
            <fs-container class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
                <fs-row align-v="center">
                    <fs-col class="text-truncate">
                        <h2 v-if="!responsive.mobile" class="hq-pg__title">Form W-4 | Employee's Withholding Certificate</h2>
                        <h2 v-if="responsive.mobile" class="hq-pg__title">Form W-4 </h2>
                    </fs-col>
                    <fs-col cols="auto" class="ms-auto">
                        <div class="d-flex align-items-center">
                            <fs-button class="d-flex align-items-center" type="submit" variant="outline-primary"
                                :disabled="!isFormChanged" @click="handleSubmitForm(false)">
                                <font-awesome-icon :icon="['far', 'floppy-disk']" />
                                <span v-if="!responsive.mobile">Save</span>
                            </fs-button>
                            <fs-button type="submit" variant="primary" @click="handleSubmitForm(true)"
                                :disabled="!isFormChanged">Save
                                &#38; next</fs-button>
                        </div>                        
                    </fs-col>
                </fs-row>


            </fs-container>
            <div class="p-4">
                <div class="d-flex align-items-center justify-content-between mb-3">
                    <div v-if="!responsive.mobile" class="font-weight-bold">Form W-4</div>
                    <fs-link class="text-task-blue"
                        @click="handleDownloadStaticFile(StaticFiles.FEDERAL_W4_INSTRUCTIONS, false)">Form W-4
                        Instruction</fs-link>
                </div>
                <div v-if="!responsive.mobile"
                    class="card_container d-flex justify-content-between align-items-center p-4 mb-3">
                    <div class="d-flex gap-2 card_title">
                        <font-awesome-icon size="lg" :icon="['far', 'user']" class="text-cornflower-blue-dark" />
                        Employee Information
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div class="card_status">
                            <div v-html="generateTemplate(isOnboardingEmployeeWitholdingCertificateFormDone)"></div>
                        </div>
                        <fs-link :to="{ name: 'onboardingEmployeeWithHoldingCertificate' }">
                            <fs-button variant="outline-primary" :style="{ width: '70px' }">View</fs-button>
                        </fs-link>
                    </div>
                </div>
                <div v-if="responsive.mobile" class="card mb-4">
                    <div class="card_header-mobile d-flex align-items-center justify-content-between p-2">
                        <div class="d-flex gap-2 card_title">
                            <font-awesome-icon size="lg" :icon="['far', 'user']" class="text-cornflower-blue-dark" />
                            Employee Information
                        </div>
                        <fs-link :to="{ name: 'onboardingEmployeeWithHoldingCertificate' }">
                            <fs-button variant="outline-primary" :style="{ width: '70px' }">View</fs-button>
                        </fs-link>
                    </div>
                    <div class="px-2 py-4">
                        <div class="card_status">
                            <div v-html="generateTemplate(isOnboardingEmployeeWitholdingCertificateFormDone)"></div>
                        </div>
                    </div>
                </div>
                <!-- Employer Information -->
                <div v-if="!responsive.mobile" class="card_container d-flex justify-content-between align-items-center p-4">
                    <div class="d-flex gap-2 card_title">
                        <font-awesome-icon size="lg" :icon="['far', 'city']" class="text-task-blue" />
                        Employer Information
                    </div>
                    <div class="d-flex align-items-center gap-3">
                        <div class="card_status">
                            <div v-html="generateTemplate(isOnboardingEmployerInformationDone)"></div>
                        </div>
                        <fs-link :to="{ name: 'onboardingEmployerInformation' }"
                            :disabled="isOnboardingEmployeeWitholdingCertificateFormDone !== formStatus.completed">
                            <fs-button v-if="isOnboardingEmployeeWitholdingCertificateFormDone !== formStatus.completed"
                                variant="primary" :style="{ width: '70px' }">Start</fs-button>
                            <fs-button v-else variant="primary" :style="{ width: '70px' }">Edit</fs-button>
                        </fs-link>
                    </div>
                </div>
                <div v-if="responsive.mobile" class="card">
                    <div class="card_header-mobile d-flex align-items-center justify-content-between p-2">
                        <div class="d-flex gap-2 card_title">
                            <font-awesome-icon size="lg" :icon="['far', 'city']" class="text-task-blue" />
                            Employer Information
                        </div>
                        <fs-link :to="{ name: 'onboardingEmployerInformation' }"
                            :disabled="isOnboardingEmployeeWitholdingCertificateFormDone !== formStatus.completed">
                            <fs-button v-if="isOnboardingEmployeeWitholdingCertificateFormDone !== formStatus.completed"
                                variant="primary" :style="{ width: '70px' }">Start</fs-button>
                            <fs-button v-else variant="primary" :style="{ width: '70px' }">Edit</fs-button>
                        </fs-link>
                    </div>
                    <div class="px-2 py-4">
                        <div class="card_status">
                            <div v-html="generateTemplate(isOnboardingEmployerInformationDone)"></div>
                        </div>
                    </div>
                </div>
                <!-- Employer Information -->
                <hr />
                <fs-form-group v-if="!responsive.mobile" class="form_group mb-3">
                    <div class="form_label">
                        <label class="mb-2">Upload File</label>
                    </div>
                    <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile" hidden />
                    <fs-button variant="outline-primary" @click="chooseFile" class="d-flex gap-2"> <font-awesome-icon
                            :icon="['fal', 'upload']" size="lg" />FORM W-4</fs-button>
                    <div class="error_message"> {{ errorMessage }} </div>
                    <div class="file_list" style="margin-top: 20px">
                        <div v-for="document in formFileData" :key="document.filePath"
                            class="file_item d-flex align-items-center mb-1 p">
                            <font-awesome-icon :icon="['fal', 'paperclip']" />
                            <fs-link @click="previewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
                                <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>

                            </fs-link>
                            <div style="display: inline; cursor: pointer" @click="handleRemoveFile(document)">
                                <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                            </div>
                        </div>
                    </div>
                </fs-form-group>
                <div v-if="responsive.mobile" class="mb-3">
                    <fs-card no-body class="h-100">
                        <fs-card-header
                            class="fs-7 font-weight-bold p-3 d-flex align-items-center justify-content-between">
                            <div class="d-flex align-items-center gap-2" :style="{ fontSize: '14px' }">
                                <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="text-task-violet" />
                                Form W-4 Upload
                            </div>
                            <div class="d-flex align-items-center">
                                <fs-button v-if="formFileData.length > 0" variant="link" class="text-decoration-none"
                                    @click="chooseFile">Upload</fs-button>
                                <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile"
                                    hidden />
                            </div>
                        </fs-card-header>
                        <fs-card-body class="p-0">
                            <div v-if="formFileData.length > 0" class="p-3">
                                <div v-for="file in formFileData" :key="file.fileName" class="mb-2">
                                    <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                                        <fs-link @click="previewFile(file)"
                                            class="d-flex gap-2 align-items-center text-decoration-none text-black">
                                            <span style="flex: 1"> {{ truncateFileName(file.fileName) }}</span>
                                        </fs-link>
                                        <div style="display: inline; cursor: pointer" @click="handleRemoveFile(file)">
                                            <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="p-3 d-flex flex-column align-items-center gap-3">
                                <div class="text-status-inactive">
                                    No file has been uploaded.
                                </div>
                                <fs-button variant="outline-green" @click="chooseFile">
                                    <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                                    Upload</fs-button>
                                <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile"
                                    hidden />
                            </div>
                        </fs-card-body>
                    </fs-card>
                </div>
                <fs-input type="FsTextArea" label="Notes" v-model="formData.note" @input="isFormChanged = true"></fs-input>
            </div>
        </div>
        <dark-theme-modal ref="leaveDialog" :showModal="openSaveChangeModal" title="Unsaved changes" okText="YES, LEAVE"
            okTextVariant="danger" cancelText="STAY" cancelBtnVariant="light" @close="handleCancelDiscardOnRouteChange"
            @ok="handleDiscardOnRouteChange">
            <template #content>
                <span class="d-flex py-3">
                    <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fa-solid', 'fa-circle-exclamation']"
                        size="lg" />
                    <div>
                        Are you sure you want to leave this page?
                        <br />
                        You have unsaved changes, your data will be lost.
                    </div>
                </span>
            </template>
        </dark-theme-modal>
    </div>
    <div v-if="isSubComp">
        <router-view> </router-view>
    </div>
</template>

<style lang="scss" scoped>
.card_container {
    border: 1px solid #E1E4E8;
    border-radius: 5px;
    text-decoration: none;
    color: inherit;
}

.card_title {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
}

.card_status {
    font-weight: 400;
    font-size: 12px;
    line-height: 14px;
}

.form_group {
    margin-bottom: 0px;

    .form_label {
        display: flex;

        :deep(svg) {
            color: #fc5555;
            font-size: 11px;
            margin-left: 3px;
            font-size: 60%;
            margin-bottom: 2px;
            height: 1em;
        }
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
}

.error_message {
    margin-top: 10px;
    font-size: 12px;
    font-weight: bold;
    color: red;
}

.status_indicator {
    height: 2px;
    width: 2px;
}

.form_header {
    height: 80px;
    border-bottom: 1px solid #e1e4e8;
    position: sticky;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 2;
    font-size: 16px;
}

.font-weight-bold {
    font-weight: 700;
}

.card_header-mobile {
    border-bottom: 1px solid #e1e4e8;
}
</style>