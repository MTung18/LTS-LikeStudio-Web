import { whqEmployeePayrollInformationApi } from "@/axios/instances/EmployeePayrollInformationApi";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import { PayrollInformation } from '../models/employees/PayrollInformation';

export const useEmployeePayrollInformationStore = defineStore("employeePayrollInformation", () => {
  const payrollInformation = ref<PayrollInformation>(new PayrollInformation());

  async function fetchPayrollInformation(employeeId: number | string): Promise<PayrollInformation> {
    const result = await whqEmployeePayrollInformationApi.getPayrollInformation(employeeId);
    payrollInformation.value = result;

    return payrollInformation.value;
  }

  async function editPayrollInformation(data: PayrollInformation): Promise<boolean> {
    const result = await whqEmployeePayrollInformationApi.editPayrollInformation(data);

    if (result) {
      payrollInformation.value = data;
    }

    return result;
  }

  return {
    payrollInformation,
    fetchPayrollInformation,
    editPayrollInformation,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useEmployeePayrollInformationStore, import.meta.hot));
}
