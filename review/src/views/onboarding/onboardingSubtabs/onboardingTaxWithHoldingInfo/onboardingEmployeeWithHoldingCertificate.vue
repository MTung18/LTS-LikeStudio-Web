<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useOnboardingEmployeeWithholdingCertificateStore } from '@/stores/onboardingEmployeeWithholdingCertificateStore'
import { storeToRefs } from 'pinia';
import { FormField } from '@/enums/FormField';
import { FormStatus } from '@/enums/FormStatus';
import { Ref } from 'vue';
import { W4FormFile, W4FormFileInput } from '@/models/onboarding/W4/W4FormFile';
import { STATES as stateList } from '@/constants/common';
import { faEye, faEyeSlash, faFileCircleExclamation, faFilePdf, faPaperclip, faTrashCan, faArrowUpFromBracket } from "@fortawesome/pro-light-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faFloppyDisk } from '@fortawesome/pro-regular-svg-icons';
import { FilingStatus } from "@/enums/FilingStatus";
import SignaturePad from "@/components/common/SignaturePad.vue";
import { useEmployeeStore } from '@/stores/employeeStore';
import { useLoadingStore } from '@/stores/loadingStore';
import { useAlerts } from '@/composables/useAlerts';
import { useReportTemplate } from '@/stores/reportTemplateStore';
import { fsCurrencyConfig, FormattedDateTime } from '@/utilities/formatUtils';
import uploadedFile from '@/components/shared/uploadedFile.vue';
import { StaticFiles } from '@/enums/StaticFiles';

library.add(faEyeSlash, faPaperclip, faEye, faFileCircleExclamation, faFilePdf, faFloppyDisk, faTrashCan, faArrowUpFromBracket);

// CONSTANTS
const formId = FormField.TaxWithholdingInfoEmployee;
const employeeId = computed(() => route.params.id);
const mappedStates = computed(() => stateList.map((state) => {
    return {
        value: state.value,
        text: state.value
    }
}));

// STORES
const router = useRouter();
const route = useRoute();
const { onboardingEmployeeWitholdingCertificate } = storeToRefs(useOnboardingEmployeeWithholdingCertificateStore());
const { getOnboardingEmployeeWitholdingCertificate } = useOnboardingEmployeeWithholdingCertificateStore();
const { fetchEmployeeSsn, fetchEmployment } = useEmployeeStore();
const { employeeSsn, employment } = storeToRefs(useEmployeeStore());
const { setLoading } = useLoadingStore();
const { notifyError } = useAlerts();
const { getDocumentTemplate, getStateDocuments } = useReportTemplate();
const { stateDocuments } = storeToRefs(useReportTemplate());

// REFS 
const formData = ref({
    firstName: '',
    middleName: '',
    lastName: '',
    isSubmittedHR: false,
    address1: '',
    address2: '',
    city: '',
    state: null,
    zipcode: '',
    ssn: employeeSsn.value,
    filingStatusId: null,
    isTwoJobs: false,
    numberQualifyingChildren: '',
    numberOtherDependents: '',
    amountAboveQualifying: '',
    otherIncome: '',
    deductionsWorksheet: '',
    extraWithHolding: '',
    employeeSignaturePath: '',
    employeeSignatureDateUTC: '',
    formStatus: FormStatus.EmployeeNotStarted
});

const W4FormFileData: Ref<W4FormFile[]> = ref([]);
const W4StateForm: Ref<W4FormFileInput[]> = ref([])
const isLoaded = ref(false);
const dateUTC = ref(null);
const timeUTC = ref(null);
const checkIconSsn = ref(true);

// HANDLING GET W4 STATE FORM
const getW4FileData = async (states: string[]) => {
    const localData: W4FormFile[] = [];

    states.forEach(async element => {
        const foundState = stateList.find(item => item.value === element);
        await getStateDocuments(foundState.text.replace(/\s+/g, ''));
        if (stateDocuments.value.length === 0) return;
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

            localData.push(data)
        }

        W4FormFileData.value = [...localData];
    });
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


// COMPONENTS FUNCTIONS
onMounted(async () => {
    setLoading(true);

    try {
        await fetchEmployment(Number(employeeId.value));
        await getW4FileData(employment.value.workLocations);
        await getOnboardingEmployeeWitholdingCertificate(Number(employeeId.value), formId);
        const uploadedFiles = [...onboardingEmployeeWitholdingCertificate.value.uploadFileStateForms];
        // MAP FILES TO CORRECT STATE
        uploadedFiles.forEach((file) => {
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
        })
        const data = onboardingEmployeeWitholdingCertificate.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
            if (fieldValue !== undefined) {
                acc[fieldKey] = fieldValue;
            }
            return acc as any;
        }, {});



        if (data.employeeSignatureDateUTC) {
            const [date, time] = FormattedDateTime(data.employeeSignatureDateUTC).split(' ');
            dateUTC.value = date;
            timeUTC.value = time;
        }

        if (!formData.value.ssn) {
            await fetchEmployeeSsn(employeeId.value as string);
        }

        formData.value = data;
        isLoaded.value = true;
    } catch (error) {
        notifyError('There was an error fetching Employee Withholding Cerificate');
        console.error(error);
    } finally {
        setLoading(false)
    }


})

</script>

<template>
    <div>
        <header class="header sticky d-flex align-items-center justify-content-between px-4">
            <div class="d-flex align-items-center gap-2">
                <span @click="router.push({ name: 'onboardingFormW4' })">
                    <font-awesome-icon size="2x" :icon="['fal', 'circle-arrow-left']" class="text-primary"
                        :style="{ cursor: 'pointer' }" />
                </span>
                <span class="header-title">
                    Employee Withholding Certificate (W-4)
                </span>
            </div>
        </header>
        <main class="p-4">
            <section>
                <h5 class="section_title text-cerulean">
                    A. State W-4 Form
                </h5>
                <hr />
                <div v-if="W4FormFileData.length > 0 && !formData.isSubmittedHR">
                    <div v-for="(item, index) in W4FormFileData" :key="index">
                        <fs-row class="mb-3">
                            <fs-col md="4" class="tax-box-left display-flex justify-content-center flex-column">
                                <div class="d-flex align-items-center gap-3">
                                    <font-awesome-icon :icon=faFilePdf size="2x" class="tax-text-blue" />
                                    <fs-link v-if="item.fileName" class="tax-text-blue" style="textDecoration: none"
                                        @click="handleDownloadStaticFile(formatStateName(item.stateName), false)">{{
                                            item.fileName }}

                                    </fs-link>
                                    <div v-else class="tax-text-red">No Data Found.</div>
                                </div>
                                <div class="d-flex align-items-center gap-3 mt-3">
                                    <fs-link v-if="item.fileWorkSheetName" class="tax-text-blue"
                                        @click="handleDownloadStaticFile(item.fileWorkSheetName, true)">Worksheet</fs-link>
                                    <fs-link v-if="item.fileInstructName" class="tax-text-blue"
                                        @click="handleDownloadStaticFile(item.fileInstructName, false)">Instruction</fs-link>
                                </div>
                            </fs-col>
                            <fs-col md="8" class="tax-box-right">
                                <div>
                                    <!-- Show List of Files Uploaded -->
                                    <div v-show="getFileData(item.stateEnum).length > 0" class="flex-grow-1">
                                        <div class="d-flex align-items-center gap-2"
                                            v-for="(file) in getFileData(item.stateEnum)" :key="file.fileName">
                                            <uploaded-file :file="file" />
                                        </div>
                                    </div>
                                </div>
                            </fs-col>
                        </fs-row>
                    </div>
                </div>
                <div v-if="formData.isSubmittedHR" class="mb-4">
                    I have submitted a hard copy of the document directly to the HR department.
                </div>
            </section>
            <section>
                <h5 class="section_title text-cerulean">
                    B. Federal W-4 Form
                </h5>
                <hr />

                <div>
                    <div>
                        <div>See the Federal W-4 Form filling instruction <fs-link
                                @click="handleDownloadStaticFile(StaticFiles.FEDERAL_W4_INSTRUCTIONS, false)"
                                class="desc-link">here.</fs-link>
                        </div>
                        <div class="tax-withholding-steps mt-2 mb-2">STEP 1: Personal Information</div>
                        <div class="d-flex gap-2">
                            <div class="form_section">(a)</div>
                            <div class="flex-grow-1">
                                <fs-row>
                                    <fs-col cols="4" class="p-0">
                                        <fs-input :required="true" v-model="formData.firstName" type="fsTextInput"
                                            label="First Name" :rules="{ required: true }" name="firstName"
                                            disabled></fs-input>
                                    </fs-col>
                                    <fs-col class="px-4">
                                        <fs-input :required="true" v-model="formData.middleName" type="fsTextInput"
                                            label="Middle Initial" :rules="{ required: true }" name="middleName"
                                            disabled></fs-input>
                                    </fs-col>
                                    <fs-col cols="4" class="p-0">
                                        <fs-input :required="true" v-model="formData.lastName" type="fsTextInput"
                                            label="Last Name" :rules="{ required: true }" name="lastName"
                                            disabled></fs-input>
                                    </fs-col>
                                </fs-row>
                                <fs-row>
                                    <fs-col md="12" class="p-0">
                                        <fs-input :required="true" v-model="formData.address1" type="fsTextInput"
                                            label="Address Line 1" :rules="{ required: true }" name="address1" disabled />
                                    </fs-col>
                                </fs-row>
                                <fs-row>
                                    <fs-col md="12" class="p-0">
                                        <fs-input v-model="formData.address2" type="fsTextInput" label="Address Line 2"
                                            name="address2" disabled />
                                    </fs-col>
                                </fs-row>
                                <fs-row>
                                    <fs-col cols="4" class="p-0">
                                        <fs-input :required="true" v-model="formData.city" type="fsTextInput"
                                            label="City or Town" :rules="{ required: true }" name="city" disabled />
                                    </fs-col>
                                    <fs-col class="px-4">
                                        <fs-input label="State" type="fsMultiselectList" :typeaheaddata="mappedStates"
                                            typeaheadkey="value" typeaheadvalueattribute="value" placeholder="" name="state"
                                            v-model="formData.state" :required="true" disabled />
                                    </fs-col>
                                    <fs-col cols="4" class="p-0">
                                        <fs-input :required="true" v-model="formData.zipcode" type="fsTextInput"
                                            label="Zipcode" :rules="{ required: true }" name="zipcode" disabled />
                                    </fs-col>
                                </fs-row>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <div class="form_section">(b)</div>
                            <div class="flex-grow-1">
                                <fs-row>
                                    <fs-col cols="4" class="p-0">
                                        <fs-input type="fsTextInput" :input-type="checkIconSsn ? 'password' : 'text'"
                                            v-model="formData.ssn" rules="ssn" name="SSN" label="SSN"
                                            maskFormat="###-##-####" disabled>
                                            <template #input-group-content>
                                                <fs-button class="fs-input__overlap-button"
                                                    @click="checkIconSsn = !checkIconSsn" variant="outline-secondary">
                                                    <font-awesome-icon :icon="checkIconSsn
                                                        ? 'fa-light fa-eye'
                                                        : 'fa-light fa-eye-slash'
                                                        " />
                                                </fs-button>
                                            </template>
                                        </fs-input>
                                    </fs-col>
                                    <fs-col cols="8" class="pl-2 pr-0">
                                        <div class="tax-card-header">Does your name match the name on your social
                                            security card?
                                        </div>
                                        <div class="tax-card-content">If not, to ensure you get credit for your
                                            earnings,
                                            contact SSA at<br>
                                            800-772-1213 or go to <a href="https://www.ssa.gov/" target="_blank"
                                                class="text-success" :style="{ textDecoration: 'none' }">www.ssa.gov.</a>
                                        </div>
                                    </fs-col>
                                </fs-row>
                            </div>
                        </div>
                        <div class="d-flex gap-2">
                            <div class="form_section">(c)</div>
                            <div class="flex-grow-1">
                                <VeeField v-model="formData.filingStatusId" name="filingStatus" rules="required">
                                    <fs-form-group name="unit-options">
                                        <fs-form-radio disabled v-model="formData.filingStatusId" name="unit-options"
                                            :value="FilingStatus.SINGLE_OR_MARRIED"><b>Single</b> or
                                            <b>Married filing separately</b></fs-form-radio>
                                        <fs-form-radio disabled v-model="formData.filingStatusId" name="unit-options"
                                            :value="FilingStatus.MARRIED_OR_QUALIFIYNG"><b>Married filing
                                                jointly</b> or <b>Qualifying surviving spouse</b>
                                        </fs-form-radio>
                                        <fs-form-radio disabled v-model="formData.filingStatusId" name="unit-options"
                                            :value="FilingStatus.HEAD_OF_HOUSEHOLD"><b>Head
                                                of
                                                household</b>
                                            <span style="color:#6E7C8F"> (Check only if you’re unmarried and pay
                                                more than half of the
                                                costs
                                                of keeping up a home for yourself and a
                                                qualifying individual.)</span>
                                        </fs-form-radio>
                                    </fs-form-group>
                                </VeeField>
                                <ErrorMessage class="message-error" name="maritalStatus" />
                            </div>
                        </div>
                        <div class="notice mb-4">
                            <font-awesome-icon class="notice__file" icon="fa-light fa-file-circle-exclamation" size="3x" />
                            <div>
                                <div class="text-bold">
                                    Complete Steps 2-4 ONLY if they apply to you; otherwise, skip to Step 5.
                                </div>
                                <div>
                                    See page 1 of the instruction for more information on each step, who can claim
                                    exemption from
                                    withholding,
                                    other
                                    details, and privacy.
                                </div>
                            </div>
                        </div>
                        <div class="tax-withholding-steps">STEP 2: Multiple Jobs or Spouse Works</div>
                        <div>
                            Complete this step if you (1) hold more than one job at a time, or (2) are married
                            filing jointly and
                            your spouse also works. The correct amount of withholding depends on income earned from
                            all these
                            jobs.
                        </div>
                        <div class="mt-3">
                            Do <b>only one</b> of the following:
                        </div>
                        <div class="my-2">
                            <span class="mx-3 text-bold">(a)</span>Reserved for future use.
                        </div>
                        <div class="mb-2">
                            <span class="mx-3 text-bold">(b)</span>Use the Multiple Jobs Worksheet on page 2 and
                            enter the result
                            in Step 4(c) below; <b>or</b>
                        </div>
                        <div class="d-flex mb-2">
                            <span class="mx-3 mb-2 text-bold">(c)</span> <fs-form-checkbox :disabled="true"
                                v-model="formData.isTwoJobs" name="isTwoJobs">
                                If there are only two jobs total, you may check this box.
                                Do the same on Form W-4 for the other job. This option is generally more accurate
                                than (b) if pay at
                                the lower paying job is more than half of the pay at the higher paying job.
                                Otherwise, (b) is more
                                accurate.
                            </fs-form-checkbox>
                        </div>
                        <div class="mt-3 mb-2"><b>TIP:</b> If you have self-employment income, see page 1 on the
                            instruction.</div>
                        <div class="notice mb-4">
                            <font-awesome-icon class="notice__file" icon="fa-light fa-file-circle-exclamation" size="3x" />
                            <div>
                                <div class="text-bold">
                                    Complete Steps 3-4(b) on Form W-4 for only ONE of these jobs.
                                </div>
                                <div>
                                    Leave those steps blank for the other jobs. (Your withholding will be most accurate
                                    if you complete
                                    Steps 3-4(b) on the Form W-4 for the highest paying job.)
                                </div>
                            </div>
                        </div>
                        <div class="tax-withholding-steps">
                            STEP 3: Claim Dependent and Other Credits
                        </div>
                        <div class="mb-2">
                            If your total income will be $200,000 or less ($400,000 or less
                            if married filing jointly):
                        </div>
                        <fs-row class="d-flex mb-2">
                            <fs-col cols="8">
                                Multiply the number of qualifying children under age 17 by $2,000.
                            </fs-col>
                            <fs-col cols="4" class="p-0">
                                <div class="currency_input">
                                    <fs-input type="fsCurrencyInput" v-model="formData.numberQualifyingChildren" disabled
                                        prepend="$" :config="fsCurrencyConfig" />
                                </div>

                            </fs-col>
                        </fs-row>
                        <fs-row class="mb-2">
                            <fs-col cols="8">
                                Multiply the number of other dependents by $500.
                            </fs-col>
                            <fs-col cols="4" class="p-0">
                                <div class="currency_input">
                                    <fs-input type="fsCurrencyInput" v-model="formData.numberOtherDependents" disabled
                                        prepend="$" :config="fsCurrencyConfig" />
                                </div>
                            </fs-col>
                        </fs-row>
                        <fs-row class="mb-4">
                            <fs-col cols="8" class="p-0 pr-2">
                                Add the amounts above for qualifying children and other dependents.
                                You may add to this the amount of any other credits.
                            </fs-col>
                            <fs-col cols="4" class="p-0">
                                <div class="currency_input">
                                    <fs-input type="fsCurrencyInput" v-model="formData.amountAboveQualifying" disabled
                                        prepend="$" :config="fsCurrencyConfig" />
                                </div>
                            </fs-col>
                        </fs-row>
                        <div class="tax-withholding-steps">STEP 4 (optional): Other Adjustments</div>
                        <fs-row class="mb-2">
                            <fs-col cols="8" class="p-0">
                                <fs-row>
                                    <fs-col cols="1" class="p-0 text-bold">(a)</fs-col>
                                    <fs-col cols="11" class="p-0">
                                        <div class="mb-3 text-bold">
                                            Other income (not from jobs).
                                        </div>
                                        <div>
                                            If you want tax withheld for other income you expect this year that won’t have
                                            withholding, enter the amount of other income her. This may include interest,
                                            dividends, and retirement income.
                                        </div>
                                    </fs-col>
                                </fs-row>
                            </fs-col>
                            <fs-col cols="4" class="p-0">
                                <div class="currency_input">
                                    <fs-input type="fsCurrencyInput" v-model="formData.otherIncome" disabled prepend="$"
                                        :config="fsCurrencyConfig" />
                                </div>
                            </fs-col>
                        </fs-row>
                        <fs-row class="mb-2">
                            <fs-col cols="8" class="p-0">
                                <fs-row>
                                    <fs-col cols="1" class="p-0 text-bold">(b)</fs-col>
                                    <fs-col cols="11" class="p-0">
                                        <div class="mb-3 text-bold">
                                            Deductions
                                        </div>
                                        <div>
                                            If you expect to claim deductions other than the standard deduction and want to
                                            reduce your withholding, use the Deductions Worksheet on page 3 and enter the
                                            result here.
                                        </div>
                                    </fs-col>
                                </fs-row>
                            </fs-col>
                            <fs-col cols="4" class="p-0">
                                <div class="currency_input">
                                    <fs-input type="fsCurrencyInput" v-model="formData.deductionsWorksheet" disabled
                                        prepend="$" :config="fsCurrencyConfig" />
                                </div>
                            </fs-col>
                        </fs-row>
                        <fs-row class="mb-4">
                            <fs-col cols="8" class="p-0">
                                <fs-row>
                                    <fs-col cols="1" class="p-0 text-bold">(c)</fs-col>
                                    <fs-col cols="11" class="p-0">
                                        <div class="mb-3 text-bold">
                                            Extra Withholding
                                        </div>
                                        <div>
                                            Enter any additional tax you want withheld each <strong>pay period.</strong>
                                        </div>
                                    </fs-col>
                                </fs-row>
                            </fs-col>
                            <fs-col cols="4" class="p-0">
                                <div class="currency_input">
                                    <fs-input type="fsCurrencyInput" v-model="formData.extraWithHolding" disabled
                                        prepend="$" :config="fsCurrencyConfig" />
                                </div>
                            </fs-col>
                        </fs-row>
                        <div class="tax-withholding-steps">STEP 5: Sign here</div>
                        <div class="mb-2">
                            Under penalties of perjury, I declare that this certificate, to the best of my knowledge and
                            belief, is
                            true, correct, and complete.
                        </div>
                        <fs-row>
                            <fs-col cols="12" class="mb-2 p-0">
                                <VeeField v-model="formData.employeeSignaturePath" name="signature">
                                    <SignaturePad v-if="isLoaded" :isEdit="false" :path="formData?.employeeSignaturePath"
                                        ref="signaturePad" :isViewOnly="true" :isDisabledAll="true" />
                                </VeeField>
                                <ErrorMessage class="message-error" name="signature" />
                            </fs-col>
                            <fs-col cols="6" class="p-0">
                                <fs-form-group class="form_group">
                                    <div class="label-required gap-0">
                                        <div>Date</div>
                                        <font-awesome-icon :icon="['fas', 'asterisk']" />
                                    </div>
                                    <div class="d-flex" style="gap:10px">
                                        <fs-form-input v-model="dateUTC" disabled></fs-form-input>
                                        <fs-form-input v-model="timeUTC" type="time" disabled></fs-form-input>
                                    </div>
                                </fs-form-group>

                            </fs-col>
                        </fs-row>
                    </div>
                </div>
            </section>
        </main>
    </div>
</template>

<style lang="scss" scoped>
$black: #15181c;
$gray: #95989a;
$green: #1abc9c;
$orange: #f79f1f;
$blue: #03a9f4;
$red: #fc5555;
$white: #fff;

.header-title {
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
}

.sticky {
    position: sticky;
    top: 0;
    left: 0;
    background-color: #fff;
    z-index: 10;
}

.section_title {
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    text-transform: uppercase;
}

.row {
    padding: 0;
    margin: 0;
}

.tax-withholding-label {
    font-weight: 700;
    font-size: 16px;
    line-height: 22px;
    text-transform: uppercase;
    color: $blue;
}

.tax-withholding-steps {
    font-weight: 700;
    font-size: 16px;
    color: $black;
    padding: 4px 0;
}

.bv-no-focus-ring {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

input[type="checkbox"]:checked,
input[type="radio"]:checked {
    background-color: $blue;
    border-color: $blue;
}

input[type="checkbox"]:focus,
input[type="radio"]:focus {
    box-shadow: unset !important;
}

.label-required {
    display: flex;
    align-items: center;
    font-weight: 700;
    font-size: 14px;
    line-height: 22px;
    text-align: center;
    color: $black;
    gap: 5px;
}

.required {
    color: $red;
}

.desc-link {
    color: #1abc9c;
}

.tax-card-header {
    font-weight: 600;
    font-size: 14px;
    line-height: 14px;
    color: #6e7c8f;
}

.tax-card-content {
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    color: #6e7c8f;

    &__link {
        color: #1abc9c;
    }
}

.tax-box-left {
    padding: 16px;
    border: 1px solid #e1e4e8;
    border-radius: 6px 0 0 6px;
    -webkit-border-radius: 6px 0 0 6px;
    -moz-border-radius: 6px 0 0 6px;
    -ms-border-radius: 6px 0 0 6px;
    -o-border-radius: 6px 0 0 6px;
}

.tax-text-blue {
    color: $blue;
}

.tax-text-red {
    color: $red;
}

.tax-box-right {
    display: flex;
    align-items: center;
    padding: 16px;
    border: 1px solid #e1e4e8;
    border-radius: 0 6px 6px 0;
    -webkit-border-radius: 0 6px 6px 0;
    -moz-border-radius: 0 6px 6px 0;
    -ms-border-radius: 0 6px 6px 0;
    -o-border-radius: 0 6px 6px 0;
}

.tax-holding-btn {
    background-color: #fff;
    border-left: none;
    border-top: solid $gray 1px;
    border-right: solid $gray 1px;
    border-bottom: solid $gray 1px;
    border-radius: 0px 5px 5px 0;
    -webkit-border-radius: 0px 5px 5px 0;
    -moz-border-radius: 0px 5px 5px 0;
    -ms-border-radius: 0px 5px 5px 0;
    -o-border-radius: 0px 5px 5px 0;
    min-height: 35px;
}

.message-error {
    margin: 5px 0;
    color: $red;
    display: block;
}

.tax-holding-ssn {
    position: relative;

    .icon-eye {
        color: $gray;
        padding-left: 4px;
        cursor: pointer;
        height: 16px;
        width: 20px;
        position: absolute;
        right: 0;
        top: 50%;
        transform: translate(-50%, -50%);
    }
}

.notice {
    padding: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
    border: 1.5px dashed $orange;
    border-radius: 6px;

    &__file {
        color: $orange;
    }
}

.text-bold {
    font-weight: bold;
}

.pl-2 {
    padding-left: 2rem;
}

.b-textfield .b-fieldtrigger {
    right: 0;
}

.b-textfield .b-fieldtrigger.b-icon-remove {
    right: 20px;
}

.b-pickerfield {
    width: 100%;
}

.pointer-style {
    cursor: pointer;
}

.tax-note {
    color: $gray;
    font-weight: 400;
    font-size: 12px;
    line-height: 20px;
}

.form_section {
    display: inline-block;
    line-height: 14px;
    font-weight: 700;
    font-size: 12px;
}

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

:deep(input[type="checkbox"]:checked),
:deep(input[type="radio"]:checked) {
    background-color: #03a9f4;
    border-color: #03a9f4;
}

:deep(.currency_input > .fs-input__form-group, .b-field-inner) {
    margin: 0;
    padding: 0;
}

.header {
    height: 80px;
    border-bottom: 1px solid #e1e4e8;
}
</style>