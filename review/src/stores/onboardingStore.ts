import { acceptHMRUpdate, defineStore } from 'pinia';
import { whqOnboardingApi } from "@/axios/instances/whqOnboardingApi";
import { whqOnboardingESSApi } from "@/axios/instances/whqOnboardingESSApi";
import CurrentOnboards, { EmployeeOnboardList } from "@/models/CurrentOnboards";
import OnboardingPlan from "@/models/onboarding/OnboardingPlan";
import OnboardingSummary from "@/models/onboarding/OnboardingSummary";
import OnboardingProgress from "@/models/onboarding/onboardingProgress";
import { ref, Ref } from "vue";
import { useAlerts } from '@/composables/useAlerts';
import { EmployeeOnboardingCountStatuses } from '@/models/onboarding/EmployeeOnboardingCountStatuses';
import { onboardingInformationApi } from "@/axios/instances/onboardingInformationApi";

const { notifyError } = useAlerts();

export const useOnboardingStore = defineStore("onboarding", () => {
  const onboardingSideNavItem: Ref<OnboardingSummary[]> = ref(
    new Array<OnboardingSummary>()
  )
  const onboardingProgress: Ref<OnboardingProgress> = ref(new OnboardingProgress());
  const currentOnboards: Ref<CurrentOnboards[]> = ref(
    new Array<CurrentOnboards>()
  );
  const employeeOnboardList: Ref<EmployeeOnboardList[]> = ref(new Array<EmployeeOnboardList>());
  const onboardingPlanList: Ref<OnboardingPlan[]> = ref(
    new Array<OnboardingPlan>()
  );
  const employeeOnboard: Ref<CurrentOnboards> = ref();
  const employeeOnboardingCountStatuses: Ref<EmployeeOnboardingCountStatuses> = ref(new EmployeeOnboardingCountStatuses());
  async function fetchCurrentOnboards(): Promise<void> {
    currentOnboards.value = await whqOnboardingApi.getCurrentOnboard();
  }

  async function fetchEmployeeOnboardList(tabNumber:number): Promise<void> {
    employeeOnboardList.value = await whqOnboardingApi.getEmployeeOnboardList(tabNumber);
  }

  async function fetchOnboardingList(): Promise<void> {
    onboardingPlanList.value = await whqOnboardingApi.getOnboardingPlans();
  }

  async function changeEmployeeStatus(listEmployeeId: number[], type: number) {
    return await whqOnboardingApi.changeEmployeeStatus(listEmployeeId, type);
  }

  async function fetchOnboardingProgress(): Promise<void> {
    onboardingProgress.value = await whqOnboardingApi.fetchOnboardingProgress();
  }

  async function getOnboardingSideNavItems(employeeId: number): Promise<void> {
    try {
      const paymentMethodSetting = await whqOnboardingApi.getOnboardingPaymentMethodSetting();
      if (!paymentMethodSetting) {
        notifyError('There was an error while fetching payment method setting');
        console.error('There was an error while fetching payment method setting');
        //Show full navbar items
        onboardingSideNavItem.value = await whqOnboardingESSApi.getOnboardingSideNavItems(employeeId);
      }
      if (paymentMethodSetting?.isDirectDeposit) {
        onboardingSideNavItem.value = await whqOnboardingESSApi.getOnboardingSideNavItems(employeeId);
      } else {
        const res = await whqOnboardingESSApi.getOnboardingSideNavItems(employeeId);
        onboardingSideNavItem.value = res.filter((item) => item.progressSidebarUrl !== 'onboardingDirectDeposit')
      }
    } catch (error) {
      onboardingSideNavItem.value = await whqOnboardingESSApi.getOnboardingSideNavItems(employeeId);
      throw error;
    }

  }

  async function markOnboardingSidenavItemAsDone(progressSidebarId: string, isDone: boolean, employeeId: number): Promise<void> {

    const onboardingInformation = await onboardingInformationApi.fetchOnboardingEmployeeInformation(employeeId);
    if (onboardingInformation) {
      if (onboardingInformation.onboardingStartedUTC) {
        await onboardingInformationApi.updateOnboardInformation(employeeId, {
          lastAccessedUTC: new Date().toISOString()
        });
      } else {
        await onboardingInformationApi.updateOnboardInformation(employeeId, {
          onboardingStartedUTC: new Date().toISOString(),
          lastAccessedUTC: new Date().toISOString()
        });
      }
    }

    await whqOnboardingESSApi.markOnboardingSideNavItemAsDone(progressSidebarId, isDone, employeeId);
    await getOnboardingSideNavItems(employeeId);
  }

  async function getEmployeeFormSubmit(employeeId: number): Promise<boolean> {
    return await whqOnboardingApi.getEmployeeFormSubmit(employeeId);
  }

  async function updateForm(employeeIds: number[], isClear: boolean): Promise<void> {
    await Promise.all(employeeIds.map(async (id) => {
      await whqOnboardingApi.updateForm(id, isClear);
    }))
  }

  async function updateMultipleSidebar(listEmployeeId: number[]): Promise<boolean> {
    return await whqOnboardingESSApi.updateMultipleSidebar(listEmployeeId);
  }

  async function clearOnboardingStartedDate(listEmployeeId: number[]): Promise<boolean> {
    return await whqOnboardingESSApi.clearOnboardingStartedDate(listEmployeeId);
  }

  async function fetchOnboardingProgressStatus(): Promise<EmployeeOnboardingCountStatuses> {
    employeeOnboardingCountStatuses.value = await whqOnboardingApi.getOnboardingProgressStatus();
    return employeeOnboardingCountStatuses.value;
  }

  return {
    onboardingPlanList,
    fetchCurrentOnboards,
    fetchOnboardingList,
    currentOnboards,
    employeeOnboard,
    changeEmployeeStatus,
    fetchOnboardingProgress,
    onboardingProgress,
    getOnboardingSideNavItems,
    onboardingSideNavItem,
    markOnboardingSidenavItemAsDone,
    getEmployeeFormSubmit,
    updateForm,
    updateMultipleSidebar,
    fetchEmployeeOnboardList,
    employeeOnboardList,
    clearOnboardingStartedDate,
    fetchOnboardingProgressStatus,
    employeeOnboardingCountStatuses
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOnboardingStore, import.meta.hot));
}
