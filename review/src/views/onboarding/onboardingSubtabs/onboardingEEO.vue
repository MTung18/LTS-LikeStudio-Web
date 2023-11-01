<script lang="ts" setup>
import { computed, onMounted } from 'vue';
import { useEmployeeStore } from '@/stores/employeeStore';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import OnboardingEEOSelfIdentification from '@/views/onboarding/onboardingSubtabs/onboardingEEOSelfIdentification/onboardingEEOSelfIdentification.vue'
import QuickHireEEOSelfIdentification from '@/views/onboarding/onboardingSubtabs/onboardingEEOSelfIdentification/quickHireEEOSelfIdentification.vue';
import { useLoadingStore } from '@/stores/loadingStore';

// STORES
const { employeeDetails } = storeToRefs(useEmployeeStore());
const { fetchEmployeeDetails } = useEmployeeStore();
const route = useRoute();
const { setLoading } = useLoadingStore();


const employeeId = computed(() => route.params.id);

// COMPONENT FUNCTIONS
onMounted(async () => {
    setLoading(true);
    await fetchEmployeeDetails(employeeId.value as string);
    setLoading(false);
})
</script>

<template>
    <div v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.QuickHire">
        <QuickHireEEOSelfIdentification />
    </div>
    <div v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.Onboard">
        <OnboardingEEOSelfIdentification />
    </div>
</template>
