<script setup lang="ts">
import { Ref, computed, nextTick, ref, onMounted, watch } from 'vue';
import { STATES } from '@/constants/common';
import { useOnboardingEmployerInformationStore } from '@/stores/onboardingEmployerInformationStore';
import { storeToRefs } from 'pinia';
import { FormField } from '@/enums/FormField';
import OnboardingEmployerInformation from '@/models/onboarding/OnboardingEmployerInformation';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { isEqual } from 'lodash';
import { useLoadingStore } from '@/stores/loadingStore';
import { useAlerts } from '@/composables/useAlerts';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { useOnboardingStore } from '@/stores/onboardingStore';
import { StaticFiles } from '@/enums/StaticFiles';

// STORES
const { getOnboardingEmployerInformation, updateOnboardingEmployerInformation } = useOnboardingEmployerInformationStore();
const { onboardingEmployerInformation } = storeToRefs(useOnboardingEmployerInformationStore());
const router = useRouter();
const route = useRoute();
const { setLoading } = useLoadingStore();
const { notifyError } = useAlerts();
const { getDocumentTemplate } = useReportTemplate();
const { markOnboardingSidenavItemAsDone, getOnboardingSideNavItems } = useOnboardingStore();
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());

// REFS
const formData = ref({
    employerName: '',
    employerAddress: '',
    city: '',
    state: null,
    zipcode: '',
    firstDateOfEmployment: null,
    employerIdentificationNumber: '',
    formStatus: false,
});
const firstRenderedFormData = ref({
    employerName: '',
    employerAddress: '',
    city: '',
    state: null,
    zipcode: '',
    firstDateOfEmployment: null,
    employerIdentificationNumber: '',
    formStatus: false,
})
const payloadUploadForm: Ref<OnboardingEmployerInformation> = ref(undefined);
const observer = ref(null);
const openSaveChangeModal = ref(false);
const isForcePush = ref(false);
const toPath = ref('');
const isFormChanged = ref(false);
const formHasValidated = ref(false);

// CONSTANTS
const employeeId = computed(
    () => route.params.id
);
const onboardingEmployerInformationFormId = FormField.TaxWithholdingInfoEmployer;
const mappedStates = computed(() => STATES.map((state) => {
    return {
        value: state.value,
        text: state.value
    }
}));

// SUBMIT FORM
const handleSubmitForm = async (event: Event) => {
    event.preventDefault();
    setLoading(true);
    const { valid } = await observer.value.validate();
    if (!valid) {
        nextTick(() => {
            const el = document.getElementsByClassName('form_error-message')[0];
            if (el) {
                el.scrollIntoView({ behavior: 'smooth' })
            }
        })
        setLoading(false);
        return;
    } else {
        formData.value.formStatus = true;
        const mappedFieldModels = payloadUploadForm.value.fieldModels.map((fieldModel) => {
            const fieldValue = formData.value[fieldModel.fieldKey] || ""; // Set fieldValue to an empty string if fieldKey does not exist in data
            return { ...fieldModel, fieldValue };
        });
        payloadUploadForm.value.fieldModels = mappedFieldModels;

        await updateOnboardingEmployerInformation(Number(employeeId.value), payloadUploadForm.value);

        //update logic save done update done onboardingFormW4
        await getOnboardingSideNavItems(Number(employeeId.value));
        let currentNavItem = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLocaleLowerCase() === 'onboardingFormW4'.trim().toLocaleLowerCase());
        await markOnboardingSidenavItemAsDone(currentNavItem.progressSidebarId, true, Number(employeeId.value))

        isFormChanged.value = false;
        setLoading(false)
        router.push({
            name: 'onboardingFormW4'
        })
    }
}

const handleCancelForm = () => {
    router.push({ name: 'onboardingFormW4' })
}

onMounted(async () => {
    setLoading(true);
    await getOnboardingEmployerInformation(Number(employeeId.value), onboardingEmployerInformationFormId);
    payloadUploadForm.value = onboardingEmployerInformation.value;

    const data = payloadUploadForm.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
            acc[fieldKey] = fieldValue;
        }
        return acc as any;
    }, {});

    formData.value = data;
    firstRenderedFormData.value = onboardingEmployerInformation.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
            acc[fieldKey] = fieldValue;
        }
        return acc as any;
    }, {});
    setLoading(false);
})

// LEAVING GUARDS
watch(() => formData.value, () => {
    if (!isEqual(formData.value, firstRenderedFormData.value)) {
        isFormChanged.value = true;
    } else {
        isFormChanged.value = false;
    }
}, { deep: true })

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

// DOWNLOAD FILES
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
    <VeeForm ref="observer" id="observer" v-slot="{ meta }">
        <div class="d-flex justify-content-between align-items-center px-4 py-3 sticky-header">
            <div class="title">
                <h4 :style="{ fontWeight: 'bold', fontSize: '16px', lineHeight: '19px', marginBottom: '6.5px' }">Employer
                    Information </h4>
            </div>
            <div class="d-flex align-items-center">
                <fs-button type="button" variant="outline-secondary" @click="handleCancelForm">
                    Cancel
                </fs-button>
                <fs-button type="submit" variant="cerulean" :disabled="!isFormChanged"
                    @click="handleSubmitForm">Save</fs-button>
            </div>
        </div>
        <div :style="{ maxWidth: '700px', marginBottom: '40px' }" class="px-4">
            <div class="mb-4">See the Federal W-4 Form filling instruction <fs-link
                    @click="handleDownloadStaticFile(StaticFiles.FEDERAL_W4_INSTRUCTIONS, false)" class="desc-link">here.</fs-link>
            </div>
            <fs-row>
                <fs-col>
                    <fs-input :required="true" v-model="formData.employerName" type="fsTextInput" label="Employer's Name"
                        :rules="{ required: true }" name="employerName"
                        :formMeta="{ ...meta, validated: formHasValidated }"></fs-input>
                </fs-col>
            </fs-row>
            <fs-row>
                <fs-col>
                    <fs-input :required="true" v-model="formData.employerAddress" type="fsTextInput"
                        label="Employer's Address" :rules="{ required: true }" name="employerAddress"
                        :formMeta="{ ...meta, validated: formHasValidated }"></fs-input>
                </fs-col>
            </fs-row>
            <fs-row>
                <fs-col cols="4">
                    <fs-input :required="true" v-model="formData.city" type="fsTextInput" label="City"
                        :rules="{ required: true }" name="city"
                        :formMeta="{ ...meta, validated: formHasValidated }"></fs-input>
                </fs-col>
                <fs-col cols="4">
                    <fs-input type="fsSelect" :required="true" v-model="formData.state" name="state" label="State"
                        :options="mappedStates" :style="{ height: '40px' }" />
                </fs-col>
                <fs-col cols="4">
                    <fs-input :required="true" v-model="formData.zipcode" type="FsTextInput" label="Zipcode"
                        :rules="{ required: true, max: 10 }" name="zipcode"
                        :formMeta="{ ...meta, validated: formHasValidated }" maskFormat="##########"></fs-input>
                </fs-col>
            </fs-row>
            <fs-row>
                <fs-col cols="6">
                    <fs-input v-model="formData.firstDateOfEmployment" type="FsDateInput" label="First Date Of Employment"
                        :required="true" name="firstDateOfEmployment"
                        :formMeta="{ ...meta, validated: formHasValidated }" />
                </fs-col>
                <fs-col cols="6">
                    <fs-input :required="true" v-model="formData.employerIdentificationNumber" type="FsTextInput"
                        label="Employer's Identification Number" :rules="{ required: true, max: 10 }"
                        name="employerIdentificationNumber" :formMeta="{ ...meta, validated: formHasValidated }"
                        maskFormat="##-#######"></fs-input>
                </fs-col>
            </fs-row>
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

    :deep(svg) {
        color: #fc5555;
        font-size: 11px;
        margin-left: 3px;
        font-size: 60%;
        margin-bottom: 2px;
        height: 1em;
    }
}

.form_input {
    min-height: 40px;
    margin-top: 0;
    height: unset;
    font-size: unset;
}

.form_error-message {
    color: #fc5555;
    font-size: 12px;
    font-weight: bold;
}
</style>