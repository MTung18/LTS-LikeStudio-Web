<script lang="ts" setup>
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from 'pinia';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import OnboardingTaxWithHoldingInfoSummary from '@/views/onboarding/onboardingSubtabs/onboardingTaxWithHoldingInfo/onboardingTaxWithHoldingInfoSummary.vue';
import OnboardingQuickHireTaxWithHoldingInfo from '@/views/onboarding/onboardingSubtabs/onboardingTaxWithHoldingInfo/onboardingQuickHireTaxWithHoldingInfo.vue';
import { useLoadingStore } from '@/stores/loadingStore';
// STORES
const route = useRoute();
const { fetchEmployeeDetails } = useEmployeeStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const { setLoading } = useLoadingStore();
// CONST
const employeeId = computed(() => route.params.id);
onMounted(async () => {
  setLoading(true);
  await fetchEmployeeDetails(employeeId.value as string);
  setLoading(false);
})

</script>
<template>
  <div v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.QuickHire">
    <OnboardingQuickHireTaxWithHoldingInfo />
  </div>
  <div v-if="Number(employeeDetails.employeeStatusId) === EmployeeStatusEnum.Onboard">
    <OnboardingTaxWithHoldingInfoSummary />
  </div>
</template>
<style scoped></style>