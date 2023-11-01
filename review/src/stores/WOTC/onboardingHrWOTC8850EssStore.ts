import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { onboardingWOTC8850EssApi } from "../../axios/instances/onboardingHrWOTC8850EssApi";
import { onboardingWOTC9061EssApi } from "../../axios/instances/onboardingHrWOTC9061EssApi";
import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";
import { OnboardingWOTC8850Ess } from "../../models/onboarding/WOTC/HrOnboardingWOTC8850Ess";

export const useOnboardingWOTC8850Store = defineStore(
  "hrOnboardingWOTC8850Ess",
  () => {
    const form8850Data = ref<Partial<UploadPayload<OnboardingWOTC8850Ess>>>();
    const isDoneForm8850 = ref(false);
    const isDoneForm9061 = ref(false);
    const isForm9061Available = ref(false);

    const fetchForm8850Data = async (employeeId: number, formId: number) => {
      form8850Data.value =
        await onboardingWOTC8850EssApi.getOnboardingWOTC8850Ess(
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
      await onboardingWOTC8850EssApi.updateOnboardingWOTC8850Ess(
        employeeId,
        formData
      );
    };

    const getForm9061Status = async (employeeId: number, formId: number) => {
      const form9061Data =
        await onboardingWOTC9061EssApi.getOnboardingWOTC9061Ess(
          employeeId,
          formId
        );
      const form8850Data =
        await onboardingWOTC8850EssApi.getOnboardingWOTC8850Ess(
          employeeId,
          formId
        );
      isForm9061Available.value = !form8850Data.fieldModels.find(
        (item) => item.fieldKey === "isReceivedAConditional"
      )?.fieldValue;
      isDoneForm9061.value = form9061Data.fieldModels.find(
        (item) => item.fieldKey === "isFormDone"
      )?.fieldValue as boolean;
    };

    const getForm8850Status = async (employeeId: number, formId: number) => {
      const form8850Data =
        await onboardingWOTC8850EssApi.getOnboardingWOTC8850Ess(
          employeeId,
          formId
        );
      isDoneForm8850.value = form8850Data.fieldModels.find(
        (item) => item.fieldKey === "isFormDone"
      )?.fieldValue as boolean;
    };

    const changeForm9061Available = (val: boolean) => {
      isForm9061Available.value = val;
    };

    return {
      form8850Data,
      fetchForm8850Data,
      updateForm8850Data,
      getForm9061Status,
      getForm8850Status,
      changeForm9061Available,
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
