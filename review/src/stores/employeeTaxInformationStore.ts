import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import { employeeTaxInformationApi } from "../axios/instances/employeeTaxInformationApi";
import { payrollLocalTaxCodeApi } from "../axios/instances/payrollLocalTaxCodeApi";
import { payrollLocalTaxGroupApi } from "../axios/instances/payrollLocalTaxGroupApi";
import { payrollStateTaxCodeApi } from "../axios/instances/payrollStateTaxCodeApi";
import { TaxGroup } from "@/models/foundationIntegration/TaxGroup";
import { LocalTaxCode } from "@/models/foundationIntegration/LocalTaxCode";
import PayrollStateTaxCode from "@/models/foundationIntegration/PayrollStateTaxCode";
import { EmployeeTaxInformation } from "../models/employees/EmployeeTaxInformation";

export const useEmployeeTaxInformationStore = defineStore(
  "employeeTaxInformationStore",
  () => {
    const employeeTaxInformation: Ref<EmployeeTaxInformation> = ref(
      new EmployeeTaxInformation()
    );
    const payrollLocalTaxCodeOptions = ref<LocalTaxCode[]>([]);
    const payrollLocalTaxGroupOptions = ref<TaxGroup[]>([]);
    const payrollStateTaxCodeOptions = ref<PayrollStateTaxCode[]>([]);

    async function fetchEmployeeTaxInformation(employeeId: number) {
      employeeTaxInformation.value =
        await employeeTaxInformationApi.getEmployeeTaxInformation(employeeId);
    }

    async function editEmployeeTaxInformation(
      data: EmployeeTaxInformation
    ): Promise<boolean> {
      const result = await employeeTaxInformationApi.editEmployeeTaxInformation(
        data
      );

      if (result) {
        employeeTaxInformation.value = data;
      }
      return result;
    }

    const fetchPayrollLocalTaxCodeOptions = async (): Promise<void> => {
      payrollLocalTaxCodeOptions.value =
        await payrollLocalTaxCodeApi.getPayrollLocalTaxCodes();
    };

    const fetchPayrollLocalTaxGroupOptions = async (): Promise<void> => {
      payrollLocalTaxGroupOptions.value =
        await payrollLocalTaxGroupApi.getPayrollLocalTaxGroups();
    };

    const fetchPayrollStateTaxCodeOptions = async (): Promise<void> => {
      payrollStateTaxCodeOptions.value =
        await payrollStateTaxCodeApi.getPayrollStateTaxCodes();
    };

    return {
      fetchEmployeeTaxInformation,
      fetchPayrollLocalTaxCodeOptions,
      fetchPayrollLocalTaxGroupOptions,
      fetchPayrollStateTaxCodeOptions,
      editEmployeeTaxInformation,
      employeeTaxInformation,
      payrollLocalTaxCodeOptions,
      payrollLocalTaxGroupOptions,
      payrollStateTaxCodeOptions,
    };
  }
);

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useEmployeeTaxInformationStore, import.meta.hot)
  );
}
