<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import type { Ref } from 'vue';
import { useBreakpoints } from "@/composables/useBreakpoints";
import { faAsterisk, faCircleEllipsis } from '@fortawesome/pro-solid-svg-icons';
import {
    faPaperclip,
    faTrashCan,
    faArrowUpFromBracket,
    faLandmark,
    faDownload
} from "@fortawesome/pro-light-svg-icons";
import { faUpload } from '@fortawesome/pro-light-svg-icons';
import { faFloppyDisk } from '@fortawesome/pro-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import { storeToRefs } from 'pinia';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useOnboardingQuickHireEEOStore } from "@/stores/onboardingQuickHireEEOStore";
import OnboardingQuickHireEEO from '@/models/onboarding/OnboardingQuickHireEEO';
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { FormField } from '@/enums/FormField';
import { truncateFileName } from '@/utilities/formatUtils';
import { FileInputData } from '@/models/onboarding/W4/W4FormFile';
import { useLoadingStore } from '@/stores/loadingStore';
import { useAlerts } from '@/composables/useAlerts';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { fileExists, isFileSizeValid, previewFile } from '@/utilities/fileUtils';
import { StaticFiles } from '@/enums/StaticFiles';
import { MAX_FILE_NAME_LENGTH } from '@/constants/common';

//Responsive
const { responsive } = useBreakpoints();

// Stores
const hqSuiteStore = useHQSuiteStore();
const azureB2CAuthStore = useAzureB2CAuthStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { getOnboardingSideNavItems } = useOnboardingStore();
const { markOnboardingSidenavItemAsDone } = useOnboardingStore();
const { getOnboardingQuickHireEEO, updateOnboardingQuickHireEEOForm } = useOnboardingQuickHireEEOStore();
const { onboardingQuickHireEEO } = storeToRefs(useOnboardingQuickHireEEOStore())
const { setLoading } = useLoadingStore();
const openSaveChangeModal = ref(false);
const toPath = ref('');
const { notifyError } = useAlerts();
const { getDocumentTemplate } = useReportTemplate();

// FORM REFS
const formFileId = ref(null);
const isForcePush = ref(false);

const clientId = computed(
    () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
library.add(faFloppyDisk, faLandmark, faAsterisk, faPaperclip, faTrashCan, faArrowUpFromBracket, faUpload, faCircleEllipsis, faDownload);

const formData: Ref<OnboardingQuickHireEEO> = ref(undefined);
const formFileData = ref([]);
const formNotes = ref('');

const isFormChanged = ref(false);
const formRef = ref(null);
const currentNavItem = ref(null);
const route = useRoute();

const employeeId = computed(() => route.params.id);

const router = useRouter();
const deletedFromStorageFileList: Ref<string[]> = ref([]);

//UPLOAD FILE SECTION
function isFileTypeSupported(fileName: string) {
    const supportedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return supportedExtensions.includes(fileExtension);
}

const saveFile = async (filePath: string, file: File) => {
    await hqSuiteStore.uploadDocument(
        { path: filePath, file: file, fileName: file.name },
        true
    );
};

const handleUploadFile = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    for (let i = 0; i < files.length; i++) {
        if (!isFileSizeValid(files[i])) return;
        if (!isFileTypeSupported(files[i].name)) {
            notifyError('Upload JPEG, JPG, PDF, PNG only!', null, 'Uploaded Failed')
            return;
        }
        if (files[i].name.length > MAX_FILE_NAME_LENGTH) {
            notifyError('File name cannot exceed 50 characters.');
            return;
        }

        if (fileExists(formFileData.value, files[i].name)) {
            notifyError('This file name already exists.');
            return;
        }
        isFormChanged.value = true;
        const pathforEmployeeDoc = await makeDocumentPath(
            DocumentTypes.EEOQuickHiresDocument,
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
};

const chooseFile = () => {
    const element = document.getElementById("upload_file") as HTMLInputElement;
    element.value = ""; // Clear the value of the file input
    element.click();
};

const handleRemoveFile = (file: FileInputData) => {
    isFormChanged.value = true;
    deletedFromStorageFileList.value.push(`${file.filePath}/${file.fileName}`);
    formFileData.value = formFileData.value.filter((fileItem) => fileItem.fileName !== file.fileName);
    formData.value.uploadFileStateForms = formData.value.uploadFileStateForms.filter((file) => file.fileName !== file.fileName)
};

//SUBMIT FORM
const handleSubmitForm = async (isNextForm: boolean) => {
    setLoading(true);
    try {
        if (formFileData.value.length > 0) {
            formFileData.value.forEach((file) => {
                saveFile(file.filePath, file.fileObject);
            });
            formFileData.value.forEach((file, index) => {
                formData.value.uploadFileStateForms[index] = {
                    formFieldId: formFileId.value,
                    fileName: file.fileName,
                    filePath: file.filePath,
                    description: '',
                    payload: '',
                    documentCategory: null
                }
            })
        }
        await updateOnboardingQuickHireEEOForm(Number(employeeId.value), formData.value);
        // DELETE FILES FROM STORAGE
        deletedFromStorageFileList.value.forEach((file: string) => {
            hqSuiteStore.deleteFile(file);
            deletedFromStorageFileList.value = [];
        })
        if (formFileData.value.length > 0) {
            await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId.value));
        } else {
            await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, false, Number(employeeId.value));
        }
        isFormChanged.value = false;
        setLoading(false);
        if (isNextForm) {
            router.push({ name: 'onboardingVEVRAASelfIdentification' })
        }
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false)
    }

}

// PREVIEW FILE

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

//COMPONENT
onMounted(async () => {
    setLoading(true);
    try {
        isFormChanged.value = false;
        await getOnboardingSideNavItems(Number(employeeId.value));
        await getOnboardingQuickHireEEO(Number(employeeId.value), FormField.EEOQuickHire);
        currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === 'onboardingEEOSelfIdentification'.trim().toLocaleLowerCase())
        formData.value = onboardingQuickHireEEO.value;
        formFileData.value = onboardingQuickHireEEO.value.uploadFileStateForms;
        formFileId.value = onboardingQuickHireEEO.value.fieldModels.find((model) => model.fieldKey === 'formFiles').formFieldId;
        formNotes.value = onboardingQuickHireEEO.value.fieldModels.find((model) => model.fieldKey === 'note').fieldValue as string | '';
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
</script>

<template>
    <VeeForm @submit.prevent="handleSubmitForm(false)" ref="formRef">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
            <fs-row align-v="center">
                <fs-col class="truncate-text">
                    <h2 v-if="responsive.mobile" class="hq-pg__title">EEO Self-Identification
                    </h2>
                    <h2 v-else class="hq-pg__title">EEO Self-Identification | Equal Employment Opportunity
                        Self-Identification </h2>
                </fs-col>
                <fs-col cols="auto" class="ms-auto">
                    <fs-button :disabled="!isFormChanged" type="submit"
                        variant="outline-primary" @click="handleSubmitForm(false)">
                        <font-awesome-icon :icon="['far', 'floppy-disk']" />
                        <span v-if="!responsive.mobile">Save</span>
                    </fs-button>
                    <fs-button :disabled="!isFormChanged" type="submit" variant="primary" @click="handleSubmitForm(true)">Save
                        &#38; next</fs-button>
                </fs-col>
            </fs-row>

        </fs-container>
        <fs-container class="contain my-4">
            <div v-if="!responsive.mobile" class="mb-3">
                EEO Self-Identification | Equal Employment Opportunity Self-Identification
            </div>
            <fs-row v-if="!responsive.mobile" class="card state_card mx-0 mb-3">
                <fs-col class="state_card_left d-flex align-items-center" cols="4">
                    <div class="d-flex align-items-center gap-3">
                        <fs-link @click="handleDownloadStaticFile(StaticFiles.FORM_EEO, false)">Download</fs-link>
                    </div>
                </fs-col>
                <fs-col class="state_card_right" cols="8">
                    <div v-if="formFileData.length > 0" class="w-100">
                        <div v-for="file in formFileData" :key="file.fileName" class="mb-2">
                            <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                                <fs-link @click="previewFile(file)"
                                    class="d-flex gap-2 align-items-center text-decoration-none text-black">
                                    <font-awesome-icon :icon="['fal', 'paperclip']" class="text-task-blue" />
                                    <span style="flex: 1"> {{ truncateFileName(file.fileName) }}</span>
                                </fs-link>
                                <div style="display: inline; cursor: pointer" @click="handleRemoveFile(file)">
                                    <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="d-flex align-items-center justify-content-between w-100">
                        <div class="text-gray">
                            No file has been uploaded.
                        </div>
                        <fs-button variant="outline-green" @click="chooseFile">
                            <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                            Upload</fs-button>
                        <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile" hidden />
                    </div>
                </fs-col>
            </fs-row>
            <div v-if="responsive.mobile">
                <fs-card no-body class="h-100">
                    <fs-card-header class="fs-7 font-weight-bold p-3 d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-2">
                            <font-awesome-icon :icon="['fal', 'landmark']" class="text-cornflower-blue-dark" size="lg" />
                            EEO Self-Identification
                        </div>
                        <div class="d-flex align-items-center flex-row-reverse">
                            <fs-button v-if="formFileData.length > 0" variant="link" class="text-decoration-none"
                                @click="chooseFile">Upload</fs-button>
                            <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile" hidden />
                            <fs-dropdown size="lg" variant="link" no-caret>
                                <template #button-content>
                                    <font-awesome-icon :icon="['fas', 'circle-ellipsis']" size="lg" />
                                </template>
                                <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.FORM_EEO, false)">
                                    <font-awesome-icon :icon="['fal', 'download']" class="me-2" />
                                    Download</fs-dropdown-item>
                            </fs-dropdown>
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
                            <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile" hidden />
                        </div>
                    </fs-card-body>
                </fs-card>
            </div>
            <div v-if="formFileData.length > 0 && !responsive.mobile">
                <fs-button variant="outline-green" @click="chooseFile">
                    <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                    Upload</fs-button>
                <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile" hidden />
            </div>
            <fs-input class="mt-4" name="note" :rules="{ required: false }" :required="false" type="FsTextArea" label="Note"
                v-model="formNotes" @input="isFormChanged = true"></fs-input>
        </fs-container>
    </VeeForm>
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
</template>
<style scoped lang="scss">
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

.title {
    font-size: 16px;
}
</style>