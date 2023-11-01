<script setup lang="ts">
import { useBreakpoints } from '@/composables/useBreakpoints';
import { computed, ref, Ref } from 'vue';
import { useAlerts } from '@/composables/useAlerts';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { FileInputData } from '@/models/onboarding/W4/W4FormFile';
import { truncateFileName } from '@/utilities/formatUtils';
import {
    faTrashCan,
    faFloppyDisk,
} from "@fortawesome/pro-regular-svg-icons";
import { faCircleEllipsis } from '@fortawesome/pro-solid-svg-icons';
import { faUpload, faDownload } from '@fortawesome/pro-light-svg-icons';
import { faArrowUpFromBracket, faPaperclip } from "@fortawesome/pro-light-svg-icons";
import { library } from '@fortawesome/fontawesome-svg-core';
import { onBeforeRouteLeave, useRouter, useRoute } from 'vue-router';
import { FormField } from '@/enums/FormField';
import { useOnboardingEEOSelfIdentificationStore } from '@/stores/onboardingEEOSelfIdentificationStore';
import { dataUrlToFile } from '@/helper/hqSuite/formatHelper';
import { onMounted } from 'vue';
import SignaturePad from "@/components/common/SignaturePad.vue";
import { storeToRefs } from 'pinia';
import FormFieldModel from '@/models/onboarding/FormField';
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useOnboardingStore } from '@/stores/onboardingStore';
import { useLoadingStore } from '@/stores/loadingStore';
import { FormStatus } from '@/enums/FormStatus';
import { fileExists, isFileSizeValid } from '@/utilities/fileUtils';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { StaticFiles } from '@/enums/StaticFiles';
import { MAX_FILE_NAME_LENGTH } from '@/constants/common';

library.add(faTrashCan, faFloppyDisk, faArrowUpFromBracket, faPaperclip, faUpload, faCircleEllipsis, faDownload);
// STORES
const { responsive } = useBreakpoints();
const { notifyError } = useAlerts();
const hqSuiteStore = useHQSuiteStore();
const azureB2CAuthStore = useAzureB2CAuthStore();
const router = useRouter();
const route = useRoute();

const { genderList, raceList, getOnboardingEEOSelfIdentification, updateOnboardingEEOSelfIdentification } = useOnboardingEEOSelfIdentificationStore();
const { onboardingEEOSelfIdentification } = storeToRefs(useOnboardingEEOSelfIdentificationStore())
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems } = useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { setLoading } = useLoadingStore();
const { getDocumentTemplate } = useReportTemplate();


// CONSTANTS
const clientId = computed(
    () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
const initState = {
    note: '',
    firstName: '',
    middleInitial: '',
    lastName: '',
    jobTitle: '',
    gender: null,
    race: null,
    signaturePath: null,
    signatureValue: null,
    date: null,
    time: null,
    formStatus: null,
    formFiles: 'formFiles'
}
const onboardingEEOSelfIdentificationFormId = FormField.EEOOnboard;
const employeeId = computed(() => route.params.id);

// REFS
const formRef = ref(null);
const isFormChanged = ref(false);
const formFileData: Ref<FileInputData[]> = ref([]);
const formData = ref(initState)
const isSignatureConsent = ref(false);
const signatureObject = ref({
    path: '',
    fileObject: null,
    name: ''
});
const signatureFilePath = ref('');
const isLoaded = ref(false);
const payloadUploadForm: Ref<FormFieldModel> = ref(undefined);
const openSaveChangeModal = ref(false);
const isForcePush = ref(false);
const toPath = ref('');
const currentNavItem = ref(null);
const deletedFromStorageFileList: Ref<string[]> = ref([]);
const dateUTC = ref(null);
const timeUTC = ref(null);

// SUBMIT FORM
const handleSubmitForm = async (event: Event, isNextForm: boolean) => {
    setLoading(true);
    event.preventDefault();
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

        formData.value.formStatus = FormStatus.HRCompleted;
        formData.value.formFiles = 'form files';

        const mappedFieldModels = payloadUploadForm.value.fieldModels.map((fieldModel) => {
            const fieldValue = formData.value[fieldModel.fieldKey] || ""; // Set fieldValue to an empty string if fieldKey does not exist in data
            return { ...fieldModel, fieldValue };
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { formStatus, formFiles, note, ...employeeData } = formData.value;

        let allFieldEmpty = true;
        for (const key in employeeData) {
            if (employeeData[key] !== "") {
                allFieldEmpty = false;
                break;
            }
        }

        payloadUploadForm.value.fieldModels = mappedFieldModels;
        isFormChanged.value = false;
        formFileData.value.forEach(async (file) => {
            await saveFile(file.filePath, file.fileObject)
        })
        if (allFieldEmpty && formFileData.value.length === 0) {
            await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, false, Number(employeeId.value));
        } else if (formFileData.value.length > 0) {
            await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, Number(employeeId.value));
        }
        setLoading(true);
        // DELETE FILES FROM STORAGE
        deletedFromStorageFileList.value.forEach((file: string) => {
            hqSuiteStore.deleteFile(file);
            deletedFromStorageFileList.value = [];
        })

        updateOnboardingEEOSelfIdentification(Number(employeeId.value), payloadUploadForm.value);
        if (isNextForm) {
            router.push({ name: 'onboardingVEVRAASelfIdentification' })
        }
    } catch (error) {
        console.error(error)
    } finally {

        setLoading(false);
    }
}

// UPLOAD FILES
function isFileTypeSupported(fileName: string) {
    const supportedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return supportedExtensions.includes(fileExtension);
}


const handleUploadFile = async (event: Event) => {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    for (let i = 0; i < files.length; i++) {
        if (!isFileSizeValid(files[i])) return;
        if (!isFileTypeSupported(files[i].name)) {
            notifyError('Wrong file format, upload PDF, PNG, JPEG or JPG only!')
            return;
        }
        if (files[i].name.length > MAX_FILE_NAME_LENGTH) {
            notifyError(`The maximum file name is ${MAX_FILE_NAME_LENGTH} characters.`);
            return;
        }

        if (fileExists(formFileData.value, files[i].name)) {
            notifyError('This file name already exists.');
            return;
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
        isFormChanged.value = true;
    }
};

const chooseFile = () => {
    const element = document.getElementById("upload_file") as HTMLInputElement;
    element.value = ""; // Clear the value of the file input
    element.click();
};

const handlePreviewFile = async (file: FileInputData) => {
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
            setLoading(true);
            await hqSuiteStore.previewPDFFile(filePath).finally(() => {
                setLoading(false);
            });
        } else if (['png', 'jpg', 'jpeg'].includes(fileType)) {
            //WITH TYPE IMAGE
            setLoading(true);
            hqSuiteStore.previewImageFile(filePath).finally(() => {
                setLoading(false);
            });
        }
    }

};

const handleRemoveFile = (file: FileInputData) => {
    formFileData.value = formFileData.value.filter((fileItem) => fileItem.fileName !== file.fileName);
    deletedFromStorageFileList.value.push(`${file.filePath}/${file.fileName}`);
    isFormChanged.value = true;
}

const saveFile = async (filePath: string, file: File) => {
    await hqSuiteStore.uploadDocument(
        { path: filePath, file: file, fileName: file.name },
        true
    )
};


// SIGNATURE HANDLING
const handleUpdateSignatureConsent = () => {
    isSignatureConsent.value = !isSignatureConsent.value;
}

const handleClearSignature = () => {
    formData.value.signaturePath = '';
}

const handleUpdatePathSignature = async (value: string) => {
    const name = `FormEEOSelfIdentification-Signature-${new Date().getTime()}.png`;
    const File = await dataUrlToFile(value, name);
    signatureObject.value.path = signatureFilePath.value;
    signatureObject.value.name = name;
    signatureObject.value.fileObject = File;
    formData.value.signatureValue = value;
    formData.value.signaturePath = `${signatureFilePath.value}/${name}`;
}

const handleUpdatePathEmp = (path: string) => {
    formData.value.signaturePath = path;
    const loadedSignature = localStorage.getItem('signature');
    formData.value.signatureValue = loadedSignature;
}

// COMPONENT HANDLING
onMounted(async () => {
    setLoading(true);
    try {
        await getOnboardingSideNavItems(Number(employeeId.value));
        currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === 'onboardingEEOSelfIdentification'.trim().toLocaleLowerCase());

        await getOnboardingEEOSelfIdentification(Number(employeeId.value), onboardingEEOSelfIdentificationFormId);
        payloadUploadForm.value = onboardingEEOSelfIdentification.value;

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
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            return acc as any;
        }, {});

        if (data.employeeSignatureDateUTC) {
            const [date, time] = data.employeeSignatureDateUTC.split('T');
            const utcDate = new Date(`2000-01-01T${time}`);
            const formattedTime = `${utcDate.getUTCHours().toString().padStart(2, '0')}:${utcDate.getUTCMinutes().toString().padStart(2, '0')}`;
            dateUTC.value = date;
            timeUTC.value = formattedTime;
        }

        formData.value = data;
        isLoaded.value = true;
    } catch (error) {
        console.error(error)
    } finally {
        setLoading(false);
    }
})

const renderRaceOptions = (option) => {
    if (option.description) {
        return `<strong>${option.value}: </strong>
                <span>${option.description}</span>`
    } else {
        return `<strong>${option.value}</strong>`
    }
};

// LEAVING GUARDS
const handleDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
    isForcePush.value = true;
    router.push(toPath.value)
}

const handleCancelDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
}

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
    <VeeForm ref="formRef">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
            <fs-row align-v="center">
                <fs-col class="text-truncate">
                    <h2 v-if="responsive.mobile" class="hq-pg__title">EEO Self-Identification
                </h2>
                <h2 v-else class="hq-pg__title">EEO Self-Identification | Equal Employment Opportunity
                    Self-Identification </h2>
                </fs-col>
                <fs-col cols="auto" class="ms-auto">
                    <fs-button type="submit" variant="outline-primary"
                    :disabled="!isFormChanged" @click="(event: Event) => handleSubmitForm(event, false)">
                    <font-awesome-icon :icon="['far', 'floppy-disk']" />
                    <span v-if="!responsive.mobile">Save</span>
                </fs-button>
                <fs-button type="submit" variant="primary" @click="(event: Event) => handleSubmitForm(event, true)"
                    :disabled="!isFormChanged">Save
                    &#38; next</fs-button>
                </fs-col>
            </fs-row>

        </fs-container>
        <div class="p-4">
            <div v-if="!responsive.mobile">
                <fs-row class="card state_card mx-0 mb-3">
                    <fs-col class="state_card_left d-flex align-items-center" cols="4">
                        <div class="d-flex align-items-center gap-3">
                            <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']"
                                class="me-2 text-status-quickhire" />
                            <span class="fw-bold">Form EEO Upload</span>
                        </div>
                    </fs-col>
                    <fs-col class="state_card_right" cols="8">
                        <div v-if="formFileData.length > 0" class="w-100">
                            <div v-for="file in formFileData" :key="file.fileName" class="mb-2">
                                <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                                    <fs-link @click="handlePreviewFile(file)"
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
                            <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile"
                                ref="W4FederalFileInput" hidden />
                        </div>
                    </fs-col>
                </fs-row>
                <div v-if="formFileData.length > 0">
                    <fs-button variant="outline-green" @click="chooseFile">
                        <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                        Upload</fs-button>
                    <input type="file" name="files" multiple id="upload_file" @change="handleUploadFile"
                        ref="W4FederalFileInput" hidden />
                </div>
            </div>
            <div v-if="responsive.mobile">
                <fs-card no-body class="h-100">
                    <fs-card-header class="fs-7 font-weight-bold p-3 d-flex align-items-center justify-content-between">
                        <div class="d-flex align-items-center gap-2">
                            <font-awesome-icon :icon="['fal', 'landmark']" class="text-cornflower-blue-dark" size="lg" />
                            EEO Self-Identification
                        </div>
                        <div class="d-flex align-items-center">
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
                                    <fs-link @click="handlePreviewFile(file)"
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
            <fs-input class="mt-3" type="FsTextArea" label="Note" v-model="formData.note" name="note"
                :rules="{ required: false }" :required="false" @input="isFormChanged = true"></fs-input>
            <hr />
            <p :style="{ textAlign: 'justify' }">The Equal Employment Opportunity Commission (EEOC) requires
                organizations
                with
                100 or more employees to
                complete an EEO-1 report each year. Your employer invites you to self-identify gender and
                race/ethnicity. Completion of this data is VOLUNTARY and will not affect your opportunity for
                employment,
                or
                terms or conditions of employment. This form will be used for EEO-1 reporting purposes only and will
                be
                kept separate from all other personnel records only accessed by Human Resources.</p>
            <fs-row>
                <fs-col md="5" xs="12">
                    <fs-input type="fsTextInput" label="First Name" name="firstName" v-model="formData.firstName"
                        :rules="{ required: false }" :required="true" :maxlength="20" :disabled="true"></fs-input>
                </fs-col>
                <fs-col md="2" xs="12">
                    <fs-input type="fsTextInput" label="Middle Initial" name="middleInitial"
                        v-model="formData.middleInitial" :rules="{ required: false }" :required="false" :maxlength="1"
                        :disabled="true"></fs-input>
                </fs-col>
                <fs-col md="5" xs="12">
                    <fs-input type="fsTextInput" label="Last Name" name="lastName" v-model="formData.lastName"
                        :rules="{ required: false }" :required="true" :maxlength="20" :disabled="true"></fs-input>
                </fs-col>
            </fs-row>
            <fs-row>
                <fs-col md="6" xs="12">
                    <fs-input type="fsTextInput" label="Job Title" name="jobTitle" v-model="formData.jobTitle"
                        :rules="{ required: false }" :required="true" :disabled="true"></fs-input>
                </fs-col>
            </fs-row>
            <hr />
            <fs-row>
                <span :style="{ textTransform: 'uppercase', marginBottom: '10px' }">Please answer the following
                    questions:</span>
                <fs-form-group class="form_group" :style="{ marginBottom: '22px' }">
                    <div class="form_label">
                        <label class="mb-2">What is your Gender?</label>
                        <font-awesome-icon :icon="['fas', 'asterisk']" />
                    </div>
                    <fs-form-radio disabled v-for="gender in genderList" :key="gender.value" v-model="formData.gender"
                        name="gender" :value="gender.value">{{ gender.text }}</fs-form-radio>
                </fs-form-group>

                <fs-form-group class="form_group">
                    <div class="form_label">
                        <label>What is your race/ethnicity?</label>
                        <font-awesome-icon :icon="['fas', 'asterisk']" />
                    </div>
                    <div class="form_sub-label mb-2">
                        Please mark the box that describes the race/ethnicity category with which you primarily
                        identify.
                    </div>
                    <fs-form-radio disabled v-for="race in raceList" :key="race.id" v-model="formData.race" name="race"
                        :value="race.id" class="mb-4">
                        <div v-html="renderRaceOptions(race)"></div>
                    </fs-form-radio>
                </fs-form-group>
            </fs-row>
            <hr />
            <fs-row>
                <fs-col cols="12" class="mb-4">
                    <h5>Thank you for your participation.</h5>
                    <SignaturePad :isEdit="false" :isSignatureConsent="isSignatureConsent" v-if="isLoaded"
                        ref="signaturePad" @update-signature-consent="handleUpdateSignatureConsent"
                        :isUpdate="isFormChanged" @clear-signature="handleClearSignature" :path="formData.signaturePath"
                        @submit-signature="handleUpdatePathSignature" :isDisabledAll="true" :isViewOnly="true"
                        @update-path-signature="handleUpdatePathEmp" />
                </fs-col>
                <fs-col cols="6">
                    <fs-form-group class="form_group">
                        <div class="form_label">
                            <label>Date</label>
                            <font-awesome-icon :icon="['fas', 'asterisk']" />
                        </div>
                        <div class="d-flex align-items-center" :style="{ gap: '10px' }">
                            <fs-form-input v-model="formData.date" type="text" disabled></fs-form-input>
                            <fs-form-input v-model="formData.time" type="time" disabled></fs-form-input>
                        </div>
                    </fs-form-group>
                </fs-col>
            </fs-row>
            <hr />
            <p :style="{ fontSize: '12px', color: '#6E7C8F' }">
                Refusal to complete this form will not subject you to any adverse treatment. This form will be used
                for governmental reporting purposes only. If we have not received your completed form, the Company
                will interpret that to mean you have declined self-identification and will be required to obtain the
                necessary information from visual identification and/or other available information.
            </p>
        </div>
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

<style lang="scss" scoped>
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

:deep(.form-check-input:checked) {
    background-color: #03A9F4;
    border-color: #03A9F4;
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

.form_title {
    font-size: 16px;
}
</style>