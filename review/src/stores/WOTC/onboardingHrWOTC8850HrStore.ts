import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { onboardingWOTC8850HrApi } from "../../axios/instances/onboardingHrWOTC8850HrApi";
import { OnboardingWOTC8850Hr } from "../../models/onboarding/WOTC/HrOnboardingWOTC8850Hr";
import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";

export const useOnboardingWOTC8850Store = defineStore(
  "hrOnboardingWOTC8850Hr",
  () => {
    const form8850Data = ref<Partial<UploadPayload<OnboardingWOTC8850Hr>>>();
    const isDoneForm8850 = ref(false);
    const isDoneForm9061 = ref(false);
    const isForm9061Available = ref(false);

    const fetchForm8850Data = async (employeeId: number, formId: number) => {
      form8850Data.value = await onboardingWOTC8850HrApi.getOnboardingWOTC8850Hr(
        employeeId,
        formId
      );
    };

    const updateForm8850Data = async ({
      employeeId,
      formData,
    }: {
      employeeId: number;
      formData: any;
    }) => {
      await onboardingWOTC8850HrApi.updateOnboardingWOTC8850Hr(
        employeeId,
        formData
      );
    };

    return {
      form8850Data,
      fetchForm8850Data,
      updateForm8850Data,
      isDoneForm8850,
      isDoneForm9061,
      isForm9061Available,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOnboardingWOTC8850Store, import.meta.hot)
  );
}
