import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { onboardingWOTC9061HrApi } from "../../axios/instances/onboardingHrWOTC9061HrApi";
import { OnboardingWOTC9061Hr } from "../../models/onboarding/WOTC/HrOnboardingWOTC9061Hr";
import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";

export const useOnboardingWOTC9061Store = defineStore(
  "hrOnboardingWOTC9061Hr",
  () => {
    const form9061Data = ref<Partial<UploadPayload<OnboardingWOTC9061Hr>>>();

    const fetchForm9061Data = async (employeeId: number, formId: number) => {
      form9061Data.value = await onboardingWOTC9061HrApi .getOnboardingWOTC9061Hr(
        employeeId,
        formId
      );
    };

    const updateForm9061Data = async ({
      employeeId,
      formData,
    }: {
      employeeId: number;
      formData: any;
    }) => {
      await onboardingWOTC9061HrApi.updateOnboardingWOTC9061Hr(
        employeeId,
        formData
      );
    };

    return {
      form9061Data,
      fetchForm9061Data,
      updateForm9061Data,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOnboardingWOTC9061Store, import.meta.hot)
  );
}
