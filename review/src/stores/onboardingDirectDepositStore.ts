import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import { onboardingDirectDepositApi } from "../axios/instances/onboardingDirectDepositApi";
import { APPROVAL_STATUS } from "../constants/common";
import DirectDepositAccount, { DirectDepositMetaDataT, MetaFieldT } from "../models/onboarding/OnboardingDirectDeposit";


export const useOnboardingDirectDepositStore = defineStore("onboardingDirectDeposit", () => {
  interface T extends DirectDepositAccount {
    parentIndex?: number;
  }
  const selectedAccountId = ref<string | number>("");
  const accountList: Ref<T[]> = ref(new Array<DirectDepositAccount>());
  const curAccountList: Ref<T[]> = ref(new Array<DirectDepositAccount>());
  const isPending = ref(false);
  const startAtMode = ref('edit');
  const masterData = ref<DirectDepositMetaDataT>({} as DirectDepositMetaDataT)
  const distributionMethodOptions = ref<MetaFieldT[]>([])
  const bankAccountTypeOptions = ref<MetaFieldT[]>([])
  const approvalStatusOptions = ref<MetaFieldT[]>([])

  async function getMetaData(employeeId: number): Promise<void> {
    masterData.value = await onboardingDirectDepositApi.getMetaData(employeeId)
    distributionMethodOptions.value = masterData.value.distributionMethodList
    bankAccountTypeOptions.value = masterData.value.accountTypeList
    approvalStatusOptions.value = masterData.value.approvalStatusList
  }

  const changeStartAtMode = (mode: 'add' | 'edit') => {
    startAtMode.value = mode
  }

  async function fetchAccount(employeeId: number): Promise<void> {
    accountList.value = await onboardingDirectDepositApi.getAccounts(employeeId);
    const _list = accountList.value.map(account => {
      const reObj = {};
      Object.assign(reObj, account);
      return reObj;
    }) as DirectDepositAccount[];
    curAccountList.value = [..._list];
  }

  const updateSelectedAccountId = (newId: string | number) => {
    selectedAccountId.value = newId;
  };

  const updateCurAccountList = (updatedAccount: DirectDepositAccount): void => {
    curAccountList.value = curAccountList.value.map(account => {
      if (account.employeeDirectDepositId === updatedAccount.employeeDirectDepositId) {
        return updatedAccount;
      } else return account;
    });
  };

  const updateCurAccountListOrder = (newList: DirectDepositAccount[]) => {
    const _list = newList.map(account => {
      const reObj = {};
      Object.assign(reObj, account);
      return reObj;
    }) as DirectDepositAccount[];
    curAccountList.value = [..._list];
  };

  const deleteAccount = async ({employeeId, directDepositId}: {employeeId: number, directDepositId: string | number}) => {
        // delete newly created account
        if (String(directDepositId).startsWith('add_')){
          curAccountList.value = curAccountList.value.filter(account => {
            return account.employeeDirectDepositId !== directDepositId;
          });
        } else {
          // delete account saved in database
          await onboardingDirectDepositApi.deleteAccount({employeeId, directDepositId: Number(directDepositId)})
        }
  };

  const addAccount = (newAccount: DirectDepositAccount) => {
    const remainingAcc = curAccountList.value.filter(account => {
      return account.ordinalPosition === -1;
    });

    const notRemainingAcc = curAccountList.value.filter(account => {
      return account.ordinalPosition !== -1;
    });
    curAccountList.value = [...notRemainingAcc, newAccount, ...remainingAcc];
  };

  const submitAccounts = async ({ updateAccountList, employeeId }) => {
    await onboardingDirectDepositApi.updateAccounts({ updateAccountList, employeeId })
  }

  const updatePaymentMethod = async (isDirectDeposit: boolean, employeeId: number) => {
    return await onboardingDirectDepositApi.updatePaymentMethod(isDirectDeposit, employeeId)
  }

  const getPaymentMethod = async (employeeId: number) => {
    const payrollConfig = await onboardingDirectDepositApi.getPaymentMethod(employeeId);
    return payrollConfig.isDirectDeposit;
  }

  const getOnboardingPaymentMethodSetting = async () => {
    const paymentMethodSetting = await onboardingDirectDepositApi.getOnboardingPaymentMethodSetting();
    return paymentMethodSetting
  }

  return {
    selectedAccountId,
    accountList,
    fetchAccount,
    curAccountList,
    updateCurAccountList,
    updateSelectedAccountId,
    deleteAccount,
    addAccount,
    isPending,
    updateCurAccountListOrder,
    startAtMode,
    changeStartAtMode,
    submitAccounts,
    updatePaymentMethod,
    getPaymentMethod,
    getOnboardingPaymentMethodSetting,
    getMetaData,
    approvalStatusOptions,
    bankAccountTypeOptions,
    distributionMethodOptions
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useOnboardingDirectDepositStore, import.meta.hot));
}
