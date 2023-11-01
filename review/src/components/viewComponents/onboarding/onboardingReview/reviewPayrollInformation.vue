<script setup lang="ts">
import { ref, Ref, onMounted } from 'vue';
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';
import { useOnboardingEmployerPayrollInformationStore } from '@/stores/onboardingEmployerPayrollInformationStore';
import { OnboardingPayrollInformation, OnboardingPayrollInformationModel } from '@/models/onboarding/OnboardingPayrollInformation';
import { FormField } from '@/enums/FormField';
import { useLoadingStore } from '@/stores/loadingStore';

const { setLoading } = useLoadingStore();
const onboardingEmployerPayrollInformationStore = useOnboardingEmployerPayrollInformationStore();
const { dataOnboardingEmployerPayrollInformation } = storeToRefs(useOnboardingEmployerPayrollInformationStore());
const router = useRouter();

const employeeId = router.currentRoute.value.params.id;
const formModel: Ref<OnboardingPayrollInformation> = ref({} as OnboardingPayrollInformation);
const formFieldPayrollInformation: Ref<OnboardingPayrollInformationModel> = ref();

const handleGetPayrollInformation = async () => {
    await onboardingEmployerPayrollInformationStore.fetchFormPayrollInformation(Number(employeeId), FormField.PayrollInformation)
    formFieldPayrollInformation.value = dataOnboardingEmployerPayrollInformation.value

    mapFieldModelToFormModel();
}

const mapFieldModelToFormModel = () => {
    const data = formFieldPayrollInformation.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
            acc[fieldKey] = fieldValue;
        }
        return acc as any;
    }, {});
    formModel.value = data;

    if (formModel.value.hoursRequiredForSalary == "") formModel.value.hoursRequiredForSalary = false;
    if (formModel.value.certifiedPayroll == "") formModel.value.certifiedPayroll = false;
    if (formModel.value.futaFusaExempt == "") formModel.value.futaFusaExempt = false;
}

const getBooleanValue = (data: string | boolean): string => {
    return (data == "" || data == false) ? "No" : "Yes"
}

onMounted(async () => {
    setLoading(true);
    await handleGetPayrollInformation();
    setLoading(false);
})

</script>

<template>
    <fs-container>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Pay Type
            </fs-col>
            <fs-col cols="3">
                {{ formModel.payType ? formModel.payType?.text : '' }}
            </fs-col>
        </div>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Earn Code
            </fs-col>
            <fs-col cols="3">
                {{ formModel.earnCode ? formModel.earnCode?.earnCodeName : '' }}
            </fs-col>
        </div>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Pay Period
            </fs-col>
            <fs-col cols="3">
                {{ formModel.payPeriod ? formModel.payPeriod?.payPeriodName : '' }}
            </fs-col>
        </div>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Pay Rate per Pay Period
            </fs-col>
            <fs-col cols="3">
                {{ formModel.payRatePerPayPeriod ? formModel.payRatePerPayPeriod : '' }}
            </fs-col>
        </div>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Pay Periods per Year
            </fs-col>
            <fs-col cols="3">
                {{ formModel.payPeriodsPerYear ? formModel.payPeriodsPerYear : '' }}
            </fs-col>
        </div>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Hours Required for Salary
            </fs-col>
            <fs-col cols="3">
                {{ getBooleanValue(formModel.hoursRequiredForSalary) }}
            </fs-col>
        </div>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Certified Payroll
            </fs-col>
            <fs-col cols="3">
                {{ getBooleanValue(formModel.certifiedPayroll) }}
            </fs-col>
        </div>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                FUTA/FUSA Exempt
            </fs-col>
            <fs-col cols="3">
                {{ getBooleanValue(formModel.futaFusaExempt) }}
            </fs-col>
        </div>
    </fs-container>
</template>

<style scoped></style>
