import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import { onboardingEmployerInformationApi } from "../axios/instances/onboardingEmployerInformationApi";
import OnboardingEmployerInformation from "../models/onboarding/OnboardingEmployerInformation";

export const useOnboardingEmployerInformationStore = defineStore("onboardingEmployerInformation", () => {
    const onboardingEmployerInformation: Ref<OnboardingEmployerInformation | undefined> = ref(undefined);

    async function getOnboardingEmployerInformation(employeeId: number, formId: number) {
        onboardingEmployerInformation.value = await onboardingEmployerInformationApi.getOnboardingEmployerInformation(employeeId, formId)
    }

    async function updateOnboardingEmployerInformation(employeeId: number, formData: OnboardingEmployerInformation) {
        await onboardingEmployerInformationApi.updateOnboardingEmployerInformation(employeeId, formData);
    }

    return {
        onboardingEmployerInformation,
        getOnboardingEmployerInformation,
        updateOnboardingEmployerInformation
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useOnboardingEmployerInformationStore, import.meta.hot)
    );
}