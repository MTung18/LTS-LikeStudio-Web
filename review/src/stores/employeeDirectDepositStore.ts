import { ref, Ref } from 'vue';
import { acceptHMRUpdate, defineStore } from 'pinia'
import { EmployeeDirectDeposit } from '@/models/employees/employeeDirectDepositModel';
import { ExtendedEmployeeDirectDeposit } from '@/models/directDeposit/extendedEmployeeDirectDeposit';
import { WhqEmployeeDirectDepositApi } from '@/axios/instances/employeeDirectDepositsApi';
import DirectDepositMasterData from '@/models/directDeposit/directDepositMasterData';
import { WHQApiError } from '@/models/error/WHQApiError';
import _ from 'lodash';
import { useAlerts } from '@/composables/useAlerts';
import { encodeBase64 } from '@/functions/FormatterUtilityFunction';

export const useEmployeeDirectDepositStore = defineStore('employeeDirectDepositStore', () => {
    const employeeDirectDeposit: Ref<EmployeeDirectDeposit[]> = ref(new Array<EmployeeDirectDeposit>());
    const employeeAccountList: Ref<ExtendedEmployeeDirectDeposit[]> = ref(new Array<ExtendedEmployeeDirectDeposit>());
    const originalAccountList: Ref<EmployeeDirectDeposit[]> = ref(new Array<EmployeeDirectDeposit>());
    const directDepositsToSubmit: Ref<ExtendedEmployeeDirectDeposit[]> = ref([]);
    const masterData: Ref<DirectDepositMasterData> = ref(new DirectDepositMasterData());
    const submitAPIError: Ref<WHQApiError> = ref();
    const { notifyError } = useAlerts();
    
    // UNCOMMENT ALL THE COMMENT CODE RELATED TO THIS VARIABLE TO ENABLE MULTI EMPLOYEE SUPPORT FOR UNSUBMITTED CHANGES
    // const multiEmployeeDirectDepositsToSubmit: Ref<{ [key: string]: ExtendedEmployeeDirectDeposit[] }> = ref();
    // const multiEmployeeOriginalAccountList: Ref<{ [key: string]: ExtendedEmployeeDirectDeposit[] }> = ref();

    async function upsertEmployeeDirectDeposits(dataToUpdate: ExtendedEmployeeDirectDeposit) {
        //Push all the direct deposit once to submit data and update the value when it is update
        if (directDepositsToSubmit.value?.length <= 0) {
            directDepositsToSubmit.value = originalAccountList.value.map(p => new ExtendedEmployeeDirectDeposit(p));
        }
        // if (multiEmployeeDirectDepositsToSubmit.value[dataToUpdate.employeeId]) {
        //     multiEmployeeDirectDepositsToSubmit.value[dataToUpdate.employeeId] = originalAccountList.value.map(p => new ExtendedEmployeeDirectDeposit(p));
        // }
        updateDirectDepositData(dataToUpdate);
    }

    function assignEmployeeDirectDeposits(data: ExtendedEmployeeDirectDeposit[]) {
        //Push all the direct deposit once to submit data and update the value when it is update
        directDepositsToSubmit.value = data;
    }

    function updateDirectDepositData(dataToUpdate: ExtendedEmployeeDirectDeposit) {
        if (dataToUpdate) {
            var currentDirectDeposit = directDepositsToSubmit.value.findIndex(a => a.employeeDirectDepositId === dataToUpdate.employeeDirectDepositId);
            if (currentDirectDeposit > -1) {
                directDepositsToSubmit.value[currentDirectDeposit] = dataToUpdate;
            } else {
                directDepositsToSubmit.value.push(dataToUpdate);
            }
            // var currentDirectDeposit = multiEmployeeDirectDepositsToSubmit.value[dataToUpdate.employeeId].findIndex(a => a.employeeDirectDepositId === dataToUpdate.employeeDirectDepositId);
            // if (currentDirectDeposit > -1) {
            //     multiEmployeeDirectDepositsToSubmit.value[dataToUpdate.employeeId][currentDirectDeposit] = dataToUpdate;
            // } else {
            //     multiEmployeeDirectDepositsToSubmit.value[dataToUpdate.employeeId].push(dataToUpdate);
            // }
        }
    }

    async function removeDirectDepositData(employeeDirectDepositId: number) {
        var currentDirectDeposit = directDepositsToSubmit.value.findIndex(a => a.employeeDirectDepositId === employeeDirectDepositId);
        if (currentDirectDeposit > -1) {
            directDepositsToSubmit.value.splice(currentDirectDeposit, 1);
        }
        // var currentDirectDeposit = multiEmployeeDirectDepositsToSubmit.value[employeeId].findIndex(a => a.employeeDirectDepositId === employeeDirectDepositId);
        // if (currentDirectDeposit > -1) {
        //     multiEmployeeDirectDepositsToSubmit.value[employeeId].splice(currentDirectDeposit, 1);
        // }
    }

    async function clearUpsertEmployeeDirectDeposits() {
        directDepositsToSubmit.value = [];
        // multiEmployeeDirectDepositsToSubmit.value[employeeId] = [];
    }

    async function fetchEmployeeDirectDeposits(employeeId: number, isDataFromUpdateState = false) {
        if (!isDataFromUpdateState) {
            employeeDirectDeposit.value = await WhqEmployeeDirectDepositApi.fetchDirectDeposit(employeeId);
        } else {
            if (directDepositsToSubmit.value.length > 0) {
                employeeAccountList.value = directDepositsToSubmit.value;
                // employeeAccountList.value = multiEmployeeDirectDepositsToSubmit.value[employeeId];
            } else {
                const data = await WhqEmployeeDirectDepositApi.fetchDirectDeposit(employeeId);
                employeeAccountList.value = data.map(x => new ExtendedEmployeeDirectDeposit(x));
                originalAccountList.value = _.cloneDeep(employeeAccountList.value);
                // multiEmployeeOriginalAccountList.value[employeeId] = _.cloneDeep(employeeAccountList.value);

            }
        }
    }

    async function deleteEmployeeDirectDeposits(employeeId: number, id: number): Promise<boolean> {
        try {
            return await WhqEmployeeDirectDepositApi.deleteDirectDeposit(employeeId, id, true);
        } catch (error) {
            if (error instanceof WHQApiError) {
                notifyError(error?.failureItems[0]?.failureReason);
            }
        }
    }

    async function submitDirectDeposit(data: EmployeeDirectDeposit[], employeeId: number): Promise<boolean> {
        try {
            // To avoid WAF rule error encode to base 64 before sending it
            data.forEach(element => {
                element.voidedCheckFilePath = encodeBase64(element.voidedCheckFilePath);
                element.description = encodeBase64(element.description);
                // Remove additional property to be send on api to avoid WAF Rule error 
                delete (element as any).file;
                delete (element as any).id;
            });
            return await WhqEmployeeDirectDepositApi.submitEmployeeDirectDeposit(data, employeeId);
        }
        catch (error) {
            submitAPIError.value = error;
            return false;
        }
    }

    async function getEmployeeDirectDepositsMasterData(employeeId: number): Promise<void> {
        masterData.value = await WhqEmployeeDirectDepositApi.getDirectDepositMasterData(employeeId);
    }

    async function getPaymentMethod(employeeId: number): Promise<boolean> {
        return await WhqEmployeeDirectDepositApi.getPaymentMethod(employeeId);
    }

    async function editPaymentMethod(employeeId: number): Promise<boolean> {
        return await WhqEmployeeDirectDepositApi.editPaymentMethod(employeeId);
    }

    return {
        fetchEmployeeDirectDeposits,
        deleteEmployeeDirectDeposits,
        employeeDirectDeposit,
        getEmployeeDirectDepositsMasterData,
        masterData,
        employeeAccountList,
        originalAccountList,
        submitDirectDeposit,
        assignEmployeeDirectDeposits,
        upsertEmployeeDirectDeposits,
        removeDirectDepositData,
        clearUpsertEmployeeDirectDeposits,
        directDepositsToSubmit,
        getPaymentMethod,
        editPaymentMethod,
        submitAPIError
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useEmployeeDirectDepositStore, import.meta.hot));
}