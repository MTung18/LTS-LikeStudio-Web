import { VacationPlan } from "@/models/employees/timeOff/VacationPlan";
import { VacationType } from "@/models/employees/timeOff/VacationType";
import { TimeOffPlanTree } from "@/models/employees/timeOff/TimeOffPlan";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import { timeOffPlanApi } from "@/axios/instances/timeOffPlanApi";
import { employeeAccrualPlanApi } from "@/axios/instances/employeeAccrualPlanApi";
import { AssignedVacationPlans } from "@/models/employees/timeOff/AssignedVacationPlans";
import { OnboardingFormVacation } from '@/models/onboarding/OnboardingVacation';

export const useTimeOffPlanStore = defineStore("useTimeOffPlan", () => {
  const timeOffPlanTree: Ref<TimeOffPlanTree[]> = ref(new Array<TimeOffPlanTree>());
  const timeOffPlanList: Ref<TimeOffPlanTree[]> = ref(new Array<TimeOffPlanTree>());
  const vacationPlanName: Ref<VacationPlan[]> = ref(new Array<VacationPlan>());
  const vacationType: Ref<VacationType[]> = ref(new Array<VacationType>());
  const employeePlanType: Ref<VacationType[]> = ref(new Array<VacationType>());
  const assignedVacationPlans: Ref<AssignedVacationPlans> = ref(
    {} as AssignedVacationPlans
  );
  const dataOnboardingVacation: Ref<any> = ref()

  async function fetchVacationList(employeeId, hasPlanBeenAssigned): Promise<void> {
    vacationPlanName.value = await timeOffPlanApi.getAccrualPlans(employeeId, hasPlanBeenAssigned);
    vacationType.value = await timeOffPlanApi.getAccrualCodes(employeeId);
  }

  async function fetchTimeOffPlantList(empId): Promise<void> {
    timeOffPlanList.value = [];
    timeOffPlanTree.value = [];
    timeOffPlanList.value = await timeOffPlanApi.getTimeOffPlan(empId);
    if (timeOffPlanList.value.length) {
      const listPlanType = [...new Set(timeOffPlanList.value.map(val => val.planType))];
      for (let i = 0; i < listPlanType.length; i++) {
        const getFilterData = timeOffPlanList.value.filter(data => data.planType === listPlanType[i]);
        const data: TimeOffPlanTree = {
          id: i,
          isActive: null,
          startDate: "",
          planTypeId: null,
          vacationPlanId: null,
          planType: listPlanType[i],
          planName: listPlanType[i],
          employeeId: null,
          expanded: true,
          children: getFilterData.map(child => {
            child.parentId = i;
            return child;
          })
        }
        timeOffPlanTree.value.push(data);
      }
    }
  }

  async function getListVacationPlan(planTypeId: number): Promise<void> {
    vacationPlanName.value = await timeOffPlanApi.getVacationPlansByPlanId(planTypeId);
  }

  async function fetchFormPayrollInformation(empId: number, formType: number): Promise<void> {
    dataOnboardingVacation.value = await timeOffPlanApi.getFormVacation(empId, formType);
  }

  async function updateOnboardingVacation(employeeId: number, formData: OnboardingFormVacation) {
    await timeOffPlanApi.updateOnboardingFormVacation(employeeId, formData);
  }

  async function fetchListOfEmployeePlanType(employeeId: any): Promise<void> {
    employeePlanType.value = await employeeAccrualPlanApi.getEmployeePlanTypes(employeeId);
  }

  async function updateListPlanOfEmployee(dataForm): Promise<boolean> {
    return await timeOffPlanApi.updateTimeOffPlanToEmployee(dataForm);
  }

  async function addListPlanOfEmployee(dataForm): Promise<boolean> {
    return await timeOffPlanApi.addTimeOffPlanToEmployee(dataForm);
  }

  async function hasActivePlanWithType(employeeId: any, accrualPlanId: number): Promise<boolean> {
    return await employeeAccrualPlanApi.hasActivePlanWithType(employeeId, accrualPlanId);
  }

  async function fetchAssignedVacationPlans(employeeId: number): Promise<void> {
    assignedVacationPlans.value = await timeOffPlanApi.getAssignedVacationPlans(employeeId);
  }

  async function updateAssignedVacationPlans(data: AssignedVacationPlans): Promise<void> {
    return await timeOffPlanApi.upsertAssignedVacationPlans(data);
  }

  return {
    fetchTimeOffPlantList,
    fetchVacationList,
    timeOffPlanList,
    timeOffPlanTree,
    vacationPlanName,
    vacationType,
    dataOnboardingVacation,
    updateListPlanOfEmployee,
    addListPlanOfEmployee,
    employeePlanType,
    fetchListOfEmployeePlanType,
    getListVacationPlan,
    fetchFormPayrollInformation,
    updateOnboardingVacation,
    hasActivePlanWithType,
    fetchAssignedVacationPlans,
    assignedVacationPlans,
    updateAssignedVacationPlans
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTimeOffPlanStore, import.meta.hot));
}
