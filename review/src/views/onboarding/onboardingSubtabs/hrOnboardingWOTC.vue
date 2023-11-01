<script lang="ts" setup>
import { useAlerts } from '@/composables/useAlerts';
import { useBreakpoints } from '@/composables/useBreakpoints';
import { FormField } from '@/enums/FormField';
import { DocumentTypes, makeDocumentPath } from '@/helper/hqSuite/pathHelper';
import { HrOnboardingWOTC } from '@/models/onboarding/WOTC/OnboardingHrWOTC';
import { FormT } from '@/models/onboarding/WOTC/OnboardingQuickHireWOTC';
import { UploadPayload } from '@/models/onboarding/WOTC/UploadPayload';
import { useOnboardingHrWOTCStore } from '@/stores/WOTC/onboardingHrWOTCStore';
import { useAzureB2CAuthStore } from '@/stores/azureB2CAuthStore';
import { useHQSuiteStore } from '@/stores/hqSuiteStore';
import { useLoadingStore } from '@/stores/loadingStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { library } from '@fortawesome/fontawesome-svg-core';
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import {
    faArrowUpFromBracket,
    faArrowUpRightFromSquare,
    faCity,
    faFilePdf,
    faFloppyDisk,
    faPaperclip,
    faPenToSquare,
    faTrashCan,
    faUser,
    faUpload,
    faHourglassHalf
} from "@fortawesome/pro-light-svg-icons";
import { faAsterisk } from '@fortawesome/pro-solid-svg-icons';
import { cloneDeep, isEqual } from 'lodash';
import { storeToRefs } from 'pinia';
import { computed, onBeforeMount, ref, watch } from 'vue';
import { onBeforeRouteLeave, useRouter, useRoute } from 'vue-router';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { isFileSizeValid } from '@/utilities/fileUtils';
import { StaticFiles } from '@/enums/StaticFiles';

library.add(faFloppyDisk, faAsterisk, faUpload, faPaperclip, faTrashCan, faArrowUpFromBracket, faFilePdf, faPenToSquare, faArrowUpFromBracket, faArrowUpRightFromSquare, faUser, faCity, faHourglassHalf);


const { getDocumentTemplate } = useReportTemplate();
const route = useRoute();
const hqSuiteStore = useHQSuiteStore();
const azureB2CAuthStore = useAzureB2CAuthStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { getOnboardingSideNavItems, markOnboardingSidenavItemAsDone, getEmployeeFormSubmit } = useOnboardingStore();
const { setLoading } = useLoadingStore();
const { getOnboardingHrWOTC,
    updateOnboardingHrWOTC,
    get8850EssStatus,
    get8850HrStatus,
    get9061EssStatus,
    get9061HrStatus } = useOnboardingHrWOTCStore();
const { onboardingHrWOTC } = storeToRefs(useOnboardingHrWOTCStore());
const { is8850EssDone, is9061EssDone, is8850HrDone, is9061HrDone, is8850DoneByFile, is9061DoneByFile, is9062Done } = storeToRefs(useOnboardingHrWOTCStore());
const { notifyError, notifySuccess } = useAlerts();
const clientId = computed(
    () => azureB2CAuthStore?.activeUserClient?.clientGuid ?? "Shared"
);
const { responsive } = useBreakpoints();
const tabIndex = ref(0);
const isFormChanged = ref(false);
const renderedFormData = ref(null);
const currentNavItem = ref(null);
const employeeId = computed(() => Number(route.params.id));
const formIdSummary = FormField.WOTCOnboardSummary;
const formId8850Ess = FormField.WOTC8850Employee;
const formId8850Hr = FormField.WOTC8850Employer;
const formId9061Ess = FormField.WOTC9061Employee;
const formId9061Hr = FormField.WOTC9061Employer;
const router = useRouter();
const formFileId = ref(null)
const upload8850 = ref(null);
const upload9061 = ref(null);
const upload9062 = ref(null);
const isLoaded = ref(false);
const isEmployeeFormSubmitted = ref(false);
const formRef = ref(null);
const openSaveChangeModal = ref(false);
const toPath = ref("");
const isForcePush = ref(false);

const formData = ref({
    noteForm8850: '',
    noteForm9061: '',
    noteForm9062: '',
    formFiles: '',
    uploadFileStateForms: [],
})

const uploadFormData = ref<Partial<UploadPayload<HrOnboardingWOTC>>>({
    fieldModels: [],
    uploadFileStateForms: [],
    formId: formIdSummary,
    employeeId: employeeId.value
})

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

const handleUploadFile = async (formType: string, event: Event) => {
    setLoading(true);
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
        }
        if (!isFileSizeValid(files[i])) {
            setLoading(false);
            return;
        }
        const pathForEmployeeDoc = await makeDocumentPath(
            DocumentTypes.HrOnboardWotc,
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

    setLoading(false);
};

const chooseFile = (uploadFormId: string) => {
    const element = document.getElementById(uploadFormId) as HTMLInputElement;
    element.value = "";
    element.click();
};

const handleRemoveFileItem = (file: any) => {
    setLoading(true);
    const removeFileName = file.fileName;
    uploadFormData.value.uploadFileStateForms = uploadFormData.value.uploadFileStateForms.filter((file) => file.fileName !== removeFileName);
    if (!file.fileObject) {
        removedUploadFiles.value.push(`${file.filePath}/${file.fileName}`)
    }
    setLoading(false)
};

const handleSubmitForm = async (isNextForm: boolean) => {
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
        uploadFormData.value.uploadFileStateForms = []
    }
    const { uploadFileStateForms, ..._formData } = formData.value
    Object.keys(_formData).forEach((fieldName: string) => {
        uploadFormData.value.fieldModels.find((item) => item.fieldKey === fieldName).fieldValue = _formData[fieldName]
    })
    await updateOnboardingHrWOTC(employeeId.value, uploadFormData.value)
    notifySuccess('Information updated.')
    await getOnboardingHrWOTC(employeeId.value, formIdSummary)
    
    const is8850DoneByForm = is8850EssDone.value && is8850HrDone.value
    const is9061DoneByForm = is9061EssDone.value && is9061HrDone.value
    const group8850Done = is8850DoneByForm || is8850DoneByFile.value
    const group9061Done = is9061DoneByForm || is9061DoneByFile.value
    if (group8850Done && (group9061Done || is9062Done.value)) {
        await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, true, employeeId.value)
    } else {
        await markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, false, employeeId.value)
    }

    if (isNextForm) {
        isForcePush.value = true;
        router.push({ name: 'onboardingTaxWithHoldingInfoHR' });
    }
    setLoading(false);
}

const handlePreviewFile = async (file: any) => {
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
}

const handleDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
    isForcePush.value = true;
    router.push(toPath.value);
};

const handleCancelDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
};

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

onBeforeMount(async () => {
    setLoading(true)
    await Promise.all([
        getOnboardingSideNavItems(employeeId.value),
        getOnboardingHrWOTC(employeeId.value, formIdSummary),
        get8850EssStatus(employeeId.value, formId8850Ess),
        get8850HrStatus(employeeId.value, formId8850Hr),
        get9061EssStatus(employeeId.value, formId9061Ess),
        get9061HrStatus(employeeId.value, formId9061Hr),
    ])
    isEmployeeFormSubmitted.value = await getEmployeeFormSubmit(employeeId.value)
    onboardingHrWOTC.value.fieldModels.forEach((item) => {
        const newKey = item.fieldKey as keyof HrOnboardingWOTC
        formData.value[newKey] = item.fieldValue as never

        uploadFormData.value.fieldModels.push(({
            formFieldId: item.formFieldId,
            fieldKey: item.fieldKey,
            fieldValue: item.fieldValue
        }))
    })
    currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === 'onboardingWOTC'.trim().toLocaleLowerCase())
    uploadFormData.value.uploadFileStateForms = [...onboardingHrWOTC.value.uploadFileStateForms]
    formData.value.uploadFileStateForms = [...onboardingHrWOTC.value.uploadFileStateForms]
    renderedFormData.value = cloneDeep(formData.value);
    isLoaded.value = true;
    setLoading(false)
})

watch([() => uploadFormData.value.uploadFileStateForms, () => formData.value.noteForm8850], () => {
    formData.value.uploadFileStateForms = [...uploadFormData.value.uploadFileStateForms]
    if (!isEqual(formData.value, renderedFormData.value)) {
        isFormChanged.value = true;
    } else {
        isFormChanged.value = false;
    }
}, {
    deep: true,
})

const getHrTextClass = (isSubmitted: boolean, isFormDone: boolean) => {
    if (!isFormDone) {
        return { cls: 'text-status-inactive', text: 'Not Started' }
    }

    if (isFormDone && !isSubmitted) {
        return { cls: 'text-orange', text: 'In progress' }
    }

    if (isFormDone && isSubmitted) {
        return { cls: 'text-success', text: 'Completed' }
    }
}

const goTo = (route: string, isFormDone: boolean) => {
    isFormDone && router.push({ name: route })
}

</script>
<template>
    <div class="">
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
            <fs-row align-v="center">
                <fs-col class="truncate-text">
                    <h2 class="hq-pg__title">WOTC<span v-if="isLoaded && !responsive.mobile">| Work Opportunity Tax Credit</span></h2>
                </fs-col>
                <fs-col cols="auto" class="ms-auto">
                    <fs-button variant="outline-primary" @click="handleSubmitForm(false)"
                    :disabled="!isFormChanged">
                    <font-awesome-icon :icon="['fal', 'floppy-disk']" class="me-2" /> SAVE
                    </fs-button>
                    <fs-button variant="primary" @click="handleSubmitForm(true)"
                        :disabled="!isFormChanged">
                        SAVE & NEXT
                </fs-button>
                </fs-col>
            </fs-row>
            
        </fs-container>
        <VeeForm ref="formRef">
            <!-- desktop screen -->
            <fs-container class="contain my-4" v-if="isLoaded && !responsive.mobile">
                <div class="mb-4">
                    <div class="d-flex justify-content-between">
                        <span>
                            <span class="fw-bold">Form 8850 </span>
                            <span>| Pre-Screening Notice and Certification Request for the Work Opportunity Credit</span>
                        </span>
                        <fs-link class="text-task-cyan"
                            @click="handleDownloadStaticFile(StaticFiles.WOTC_8850_INSTRUCTIONS, false)">Form 8850
                            Instructions</fs-link>
                    </div>
                    <div class="bg-white rounded d-flex justify-content-between align-items-center border px-3 py-4 mt-3">
                        <div class="d-flex gap-2 algin-items-center">
                            <font-awesome-icon :icon="['fal', 'user']" style="font-size: 20px" class="text-cornflower-blue-dark" />
                            <div class="fw-bold">Form 8850 | Employee’s Section</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between" style="width: 170px">
                            <span class="d-flex align-items-center">
                                <font-awesome-icon :icon="['fas', 'circle']" class="me-2"
                                :class="getHrTextClass(isEmployeeFormSubmitted, is8850EssDone).cls"
                                style="font-size: 8px" />
                                <span>
                                    {{ getHrTextClass(isEmployeeFormSubmitted, is8850EssDone).text }}
                                </span>
                            </span>
                            <fs-button class="ms-2" variant="outline-success" :to="{ name: 'hrOnboardingWOTC8850Ess' }">
                                VIEW
                            </fs-button>
                        </div>
                    </div>
                    <div class="bg-white rounded d-flex justify-content-between align-items-center border px-3 py-4 mt-3">
                        <div class="d-flex gap-2 algin-items-center">
                            <font-awesome-icon :icon="['fal', 'city']" style="font-size: 20px" class="text-task-blue" />
                            <div class="fw-bold">Form 8850 | Employer’s Section</div>
                        </div>
                        <div class="d-flex align-items-center justify-content-between" style="width: 170px">
                            <span class="d-flex align-items-center">
                                <font-awesome-icon :icon="['fas', 'circle']" class="me-2"
                                :class="is8850HrDone ? 'text-success' : 'text-status-inactive'" style="font-size: 8px" />
                                <span>
                                    {{ is8850HrDone ? "Completed" : "Not Started" }}
                                </span>
                            </span>
                            <fs-button class="ms-2" :variant="is8850HrDone ? 'outline-success' : 'success'"
                                @click="goTo('hrOnboardingWOTC8850Hr', is8850EssDone && isEmployeeFormSubmitted)" :disabled="!is8850EssDone || !isEmployeeFormSubmitted">
                                {{ is8850HrDone ? 'EDIT' : 'START' }}
                            </fs-button>
                        </div>
                    </div>

                    <div class="my-3 border" v-if="form8850ListFiles.length > 0">
                        <fs-row>
                            <fs-col xl="3">
                                <div class="py-4 border-right h-100 d-flex flex-column justify-content-between ps-2">
                                    <div class="h-100">
                                        <div class="me-4 h-100 d-flex flex-column justify-content-center">
                                            <div variant="outline" class="bg-white fw-bold">
                                                <font-awesome-icon :icon="['fal', 'upload']"
                                                    class="me-2 text-boat-orchid" />
                                                Form 8850 Upload
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </fs-col>
                            <fs-col xl="9">
                                <div v-if="form8850ListFiles.length > 0" class="px-3 h-100 d-flex flex-column gap-3 py-3">
                                    <div v-for="file in form8850ListFiles" :key="file.fileName"
                                        class="d-flex w-100 justify-content-between align-items-center h-100">
                                        <span><font-awesome-icon :icon="['fal', 'paperclip']" class="text-task-cyan me-2"
                                                style="font-size: 16px" /><span @click="handlePreviewFile(file)"
                                                class="ms-2">{{
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

                    <div class="h-100 d-flex flex-column justify-content-between"
                        :class="form8850ListFiles.length === 0 ? 'mt-3' : ''">
                        <input multiple id="upload8850" type="file"
                            @change="(event) => handleUploadFile('upload8850', event)" hidden ref="upload8850"
                            accept="pdf" />
                        <div>
                            <fs-button variant="outline-success" @click="chooseFile(FormT.upload8850)">
                                <font-awesome-icon :icon="['fal', 'upload']" class="me-2" />
                                Form 8850
                            </fs-button>
                        </div>
                    </div>
                </div>

                <div class="py-3 mb-4">
                    <div class="d-flex align-items-center justify-content-between mb-2">
                        <span>
                            <span class="fw-bold">Form 9061 </span>
                            <span class="">| Individual Characteristics Form (ICF) Work Opportunities Tax Credit</span>
                        </span>
                        <fs-link class="text-task-cyan"
                            @click="handleDownloadStaticFile(StaticFiles.WOTC_9061_INSTRUCTIONS, false)">Form 9061
                            Instructions</fs-link>
                    </div>
                    <div v-if="is8850HrDone">
                        <div class="rounded d-flex justify-content-between align-items-center border px-3 py-4 mt-3">
                            <div class="d-flex gap-2 algin-items-center">
                                <font-awesome-icon :icon="['fal', 'user']" style="font-size: 20px" class="text-cornflower-blue-dark" />
                                <div class="fw-bold">Form 9061 | Employee’s Section</div>
                            </div>
                            <div class="d-flex align-items-center justify-content-between" style="width: 170px">
                                <span class="d-flex align-items-center">
                                    <font-awesome-icon :icon="['fas', 'circle']" class="me-2"
                                    :class="getHrTextClass(isEmployeeFormSubmitted, is9061EssDone).cls"
                                    style="font-size: 8px" />
                                    <span>
                                        {{ getHrTextClass(isEmployeeFormSubmitted, is9061EssDone).text }}
                                    </span>
                                </span>
                                <fs-button class="ms-2" variant="outline-success" :to="{ name: 'hrOnboardingWOTC9061Ess' }">
                                    VIEW
                                </fs-button>
                            </div>
                        </div>
                        <div class="rounded d-flex justify-content-between align-items-center border px-3 py-4 mt-3">
                            <div class="d-flex gap-2 algin-items-center">
                                <font-awesome-icon :icon="['fal', 'city']" style="font-size: 20px" class="text-task-blue" />
                                <div class="fw-bold">Form 9061 | Employer’s Section</div>
                            </div>
                            <div class="d-flex align-items-center justify-content-between" style="width: 170px">
                                <span class="d-flex align-items-center">
                                    <font-awesome-icon :icon="['fas', 'circle']" class="me-2"
                                    :class="is9061HrDone ? 'text-success' : 'text-status-inactive'" style="font-size: 8px" />
                                    <span>{{ is9061HrDone ? "Completed" :
                                    "Not Started" }}</span>
                                </span>
                                <fs-button class="ms-2" :variant="is9061HrDone ? 'outline-success' : 'success'"
                                    @click="goTo('hrOnboardingWOTC9061Hr', is9061EssDone && isEmployeeFormSubmitted)" :disabled="!is9061EssDone || !isEmployeeFormSubmitted">
                                    {{ is9061HrDone ? 'EDIT' : 'START' }}
                                </fs-button>

                            </div>
                        </div>

                        <div class="my-3 border" v-if="form9061ListFiles.length > 0">
                            <fs-row>
                                <fs-col xl="3">
                                    <div class="py-4 border-right h-100 d-flex flex-column justify-content-between ps-2">
                                        <div class="me-4 h-100 d-flex flex-column justify-content-center fw-bold">
                                            <div>
                                                <font-awesome-icon :icon="['fal', 'upload']"
                                                    class="me-2 text-boat-orchid" />
                                                Form 9061 Upload
                                            </div>
                                        </div>
                                    </div>
                                </fs-col>
                                <fs-col xl="9">
                                    <div v-if="form9061ListFiles.length > 0"
                                        class="px-3 h-100 d-flex flex-column gap-3 py-3">
                                        <div v-for="file in form9061ListFiles" :key="file.fileName"
                                            class="d-flex w-100 justify-content-between align-items-center h-100">
                                            <span><font-awesome-icon :icon="['fal', 'paperclip']"
                                                    class="text-task-cyan me-2" style="font-size: 16px" /><span
                                                    @click="handlePreviewFile(file)" class="ms-2">{{
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

                        <div class="my-3 border" v-if="supportDocumentListFiles.length > 0">
                            <fs-row>
                                <fs-col xl="3">
                                    <div class="py-4 border-right h-100 d-flex flex-column justify-content-between ps-2">
                                        <div class="me-4 h-100 d-flex flex-column justify-content-center fw-bold">
                                            <div>
                                                <font-awesome-icon :icon="['fal', 'upload']"
                                                    class="me-2 text-task-violet" />
                                                Supporting Documents
                                            </div>
                                        </div>
                                    </div>
                                </fs-col>
                                <fs-col xl="9">
                                    <div v-if="supportDocumentListFiles" class="px-3 h-100 d-flex flex-column gap-3 py-3">
                                        <div v-for="file in supportDocumentListFiles" :key="file.fileName"
                                            class="d-flex w-100 justify-content-between align-items-center h-100">
                                            <span><font-awesome-icon :icon="['fal', 'paperclip']"
                                                    class="text-task-cyan me-2" style="font-size: 16px" /><span
                                                    @click="handlePreviewFile(file)" class="ms-2">{{
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

                        <div class="d-flex gap-3 mt-3">
                            <div class="h-100 d-flex flex-column justify-content-between">
                                <input multiple id="upload9061" type="file"
                                    @change="(event) => handleUploadFile('upload9061', event)" hidden ref="upload9061"
                                    accept="pdf" />
                                <div @click="chooseFile(FormT.upload9061)">
                                    <fs-button variant="outline-success">
                                        <font-awesome-icon :icon="['fal', 'upload']" class="me-2" />
                                        Form 9061
                                    </fs-button>
                                </div>
                            </div>

                            <div class="h-100 d-flex flex-column justify-content-between">
                                <input multiple id="supportingDocuments" type="file"
                                    @change="(event) => handleUploadFile('supportingDocuments', event)" hidden
                                    ref="supportingDocuments" accept="pdf" />
                                <div @click="chooseFile(FormT.supportingDocuments)">
                                    <fs-button variant="outline-success">
                                        <font-awesome-icon :icon="['fal', 'upload']" class="me-2" />
                                        Supporting Documents
                                    </fs-button>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div v-else>
                        <div class="d-flex align-items-center border px-3 py-4">
                            <font-awesome-icon :icon="['fal', 'hourglass-half']" style="font-size: 16px"
                                class="text-task-orange me-3" />
                            <div class="text-status-inactive font-italic">Waiting on Form 8850 to be completed</div>
                        </div>
                    </div>
                </div>

                <div class="py-3">
                    <div class="d-flex justify-content-between mb-2">
                        <span>
                            <span class="fw-bold">Form 9062 </span><span>| Conditional Certification Work Opportunity
                                Tax Credit</span>
                        </span>
                        <fs-link class="text-task-cyan"
                            @click="handleDownloadStaticFile(StaticFiles.WOTC_9062_INSTRUCTIONS, false)">Form 9062
                            Instructions</fs-link>
                    </div>
                    <div class="mt-3" v-if="is8850HrDone">

                        <div class="my-3 border" v-if="form9062ListFiles.length > 0">
                            <fs-row>
                                <fs-col xl="3">
                                    <div
                                        class="py-4 border-right h-100 d-flex flex-column justify-content-between ps-2 h-100">
                                        <div class="me-4 h-100 fw-bold d-flex flex-column justify-content-center">
                                            <div>
                                                <font-awesome-icon :icon="['fal', 'upload']"
                                                    class="me-2 text-boat-orchid" />
                                                Form 9062 Upload
                                            </div>
                                        </div>
                                    </div>
                                </fs-col>
                                <fs-col xl="9">
                                    <div v-if="form9062ListFiles.length > 0"
                                        class="px-3 h-100 d-flex flex-column gap-3 py-3">
                                        <div v-for="file in form9062ListFiles" :key="file.fileName"
                                            class="d-flex w-100 justify-content-between align-items-center h-100">
                                            <span><font-awesome-icon :icon="['fal', 'paperclip']"
                                                    class="text-task-cyan me-2" style="font-size: 16px" /><span
                                                    @click="handlePreviewFile(file)" class="ms-2">{{
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

                        <div class="h-100 d-flex flex-column justify-content-between"
                            :class="form9062ListFiles.length === 0 ? 'mt-3' : ''">
                            <input multiple id="upload9062" type="file"
                                @change="(event) => handleUploadFile('upload9062', event)" hidden ref="upload9062"
                                accept="pdf" />
                            <div>
                                <fs-button variant="outline-success" @click="chooseFile(FormT.upload9062)">
                                    <font-awesome-icon :icon="['fal', 'upload']" class="me-2" />
                                    Form 9062
                                </fs-button>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class="d-flex align-items-center border px-3 py-4">
                            <font-awesome-icon :icon="['fal', 'hourglass-half']" style="font-size: 16px"
                                class="text-task-orange me-3" />
                            <div class="text-status-inactive font-italic">Waiting on Form 8850 to be completed</div>
                        </div>
                    </div>
                </div>

                <div class="mt-3">
                    <fs-input type="fsTextArea" label="Note" v-model="formData.noteForm8850" name="note8850" :rows="3" />
                </div>

            </fs-container>
            <!-- mobile screen -->
            <div class="h-100" v-if="isLoaded && responsive.mobile">
                <fs-tabs content-class="mt-3 h-100" v-model="tabIndex" active-nav-item-class="border-0" justified
                    class="h-100">
                    <fs-tab active>
                        <template #title>
                            <div class="d-flex align-items-center gap-2 fw-bold">
                                <div class="tab-header">1</div>
                                <div class="text-black">Form 8850</div>
                            </div>
                        </template>
                        <div class="form-bg p-3 h-100">
                            <div class="d-flex justify-content-between align-items-center pb-2">
                                <span class="fw-bold">Form 8850</span>
                                <fs-link class="text-task-cyan"
                                    @click="handleDownloadStaticFile(StaticFiles.WOTC_8850_INSTRUCTIONS, false)">Instructions</fs-link>
                            </div>
                            <div class="bg-white border">
                                <div
                                    class="px-3 py-2 border-bottom d-flex justify-content-between align-items-center gap-2">
                                    <div>
                                        <font-awesome-icon :icon="['fal', 'user']" class="text-cornflower-blue-dark me-2"
                                            style="font-size: 14px" />
                                        <span class="fw-bold">Employee</span>
                                    </div>
                                    <div>
                                        <fs-button variant="outline-success">VIEW</fs-button>
                                    </div>
                                </div>
                                <div class="p-3 d-flex align-items-center">
                                    <font-awesome-icon :icon="['fas', 'circle']" class="me-2" :class="getHrTextClass(isEmployeeFormSubmitted, is8850EssDone).cls
                                        " style="font-size: 8px" />
                                    <span>
                                        {{
                                            getHrTextClass(isEmployeeFormSubmitted, is8850EssDone)
                                                .text
                                        }}
                                    </span>
                                </div>
                            </div>
                            <div class="bg-white border mt-4">
                                <div
                                    class="px-3 py-2 border-bottom d-flex justify-content-between align-items-center gap-2">
                                    <div>
                                        <font-awesome-icon :icon="['fal', 'city']" class="text-task-cyan me-2"
                                            style="font-size: 14px" />
                                        <span class="fw-bold">Employer</span>
                                    </div>
                                    <div>
                                        <fs-button :variant="is8850HrDone ? 'outline-success' : 'success'" :disabled="true">
                                            {{ is8850HrDone ? "EDIT" : "START" }}
                                        </fs-button>
                                    </div>
                                </div>
                                <div class="p-3 d-flex align-items-center">
                                    <font-awesome-icon :icon="['fas', 'circle']" class="me-2" :class="getHrTextClass(isEmployeeFormSubmitted, is8850EssDone).cls
                                        " style="font-size: 8px" />
                                    <span>
                                        {{ is8850HrDone ? "Completed" : "Not Started" }}
                                    </span>
                                </div>
                            </div>
                            <div class="mt-4">
                                <input multiple id="upload8850" type="file"
                                    @change="(event) => handleUploadFile(FormT.upload8850, event)" hidden ref="upload8850"
                                    accept="pdf" />
                                <label for="upload8850" class="me-4 d-inline" v-if="form8850ListFiles.length === 0">
                                    <fs-button variant="primary" @click="chooseFile(FormT.upload8850)"
                                        class="bg-white text-primary">
                                        <font-awesome-icon icon="fa-light fa-arrow-up-from-bracket" class="me-2" />
                                        Form 8850
                                    </fs-button>
                                </label>
                            </div>
                            <div class="mt-4 border bg-white" v-if="form8850ListFiles.length > 0">
                                <div>
                                    <div class="border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
                                        <div class="fw-bold" v-if="form8850ListFiles">
                                            <font-awesome-icon :icon="['fal', 'upload']" class="text-boat-orchid me-2" />
                                            Form 8850 Upload
                                        </div>
                                        <div class="text-success" @click="chooseFile(FormT.upload8850)">Upload</div>
                                    </div>
                                    <div class="px-3 py-2" v-if="form8850ListFiles">
                                        <a v-for="file in form8850ListFiles" :key="file.fileName"
                                            class="mb-2 d-flex justify-content-between align-items-center my-2">
                                            <span>
                                                <span @click="handlePreviewFile(file)">{{
                                                    file?.fileName }}</span>
                                            </span>

                                            <div class="d-inline ms-3 px-1" @click="handleRemoveFileItem(file)">
                                                <font-awesome-icon :icon="faTrashCan" class="text-danger cursor-pointer" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4">
                                <fs-button variant="task-cyan" :disabled="false" @click="tabIndex = 1">FORM 9061
                                    <font-awesome-icon :icon="['fal', 'arrow-right']" class="ms-2" /></fs-button>
                            </div>
                        </div>
                    </fs-tab>
                    <fs-tab>
                        <template #title>
                            <div class="d-flex align-items-center gap-2 fw-bold">
                                <div class="tab-header">2</div>
                                <div class="text-black">Form 9061</div>
                            </div>
                        </template>
                        <div class="form-bg p-3">
                            <div class="d-flex justify-content-between align-items-center pb-2">
                                <span class="fw-bold">Form 9061</span>
                                <fs-link class="text-task-cyan"
                                    @click="handleDownloadStaticFile(StaticFiles.WOTC_9061_INSTRUCTIONS, false)">Instructions</fs-link>
                            </div>
                            <div class="bg-white border">
                                <div
                                    class="px-3 py-2 border-bottom d-flex justify-content-between align-items-center gap-2">
                                    <div>
                                        <font-awesome-icon :icon="['fal', 'user']" class="text-cornflower-blue-dark me-2"
                                            style="font-size: 14px" />
                                        <span class="fw-bold">Employee</span>
                                    </div>
                                    <div>
                                        <fs-button variant="outline-success">VIEW</fs-button>
                                    </div>
                                </div>
                                <div class="p-3 d-flex align-items-center">
                                    <font-awesome-icon :icon="['fas', 'circle']" class="me-2" :class="getHrTextClass(isEmployeeFormSubmitted, is9061EssDone).cls
                                        " style="font-size: 8px" />
                                    <span>
                                        {{
                                            getHrTextClass(isEmployeeFormSubmitted, is9061EssDone)
                                                .text
                                        }}
                                    </span>
                                </div>
                            </div>
                            <div class="bg-white border mt-4">
                                <div
                                    class="px-3 py-2 border-bottom d-flex justify-content-between align-items-center gap-2">
                                    <div>
                                        <font-awesome-icon :icon="['fal', 'city']" class="text-task-cyan me-2"
                                            style="font-size: 14px" />
                                        <span class="fw-bold">Employer</span>
                                    </div>
                                    <div>
                                        <fs-button variant="success" :disabled="true">START</fs-button>
                                    </div>
                                </div>
                                <div class="p-3 d-flex align-items-center">
                                    <font-awesome-icon :icon="['fas', 'circle']" class="me-2" :class="getHrTextClass(isEmployeeFormSubmitted, is9061EssDone).cls
                                        " style="font-size: 8px" />
                                    <span>
                                        {{
                                            getHrTextClass(isEmployeeFormSubmitted, is9061EssDone)
                                                .text
                                        }}

                                    </span>
                                </div>
                            </div>

                            <div class="mt-4 border bg-white" v-if="form9061ListFiles.length > 0">
                                <div>
                                    <div class="border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
                                        <div class="fw-bold">
                                            <font-awesome-icon :icon="['fal', 'upload']" class="text-boat-orchid me-2" />

                                            Form 9061 Upload
                                        </div>
                                        <span class="text-success" @click="chooseFile(FormT.upload9061)">Upload</span>
                                    </div>
                                    <div class="px-3 py-2">
                                        <a v-for="file in form9061ListFiles" :key="file.fileName"
                                            class="mb-2 d-flex justify-content-between align-items-center my-2">
                                            <span>
                                                <span @click="handlePreviewFile(file)">{{
                                                    file?.fileName }}</span>
                                            </span>

                                            <div class="d-inline ms-3 px-1" @click="handleRemoveFileItem(file)">
                                                <font-awesome-icon :icon="faTrashCan" class="text-danger cursor-pointer" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4 border bg-white" v-if="supportDocumentListFiles.length > 0">
                                <div>
                                    <div class="border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
                                        <div class="fw-bold">
                                            <font-awesome-icon :icon="['fal', 'upload']" class="text-task-violet me-2"
                                                style="font-size: 16px" />
                                            Supporting Documents Upload
                                        </div>
                                        <span class="text-success"
                                            @click="chooseFile(FormT.supportingDocuments)">Upload</span>
                                    </div>
                                    <div class="px-3 py-2">
                                        <a v-for="file in supportDocumentListFiles" :key="file.fileName"
                                            class="mb-2 d-flex justify-content-between align-items-center my-2">
                                            <span>
                                                <span @click="handlePreviewFile(file)">{{
                                                    file?.fileName }}</span>
                                            </span>

                                            <div class="d-inline ms-3 px-1" @click="handleRemoveFileItem(file)">
                                                <font-awesome-icon :icon="faTrashCan" class="text-danger cursor-pointer" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div :class="form9061ListFiles.length === 0 ? 'mt-4' : ''">
                                <input multiple id="upload9061" type="file"
                                    @change="(event) => handleUploadFile(FormT.upload9061, event)" hidden ref="upload9061"
                                    accept="pdf" />
                                <label for="upload9061" class="me-4">
                                    <fs-button variant="primary" @click="chooseFile(FormT.upload9061)"
                                        v-if="form9061ListFiles.length === 0" class="bg-white text-primary">
                                        <font-awesome-icon icon="fa-light fa-arrow-up-from-bracket" class="me-2" />
                                        Form 9061
                                    </fs-button>
                                </label>
                            </div>
                            <div :class="supportDocumentListFiles.length === 0 ? 'mt-4' : ''">
                                <input multiple id="supportingDocuments" type="file"
                                    @change="(event) => handleUploadFile(FormT.supportingDocuments, event)" hidden
                                    ref="supportingDocuments" accept="pdf" />
                                <label for="supportingDocuments" class="me-4">
                                    <fs-button variant="primary" @click="chooseFile(FormT.supportingDocuments)"
                                        v-if="supportDocumentListFiles.length === 0" class="bg-white text-primary">
                                        <font-awesome-icon icon="fa-light fa-arrow-up-from-bracket" class="me-2" />
                                        SUPPORTING DOCUMENTS
                                    </fs-button>
                                </label>
                            </div>
                            <div class="mt-4">
                                <fs-button variant="task-cyan" :disabled="false" @click="tabIndex = 2">FORM 9062
                                    <font-awesome-icon :icon="['fal', 'arrow-right']" class="ms-2" /></fs-button>
                            </div>
                        </div>
                    </fs-tab>
                    <fs-tab class="h-100">
                        <template #title>
                            <div class="d-flex align-items-center gap-2 fw-bold">
                                <div class="tab-header">3</div>
                                <div class="text-black">Form 9062</div>
                            </div>
                        </template>
                        <div class="form-bg p-3">
                            <div class="mt-4">
                                <input multiple id="upload9062" type="file"
                                    @change="(event) => handleUploadFile(FormT.upload9062, event)" hidden ref="upload9062"
                                    accept="pdf" />
                                <label for="upload9062" class="me-4" v-if="form9062ListFiles.length === 0">
                                    <fs-button variant="primary" @click="chooseFile(FormT.upload9062)"
                                        class="bg-white text-primary">
                                        <font-awesome-icon icon="fa-light fa-arrow-up-from-bracket" class="me-2" />
                                        Form 9062
                                    </fs-button>
                                </label>
                            </div>
                            <div class="mt-4 bg-white">
                                <div v-if="form9062ListFiles.length > 0">
                                    <div class="border-bottom px-3 py-2 d-flex justify-content-between align-items-center">
                                        <div class="fw-bold">
                                            <font-awesome-icon :icon="['fal', 'upload']" class="text-boat-orchid me-2"
                                                style="font-size: 16px" />
                                            Form 9062 Upload
                                        </div>
                                        <span class="text-success" @click="chooseFile(FormT.upload9062)">Upload</span>
                                    </div>
                                    <div class="px-3 py-2">
                                        <a v-for="file in form9062ListFiles" :key="file.fileName"
                                            class="mb-2 d-flex justify-content-between align-items-center my-2">
                                            <span>
                                                <span @click="handlePreviewFile(file)">{{
                                                    file?.fileName }}</span>
                                            </span>

                                            <div class="d-inline ms-3 px-1" @click="handleRemoveFileItem(file)">
                                                <font-awesome-icon :icon="faTrashCan" class="text-danger cursor-pointer" />
                                            </div>
                                        </a>
                                    </div>
                                </div>
                            </div>
                            <div class="mt-4">
                                <span class="fw-bold">WOTC Notes</span>
                                <fs-input type="fsTextArea" v-model="formData.noteForm8850" :rows="3" name="note"
                                    :rules="{ required: false }" />
                            </div>
                        </div>
                    </fs-tab>
                </fs-tabs>
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
    </div>
</template>
<style scoped lang="scss">
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
    border-left: 1px solid #e1e4e8;
}

:deep(.form-check-input:checked) {
    background-color: #03a9f4;
    border-color: #03a9f4;
}

.sub-text {
    font-style: italic;
    font-weight: 400;
    font-size: 12px;
    color: #6e7c8f;
}

.main-text {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
}

.w-60 {
    width: 75%;
    max-width: 700px;
}

.text-justify {
    text-align: justify;
}

.instruction {
    background-color: rgba(247, 159, 31, 0.06);
    border: dashed 1px rgba(247, 159, 31, 1);
    padding: 12px 14px;
    border-radius: 8px;
}

.form-division {
    background-color: #f7f9fc;
    border-radius: 10px;
}

.form-name {
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    color: #03a9f4;
}

.tab-header {
    color: #bec4cd;
    background-color: white;
    border: #bec4cd solid 1px;
    padding: 2px 8px;
    border-radius: 50%;
}

.nav-link.active>div>.tab-header {
    color: white;
    background-color: #03a9f4;
    border-color: transparent;
}

:deep(.nav-item),
:deep(.nav-item > button) {
    border-top: none !important;
    border-right: none !important;
    border-left: none !important;
}

.form-bg {
    background-color: #eff1f3;
    height: 100%;
}

.border-left {
    border-left: 1px solid #bec4cd;
}

.border-right {
    border-right: 1px solid #bec4cd;
}

.cursor-pointer {
    cursor: pointer;
}

.font-italic {
    font-style: italic;
}
</style>