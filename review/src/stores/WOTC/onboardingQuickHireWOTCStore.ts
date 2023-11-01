import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import OnboardingQuickHireWOTC from "../../models/onboarding/WOTC/OnboardingQuickHireWOTC";
import { onboardingQuickHireWOTCApi } from "../../axios/instances/onboardingQuickHireWOTCApi";
import { UploadPayload } from "@/models/onboarding/WOTC/UploadPayload";

export const useOnboardingQuickHireWOTCStore = defineStore(
  "onboardingQuickHireWOTC",
  () => {
    const onboardingQuickHireWOTC = ref<UploadPayload<OnboardingQuickHireWOTC>>();

    async function getOnboardingQuickHireWOTC(
      employeeId: number,
      formId: number
    ): Promise<void> {
      onboardingQuickHireWOTC.value =
        await onboardingQuickHireWOTCApi.getOnboardingQuickHireWOTC(
          employeeId,
          formId
        );
    }

    async function updateOnboardingQuickHireWOTC(
      employeeId: number,
      formData: Partial<UploadPayload<OnboardingQuickHireWOTC>>
    ): Promise<void> {
      await onboardingQuickHireWOTCApi.updateOnboardingQuickHireWOTC(
        employeeId,
        formData
      );
    }

    return {
      onboardingQuickHireWOTC,
      getOnboardingQuickHireWOTC,
      updateOnboardingQuickHireWOTC,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOnboardingQuickHireWOTCStore, import.meta.hot)
  );
}
