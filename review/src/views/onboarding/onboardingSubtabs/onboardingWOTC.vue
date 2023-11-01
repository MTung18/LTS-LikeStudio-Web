<script lang="ts" setup>
import { computed } from 'vue';
import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from 'pinia';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
// STORES
const route = useRoute();
const router = useRouter();
const { fetchEmployeeDetails } = useEmployeeStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
// CONST

const employeeId = computed(() => route.params.id);
onMounted(async () => {
    // CHECK EMPLOYEE CURRENT STATUS
    await fetchEmployeeDetails(employeeId.value as string);
    if (Number(employeeDetails.value.employeeStatusId) === EmployeeStatusEnum.QuickHire) {
        router.push({ name: 'onboardingQuickHireWOTC' })
    }
})

</script>

<template>
    <router-view></router-view>
</template>

<style scoped></style>
