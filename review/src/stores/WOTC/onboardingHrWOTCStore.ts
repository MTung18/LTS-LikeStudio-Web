import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { onboardingWOTC8850EssApi } from "../../axios/instances/onboardingHrWOTC8850EssApi";
import { onboardingWOTC8850HrApi } from "../../axios/instances/onboardingHrWOTC8850HrApi";
import { onboardingWOTC9061EssApi } from "../../axios/instances/onboardingHrWOTC9061EssApi";
import { onboardingWOTC9061HrApi } from "../../axios/instances/onboardingHrWOTC9061HrApi";
import { onboardingHrWOTCApi } from "../../axios/instances/onboardingHrWOTCApi";
import { HrOnboardingWOTC } from "../../models/onboarding/WOTC/OnboardingHrWOTC";
import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";
import { FormT } from "../../models/onboarding/WOTC/OnboardingQuickHireWOTC";

export const useOnboardingHrWOTCStore = defineStore("onboardingHrWOTC", () => {
  const onboardingHrWOTC = ref<UploadPayload<HrOnboardingWOTC>>();

  const is8850DoneByFile = ref(false);
  const is9061DoneByFile = ref(false);
  const is9062Done = ref(false);
  const is8850EssDone = ref(false);
  const is9061EssDone = ref(false);
  const is8850HrDone = ref(false);
  const is9061HrDone = ref(false);
  const has9061EmployeeSignature = ref(false);

  async function getOnboardingHrWOTC(
    employeeId: number,
    formId: number
  ): Promise<void> {
    onboardingHrWOTC.value = await onboardingHrWOTCApi.getOnboardingHrWOTC(
      employeeId,
      formId
    );

    const uploadFiles = onboardingHrWOTC.value.uploadFileStateForms;
    is8850DoneByFile.value = !!uploadFiles?.some(
      (item) => item.payload.type === FormT.upload8850
    );
    is9061DoneByFile.value = !!uploadFiles?.some(
      (item) => item.payload.type === FormT.upload9061
    );
    is9062Done.value = !!uploadFiles?.some(
      (item) => item.payload.type === FormT.upload9062
    );
  }

  async function updateOnboardingHrWOTC(
    employeeId: number,
    formData: Partial<UploadPayload<HrOnboardingWOTC>>
  ): Promise<void> {
    await onboardingHrWOTCApi.updateOnboardingHreWOTC(employeeId, formData);
  }

  async function get8850EssStatus(employeeId: number, formId: number) {
    const onboarding8850Ess =
      await onboardingWOTC8850EssApi.getOnboardingWOTC8850Ess(
        employeeId,
        formId
      );
    is8850EssDone.value = !!onboarding8850Ess.fieldModels.find(
      (item) => item.fieldKey === "isFormDone"
    )?.fieldValue;
  }

  async function get8850HrStatus(employeeId: number, formId: number) {
    const onboarding8850Hrs =
      await onboardingWOTC8850HrApi.getOnboardingWOTC8850Hr(employeeId, formId);
    is8850HrDone.value = !!onboarding8850Hrs.fieldModels.find(
      (item) => item.fieldKey === "isFormDone"
    )?.fieldValue;
  }

  async function get9061EssStatus(employeeId: number, formId: number) {
    const onboarding9061Ess =
      await onboardingWOTC9061EssApi.getOnboardingWOTC9061Ess(
        employeeId,
        formId
      );
    is9061EssDone.value = !!onboarding9061Ess.fieldModels.find(
      (item) => item.fieldKey === "isFormDone"
    )?.fieldValue;

    has9061EmployeeSignature.value = !!onboarding9061Ess.fieldModels.find(
      (item) => item.fieldKey === "employeeSignaturePath"
    )?.fieldValue
  }

  async function get9061HrStatus(employeeId: number, formId: number) {
    const onboarding9061Hr =
      await onboardingWOTC9061HrApi.getOnboardingWOTC9061Hr(employeeId, formId);
    is9061HrDone.value = !!onboarding9061Hr.fieldModels.find(
      (item) => item.fieldKey === "isFormDone"
    )?.fieldValue;
  }

  return {
    onboardingHrWOTC,
    getOnboardingHrWOTC,
    updateOnboardingHrWOTC,
    get8850EssStatus,
    get8850HrStatus,
    get9061EssStatus,
    get9061HrStatus,
    is8850HrDone,
    is9061HrDone,
    is8850EssDone,
    is9061EssDone,
    is8850DoneByFile,
    is9061DoneByFile,
    is9062Done,
    has9061EmployeeSignature
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOnboardingHrWOTCStore, import.meta.hot)
  );
}
