import EmployeeOnboarding from '@/models/employees/EmployeeOnboarding';
import { acceptHMRUpdate, defineStore } from "pinia";
import { computed, ref } from "vue";
import type { Ref } from "vue";

export const useEmployeeOnboardingStore = defineStore("employeeOnboarding", () => {
    const employeeOnboarding: Ref<EmployeeOnboarding> = ref(new EmployeeOnboarding());
    const getEmployeeOnboarding = computed(() => {
        return employeeOnboarding.value;
    });

    async function fetchEmployeeOnboarding(id: string | number): Promise<void> {
        employeeOnboarding.value = {
            employeeId: "1",
            onboardingId: "1",
            dateStarted: "06/01/2022",
            dateCompleted: null,
            lastAccessed: "06/10/2022",
            onboardingProgress: 25
        }
    }

    return {
        employeeOnboarding,
        getEmployeeOnboarding,
        fetchEmployeeOnboarding
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useEmployeeOnboardingStore, import.meta.hot));
}