import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import { OnboardingTaxWithholdingInfoSummary } from "../models/onboarding/onboardingTaxWithholdingInfoSummary";
import { onboardingTaxWithHoldingInfoSummaryApi } from "../axios/instances/onboardingTaxWithHoldingInfoSummaryApi";

export const useOnboardingTaxWithHoldingInfoSummaryStore = defineStore("onboardingTaxWithHoldingInfoSummaryStore", () => {
    const onboardingTaxWithHoldingInfoSummary: Ref<OnboardingTaxWithholdingInfoSummary | undefined> = ref(undefined);

    async function getOnboardingTaxWithHoldingInfoSummary(employeeId: number, formId: number) {
        onboardingTaxWithHoldingInfoSummary.value = await onboardingTaxWithHoldingInfoSummaryApi.getOnboardingTaxWithHoldingInfoSummary(employeeId, formId)
    }

    async function updateOnboardingQuickHireTaxWithHoldingInfo(employeeId: number, formData: OnboardingTaxWithholdingInfoSummary) {
        await onboardingTaxWithHoldingInfoSummaryApi.updateOnboardingTaxWithHoldingInfoSummary(employeeId, formData);
    }

    return {
        onboardingTaxWithHoldingInfoSummary,
        getOnboardingTaxWithHoldingInfoSummary,
        updateOnboardingQuickHireTaxWithHoldingInfo
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useOnboardingTaxWithHoldingInfoSummaryStore, import.meta.hot)
    );
}