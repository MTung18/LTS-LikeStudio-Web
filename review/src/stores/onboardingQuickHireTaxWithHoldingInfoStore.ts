import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import OnboardingQuickHireTaxWithHoldingInfo from "../models/onboarding/OnboardingQuickHireTaxWithHoldingInfo";
import { onboardingQuickHireTaxWithHoldingInfoApi } from "../axios/instances/onboardingQuickHireTaxWithHoldingInfoApi";

export const useOnboardingQuickHireTaxWithHoldingInfoStore = defineStore("onboardingQuickHireTaxWithHoldingInfo", () => {
    const onboardingQuickHireTaxiWithHoldingInfo: Ref<OnboardingQuickHireTaxWithHoldingInfo | undefined> = ref(undefined);

    async function getOnboardingQuickHireTaxWithHoldingInfo(employeeId: number, formId: number) {
        onboardingQuickHireTaxiWithHoldingInfo.value = await onboardingQuickHireTaxWithHoldingInfoApi.getOnboardingQuickHireTaxWithHoldingInfo(employeeId, formId)
    }

    async function updateOnboardingQuickHireTaxWithHoldingInfo(employeeId: number, formData: OnboardingQuickHireTaxWithHoldingInfo) {
        await onboardingQuickHireTaxWithHoldingInfoApi.updateOnboardingQuickHireTaxWithHoldingInfo(employeeId, formData);
    }

    return {
        onboardingQuickHireTaxiWithHoldingInfo,
        getOnboardingQuickHireTaxWithHoldingInfo,
        updateOnboardingQuickHireTaxWithHoldingInfo
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useOnboardingQuickHireTaxWithHoldingInfoStore, import.meta.hot)
    );
}