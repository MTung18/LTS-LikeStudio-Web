import { acceptHMRUpdate, defineStore } from 'pinia';
import { employeePayrollAndTaxesApi } from '../axios/instances/employeePayrollAndTaxApi';

export const useEmployeePayrollAndTaxStore = defineStore('employeePayrollAndTaxStore', () => {
    async function switchEmployeePaymentMethod(employeeId: number, isDirectDeposit: boolean): Promise<boolean> {
        return await employeePayrollAndTaxesApi.switchEmployeePaymentMethodAsync(isDirectDeposit, employeeId);
    }

    return { switchEmployeePaymentMethod }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useEmployeePayrollAndTaxStore, import.meta.hot));
}