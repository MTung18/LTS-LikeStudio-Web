<script setup lang="ts">
import { Ref, onMounted, ref } from 'vue';
import { useTimeOffPlanStore } from "@/stores/timeOffPlanStore";
import { useRouter } from 'vue-router';
import { FormField } from '@/enums/FormField';
import { OnboardingFormVacation, OnboardingVacation } from '@/models/onboarding/OnboardingVacation';
import { storeToRefs } from 'pinia';
import { useLoadingStore } from '@/stores/loadingStore';

const { setLoading } = useLoadingStore();
const { fetchFormPayrollInformation } = useTimeOffPlanStore();
const { dataOnboardingVacation } = storeToRefs(useTimeOffPlanStore());
const formFieldVacation = ref<OnboardingFormVacation>();
const formModel: Ref<OnboardingVacation> = ref({} as OnboardingVacation);

const router = useRouter();
const employeeId = router.currentRoute.value.params.id;

const mapFieldModelToFormModel = () => {
    const data = formFieldVacation.value.fieldModels.reduce((acc, { fieldKey, fieldValue }) => {
        if (fieldValue !== undefined) {
            acc[fieldKey] = fieldValue;
        }
        return acc as any;
    }, {});
    formModel.value = data;
}

onMounted(async () => {
    setLoading(true);
    await fetchFormPayrollInformation(Number(employeeId), FormField.Vacation);
    formFieldVacation.value = dataOnboardingVacation.value;
    mapFieldModelToFormModel();
    setLoading(false);
});

</script>

<template>
    <fs-container class="mx-0">
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Plan Type
            </fs-col>
            <fs-col cols="3">
                {{ formModel.planType ? formModel.planType.name : '' }}
            </fs-col>
        </div>
        <div class="pt-2 d-flex">
            <fs-col cols="3" class="fw-bold">
                Plan
            </fs-col>
            <fs-col cols="3">
                {{ formModel.plan ? formModel.plan.name : '' }}
            </fs-col>
        </div>
    </fs-container>
</template>

<style scoped></style>
