import { computed, ref, Ref } from 'vue';
import { defineStore } from 'pinia'
import { WhqGeneralClientSettingApi } from '../axios/instances/generalClientSettingApi';
import { ESSGeneralClientSettingApi } from '../axios/instances/generalClientSettingEssApi';
import { useAlerts } from '@/composables/useAlerts';
import { GeneralClientSetting } from '../models/generalClientSetting';
import { PaymentMethod } from '@/models/settings/PaymentMethod';
import { LOCAL_STORAGE_KEY } from '@/constants/localStorageKey'
import { useAzureB2CAuthStore } from './azureB2CAuthStore';

export const useGeneralClientSettingStore = defineStore('GeneralClientSetting', () => {

    const generalClientSetting: Ref<GeneralClientSetting> = ref<GeneralClientSetting>({} as GeneralClientSetting);
    const clientPaymentMethod: Ref<PaymentMethod> = ref<PaymentMethod>();

    const azureB2CAuthStore = useAzureB2CAuthStore();
    const RemainderKey = computed(() => `${azureB2CAuthStore.activeUserGuid}_${LOCAL_STORAGE_KEY.DirectDepositRemainderDismissed}`);

    async function fetchGeneralClientSetting() {
        try {
            generalClientSetting.value = await WhqGeneralClientSettingApi.getGeneralClientSettingAsync();
            let isReminded = generalClientSetting.value?.isReminderForDirectDepositNotification;
            if (isReminded) {
                isReminded = !(localStorage.getItem(RemainderKey.value)?.toLowerCase() == 'true');
            }
            clientPaymentMethod.value = {
                isDirectDeposit: generalClientSetting.value?.isDirectDeposit,
                isPaperCheck: generalClientSetting.value?.isPaperCheck,
                isReminded: isReminded
            };
        } catch {
            generalClientSetting.value = new GeneralClientSetting();
            clientPaymentMethod.value = new PaymentMethod();
        }
    }

    async function savePaymentMethod(paymentMethod: PaymentMethod) {
        clientPaymentMethod.value = paymentMethod;
    }

    async function upsertGeneralClientSetting(data: GeneralClientSetting, allowEmptyContact: boolean = false) {
        if (allowEmptyContact) {
            //Make empty when it null 
            if (!data.hRContactEmail) {
                data.hRContactEmail = '';
            }
            if (!data.hRContactPhoneNumber) {
                data.hRContactPhoneNumber = '';
            }
        }
        return await WhqGeneralClientSettingApi.upsertGeneralClientSettingAsync(data, allowEmptyContact);
    }


    async function isAnyEmployeeProfileLocked() {
        return await WhqGeneralClientSettingApi.checkAnyProfileIsLocked();
    }

     async function switchEmployeesPaymentMethodByClientAsync(isDirectDeposit: boolean, isPaperCheck: boolean): Promise<boolean> {
        return await ESSGeneralClientSettingApi.switchEmployeesPaymentMethodByClientAsync(isDirectDeposit, isPaperCheck);
    }

    return {
        fetchGeneralClientSetting,
        upsertGeneralClientSetting,
        savePaymentMethod,
        isAnyEmployeeProfileLocked,
        clientPaymentMethod,
        generalClientSetting,
        switchEmployeesPaymentMethodByClientAsync
    }
});