import { acceptHMRUpdate, defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { whqPayrollApi } from "@/axios/instances/whqPayrollApi";
import type { Payroll, updateAvailableDateToEmployee } from "@/models/payroll/Payroll";
import FsPaystubDetail from "@/models/payroll/PayrollHistory";

export const usePayrollStore = defineStore("payroll", () => {
  const payrollList: Ref<Payroll[]> = ref(new Array<Payroll>());
  const fsPaystubDetail: Ref<FsPaystubDetail> = ref(null);

  async function fetchPayrollList(employeeId: string, year: number): Promise<void> {
    payrollList.value = await whqPayrollApi.getPayrollListByEmployeeId(employeeId, year);
  }

  async function fetchPayrollDetails(employeeId: string, checkDate: string): Promise<void> {
    fsPaystubDetail.value = await whqPayrollApi.getPayrollDetails(employeeId, checkDate);
  }

  async function updateAvailablePayrollDateToEmployee(data: updateAvailableDateToEmployee): Promise<void> {
    whqPayrollApi.updateAvailablePayrollDateToEmployee(data)
  }

  return {
    payrollList,
    fsPaystubDetail,
    fetchPayrollList,
    fetchPayrollDetails,
    updateAvailablePayrollDateToEmployee
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(usePayrollStore, import.meta.hot));
}
