<script lang="ts" setup>
import { useAlerts } from '@/composables/useAlerts';
import { FormField } from '@/enums/FormField';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import OnboardingQuickHireWOTC, { FormT } from '@/models/onboarding/WOTC/OnboardingQuickHireWOTC';
import { UploadPayload } from '@/models/onboarding/WOTC/UploadPayload';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { useLoadingStore } from '@/stores/loadingStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { truncateFileName } from '@/utilities/formatUtils';
import { library } from '@fortawesome/fontawesome-svg-core';
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import {
    faArrowUpFromBracket,
    faFilePdf,
    faFloppyDisk,
    faPaperclip,
    faTrashCan,
    faMemo,
    faDownload,
    faFileSignature,
    faUpload,
} from "@fortawesome/pro-light-svg-icons";
import { faCircleEllipsis, faCircleExclamation, faAsterisk } from '@fortawesome/pro-solid-svg-icons';
import { cloneDeep, isEqual } from 'lodash';
import { storeToRefs } from 'pinia';
import { computed, onMounted, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import { useOnboardingQuickHireWOTCStore } from '../../../stores/WOTC/onboardingQuickHireWOTCStore';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { isFileSizeValid } from '@/utilities/fileUtils';
import { useBreakpoints } from '@/composables/useBreakpoints';
import { StaticFiles } from '@/enums/StaticFiles';

library.add(faFloppyDisk, faAsterisk, faPaperclip, faTrashCan, faArrowUpFromBracket, faFilePdf, faCircleEllipsis, faMemo, faDownload, faFileSignature, faUpload, faCircleExclamation);

const { responsive } = useBreakpoints()
const { getDocumentTemplate } = useReportTemplate();
const route = useRoute();
const hqSuiteStore = useHQSuiteStore();
const azureB2CAuthStore = useAzureB2CAuthStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { getOnboardingSideNavItems, markOnboardingSidenavItemAsDone } = useOnboardingStore();
const { setLoading } = useLoadingStore();
const { getOnboardingQuickHireWOTC, updateOnboardingQuickHireWOTC } = useOnboardingQuickHireWOTCStore();
const { onboardingQuickHireWOTC } = storeToRefs(useOnboardingQuickHireWOTCStore());
const clientId = computed(
    () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
const onlyOneOptionalFormUpload = ref(true);
const isFormChanged = ref(false);
const renderedFormData = ref(null);
const formRef = ref(null);
const currentNavItem = ref(null);
const employeeId = computed(() => Number(route.params.id));
const formId = FormField.WOTCQuickHire;
const router = useRouter();
const upload8850 = ref(null);
const upload9061 = ref(null);
const supportingDocuments = ref(null);
const formFileId = ref(null);
const upload9062 = ref(null);
const openSaveChangeModal = ref(false);
const toPath = ref("");
const isForcePush = ref(false);
const { notifySuccess, notifyError } = useAlerts();

const formData = ref({
    note: '',
    isFormDone: false,
    formFiles: [],
    uploadFileStateForms: [],
})

const uploadFormData = ref<Partial<UploadPayload<OnboardingQuickHireWOTC>>>({
    fieldModels: [],
    uploadFileStateForms: [],
    formId: formId,
    employeeId: employeeId.value
})

const handleDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
    isForcePush.value = true;
    router.push(toPath.value);
};

const handleCancelDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
};

onBeforeRouteLeave((to, from, next) => {
    if (isForcePush.value) {
        next();
        return true;
    }
    if (!isFormChanged.value) {
        next();
        return true;
    } else {
        toPath.value = to.fullPath;
        next(false);
        openSaveChangeModal.value = true;
        return false;
    }
});

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

const form8850ListFiles = computed(() => {
    return uploadFormData.value.uploadFileStateForms.filter((file) => {
        return file.payload.type === FormT.upload8850
    })
})

const form9061ListFiles = computed(() => {
    return uploadFormData.value.uploadFileStateForms.filter((file) => {
        return file.payload.type === FormT.upload9061
    })
})

const supportDocumentListFiles = computed(() => {
    return uploadFormData.value.uploadFileStateForms.filter((file) => {
        return file.payload.type === FormT.supportingDocuments
    })
})

const form9062ListFiles = computed(() => {
    return uploadFormData.value.uploadFileStateForms.filter((file) => {
        return file.payload.type === FormT.upload9062
    })
})

const removedUploadFiles = ref<string[]>([])

const isFileTypeSupported = (fileName: string) => {
    const supportedExtensions = ['pdf', 'jpeg', 'png', 'jpg'];
    const fileExtension = fileName.split('.').pop().toLowerCase();
    return supportedExtensions.includes(fileExtension);
}

const saveFile = async (filePath: string, file: File, fileName: string) => {
    await hqSuiteStore.uploadDocument(
        { path: filePath, file: file, fileName: fileName },
        true
    );
};

const uploadTypeErrorMsg = 'File type is not supported. Please choose file with types of PDF, JPEG, PNG or JPG only'

const hasEnoughFileWOTC = computed(() => {
    const hasUpload8850Form = uploadFormData.value.uploadFileStateForms.some((upload) => upload.payload.type === FormT.upload8850)
    const hasUpload9061Form = uploadFormData.value.uploadFileStateForms.some((upload) => upload.payload.type === FormT.upload9061)
    const hasUpload9062Form = uploadFormData.value.uploadFileStateForms.some((upload) => upload.payload.type === FormT.upload9062)

    return ((hasUpload8850Form && hasUpload9061Form && !hasUpload9062Form) || (hasUpload8850Form && !hasUpload9061Form && hasUpload9062Form))
})

const handleUploadFile = async (formType: string, event: Event) => {
    setLoading(true);
    if (onlyOneOptionalFormUpload.value) {
        const target = event.target as HTMLInputElement;
        const files = target.files;
        for (let i = 0; i < files.length; i++) {
            const isFileExisted = uploadFormData.value.uploadFileStateForms.find((file) => file.fileName === files[i].name)
            if (isFileExisted){
            notifyError('This file name already exists.')
            setLoading(false);
            return;
            }
            if (!isFileTypeSupported(files[i].name)) {
                notifyError(uploadTypeErrorMsg)
                setLoading(false);
                return;
            } else if (!isFileSizeValid(files[i])) {
                setLoading(false);
                return;
            }
            const pathForEmployeeDoc = await makeDocumentPath(
                DocumentTypes.QuickHireWotc,
                `${clientId.value}`,
                employeeId.value.toString()
            )
            const fileName = files[i].name;
            const reader = new FileReader();

            reader.onload = () => {
                const fileUrl = reader.result.toString();
                const data = {
                    formFieldId: formFileId.value,
                    fileName: fileName,
                    filePath: pathForEmployeeDoc,
                    fileObject: new File([files[i]], fileName),
                    fileUrl: fileUrl,
                    payload: {
                        type: FormT[formType]
                    },
                    description: ''
                };
                uploadFormData.value.uploadFileStateForms.push(data);
            };
            reader.readAsDataURL(files[i]);
        }
    }

    onlyOneOptionalFormUpload.value = !(upload9061.value?.files.length > 0 && upload9062.value?.files.length > 0)
    setLoading(false);
};

const chooseFile = (uploadFormId: string) => {
    if (uploadFormId === FormT.upload9062 && form9061ListFiles.value.length > 0 || uploadFormId === FormT.upload9061 && form9062ListFiles.value.length > 0) {
        return
    } else {
        const element = document.getElementById(uploadFormId) as HTMLInputElement;
        element.value = "";
        element.click();
    }
};

const handleRemoveFileItem = (file) => {
    setLoading(true);
    const removeFileName = file.fileName;
    uploadFormData.value.uploadFileStateForms = uploadFormData.value.uploadFileStateForms.filter((file) => file.fileName !== removeFileName);
    if (!file.fileObject) {
        removedUploadFiles.value.push(`${file.filePath}/${removeFileName}`)
    }
    setLoading(false)
};

const handleSubmitForm = async (isNextForm: boolean) => {
    isForcePush.value = true;
    setLoading(true);
    if (removedUploadFiles.value.length > 0) {
        await Promise.all(
            removedUploadFiles.value.map(async (path: string) => {
                await hqSuiteStore.deleteFile(path);
            })
        )
    }
    if (uploadFormData.value.uploadFileStateForms.length > 0) {
        await Promise.all(
            uploadFormData.value.uploadFileStateForms.map(async (item) => {
                if (item.fileObject) {
                    await saveFile(item.filePath, item.fileObject, item.fileName);
                }
            })
        ).then(async () => {
            const _uploadFileStateForms = uploadFormData.value.uploadFileStateForms.map((file) => {
                const { fileObject, fileUrl, ..._payload } = file;
                return _payload
            })
            uploadFormData.value.uploadFileStateForms = [..._uploadFileStateForms]
        })
    } else {
        formData.value.uploadFileStateForms = []
    }
    formData.value.isFormDone = true
    const { uploadFileStateForms, ..._formData } = formData.value
    Object.keys(_formData).forEach((fieldName: string) => {
        uploadFormData.value.fieldModels.find((item) => item.fieldKey === fieldName).fieldValue = _formData[fieldName]
    })
    await updateOnboardingQuickHireWOTC(employeeId.value, uploadFormData.value)
    .then(() => 
        notifySuccess('Information updated.')
    )
    .catch(() =>
        notifyError('Information not saved')
    )
    await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, hasEnoughFileWOTC.value, employeeId.value)

    isNextForm &&
        router.push({ name: 'onboardingTaxWithHoldingInfoHR' });
    setLoading(false);
}

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
    await Promise.all([
        getOnboardingSideNavItems(employeeId.value),
        getOnboardingQuickHireWOTC(employeeId.value, formId)
    ])
    currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === 'onboardingWOTC'.trim().toLocaleLowerCase())
    onboardingQuickHireWOTC.value.fieldModels.forEach((item) => {
        const newKey = item.fieldKey as keyof OnboardingQuickHireWOTC
        formData.value[newKey] = item.fieldValue as never

        uploadFormData.value.fieldModels.push(({
            formFieldId: item.formFieldId,
            fieldKey: item.fieldKey,
            fieldValue: item.fieldValue
        }))
    })
    uploadFormData.value.uploadFileStateForms = [...onboardingQuickHireWOTC.value.uploadFileStateForms]
    formData.value.uploadFileStateForms = [...onboardingQuickHireWOTC.value.uploadFileStateForms]
    renderedFormData.value = cloneDeep(formData.value);
    setLoading(false);
})

watch([() => uploadFormData.value.uploadFileStateForms, () => formData.value.note], () => {
    formData.value.uploadFileStateForms = [...uploadFormData.value.uploadFileStateForms]
    if (!isEqual(formData.value, renderedFormData.value)) {
        isFormChanged.value = true;
    } else {
        isFormChanged.value = false;
    }
}, {
    deep: true,
})

</script>
<template>
    <div class="position-relative">
        <div class="px-3 d-flex justify-content-between algin-items-center w-100 bg-white form_header" :class="!responsive.mobile && 'py-3'">
            <div class="fw-bold title d-flex align-items-center">WOTC <span v-if="!responsive.mobile">| Work Opportunity Tax Credit</span></div>
            <div class="d-flex align-items-center">
                <fs-button variant="outline-primary" :disabled="!isFormChanged"
                    @click="handleSubmitForm(false)"><font-awesome-icon :icon="['fal', 'floppy-disk']" class="me-2"
                        :disabled="!isFormChanged" />Save</fs-button>
                <fs-button variant="primary" :disabled="!isFormChanged" @click="handleSubmitForm(true)">Save &
                    Next</fs-button>
            </div>
        </div>
        <div class="px-4 mt-3">
            <VeeForm ref="formRef">
                <div class="mt-3" v-if="!responsive.mobile">
                    <!-- 8850 form -->
                    <div class="my-2">
                        <span class="fw-bold me-2">Form 8850 </span>
                        <span>| Pre-Screening Notice and Certification Request for the Work Opportunity Credit</span>
                    </div>
    
                    <fs-row class="border mb-3" style="border-radius: 8px">
                        <fs-col xl="2" lg="3" class="px-4 py-3">
                            <div class="d-flex align-items-center gap-2 h-100">
                                <fs-link class="text-task-cyan"
                                    @click="handleDownloadStaticFile(StaticFiles.FORM_8850, false)">Download</fs-link>
                                <fs-link class="text-task-cyan"
                                    @click="handleDownloadStaticFile(StaticFiles.WOTC_8850_INSTRUCTIONS, false)">Instruction</fs-link>
                            </div>
                        </fs-col>
                        <fs-col xl="10" lg="9" class="border-left ps-4 py-3">
                            <div class="d-flex justify-content-between w-100">
                                <div v-if="form8850ListFiles.length > 0" class="w-100">
                                    <a v-for="file in form8850ListFiles" :key="file.fileName"
                                        class="d-flex justify-content-between my-2 w-100">
                                        <span>
                                            <font-awesome-icon :icon="['fal', 'paperclip']" class="text-task-cyan" /><span
                                                @click="handlePreviewFile(file)" class="ms-2">{{
                                                    truncateFileName(file.fileName)
                                                }}</span>
                                        </span>
                                        <font-awesome-icon :icon="faTrashCan" class="text-danger ms-3 px-1"
                                            @click="handleRemoveFileItem(file)" />
                                    </a>
                                </div>
                                <div v-if="form8850ListFiles.length === 0" class="d-flex align-items-center">No file has been
                                    uploaded</div>
                                <input multiple id="upload8850" type="file"
                                    @change="(event) => handleUploadFile('upload8850', event)" hidden ref="upload8850"
                                    accept="pdf" />
                                <div @click="chooseFile(FormT.upload8850)">
                                    <fs-button variant="outline-primary" class="me-4" v-if="form8850ListFiles.length === 0">
                                        <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />
                                        Upload
                                    </fs-button>
                                </div>
                            </div>
                        </fs-col>
                    </fs-row>
                    <div class="my-3" v-if="form8850ListFiles.length > 0">
                        <fs-button variant="outline-primary" class="me-4" @click="chooseFile(FormT.upload8850)">
                            <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />
                            Upload
                        </fs-button>
                    </div>
    
                    <!-- 9061 form -->
                    <div class="my-2">
                        <span class="fw-bold me-2">Form 9061 </span>
                        <span>| Individual Characteristics Form (ICF) Work Opportunity Tax Credit</span>
                    </div>
    
                    <fs-row class="border mb-3" style="border-radius: 8px">
                        <fs-col xl="2" lg="3" class="px-4 py-3">
                            <div class="d-flex align-items-center gap-2 h-100">
                                <fs-link class="text-task-cyan"
                                    @click="handleDownloadStaticFile(StaticFiles.FORM_9061, false)">Download</fs-link>
                                <fs-link class="text-task-cyan"
                                    @click="handleDownloadStaticFile(StaticFiles.WOTC_9061_INSTRUCTIONS, false)">Instruction</fs-link>
                            </div>
                        </fs-col>
                        <fs-col xl="10" lg="9" class="border-left ps-4 py-3">
                            <div class="d-flex justify-content-between w-100">
                                <div v-if="form9061ListFiles.length > 0" class="w-100">
                                    <a v-for="file in form9061ListFiles" :key="file.fileName"
                                        class="d-flex justify-content-between my-2 w-100">
                                        <span>
                                            <font-awesome-icon :icon="['fal', 'paperclip']" class="text-task-cyan" /><span
                                                @click="handlePreviewFile(file)" class="ms-2">{{
                                                    truncateFileName(file.fileName)
                                                }}</span>
                                        </span>
                                        <font-awesome-icon :icon="faTrashCan" class="text-danger ms-3 px-1"
                                            @click="handleRemoveFileItem(file)" />
                                    </a>
                                </div>
                                <div v-if="form9061ListFiles.length === 0" class="d-flex align-items-center">No file has been
                                    uploaded</div>
                                <input multiple id="upload9061" type="file"
                                    @change="(event) => handleUploadFile('upload9061', event)" hidden ref="upload9061"
                                    accept="pdf" />
                                <div @click="chooseFile(FormT.upload9061)">
                                    <fs-button variant="outline-primary" class="me-4" v-if="form9061ListFiles.length === 0"
                                        :disabled="form9062ListFiles.length > 0">
                                        <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />
                                        Upload
                                    </fs-button>
                                </div>
                            </div>
                        </fs-col>
                    </fs-row>
    
                    <div class="my-3 border">
                        <fs-row>
                            <fs-col xl="2" lg="3" class="p-4">
                                <div class="h-100 d-flex flex-column justify-content-between">
                                    <input multiple id="supportingDocuments" type="file"
                                        @change="(event) => handleUploadFile('supportingDocuments', event)" hidden
                                        ref="supportingDocuments" accept="pdf" />
                                    <div class="h-100">
                                        <div class="me-4 h-100 d-flex flex-column justify-content-center">
                                            <div variant="outline" class="bg-white fw-bold">
                                                <font-awesome-icon :icon="['fal', 'upload']" class="me-2 text-task-violet" />
                                                Supporting Documents
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fs-col>
                            <fs-col xl="10" lg="9" class="border-left">
                                <div v-if="supportDocumentListFiles.length > 0" class="h-100 d-flex flex-column gap-3 ps-3">
                                    <div v-for="file in supportDocumentListFiles" :key="file.fileName"
                                        class="d-flex w-100 justify-content-between align-items-center h-100">
                                        <span><font-awesome-icon :icon="['fal', 'paperclip']" class="me-2 text-task-cyan"
                                                style="font-size: 16px" /><span @click="handlePreviewFile(file)">{{
                                                    file.fileName
                                                }}</span></span>
    
                                        <div class="d-inline ms-3 px-1" @click="handleRemoveFileItem(file)">
                                            <font-awesome-icon :icon="faTrashCan" class="text-danger cursor-pointer" />
                                        </div>
                                    </div>
                                </div>
                            </fs-col>
                        </fs-row>
                    </div>
    
                    <div class="d-flex align-items-center mt-3 gap-2">
                        <div class="my-3" v-if="form9061ListFiles.length > 0">
                            <fs-button variant="outline-primary" class="me-4" :disabled="form9062ListFiles.length > 0"
                                @click="chooseFile(FormT.upload9061)">
                                <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />
                                Upload
                            </fs-button>
                        </div>
    
                        <div class="my-3" v-if="supportDocumentListFiles.length === 0">
                            <fs-button variant="outline-primary" class="me-4" :disabled="supportDocumentListFiles.length > 0"
                                @click="chooseFile(FormT.supportingDocuments)">
                                <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />
                                Supporting Document
                            </fs-button>
                        </div>
                    </div>
    
                    <!-- 9062 form -->
                    <div class="my-2">
                        <span class="fw-bold me-2">Form 9062 </span>
                        <span>| Conditional Certification Work Opportunity Tax Credit</span>
                    </div>
    
                    <fs-row class="border mb-3" style="border-radius: 8px">
                        <fs-col xl="2" lg="3" class="px-4 py-3">
                            <div class="d-flex align-items-center gap-2 h-100">
                                <fs-link class="text-task-cyan"
                                    @click="handleDownloadStaticFile(StaticFiles.FORM_9062, false)">Download</fs-link>
                                <fs-link class="text-task-cyan"
                                    @click="handleDownloadStaticFile(StaticFiles.WOTC_9062_INSTRUCTIONS, false)">Instruction</fs-link>
                            </div>
                        </fs-col>
                        <fs-col xl="10" lg="9" class="border-left ps-4 py-3">
                            <div class="d-flex justify-content-between w-100">
                                <div v-if="form9062ListFiles.length > 0" class="w-100">
                                    <a v-for="file in form9062ListFiles" :key="file.fileName"
                                        class="d-flex justify-content-between my-2 w-100">
                                        <span>
                                            <font-awesome-icon :icon="['fal', 'paperclip']" class="text-task-cyan" /><span
                                                @click="handlePreviewFile(file)" class="ms-2">{{
                                                    truncateFileName(file.fileName)
                                                }}</span>
                                        </span>
                                        <font-awesome-icon :icon="faTrashCan" class="text-danger ms-3 px-1"
                                            @click="handleRemoveFileItem(file)" />
                                    </a>
                                </div>
                                <div v-if="form9062ListFiles.length === 0" class="d-flex align-items-center">No file has been
                                    uploaded</div>
                                <input multiple id="upload9062" type="file"
                                    @change="(event) => handleUploadFile('upload9062', event)" hidden ref="upload9062"
                                    accept="pdf" />
                                <div @click="chooseFile(FormT.upload9062)">
                                    <fs-button variant="outline-primary" class="me-4" v-if="form9062ListFiles.length === 0"
                                        :disabled="form9061ListFiles.length > 0">
                                        <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />
                                        Upload
                                    </fs-button>
                                </div>
                            </div>
                        </fs-col>
                    </fs-row>
                    <div class="my-3" v-if="form9062ListFiles.length > 0">
                        <fs-button variant="outline-primary" class="me-4" :disabled="form9061ListFiles.length > 0"
                            @click="chooseFile(FormT.upload9062)">
                            <font-awesome-icon :icon="['fal', 'arrow-up-from-bracket']" class="me-2" />
                            Upload
                        </fs-button>
                    </div>
    
                    <div>
                        <div class="fw-bold">Notes</div>
                        <fs-input type="fsTextArea" :rules="{ required: false }" name="note" v-model="formData.note" />
                    </div>
                </div>
                <div v-if="responsive.mobile">
                    <div>
                        <!-- 8850 form -->
                        <fs-card no-body class="h-100 mb-4" style="font-size: 14px">
                            <fs-card-header header-bg-variant="transparent"
                                class="fw-bold p-3 d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <font-awesome-icon :icon="['fal', 'file-signature']" class="text-task-cyan" size="lg" />
                                    Form 8850
                                </div>
                                <div class="d-flex align-items-center">
                                    <fs-button v-if="form8850ListFiles.length > 0" variant="link" class="text-decoration-none"
                                        @click="chooseFile('upload8850')">Upload</fs-button>
                                    <input multiple id="upload8850" type="file"
                                        @change="(event) => handleUploadFile('upload8850', event)" hidden ref="upload8850"
                                        accept="pdf" />
                                    <fs-dropdown size="lg" variant="link" no-caret>
                                        <template #button-content>
                                            <font-awesome-icon :icon="['fas', 'circle-ellipsis']" size="lg" />
                                        </template>
                                        <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.WOTC_8850_INSTRUCTIONS, false)">
                                            <font-awesome-icon :icon="['fal', 'memo']" />
                                            Instructions</fs-dropdown-item>
                                        <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.FORM_8850, false)">
                                            <font-awesome-icon :icon="['fal', 'download']" />
                                            Download</fs-dropdown-item>
                                    </fs-dropdown>
                                </div>
                            </fs-card-header>
                            <fs-card-body class="p-0">
                                <div v-if="form8850ListFiles.length > 0" class="p-3">
                                    <div v-for="file in form8850ListFiles" :key="file.fileName" class="mb-2">
                                        <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                                            <fs-link @click="handlePreviewFile(file)"
                                                class="d-flex gap-2 align-items-center text-decoration-none text-black">
                                                <span style="flex: 1"> {{ truncateFileName(file.fileName) }}</span>
                                            </fs-link>
                                            <div style="display: inline; cursor: pointer" @click="handleRemoveFileItem(file)">
                                                <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="p-3 d-flex flex-column align-items-center gap-3">
                                    <div class="text-status-inactive">
                                        No file has been uploaded.
                                    </div>
                                    <fs-button variant="outline-green" @click="chooseFile('upload8850')">
                                        <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                                        Upload</fs-button>
                                    <input multiple id="upload8850" type="file"
                                        @change="(event) => handleUploadFile('upload8850', event)" hidden ref="upload8850"
                                        accept="pdf" />
                                </div>
                            </fs-card-body>
                        </fs-card>
    
                        <!-- 9061 form  -->
                        <fs-card no-body class="h-100 mb-4" style="font-size: 14px">
                            <fs-card-header header-bg-variant="transparent"
                                class="fw-bold p-3 d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <font-awesome-icon :icon="['fal', 'file-signature']" class="text-cornflower-blue-dark"
                                        size="lg" />
                                    Form 9061
                                </div>
                                <div class="d-flex align-items-center">
                                    <fs-button v-if="form9061ListFiles.length > 0" variant="link" class="text-decoration-none"
                                        @click="chooseFile('upload9061')">Upload</fs-button>
                                    <input multiple id="upload9061" type="file"
                                        @change="(event) => handleUploadFile('upload9061', event)" hidden ref="upload9061"
                                        accept="pdf" />
                                    <fs-dropdown size="lg" variant="link" no-caret>
                                        <template #button-content>
                                            <font-awesome-icon :icon="['fas', 'circle-ellipsis']" size="lg" />
                                        </template>
                                        <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.WOTC_9061_INSTRUCTIONS, false)">
                                            <font-awesome-icon :icon="['fal', 'memo']" />
                                            Instructions</fs-dropdown-item>
                                        <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.FORM_9061, false)">
                                            <font-awesome-icon :icon="['fal', 'download']" />
                                            Download</fs-dropdown-item>
                                    </fs-dropdown>
                                </div>
                            </fs-card-header>
                            <fs-card-body class="p-0">
                                <div v-if="form9061ListFiles.length > 0" class="p-3">
                                    <div v-for="file in form9061ListFiles" :key="file.fileName" class="mb-2">
                                        <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                                            <fs-link @click="handlePreviewFile(file)"
                                                class="d-flex gap-2 align-items-center text-decoration-none text-black">
                                                <span style="flex: 1"> {{ truncateFileName(file.fileName) }}</span>
                                            </fs-link>
                                            <div style="display: inline; cursor: pointer" @click="handleRemoveFileItem(file)">
                                                <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="p-3 d-flex flex-column align-items-center gap-3">
                                    <div class="text-status-inactive">
                                        No file has been uploaded.
                                    </div>
                                    <fs-button variant="outline-green" :disabled="form9062ListFiles.length > 0"
                                        @click="chooseFile('upload9061')">
                                        <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                                        Upload</fs-button>
                                    <input multiple id="upload9061" type="file"
                                        @change="(event) => handleUploadFile('upload9061', event)" hidden ref="upload9061"
                                        accept="pdf" />
                                </div>
                            </fs-card-body>
                        </fs-card>
    
                        <!-- 9062 form -->
                        <fs-card no-body class="h-100 mb-4" style="font-size: 14px">
                            <fs-card-header header-bg-variant="transparent"
                                class="fw-bold p-3 d-flex align-items-center justify-content-between">
                                <div class="d-flex align-items-center gap-2">
                                    <font-awesome-icon :icon="['fal', 'file-signature']" class="text-task-violet" size="lg" />
                                    Form 9062
                                </div>
                                <div class="d-flex align-items-center">
                                    <fs-button v-if="form9062ListFiles.length > 0" variant="link" class="text-decoration-none"
                                        @click="chooseFile('upload9062')">Upload</fs-button>
                                    <input multiple id="upload9062" type="file"
                                        @change="(event) => handleUploadFile('upload9062', event)" hidden ref="upload9062"
                                        accept="pdf" />
                                    <fs-dropdown size="lg" variant="link" no-caret>
                                        <template #button-content>
                                            <font-awesome-icon :icon="['fas', 'circle-ellipsis']" size="lg" />
                                        </template>
                                        <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.WOTC_9062_INSTRUCTIONS, false)">
                                            <font-awesome-icon :icon="['fal', 'memo']" />
                                            Instructions</fs-dropdown-item>
                                        <fs-dropdown-item @click="handleDownloadStaticFile(StaticFiles.FORM_9062, false)">
                                            <font-awesome-icon :icon="['fal', 'download']" />
                                            Download</fs-dropdown-item>
                                    </fs-dropdown>
                                </div>
                            </fs-card-header>
                            <fs-card-body class="p-0">
                                <div v-if="form9062ListFiles.length > 0" class="p-3">
                                    <div v-for="file in form9062ListFiles" :key="file.fileName" class="mb-2">
                                        <div class="d-flex align-items-center flex-1 w-100 justify-content-between">
                                            <fs-link @click="handlePreviewFile(file)"
                                                class="d-flex gap-2 align-items-center text-decoration-none text-black">
                                                <span style="flex: 1"> {{ truncateFileName(file.fileName) }}</span>
                                            </fs-link>
                                            <div style="display: inline; cursor: pointer" @click="handleRemoveFileItem(file)">
                                                <font-awesome-icon :icon="faTrashCan" class="text-danger" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-else class="p-3 d-flex flex-column align-items-center gap-3">
                                    <div class="text-status-inactive">
                                        No file has been uploaded.
                                    </div>
                                    <fs-button variant="outline-green" :disabled="form9061ListFiles.length > 0"
                                        @click="chooseFile('upload9062')">
                                        <font-awesome-icon :icon="['fal', 'upload']" size="lg" class="me-2" />
                                        Upload</fs-button>
                                    <input multiple id="upload9062" type="file"
                                        @change="(event) => handleUploadFile('upload9062', event)" hidden ref="upload9062"
                                        accept="pdf" />
                                </div>
                            </fs-card-body>
                        </fs-card>
                    </div>
                    <div>
                        <div class="fw-bold">Notes</div>
                        <fs-input type="fsTextArea" :rules="{ required: false }" name="note" v-model="formData.note" />
                    </div>
                </div>
            </VeeForm>
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
</template>
<style scoped>
:deep(.row) {
    margin-left: 0;
    margin-right: 0;
}

.title {
    font-size: 18px;
}

.w-max {
    max-width: 700px;
}

label {
    font-size: 14px;
    line-height: 22px;
    font-weight: 600;
}

.text-justify {
    text-align: justify;
}

.border-left {
    border-left: 1px solid #E1E4E8;
}

:deep(.form-check-input:checked) {
    background-color: #03A9F4;
    border-color: #03A9F4;
}
.form_header {
    position: sticky; 
    top: 0; 
    z-index: 999; 
    height: 80px;
    border-bottom: 1px solid #E1E4E8;
}
</style>