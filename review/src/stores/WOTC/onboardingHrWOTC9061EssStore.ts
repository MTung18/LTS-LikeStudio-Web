import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { onboardingWOTC9061EssApi } from "../../axios/instances/onboardingHrWOTC9061EssApi";
import { OnboardingWOTC9061Ess } from "../../models/onboarding/WOTC/HrOnboardingWOTC9061Ess";
import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";

export const useOnboardingWOTC9061Store = defineStore(
  "hrOnboardingWOTC9061Ess",
  () => {
    const form9061Data = ref<Partial<UploadPayload<OnboardingWOTC9061Ess>>>();

    const fetchForm9061Data = async (employeeId: number, formId: number) => {
      form9061Data.value = await onboardingWOTC9061EssApi .getOnboardingWOTC9061Ess(
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
      await onboardingWOTC9061EssApi.updateOnboardingWOTC9061Ess(
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
