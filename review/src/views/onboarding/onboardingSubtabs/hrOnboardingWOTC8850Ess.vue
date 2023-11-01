<script setup lang="ts">
import SignaturePad from "@/components/common/SignaturePad.vue";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { STATES } from "@/constants/common";
import { FormField } from "@/enums/FormField";
import { dataUrlToFile } from "@/helper/hqSuite/formatHelper";
import { OnboardingWOTC8850Ess } from "@/models/onboarding/WOTC/HrOnboardingWOTC8850Ess";
import { UploadPayload } from "@/models/onboarding/WOTC/UploadPayload";
import { useLoadingStore } from "@/stores/loadingStore";
import { useOnboardingWOTC8850Store } from "@/stores/WOTC/onboardingHrWOTC8850EssStore";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
    faPenToSquare
} from "@fortawesome/pro-light-svg-icons";
import { faAsterisk, faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import moment from "moment";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
library.add(faAsterisk, faPenToSquare, faCircleExclamation, faEye, faEyeSlash);
const route = useRoute();

const { responsive } = useBreakpoints();
const { form8850Data } = storeToRefs(useOnboardingWOTC8850Store());
const { fetchForm8850Data } = useOnboardingWOTC8850Store();
const employeeId = computed(() => Number(route.params.id));
const formId = FormField.WOTC8850Employee

const formRef = ref(null);
const baseOptions = [
    { text: "Yes", value: true, disabled: true },
    { text: "No", value: false, disabled: true },
];
const signatureObject = ref({
    path: '',
    fileObject: null,
    name: ''
});
const signatureFilePath = ref('');
type FormDataType = OnboardingWOTC8850Ess & { employeeSignature: string };
const { setLoading } = useLoadingStore();
const renderedFormData = ref();
const isFormChanged = ref(false);
const isLoaded = ref(false);
const isSignatureConsent = ref(false);
const hideSocialSecurityNumber = ref(true);
const initialFormData = {
    status: "",
    isFormDone: false,
    lastName: "",
    firstName: "",
    middleInitial: "",
    socialSecurityNumber: "",
    address1: "",
    address2: "",
    city: "",
    state: null,
    zipCode: "",
    county: "",
    telePhone: "",
    isUnderForty: true,
    dateOfBirth: "",
    isReceivedAConditional: false,
    isStatementsApply: false,
    isVeteranAndUnemployed: false,
    isVeteranEntitledUSArmed: false,
    isVeteranEntitledSixMonths: false,
    isMemberOfFamily: false,
    isPeriodOfUnemployment: false,
    employeeSignaturePath: "",
    dateSignatureUTC: "",
    formFiles: "",
    employeeSignature: "",
}

const uploadFormData = ref<Partial<UploadPayload<OnboardingWOTC8850Ess>>>({
    fieldModels: [],
    uploadFileStateForms: [],
    formId,
    employeeId: employeeId.value
})

const formData = ref<FormDataType>(initialFormData);

onMounted(async () => {
    setLoading(true);
    await fetchForm8850Data(employeeId.value, formId);

    // map upload form data to component-used form data state
    form8850Data.value.fieldModels.forEach((item) => {
        const newKey = item.fieldKey as keyof OnboardingWOTC8850Ess
        formData.value[newKey] = item.fieldValue as never

        uploadFormData.value.fieldModels.push(({
            formFieldId: item.formFieldId,
            fieldKey: item.fieldKey,
            fieldValue: item.fieldValue
        }))
    })

    renderedFormData.value = Object.assign({}, formData.value);
    formData.value.employeeSignature = '';
    formData.value.dateSignatureUTC = form8850Data.value.fieldModels.find((item) => item.fieldKey === 'dateSignatureUTC').fieldValue.toString()
    await formRef.value.setErrors([])
    isLoaded.value = true;
    setLoading(false);
});

const handleUpdatePathSignature = async (value: string) => {
    const name = `FormEEOSelfIdentification-Signature-${new Date().getTime()}.png`;
    const File = await dataUrlToFile(value, name);
    signatureObject.value.path = signatureFilePath.value;
    signatureObject.value.name = name;
    signatureObject.value.fileObject = File;
    formData.value.employeeSignaturePath = value;
    formData.value.employeeSignaturePath = `${signatureFilePath.value}/${name}`;
}

const handleClearSignature = () => {
    formData.value.employeeSignaturePath = '';
}

const handleUpdatePathEmp = (path: string) => {
    formData.value.employeeSignaturePath = path;
    const loadedSignature = localStorage.getItem('signature');
    formData.value.employeeSignaturePath = loadedSignature;
}

</script>
<template>
    <div class="position-relative">
        <div class="p-4 pt-0">
            <div class="py-2 d-flex align-items-center  gap-3 form_header bg-white">
                <span>
                    <fs-link tag="a" :to="{ name: 'hrOnboardingWOTC' }"><font-awesome-icon
                            :icon="['fal', 'circle-arrow-left']" size="lg" class="text-mountain-meadow" /></fs-link>
                </span>
                <h5 class="fw-bold">Form 8850 | Employee’s Section</h5>
            </div>

            <div class="fw-bold py-2">
                <span>JOB APPLICANT</span>
            </div>

            <div :class="responsive.breakpoint === 'xl' && 'w-60'">
                <VeeForm ref="formRef" id="form">
                    <div class="d-flex gap-3 justify-content-between"
                        :class="responsive.breakpoint === 'sm' && 'flex-column'">
                        <div class="flex-3">
                            <fs-input type="fsTextInput" v-model="formData.lastName" name="Last Name" label="Last Name"
                                disabled rules="required|max:20" :required="true" />
                        </div>
                        <div class="flex-3">
                            <fs-input type="fsTextInput" v-model="formData.firstName" name="First Name" label="First Name"
                                disabled rules="required|max:20" :required="true" />
                        </div>
                        <div class="flex-1" style="min-width: 100px">
                            <fs-input type="fsTextInput" v-model="formData.middleInitial" name="Middle Initial"
                                label="Middle Initial" disabled rules="required|length:1" :required="true" />
                        </div>
                    </div>

                    <div :class="responsive.breakpoint === 'xl' && 'w-50'">
                        <fs-input type="fsTextInput" :input-type="hideSocialSecurityNumber ? 'password' : 'text'"
                            v-model="formData.socialSecurityNumber" rules="required|max:11" name="Social security number"
                            label="Social security number" disabled :required="true">
                            <template #input-group-content>
                                <fs-button class="fs-input__overlap-button"
                                    @click="hideSocialSecurityNumber = !hideSocialSecurityNumber"
                                    variant="outline-secondary">
                                    <font-awesome-icon :icon="hideSocialSecurityNumber
                                        ? 'fa-light fa-eye'
                                        : 'fa-light fa-eye-slash'
                                        " />
                                </fs-button>
                            </template>
                        </fs-input>
                    </div>

                    <div>
                        <fs-input type="fsTextInput" v-model="formData.address1" name="Address Line 1"
                            rules="required|max:30" label="Address Line 1" disabled :required="true" />
                    </div>

                    <div>
                        <fs-input type="fsTextInput" v-model="formData.address2" name="Address Line 2"
                            rules="required|max:30" label="Address Line 2" disabled :required="true" />
                    </div>

                    <fs-row>
                        <fs-col md="12" lg="4" class="mb-2">
                            <fs-input type="fsTextInput" v-model="formData.city" name="City or Town" rules="required|max:30"
                                label="City or Town" disabled :required="true" />
                        </fs-col>
                        <fs-col md="12" lg="4" class="mb-2">
                            <fs-input type="fsMultiselectList" label="State"
                                typeaheadkey="value" typeaheadvalueattribute="value"
                                :typeaheaddata="STATES" name="state" v-model="formData.state" :disabled="true" :required="true" />
                        </fs-col>
                        <fs-col md="12" lg="4" class="mb-2">
                            <fs-input type="fsTextInput" v-model="formData.zipCode" name="Zip code" label="Zip code"
                                rules="required|max:10" disabled :required="true" />
                        </fs-col>
                    </fs-row>

                    <fs-row>
                        <fs-col md="12" lg="7" class="mb-2">
                            <fs-input type="fsTextInput" v-model="formData.county" name="County" label="County"
                                rules="required" disabled :required="true" />
                        </fs-col>
                        <fs-col md="12" lg="5" class="mb-2">
                            <fs-input type="fsTextInput" v-model="formData.telePhone" name="Telephone Number"
                                label="Telephone Number" rules="required|max:12" disabled :required="true" />
                        </fs-col>
                    </fs-row>

                    <div class="d-flex justify-content-between">
                        <label><strong>If you are under age 40</strong></label>
                        <div>
                            <VeeField id="underForty" name="underForty">
                                <fs-form-radio-group v-model="formData.isUnderForty"
                                    :options="baseOptions"></fs-form-radio-group>
                            </VeeField>
                        </div>
                    </div>

                    <div :class="responsive.breakpoint === 'sm' ? 'd-flex flex-column' : 'd-flex justify-content-between'"
                        class="ms-3">
                        <div>
                            <strong>If YES</strong>, enter your date of birth
                        </div>
                        <div>
                            <fs-input type="fsDateInput" v-model="formData.dateOfBirth" name="Date of birth" label=""
                                :rules="formData.isUnderForty && { required: true }" disabled style="min-width: 185px" />
                        </div>
                    </div>

                    <div class="d-flex flex-column gap-3">
                        <!-- SWA -->
                        <div class="d-flex align-items-start">
                            <span class="me-3 pt-1 fw-bold">1</span>
                            <span class="me-1">
                                <VeeField name="SWA" class="pt-0" v-model="formData.isReceivedAConditional">
                                    <fs-form-checkbox disabled id="isReceivedAConditional" size="lg"
                                        v-model="formData.isReceivedAConditional" />
                                </VeeField>
                            </span>
                            <label for="isReceivedAConditional">Check here if you received a conditional certification from
                                the
                                state workforce agency (SWA) or a participating local agency for
                                the work opportunity credit.</label>
                        </div>
                        <!-- TANF -->
                        <div class="d-flex align-items-start">
                            <span class="me-3 pt-1 fw-bold">2</span>
                            <span class="me-1">
                                <VeeField name="TANF" class="pt-0" v-model="formData.isStatementsApply">
                                    <fs-form-checkbox disabled id="isStatementsApply" size="lg"
                                        v-model="formData.isStatementsApply" />
                                </VeeField>
                            </span>
                            <div>
                                <label for="isStatementsApply">Check here if any of the following statements apply to
                                    you.</label>
                                <ul class="mt-2">
                                    <li>
                                        I am a member of a family that has received assistance from
                                        Temporary Assistance for Needy Families (TANF) for any 9
                                        months during the past 18 months.
                                    </li>
                                    <li>
                                        I am a veteran and a member of a family that received
                                        Supplemental Nutrition Assistance Program (SNAP) benefits
                                        (food stamps) for at least a 3-month period during the past 15
                                        months.
                                    </li>
                                    <li>
                                        I was referred here by a rehabilitation agency approved by the
                                        state, an employment network under the Ticket to Work program,
                                        or the Department of Veterans Affairs.
                                    </li>
                                    <li>
                                        <div>
                                            I am at least age 18 but not age 40 or older and I am a
                                            member of a family that:
                                        </div>
                                        <div>
                                            a. Received SNAP benefits (food stamps) for the past 6
                                            months; or
                                            <br />
                                            b. Received SNAP benefits (food stamps) for at least 3 of
                                            the past 5 months, but is no longer eligible to receive
                                            them.
                                        </div>
                                    </li>
                                    <li>
                                        During the past year, I was convicted of a felony or released
                                        from prison for a felony.
                                    </li>
                                    <li>
                                        I received supplemental security income (SSI) benefits for any
                                        month ending during the past 60 days.
                                    </li>
                                    <li>
                                        I am a veteran and I was unemployed for a period or periods
                                        totaling at least 4 weeks but less than 6 months during the
                                        past year.
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- Unemployed half year veteran -->
                        <div class="d-flex align-items-start">
                            <span class="me-3 pt-1 fw-bold">3</span>
                            <span class="me-1">
                                <VeeField name="Unemployed half year veteran" class="pt-0"
                                    v-model="formData.isVeteranAndUnemployed">
                                    <fs-form-checkbox disabled id="isVeteranAndUnemployed"
                                        v-model="formData.isVeteranAndUnemployed" size="lg" />
                                </VeeField>
                            </span>
                            <label for="isVeteranAndUnemployed">Check here if you are a veteran and you were unemployed for
                                a
                                period or periods totaling at least 6 months during the past
                                year.</label>
                        </div>
                        <!-- Service-connected Disability Veteran -->
                        <div class="d-flex align-items-start">
                            <span class="me-3 pt-1 fw-bold">4</span>
                            <span class="me-1">
                                <VeeField name="Service-connected Disability Veteran" class="pt-0"
                                    v-model="formData.isVeteranEntitledUSArmed">
                                    <fs-form-checkbox disabled id="isVeteranEntitledUSArmed" size="lg"
                                        v-model="formData.isVeteranEntitledUSArmed" />
                                </VeeField>
                            </span>
                            <label for="isVeteranEntitledUSArmed">Check here if you are a veteran entitled to compensation
                                for a
                                service-connected disability and you were discharged or released
                                from active duty in the U.S. Armed Forces during the past
                                year.</label>
                        </div>
                        <!-- Service-connected Disability And UnEmployed Half Year Veteran -->
                        <div class="d-flex align-items-start">
                            <span class="me-3 pt-1 fw-bold">5</span>
                            <span class="me-1">
                                <VeeField name="Service-connected Disability And UnEmployed Half Year Veteran"
                                    v-model="formData.isVeteranEntitledSixMonths" class="pt-0">
                                    <fs-form-checkbox disabled id="isVeteranEntitledSixMonths"
                                        v-model="formData.isVeteranEntitledSixMonths" size="lg" />
                                </VeeField>
                            </span>
                            <label for="isVeteranEntitledSixMonths">Check here if you are a veteran entitled to compensation
                                for a
                                service-connected disability and you were unemployed for a period
                                or periods totaling at least 6 months during the past year.</label>
                        </div>
                        <!-- Member of family receiving TANF -->
                        <div class="d-flex align-items-start">
                            <span class="me-3 pt-1 fw-bold">6</span>
                            <span class="me-1">
                                <VeeField name="Member of family receiving TANF" class="pt-0"
                                    v-model="formData.isMemberOfFamily">
                                    <fs-form-checkbox disabled id="MemberOfFamilyTANF" v-model="formData.isMemberOfFamily"
                                        size="lg" />
                                </VeeField>
                            </span>
                            <div>
                                <label for="MemberOfFamilyTANF">Check here if any of the following statements apply to
                                    you.</label>
                                <ul class="mt-2 mb-0">
                                    <li>
                                        Received TANF payments for at least the past 18 months;
                                        <strong>or</strong>
                                    </li>
                                    <li>
                                        Received TANF payments for any 18 months beginning after
                                        August 5, 1997, <strong>and</strong> the earliest 18-month
                                        period beginning after August 5, 1997, ended during the past 2
                                        years; or
                                    </li>
                                    <li>
                                        Stopped being eligible for TANF payments during the past 2
                                        years because federal
                                        <strong>or</strong>
                                        state law limited the maximum time those payments could be
                                        made
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <!-- Unemployed Consecutive 27 Weeks -->
                        <div class="d-flex align-items-start">
                            <span class="me-3 pt-1 fw-bold">7</span>
                            <span class="me-1">
                                <VeeField name="Unemployed Consecutive 27 Weeks" class="pt-0"
                                    v-model="formData.isPeriodOfUnemployment">
                                    <fs-form-checkbox disabled id="isPeriodOfUnemployment"
                                        v-model="formData.isPeriodOfUnemployment" size="lg" />
                                </VeeField>
                            </span>
                            <label for="isPeriodOfUnemployment">Check here if you are in a period of unemployment that is at
                                least 27 consecutive weeks and for all or part of that period you
                                received unemployment compensation.</label>
                        </div>

                        <hr />
                        <!-- signature and signing date -->
                        <div>
                            <VeeField name="employeeSignaturePath" v-model="formData.employeeSignature" rules="required">
                                <SignaturePad :isEdit="false" :isSignatureConsent="isSignatureConsent" v-if="isLoaded"
                                    :path="formData.employeeSignaturePath" :isViewOnly="true" :isUpdate="isFormChanged"
                                    @clear-signature="handleClearSignature" @submit-signature="handleUpdatePathSignature"
                                    :isDisabledAll="true" @update-path-signature="handleUpdatePathEmp" />
                            </VeeField>

                            <div class="w-50">
                                <label for="dateSignatureUTC" class="d-block">Date<font-awesome-icon
                                        :icon="['fas', 'asterisk']" class="text-danger ms-1" size="sm" /></label>
                                <VeeField name="dateSignatureUTC" v-model="formData.dateSignatureUTC" type="text">
                                    <div class="d-flex gap-2" v-if="formData.dateSignatureUTC">
                                        <span>{{ moment(formData.dateSignatureUTC).format('YYYY/MM/DD') }}</span>
                                        <span>{{ moment(formData.dateSignatureUTC).format('hh:mm a') }}</span>
                                    </div>
                                </VeeField>
                            </div>
                        </div>
                    </div>
                </VeeForm>
            </div>
        </div>
    </div>
</template>
<style scoped>
.w-60 {
    width: 60%;
    max-width: 700px;
}

.flex-1 {
    flex: 1;
}

.flex-3 {
    flex: 3;
}

.label {
    font-style: normal;
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
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
