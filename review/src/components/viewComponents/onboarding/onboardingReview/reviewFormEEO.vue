<script lang="ts" setup>
import { computed, ref, onMounted } from 'vue';
import type { Ref } from 'vue';

import { useRoute } from 'vue-router';
import { storeToRefs } from 'pinia';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { FileInputData } from "@/models/onboarding/W4/W4FormFile";
import { FormField } from "@/enums/FormField";
import { truncateFileName } from '@/utilities/formatUtils';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faEye, faEyeSlash, faFileCircleExclamation, faFilePdf, faPaperclip, faTrashCan, faArrowUpFromBracket } from "@fortawesome/pro-light-svg-icons";
import { faFloppyDisk } from '@fortawesome/pro-regular-svg-icons';
import { useEmployeeStore } from '@/stores/employeeStore';
import { useHQSuiteStore } from "@/stores/hqSuiteStore";
import { useOnboardingEEOSelfIdentificationStore } from "@/stores/onboardingEEOSelfIdentificationStore";
import { useOnboardingQuickHireEEOStore } from "@/stores/onboardingQuickHireEEOStore";
import { previewFile } from '@/utilities/fileUtils';
import { useLoadingStore } from '@/stores/loadingStore';

const { setLoading } = useLoadingStore()
const { onboardingQuickHireEEO } = storeToRefs(useOnboardingQuickHireEEOStore())
// STORES
library.add(faEyeSlash, faPaperclip, faEye, faFileCircleExclamation, faFilePdf, faFloppyDisk, faTrashCan, faArrowUpFromBracket);

// CONST
const { getOnboardingQuickHireEEO } = useOnboardingQuickHireEEOStore();
const hqSuiteStore = useHQSuiteStore();
const { employeeDetails, employeeStatusId } = storeToRefs(useEmployeeStore());
const { fetchEmployeeStatusId } = useEmployeeStore();
const {
    getOnboardingEEOSelfIdentification,
    genderList,
    raceList,
} = useOnboardingEEOSelfIdentificationStore();
const { onboardingEEOSelfIdentification } = storeToRefs(useOnboardingEEOSelfIdentificationStore());

const route = useRoute();
const employeeId = computed(() => route.params.id);
const EEOFileData: Ref<FileInputData[]> = ref([]);
const onboardingEEOData = ref({
    firstName: '',
    middleInitial: '',
    lastName: '',
    jobTitle: '',
    gender: null,
    race: null,
    signaturePath: '',
    date: '',
    time: '',
    note: '',
});

const signatureBase64Url = ref('');

async function convertToBase64(path: string, base64Url: Ref<string>) {
    try {
        const res = await hqSuiteStore.getFile(path);
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onloadend = async function () {
            base64Url.value = reader.result as string;
        }
    } catch (error) {
        base64Url.value = ''
    }
}

function formatTime(time: string) {
    if (!time) return;
    const parts = time.split("-");
    return parts[1] + "-" + parts[2] + "-" + parts[0];
}

onMounted(async () => {
    setLoading(true);
    if (!employeeStatusId.value) {
        await fetchEmployeeStatusId(employeeId.value as string);
    }
    if (Number(employeeStatusId.value) === EmployeeStatusEnum.QuickHire) {
        if (!onboardingQuickHireEEO.value) {
            await getOnboardingQuickHireEEO(Number(employeeId.value), FormField.EEOQuickHire);
        }
        onboardingQuickHireEEO.value.uploadFileStateForms.forEach((file) => {
            EEOFileData.value.push({
                fileName: file.fileName,
                filePath: file.filePath
            })
        })
    } else if (Number(employeeStatusId.value) === EmployeeStatusEnum.Onboard) {
        if (!onboardingEEOSelfIdentification.value) {
            await getOnboardingEEOSelfIdentification(Number(employeeId.value), FormField.EEOOnboard);
        }
        const data = onboardingEEOSelfIdentification.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
            if (fieldValue !== undefined) {
                acc[fieldKey] = fieldValue;
            }
            return acc as any;
        }, {});
        onboardingEEOSelfIdentification.value.uploadFileStateForms.forEach((file) => {
            EEOFileData.value.push({
                fileName: file.fileName,
                filePath: file.filePath
            })
        })
        onboardingEEOData.value = data;
        convertToBase64(onboardingEEOData.value.signaturePath, signatureBase64Url);
    }
    setLoading(false);
});



</script>

<template>
    <div class="mb-3 px-3"> 
        <fs-row>
        <fs-col cols="2" class="fw-bold">
            Note
        </fs-col>
        <fs-col cols="10">
            {{ onboardingEEOData?.note }}
        </fs-col>
        </fs-row>
    </div>
    <div v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.QuickHire" class="file_list">
        <div v-for="document in EEOFileData" :key="document.filePath" class="file_item d-flex align-items-center mb-1 p">
            <font-awesome-icon :icon="['fal', 'paperclip']" />
            <fs-link @click="previewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
                <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
            </fs-link>
        </div>
        <div v-if="!EEOFileData.length">No file submitted.</div>
    </div>
    <div class="p-2" v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.Onboard">
        <div id="summarySection" class="mb-2" v-if="EEOFileData.length || onboardingEEOData?.note">
            <div v-for="document in EEOFileData" :key="document.filePath"
                class="file_item d-flex align-items-center mb-1 p">
                <font-awesome-icon :icon="['fal', 'paperclip']" />
                <fs-link @click="previewFile(document)" class="d-flex" style="margin-left: 10px; width: 200px;">
                    <span style="flex: 1"> {{ truncateFileName(document.fileName) }}</span>
                </fs-link>
            </div>
        </div>
        <fs-container fluid>
            <fs-row class="mb-1">
                <fs-col cols="3" class="label">Full Name</fs-col>
                <fs-col>{{ onboardingEEOData?.firstName }} {{ onboardingEEOData?.middleInitial }} {{
                    onboardingEEOData?.lastName
                }}</fs-col>
            </fs-row>
            <fs-row class="mb-1">
                <fs-col cols="3" class="label">Job Title</fs-col>
                <fs-col>{{ onboardingEEOData?.jobTitle }}</fs-col>
            </fs-row>
            <fs-row class="mb-1">
                <fs-col cols="3" class="label">Gender</fs-col>
                <fs-col>{{ genderList.find((gender) => gender.value == onboardingEEOData?.gender)?.text }}</fs-col>
            </fs-row>
            <fs-row class="mb-1">
                <fs-col cols="3" class="label">Race/Ethinicity</fs-col>
                <fs-col>{{ raceList.find((race) => race.id == onboardingEEOData?.race)?.value }}</fs-col>
            </fs-row>
            <fs-row class="mb-3">
                <fs-col cols="12" class="label">Employee Signature</fs-col>
                <fs-col cols="8">
                    <div class="card p-4" :style="{ border: '1px solid #E1E4E8', borderRadius: '3px' }">
                        <div v-if="!signatureBase64Url">Unable to get employee's signature</div>
                        <img v-if="signatureBase64Url" class="img-fluid" :src="signatureBase64Url"
                            alt="employee signature" />
                    </div>
                </fs-col>
            </fs-row>
            <fs-row class="mb-1">
                <fs-col cols="3" class="label">Date</fs-col>
                <fs-col>
                    <span>{{ formatTime(onboardingEEOData?.date) || '' }} - {{ onboardingEEOData?.time || '' }}</span>
                </fs-col>
            </fs-row>
        </fs-container>
    </div>
</template>

<style lang="scss" scoped>
#summarySection {
    padding: 12px;
    border-radius: 10px;
}

.label {
    font-weight: 700;
    font-size: 14px;
    line-height: 150%;
}
</style>
