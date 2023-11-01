
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useAlerts } from '@/composables/useAlerts';
import { Ref, ref } from 'vue';
import { OnboardingFormINineModel } from '@/models/onboarding/OnboardingFormINine';
import { OnboardingFormINineApi } from '@/axios/instances/onboardingFormINineApi';
export const useOnboardingFormINineStore = defineStore("onboardingFormINine", () => {
  const { notifySuccess, notifyError } = useAlerts();

  const dataOnboardingFormINine: Ref<any> = ref()

  async function fetchFormINine(employeeId: number, formType: number): Promise<OnboardingFormINineModel[]> {
    let response =
      await OnboardingFormINineApi.getFormINine(employeeId, formType);
    if (response.length == 0 || response == undefined) {
      response =
        await OnboardingFormINineApi.getFormINine(employeeId, formType);
    }
    dataOnboardingFormINine.value = response;
    return dataOnboardingFormINine.value;
  }

  async function editFormINine(data: Partial<OnboardingFormINineModel>, formType: number): Promise<void> {
    const res = await OnboardingFormINineApi.updateFormINine(data, formType);
    if (res.success) {
      notifySuccess('Information updated.')
    } else {
      notifyError('Something went wrong! Please try again later')
    }
  }
  return {
    dataOnboardingFormINine,
    editFormINine,
    fetchFormINine
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOnboardingFormINineStore, import.meta.hot));
}


