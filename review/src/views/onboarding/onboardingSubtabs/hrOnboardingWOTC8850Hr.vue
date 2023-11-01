<script setup lang="ts">
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { useAlerts } from "@/composables/useAlerts";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { STATES } from "@/constants/common";
import { FormField } from "@/enums/FormField";
import { OnboardingWOTC8850Hr } from "@/models/onboarding/WOTC/HrOnboardingWOTC8850Hr";
import { UploadPayload } from "@/models/onboarding/WOTC/UploadPayload";
import { useOnboardingWOTC8850Store } from "@/stores/WOTC/onboardingHrWOTC8850HrStore";
import { useOnboardingHrWOTCStore } from "@/stores/WOTC/onboardingHrWOTCStore";
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faEye,
    faEyeSlash,
    faPenToSquare,
} from "@fortawesome/pro-light-svg-icons";
import {
    faAsterisk,
    faCircleExclamation,
} from "@fortawesome/pro-solid-svg-icons";
import { isEqual } from "lodash-es";
import { storeToRefs } from "pinia";
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { onBeforeRouteLeave, useRoute, useRouter } from "vue-router";

library.add(faAsterisk, faPenToSquare, faEye, faEyeSlash, faCircleExclamation);
const route = useRoute();
const { notifySuccess } = useAlerts();
const { responsive } = useBreakpoints();
const router = useRouter();
const {
    is8850EssDone,
    is9061EssDone,
    is9061HrDone,
    is8850DoneByFile,
    is9061DoneByFile,
    is9062Done,
} = storeToRefs(useOnboardingHrWOTCStore());
const { get8850EssStatus, get8850HrStatus, get9061EssStatus, get9061HrStatus, getOnboardingHrWOTC } =
    useOnboardingHrWOTCStore();
const { fetchForm8850Data, updateForm8850Data } = useOnboardingWOTC8850Store();
const { form8850Data } = storeToRefs(useOnboardingWOTC8850Store());
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems, getEmployeeFormSubmit } =
    useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const employeeId = computed(() => Number(route.params.id));
const formId8850Ess = FormField.WOTC8850Employee;
const formId8850Hr = FormField.WOTC8850Employer;
const formId9061Ess = FormField.WOTC9061Employee;
const formId9061Hr = FormField.WOTC9061Employer;
const formRef = ref(null);
const { setLoading } = useLoadingStore();
const currentNavItem = ref(null);
const renderedFormData = ref();
const isFormChanged = ref(false);
const isLoaded = ref(false);
const toPath = ref("");
const isForcePush = ref(false);
const initialFormData = {
    status: "",
    isFormDone: false,
    name: "",
    phone: "",
    ein: "",
    address: "",
    city: "",
    state: null,
    zipCode: "",
    otherPerson: "",
    otherPhone: "",
    otherAddress: "",
    otherCity: "",
    otherState: null,
    otherZipCode: "",
    group: null,
    gaveInformationDate: "",
    offeredJobDate: "",
    hiredDate: "",
    startedJobDate: "",
    employeeSignaturePath: "",
    employeeSignature: "",
    dateSignatureUTC: "",
    formFiles: "",
};
const formIdSummary = FormField.WOTCOnboardSummary;
const isEmployeeFormSubmitted = ref(false);

const uploadFormData = ref<Partial<UploadPayload<OnboardingWOTC8850Hr>>>({
    fieldModels: [],
    uploadFileStateForms: [],
    formId: formId8850Hr,
    employeeId: employeeId.value,
});

const formData = ref(initialFormData);
const openSaveChangeModal = ref(false);
const groupOptions = [
    {
        text: 4,
        value: 4,
    },
    {
        text: 6,
        value: 6,
    },
];
const handleDiscardForm = async () => {
    isForcePush.value = true;
    router.push({ name: "hrOnboardingWOTC" });
};

const handleSaveForm = async () => {
    const { valid } = await formRef.value.validate();
    if (!valid) {
        nextTick(() => {
            const el = document.getElementsByClassName("message-error")[0];
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
        formData.value.isFormDone = true;
        const { employeeSignature, ..._formData } = formData.value;

        Object.keys(_formData).forEach((fieldName: string) => {
            const item = uploadFormData.value.fieldModels.find(
                (item) => item.fieldKey === fieldName
            );
            if (item) {
                item.fieldValue = _formData[fieldName];
            }
        });

        await updateForm8850Data({
            employeeId: employeeId.value,
            formData: uploadFormData.value,
        });
        notifySuccess("Information updated.");
        await getOnboardingHrWOTC(employeeId.value, formIdSummary)

        const is8850DoneByForm = is8850EssDone.value;
        const is9061DoneByForm = is9061EssDone.value && is9061HrDone.value;
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
        setLoading(false);
        router.push({ name: "hrOnboardingWOTC" });
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
};

const handleDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
    isForcePush.value = true;
    router.push(toPath.value);
};

const handleCancelDiscardOnRouteChange = () => {
    openSaveChangeModal.value = false;
};

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

watch([() => isEqual(formData.value, renderedFormData.value)], () => {
    isFormChanged.value = !isEqual(formData.value, renderedFormData.value);
});

onMounted(async () => {
    setLoading(true);
    await Promise.all([
        get8850EssStatus(employeeId.value, formId8850Ess),
        get9061EssStatus(employeeId.value, formId9061Ess),
        get8850HrStatus(employeeId.value, formId8850Hr),
        get9061HrStatus(employeeId.value, formId9061Hr),
        fetchForm8850Data(employeeId.value, formId8850Hr),
        getOnboardingSideNavItems(employeeId.value),
    ]);
    isEmployeeFormSubmitted.value = await getEmployeeFormSubmit(employeeId.value)
    currentNavItem.value = onboardingSideNavItem.value.find(
        (item) =>
            item.progressSidebarUrl.trim().toLocaleLowerCase() ===
            "onboardingWOTC".trim().toLocaleLowerCase()
    );

    // map upload form data to component-used form data state
    form8850Data.value.fieldModels.forEach((item) => {
        const newKey = item.fieldKey as keyof OnboardingWOTC8850Hr;
        formData.value[newKey] = item.fieldValue as never;

        uploadFormData.value.fieldModels.push({
            formFieldId: item.formFieldId,
            fieldKey: item.fieldKey,
            fieldValue: item.fieldValue,
        });
    });
    renderedFormData.value = Object.assign({}, formData.value);
    setTimeout(() => {
        formRef.value.setErrors([]);
    })
    isLoaded.value = true;
    setLoading(false);
});
</script>
<template>
    <!-- change to use equivalent fs-input component after merge code from onboarding branch -->
    <div class="position-relative">
        <div class="d-flex justify-content-between align-items-center mb-2 bg-white px-3 py-2"
            style="position: sticky; top: 0; z-index: 999">
            <div class="title">Form 8850</div>
            <span>
                <fs-button variant="outline-secondary" class="text-capitalize" @click="handleDiscardForm">
                    CANCEL
                </fs-button>
                <fs-button class="bg-cyan text-white text-capitalize" variant="outline" @click="handleSaveForm"
                    :disabled="!isFormChanged">
                    SAVE
                </fs-button>
            </span>
        </div>
        <div class="p-3" :class="responsive.breakpoint === 'xl' && 'w-700'">
            <div>
                <VeeForm ref="formRef" id="form" class="form-wrapper">
                    <div>
                        <fs-row>
                            <fs-col xl="6">
                                <fs-input label="Employer's Name" type="fsTextInput" name="name" v-model="formData.name"
                                    :required="true" :rules="{ required: true }" />
                            </fs-col>
                            <fs-col xl="3">
                                <fs-input label="Telephone No." type="fsTextInput" name="phone" v-model="formData.phone"
                                    :rules="{ required: true, phoneNumber: true }" maskFormat="(###) ###-####" :required="true" />
                            </fs-col>
                            <fs-col xl="3" style="min-width: 100px">
                                <fs-input label="EIN" type="fsTextInput" name="federalId" v-model="formData.ein"
                                    :rules="{ required: true, max: 10 }" maskFormat="##-#######" :required="true" />
                            </fs-col>
                        </fs-row>

                        <div>
                            <fs-input label="Street address" type="fsTextInput" name="address" v-model="formData.address"
                                :required="true" :rules="{ required: true }" />
                        </div>

                        <fs-row>
                            <fs-col xl="8">
                                <fs-input label="City or Town" type="fsTextInput" name="city" v-model="formData.city"
                                    :required="true" :rules="{ required: true }" />
                            </fs-col>
                            <fs-col xl="2">
                                <fs-input label="State" type="fsMultiselectList" :typeaheaddata="STATES"
                                    typeaheadkey="value" typeaheadvalueattribute="value" showClear placeholder=""
                                    name="state" v-model="formData.state" :rules="{ required: true }" :required="true" />
                            </fs-col>
                            <fs-col xl="2" style="min-width: 100px">
                                <fs-input label="Zip Code" type="fsTextInput" name="zipCode" v-model="formData.zipCode"
                                    :rules="{ required: true, max: 10 }" :required="true" />
                            </fs-col>
                        </fs-row>
                    </div>

                    <div class="py-3 border-bottom border-top">
                        <fs-row>
                            <fs-col xl="9">
                                <fs-input label="Person to contact, if different from above" type="fsTextInput"
                                    name="otherPerson" v-model="formData.otherPerson" />
                            </fs-col>
                            <fs-col xl="3">
                                <fs-input label="Telephone No." type="fsTextInput" name="otherPhone"
                                    v-model="formData.otherPhone" :rules="{ phoneNumber: true }" maskFormat="(###) ###-####" />
                            </fs-col>
                        </fs-row>

                        <div>
                            <fs-input label="Street Address" type="fsTextInput" name="otherAddress"
                                v-model="formData.otherAddress" />
                        </div>

                        <fs-row>
                            <fs-col xl="8">
                                <fs-input label="City or Town" type="fsTextInput" name="otherCity"
                                    v-model="formData.otherCity" />
                            </fs-col>
                            <fs-col xl="2">
                                <fs-input label="State" type="fsMultiselectList" :typeaheaddata="STATES"
                                    typeaheadkey="value" typeaheadvalueattribute="value" showClear placeholder=""
                                    name="otherState" v-model="formData.otherState" />
                            </fs-col>
                            <fs-col xl="2" style="min-width: 100px">
                                <fs-input label="Zip Code" type="fsTextInput" name="otherZipCode"
                                    v-model="formData.otherZipCode" :rules="{ max: 10 }" />
                            </fs-col>
                        </fs-row>
                    </div>

                    <fs-row>
                        <fs-col xl="10">
                            <span>If, based on the individual’s age and home address, he or she
                                is a member of group 4 or 6 (as described under Member of
                                Targeted Groups in the separate instructions), enter that group
                                number (4 or 6)</span>
                        </fs-col>
                        <fs-col xl="2">
                            <fs-input name="group" type="fsMultiselectList" :typeaheaddata="groupOptions"
                                typeaheadkey="text" typeaheadvalueattribute="value" showClear placeholder=""
                                v-model="formData.group" />
                        </fs-col>
                    </fs-row>

                    <div class="border-bottom"></div>

                    <fs-row>
                        <fs-col xl="3">
                            <fs-input label="Gave Information" type="fsDateInput" name="gaveInformationDate"
                                v-model="formData.gaveInformationDate" :required="true" :rules="{ required: true }" />
                        </fs-col>
                        <fs-col xl="3">
                            <fs-input label="Was Offered Job" type="fsDateInput" name="offeredJobDate"
                                v-model="formData.offeredJobDate" :required="true" :rules="{ required: true }" />
                        </fs-col>
                        <fs-col xl="3">
                            <fs-input label="Was Hired" type="fsDateInput" name="hiredDate" v-model="formData.hiredDate"
                                :required="true" :rules="{ required: true }" />
                        </fs-col>
                        <fs-col xl="3">
                            <fs-input label="Started Job" type="fsDateInput" name="startedJobDate"
                                v-model="formData.startedJobDate" :required="true" :rules="{ required: true }" />
                        </fs-col>
                    </fs-row>

                    <div class="sub-text border-top pt-3">
                        Under penalties of perjury, I declare that the applicant provided
                        the information on this form on or before the day a job was offered
                        to the applicant and that the information I have furnished is, to
                        the best of my knowledge, true, correct, and complete. Based on the
                        information the job applicant furnished on page 1, I believe the
                        individual is a member of a targeted group. I hereby request a
                        certification that the individual is a member of a targeted group.
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
    </div>
</template>
<style scoped>
.w-700 {
    max-width: 700px;
}

.title {
    font-weight: 700;
    font-size: 18px;
    line-height: 21px;
}

.label {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
}

.sub-text {
    font-weight: 400;
    font-size: 12px;
    line-height: 22px;
    text-align: justify;
    color: #6e7c8f;
}

form>div>div {
    margin-bottom: 16px;
}

.form-wrapper>* {
    margin-bottom: 20px;
}

:deep(.form-control-lg) {
    padding-top: 0;
    padding-right: 0.25rem;
}

.message-error {
    margin: 5px 0;
    color: #f23648;
    display: block;
}

.border-right-0 {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
}

.eye-icon {
    position: absolute;
    right: 0.5rem;
    cursor: pointer;
}

:deep(.fa-asterisk) {
    font-size: 6px;
    height: 9px;
}

:deep(.b-icon-calendar) {
    right: 0;
}

:deep(div[role="radiogroup"] > .form-check.form-check-inline) {
    margin-right: 0;
    margin-left: 1rem;
}

:deep(.form-check-input:checked) {
    background-color: #03a9f4;
    border-color: #03a9f4;
}
</style>
