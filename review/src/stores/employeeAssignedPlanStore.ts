import { acceptHMRUpdate, defineStore } from "pinia";
import { historyPlanType } from "@/axios/instances/historyOfPlanTypeApi";
import { employeeAccrualPlanApi } from "@/axios/instances/employeeAccrualPlanApi";
import { RestOfTimeOff } from "@/models/employees/timeOff/RestOfTimeOff";
export const useEmployeeAssignedPlanStore = defineStore(
  "employeeAssignedPlan",
  () => {
    async function getRestTimeOff(empId, accrualCodeFsNo): Promise<RestOfTimeOff> {
      return await historyPlanType.getRestTimeOff(
        empId, accrualCodeFsNo
      );
    }
    async function getPlanTypeHistories(employeeId, accrualCodeFsNo) {
      return await employeeAccrualPlanApi.getAccrualUsages(employeeId, accrualCodeFsNo);
    }

    return {
      getRestTimeOff,
      getPlanTypeHistories
    };
  }
);
if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useEmployeeAssignedPlanStore, import.meta.hot)
  );
}
