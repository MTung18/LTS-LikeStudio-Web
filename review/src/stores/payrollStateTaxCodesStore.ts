import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, Ref } from  "vue";
import { payrollStateTaxCodeApi } from "@/axios/instances/payrollStateTaxCodeApi";
import PayrollStateTaxCode from "@/models/foundationIntegration/PayrollStateTaxCode";

export const usePayrollStateTaxCodesStore = defineStore("payrollStateTaxCodes", () => {
    const payrollStateTaxCode: Ref<PayrollStateTaxCode[]> = ref([])

    async function fetchPayrollStateTaxCodes(): Promise<void> {
        payrollStateTaxCode.value = await payrollStateTaxCodeApi.getPayrollStateTaxCodes();
    }

    return {
        payrollStateTaxCode,
        fetchPayrollStateTaxCodes
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(usePayrollStateTaxCodesStore, import.meta.hot));
}
