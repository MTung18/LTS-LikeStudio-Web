
import { acceptHMRUpdate, defineStore } from 'pinia';
import { useAlerts } from '@/composables/useAlerts';
import { Ref, ref } from 'vue';
import { OnboardingFormINineModel } from '@/models/onboarding/OnboardingFormINine';
import { OnboardingFormINineApi } from '@/axios/instances/onboardingFormINineApi';
import { OnboardingEmployerFormPayrollInformationApi } from '@/axios/instances/onboardingEmployerPayrollInformationApi'
import { EarnCodes, PayPeriods } from "@/models/onboarding/OnboardingEmployerPayrollInformation";
export const useOnboardingEmployerPayrollInformationStore = defineStore("onboardingEmployerPayrollInformation", () => {
  const { notifySuccess, notifyError } = useAlerts();

  const dataOnboardingEmployerPayrollInformation: Ref<any> = ref()
  const dataPayPeriods: Ref<PayPeriods[]> = ref([]);
  const dataEarnCodes: Ref<EarnCodes[]> = ref([]);

  async function fetchFormPayrollInformation(empId: number, formType: number): Promise<OnboardingFormINineModel[]> {
    let response =
      await OnboardingFormINineApi.getFormINine(empId, formType);
    if (response.length == 0 || response == undefined) {
      response =
        await OnboardingFormINineApi.getFormINine(empId, formType);
    }
    dataOnboardingEmployerPayrollInformation.value = response;
    return dataOnboardingEmployerPayrollInformation.value;
  }

  async function fetchPayPeriods(): Promise<PayPeriods[]> {
    let response = await OnboardingEmployerFormPayrollInformationApi.getPayPeriods();
    if (response.length == 0 || response == undefined) {
      response =
        await OnboardingEmployerFormPayrollInformationApi.getPayPeriods();
    }
    dataPayPeriods.value = response;
    return dataPayPeriods.value;
  }

  async function fetchEarnCodes(): Promise<EarnCodes[]> {
    let response = await OnboardingEmployerFormPayrollInformationApi.getEarnCodes();
    if (response.length == 0 || response == undefined) {
      response =
        await OnboardingEmployerFormPayrollInformationApi.getEarnCodes();
    }
    dataEarnCodes.value = response;
    return dataEarnCodes.value;
  }

  async function editFormPayrollInformation(data: Partial<OnboardingFormINineModel>, formType: number): Promise<void> {
    const res = await OnboardingFormINineApi.updateFormINine(data, formType);
    if (res.success) {
      notifySuccess(`Information updated.`)
    } else {
      notifyError(`Something went wrong! Please try again later`)
    }
  }

  return {
    dataOnboardingEmployerPayrollInformation,
    dataPayPeriods,
    dataEarnCodes,
    editFormPayrollInformation,
    fetchFormPayrollInformation,
    fetchPayPeriods,
    fetchEarnCodes
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOnboardingEmployerPayrollInformationStore, import.meta.hot));
}


