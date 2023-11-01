import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import FormField from "@/models/onboarding/FormField";
import { onboardingVEVRAASelfIdentificationApi } from "@/axios/instances/onboardingVEVRAASelfIdentificationApi";
import { OnboardingFormVEVRAAModel } from "@/models/onboarding/OnboardingVEVRAASelfIdentificationUploadFile";

export const useOnboardingVEVRAASelfIdentificationStore = defineStore(
  "onboardingVEVRAASelfIdentification",
  () => {
    const onboardingVEVRAASelfIdentification = ref<Partial<OnboardingFormVEVRAAModel>>();
    const onboardingVEVRAAFileData: Ref<any> = ref()

    const fetchVEVRAASelfIdentification = async (employeeId: number, formId: number) => {
      onboardingVEVRAASelfIdentification.value =
        await onboardingVEVRAASelfIdentificationApi.getVEVRAASelfIdentificationByEmployeeId(
          employeeId,
          formId
        );
      onboardingVEVRAAFileData.value = await onboardingVEVRAASelfIdentificationApi.getVEVRAAFile(
        employeeId,
        formId
      );
    }

    const updateVEVRAASelfIdentificationById = async ({
      employeeId,
      formData,
    }: {
      employeeId: number;
      formData: any;
    }) => {
      await onboardingVEVRAASelfIdentificationApi.updateVEVRAASelfIdentificationById(
        employeeId,
        formData
      );
    };

    return {
      fetchVEVRAASelfIdentification,
      onboardingVEVRAASelfIdentification,
      updateVEVRAASelfIdentificationById,
      onboardingVEVRAAFileData
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOnboardingVEVRAASelfIdentificationStore, import.meta.hot)
  );
}
