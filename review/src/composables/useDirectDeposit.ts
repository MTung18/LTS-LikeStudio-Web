import { Ref, computed, ref } from 'vue';
import { useAlerts } from '@/composables/useAlerts';
import { MESSAGE } from '@/data/message';
import { useEmployeeDirectDepositStore } from '@/stores/employeeDirectDepositStore';
import { storeToRefs } from "pinia";

export function useDirectDeposit<T>(refreshCallBack: any, employeeId: number) {

    const employeeDirectDepositStore = useEmployeeDirectDepositStore();
    const { directDepositsToSubmit } = storeToRefs(employeeDirectDepositStore);

    const selectedRow: Ref<T> = ref();
    const showDeleteModal: Ref<boolean> = ref(false);
    const hasPendingAccountToSubmit = computed(() => {
        var employeeDD = directDepositsToSubmit.value?.filter(x => x.employeeId == employeeId);
        return directDepositsToSubmit.value?.length > 0 && employeeDD?.length > 0;
    });
    const { notifySuccess } = useAlerts();

    async function onDeleteDirectDepositClick(event: any): Promise<void> {
        if (event.record.data) {
            const selectedDD: T = event.record.data;
            selectedRow.value = selectedDD;
            showDeleteModal.value = true;
        }
    }

    async function proceedDirectDepositDelete() {
        if (selectedRow.value) {
            const directDeposit = selectedRow.value as any;
            if (directDeposit?.isNew === true) {
                employeeDirectDepositStore.removeDirectDepositData(directDeposit.employeeDirectDepositId);
                refreshCallBack();
            }
            else {
                if (await employeeDirectDepositStore.deleteEmployeeDirectDeposits(directDeposit.employeeId, directDeposit.employeeDirectDepositId)) {
                    notifySuccess(MESSAGE.DIRECT_DEPOSIT.DELETE_SUCCESS);
                    if (hasPendingAccountToSubmit.value) {
                        const deleteIdIndex = directDepositsToSubmit.value?.findIndex(x => x.employeeDirectDepositId === directDeposit.employeeDirectDepositId);
                        if (deleteIdIndex > -1) {
                            directDepositsToSubmit.value.splice(deleteIdIndex, 1);
                        }
                    }
                    refreshCallBack();
                }
            }
        }
    }

    return {
        proceedDirectDepositDelete,
        onDeleteDirectDepositClick,
        hasPendingAccountToSubmit,
        showDeleteModal,
        selectedRow
    }

}