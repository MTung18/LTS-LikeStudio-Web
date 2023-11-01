import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import { onboardingQuickHireEEOApi } from "../axios/instances/onboardingEEOApi";
import OnboardingQuickHireEEO from "../models/onboarding/OnboardingQuickHireEEO";

export const useOnboardingQuickHireEEOStore = defineStore("onboardingQuickHireEEO", () => {
    const onboardingQuickHireEEO: Ref<OnboardingQuickHireEEO | undefined> = ref(undefined);

    async function getOnboardingQuickHireEEO(employeeId: number, formId: number) {
        onboardingQuickHireEEO.value = await onboardingQuickHireEEOApi.getOnboardingQuickHireEEO(employeeId, formId);
    }

    async function updateOnboardingQuickHireEEOForm(employeeId: number, formData: OnboardingQuickHireEEO) {
        await onboardingQuickHireEEOApi.updateOnboardingQuickHireEEO(employeeId, formData);
    }

    return {
        onboardingQuickHireEEO,
        getOnboardingQuickHireEEO,
        updateOnboardingQuickHireEEOForm
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useOnboardingQuickHireEEOStore, import.meta.hot)
    );
}
