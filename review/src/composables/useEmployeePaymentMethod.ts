import { onMounted, ref } from 'vue';
import { useEmployeePayrollInformationStore } from '@/stores/employeePayrollInformationStore';
import { storeToRefs } from 'pinia';


export function useEmployeePaymentMethod(employeeId: number) {
    const employeePayrollAndTaxStore = useEmployeePayrollInformationStore();
    const { payrollInformation } = storeToRefs(employeePayrollAndTaxStore);
    const isEmployeeDirectDepositEnabled = ref(false);
    const isEmployeePaperCheckEnabled = ref(false);

    onMounted(async () => {
        await employeePayrollAndTaxStore.fetchPayrollInformation(employeeId);
        if (payrollInformation.value?.isDirectDepositEnabled) {
            isEmployeeDirectDepositEnabled.value = true;
        } else {
            isEmployeePaperCheckEnabled.value = true;
        }

    });
    return {
        isEmployeeDirectDepositEnabled,
        isEmployeePaperCheckEnabled
    }

}