<script lang="ts" setup>
import SignaturePad from "@/components/common/SignaturePad.vue";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useAlerts } from "@/composables/useAlerts";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { STATES } from "@/constants/common";
import { FormField } from "@/enums/FormField";
import { dataUrlToFile } from "@/helper/hqSuite/formatHelper";
import { OnboardingWOTC9061Hr } from "@/models/onboarding/WOTC/HrOnboardingWOTC9061Hr";
import { UploadPayload } from "@/models/onboarding/WOTC/UploadPayload";
import { useOnboardingWOTC9061Store } from "@/stores/WOTC/onboardingHrWOTC9061HrStore";
import { useOnboardingHrWOTCStore } from "@/stores/WOTC/onboardingHrWOTCStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import moment from "moment";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
faArrowUpFromBracket,
faCircle,
faPaperclip,
faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import {
faAsterisk,
faCircleExclamation,
faPenToSquare,
} from "@fortawesome/pro-solid-svg-icons";
import { fsCurrencyConfig } from "@/utilities/formatUtils";
import { isEqual, omit } from "lodash";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";
import { useHQSuiteStore } from "@/stores/hqSuiteStore";

library.add(
    faCircle,
    faPenToSquare,
    faAsterisk,
    faArrowUpFromBracket,
    faPaperclip,
    faCircleExclamation,
    faTrashCan
);

const route = useRoute();
const formId8850Ess = FormField.WOTC8850Employee;
const formId8850Hr = FormField.WOTC8850Employer;
const formId9061Ess = FormField.WOTC9061Employee;
const formId9061Hr = FormField.WOTC9061Employer;
const employeeId = computed(() => Number(route.params.id));
const {
    is8850EssDone,
    is9061EssDone,
    is8850HrDone,
    is8850DoneByFile,
    is9061DoneByFile,
    is9062Done,
    has9061EmployeeSignature
} = storeToRefs(useOnboardingHrWOTCStore());
const { get8850EssStatus, get8850HrStatus, get9061EssStatus, get9061HrStatus, getOnboardingHrWOTC } =
    useOnboardingHrWOTCStore();

const { fetchForm9061Data, updateForm9061Data } = useOnboardingWOTC9061Store();
const { responsive } = useBreakpoints();
const { setLoading } = useLoadingStore();
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems, getEmployeeFormSubmit } =
    useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const { form9061Data } = storeToRefs(useOnboardingWOTC9061Store());
const { notifySuccess } = useAlerts();
const router = useRouter();
const container = ref(null);
const formRef = ref(null);
const openSaveChangeModal = ref(false);
const renderedFormData = ref();
const isFormChanged = ref(false);
const toPath = ref("");
const isForcePush = ref(false);
const isSm = ref(false);
const isMd = ref(false);
const isLg = ref(false);
const isXl = ref(true);
const currentNavItem = ref(null);
const isLoaded = ref(false);
const formData = ref<OnboardingWOTC9061Hr & {employerSignature: string}>({
    status: "",
    isActive: true,
    isFormDone: false,
    name: "",
    address: "",
    city: "",
    state: null,
    zipCode: "",
    phone: "",
    federalId: "",
    startDate: "",
    startWage: "",
    position: "",
    employerSignature: "",
    employerSignaturePath: "",
    dateSignatureUTC: '',

});
const formIdSummary = FormField.WOTCOnboardSummary;
const isEmployeeFormSubmitted = ref(false);
const isSignatureConsent = ref(true);
const signatureFilePath = ref('')
const signatureObject = ref({
  path: '',
  fileObject: null,
  name: ''
})
const hqSuiteStore = useHQSuiteStore();
const uploadFormData = ref<Partial<UploadPayload<OnboardingWOTC9061Hr>>>({
    fieldModels: [],
    uploadFileStateForms: [],
    formId: formId9061Hr,
    employeeId: employeeId.value,
});

const handleSave = async () => {
    const { valid } = await formRef.value.validate();
    if (!valid) {
        nextTick(() => {
            const el = container.value.getElementsByClassName("message-error")[0];
            if (el) {
                el.scrollIntoView({ behavior: "smooth" });
            }
        });
        return;
    } else {
        handleSubmitForm();
    }
};

const handleSubmitForm = async () => {
    try {
        setLoading(true);

        if (formData.value.employerSignature && signatureObject.value.fileObject) {
            await hqSuiteStore.uploadDocument({ path: signatureObject.value.path, file: signatureObject.value.fileObject, fileName: signatureObject.value.name }, true)
        }

        formData.value.isFormDone = true;
        Object.keys(formData.value).forEach((fieldName: string) => {
            const uploadKey = uploadFormData.value.fieldModels.find(
                (item) => item.fieldKey === fieldName
            );
            if (uploadKey) {
                uploadKey.fieldValue = formData.value[fieldName];
            }
        });
        await updateForm9061Data({
            employeeId: employeeId.value,
            formData: uploadFormData.value,
        });
        notifySuccess("Information updated.");
        await getOnboardingHrWOTC(employeeId.value, formIdSummary)

        const is8850DoneByForm = is8850EssDone.value && is8850HrDone.value;
        const is9061DoneByForm = is9061EssDone.value;
        const group8850Done = is8850DoneByForm || is8850DoneByFile.value;
        const group9061Done = is9061DoneByForm || is9061DoneByFile.value;
        if (isEmployeeFormSubmitted.value && group8850Done && (group9061Done || is9062Done.value)) {
            await markOnboardingSidenavItemAsDone(
                currentNavItem.value.progressSidebarId,
                true,
                employeeId.value
            );
        } else {
            await markOnboardingSidenavItemAsDone(
                currentNavItem.value.progressSidebarId,
                false,
                employeeId.value
            );
        }
        isForcePush.value = true;
        router.push({ name: "hrOnboardingWOTC" });
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};

const handleUpdatePathSignature = async (value: string) => {
  const name = `FormWOTC9061Employer-Signature-${new Date().getTime()}.png`;
  const File = await dataUrlToFile(value, name);
  signatureObject.value.path = signatureFilePath.value;
  signatureObject.value.name = name;
  signatureObject.value.fileObject = File;
  formData.value.employerSignature = value;
  formData.value.employerSignaturePath = `${signatureFilePath.value}/${name}`;
}

const handleUpdatePathEmp = (path: string) => {
  formData.value.employerSignaturePath = path;
}

const handleUpdateSignatureConsent = () => {
  isSignatureConsent.value = !isSignatureConsent.value
}

onMounted(async () => {
    setLoading(true);
    await Promise.all([
        get8850EssStatus(employeeId.value, formId8850Ess),
        get9061EssStatus(employeeId.value, formId9061Ess),
        get8850HrStatus(employeeId.value, formId8850Hr),
        get9061HrStatus(employeeId.value, formId9061Hr),
        fetchForm9061Data(employeeId.value, formId9061Hr),
        getOnboardingSideNavItems(employeeId.value),
    ]);
    isEmployeeFormSubmitted.value = await getEmployeeFormSubmit(employeeId.value)
    currentNavItem.value = onboardingSideNavItem.value.find(
        (item) =>
            item.progressSidebarUrl.trim().toLocaleLowerCase() ===
            "onboardingWOTC".trim().toLocaleLowerCase()
    );
    formData.value.employerSignature = '';
    formData.value.dateSignatureUTC = form9061Data.value.fieldModels.find((item) => item.fieldKey === 'dateSignatureUTC')?.fieldValue.toString()
    form9061Data.value.fieldModels.forEach((item) => {
        const newKey = item.fieldKey;
        formData.value[newKey] = item.fieldValue as never;
        uploadFormData.value.fieldModels.push({
            formFieldId: item.formFieldId,
            fieldKey: item.fieldKey,
            fieldValue: item.fieldValue,
        });
    });
    renderedFormData.value = Object.assign({}, formData.value);
    isLoaded.value = true;
    isFormChanged.value = false;
    setTimeout(() => formRef.value.setErrors([])); 
    setLoading(false);
});

const handleCancel = async () => {
    isForcePush.value = true;
    router.push({ name: "hrOnboardingWOTC" });
};

const handleDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
    isForcePush.value = true;
    router.push(toPath.value);
};

const handleCancelDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
};

const handleClearSignature = () => {
  formData.value.employerSignaturePath = '';
}


onBeforeRouteLeave((to, from, next) => {
    if (!isFormChanged.value) {
        next();
        return true;
    } else {
        toPath.value = to.fullPath;
        if (isForcePush.value) {
            next();
            return true;
        }
        openSaveChangeModal.value = true;
        next(false);
        return false;
    }
});

watch(
    () => formData.value,
    () => {
        if (!isEqual(renderedFormData.value, formData.value)) {
            isFormChanged.value = true;
        } else {
            isFormChanged.value = false;
        }
    },
    {
        deep: true,
    }
);

watch(
    () => responsive.breakpoint,
    () => {
        isSm.value = responsive.breakpoint === "sm";
        isMd.value = responsive.breakpoint === "md";
        isLg.value = responsive.breakpoint === "lg";
        isXl.value = responsive.breakpoint === "xl";
    }
);

</script>
<template>
    <div class="p-3 pt-0 text-justify" ref="container">
        <!-- form header -->
        <div class="d-flex justify-content-between align-items-center py-3">
            <div class="title">Form 9061 | Employer's Section</div>
            <div>
                <fs-button variant="outline-secondary" class="text-capitalize" @click="handleCancel">
                    CANCEL
                </fs-button>

                <fs-button :disabled="!isFormChanged" variant="task-cyan" class="text-capitalize" @click="handleSave">
                    SAVE
                </fs-button>
            </div>
        </div>
        <!-- form header -->

        <!-- form body -->
        <VeeForm ref="formRef">
            <div class="border mb-4" :class="isXl && 'w-700'">
                <div class="bg-light border px-3 py-2 fw-bold">
                    EMPLOYER'S INFORMATION
                </div>
                <div class="p-3 pb-0">
                    <fs-input label="Employer's Name" type="fsTextInput" name="name" v-model="formData.name"
                        :required="true" :rules="{ required: true }" />
                    <fs-input label="Employer's Address" type="fsTextInput" name="address" v-model="formData.address"
                        :required="true" :rules="{ required: true }" />
                    <fs-row>
                        <fs-col xl="8">
                            <fs-input label="City or Town" type="fsTextInput" name="city" v-model="formData.city"
                                :required="true" :rules="{ required: true }" />
                        </fs-col>
                        <fs-col xl="2">
                            <fs-input label="State" type="fsMultiselectList" :typeaheaddata="STATES" typeaheadkey="value"
                                typeaheadvalueattribute="value" showClear
                                name="state" v-model="formData.state" :rules="{ required: true }" :required="true" />
                        </fs-col>
                        <fs-col xl="2" style="min-width: 100px">
                            <fs-input label="Zip Code" type="fsTextInput" name="zipCode" v-model="formData.zipCode"
                                :rules="{ required: true, max: 10 }"  :required="true" />
                        </fs-col>
                    </fs-row>
                    <fs-row>
                        <fs-col xl="6">
                            <fs-input label="Employer Telephone No." type="fsTextInput" name="phone"
                                v-model="formData.phone" :required="true" :rules="{ required: true, phoneNumber: true }" maskFormat="(###) ###-####" />
                        </fs-col>
                        <fs-col xl="6">
                            <fs-input label="Employer Federal ID Number (EIN)" type="fsTextInput" name="federalId"
                                v-model="formData.federalId" :rules="{ required: true, max: 10 }" :required="true" maskFormat="##-#######" />
                        </fs-col>
                    </fs-row>
                </div>
            </div>

            <div class="border mb-4" :class="isXl && 'w-700'">
                <div class="bg-light border px-3 py-2 fw-bold">
                    APPLICANT CHARACTERISTICS FOR WOTC TARGET GROUP CERTIFICATION
                </div>
                <div class="p-3 pb-0">
                    <fs-row>
                        <fs-col xl="4">
                            <fs-input label="Employment Start Date" type="fsDateInput" name="startDate"
                                v-model="formData.startDate" :required="true" :rules="{ required: true }" />
                        </fs-col>
                        <fs-col xl="4">
                            <fs-input type="fsCurrencyInput" prepend="$" label="Starting Wage" name="startWage" v-model="formData.startWage" :required="true" 
                            :rules="{ required: true }" :config="{...fsCurrencyConfig}">
                            </fs-input>


                        </fs-col>
                        <fs-col xl="4">
                            <fs-input label="Position" type="fsTextInput" name="position" v-model="formData.position"
                                :required="true" :rules="{ required: true }" />
                        </fs-col>
                    </fs-row>
                </div>
            </div>

            <div :class="isXl && 'w-700'" v-if="!has9061EmployeeSignature">
                <VeeField name="employerSignaturePath" v-model="formData.employerSignaturePath" :rules="{ required: !has9061EmployeeSignature}">
                <SignaturePad :isSignatureConsent="isSignatureConsent" :isEmployer="true"
                    :isEdit="!isEqual(omit(formData, 'employerSignature', 'employerSignaturePath'), omit(renderedFormData, 'employerSignature', 'employerSignaturePath'))" 
                    v-if="isLoaded" @update-signature-consent="handleUpdateSignatureConsent"
                    @clear-signature="handleClearSignature" :path="formData.employerSignaturePath" 
                    @submit-signature="handleUpdatePathSignature" @update-path-signature="handleUpdatePathEmp" />
                    <ErrorMessage class="message-error mt-0" name="employerSignaturePath" />
                </VeeField>

                <div class="w-50" v-if="formData.dateSignatureUTC">
                    <label for="dateSignatureUTC" class="d-block">Date<font-awesome-icon :icon="['fas', 'asterisk']"
                        class="text-danger ms-1" size="sm" /></label>
                    <div>
                        <div class="d-flex gap-2">
                        <div class="p-2 bg-grey--000 border rounded" style="flex: 1 1 auto">{{ moment(formData.dateSignatureUTC).format('YYYY/MM/DD') }}</div>
                        <div class="p-2 bg-grey--000 border rounded" style="flex: 1 1 auto">{{ moment(formData.dateSignatureUTC).format('hh:mm a') }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </VeeForm>
        <!-- form body -->
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
<style scoped>
.label {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
}

.title {
    font-weight: 700;
    font-size: 18px;
    line-height: 21px;
}

.w-700 {
    max-width: 700px;
}

.text-justify {
    text-align: justify;
}

form>div>div>div {
    margin-bottom: 20px;
}

.form-body>div {
    margin-bottom: 12px;
}

:deep(.b-icon-calendar) {
    right: 0;
}

:deep(.fa-asterisk) {
    font-size: 6px;
    height: 9px;
}

:deep(div[role="radiogroup"] > .form-check.form-check-inline) {
    margin-right: 0;
    margin-left: 1rem;
}

:deep(.b-datefield) {
    display: block;
    width: 100%;
}

:deep(.form-check-label:has(> .w-100)) {
    width: 100%;
}

:deep(div[margin="top"] > input[type="radio"]) {
    margin-top: 13px;
}

.message-error {
    color: #f23648;
    display: block;
}
</style>
