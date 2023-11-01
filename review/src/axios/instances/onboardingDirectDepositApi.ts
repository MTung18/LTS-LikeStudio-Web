import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import DirectDepositAccount, { DirectDepositMetaDataT } from "../../models/onboarding/OnboardingDirectDeposit";
import { PayrollInformation } from "@/models/employees/PayrollInformation";

export default class OnboardingDirectDepositApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
    super(interceptors, baseUrl);
  }

  public async getMetaData(employeeId: number): Promise<DirectDepositMetaDataT> {
    const endPoint = `employees/${employeeId}/directDeposit/masterdata`;
    let directDepositMasterData: DirectDepositMetaDataT = {} as DirectDepositMetaDataT;
    try {
      const response = await this.axiosInstance.get<DirectDepositMetaDataT>(endPoint);

      if (response && response.data && response.status === 200) {
        directDepositMasterData = response.data
      } else {
        throw new Error("Failed to parse Direct Deposit master data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Direct Deposit master data.",
        error,
      );
    }
    return directDepositMasterData;
  }

  public async getAccounts(employeeId: number): Promise<DirectDepositAccount[]> {
    const endPoint = `employees/${employeeId}/directDeposit?IsDeleted=false`;
    let listAccount: DirectDepositAccount[] = [];
    try {
      const response = await this.axiosInstance.get<DirectDepositAccount[]>(endPoint);

      if (response && response.data && response.status === 200) {
        listAccount = response.data.map(account => {
          return account;
        });
      } else {
        throw new Error("Failed to parse Direct Deposit Account list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Direct Deposit Account list.",
        error,
      );
    }
    return listAccount;
  }

  public async updateAccounts({ updateAccountList, employeeId }: { updateAccountList: Array<DirectDepositAccount & { parentIndex: number | string, employeeDirectDepositFsNo: number }>; employeeId: number }): Promise<void> {
    const endPoint = `employees/${employeeId}/directDeposit`;
    const _updateAccountList = updateAccountList.map((acc) => {
      const { parentIndex, id, accountTypeName, distributionMethodName, approvalStatusName, rowUniqueId, status, phqClientId, ..._acc } = acc;
      _acc.employeeDirectDepositFsNo = null;
      return _acc;
    });
    try {
      await this.axiosInstance.put<DirectDepositAccount[]>(
        endPoint,
        _updateAccountList
      );
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to submit Direct Deposit Account list.",
        error
      );
    }
  }

  public async deleteAccount({ employeeId, directDepositId }: { directDepositId: number, employeeId: number | string }): Promise<void> {
    const endPoint = `employees/${employeeId}/directDeposit/${directDepositId}`;
    try {
      await this.axiosInstance.delete(endPoint);
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to delete Direct Deposit Account.",
        error
      );
    }
  }

  public async updatePaymentMethod(isDirectDeposit: boolean, employeeId: number): Promise<boolean> {
    const endPoint = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/Employee/${employeeId}/payroll/updatePaymentMethod?isDirectDeposit=${isDirectDeposit}`;

    try {
      const res = await this.axiosInstance.put<boolean>(endPoint);
      return res.data;
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update payment method.",
        error
      );
    }
  }

  public async getPaymentMethod(employeeId: number): Promise<Partial<Omit<PayrollInformation, 'payType'>> & {isDirectDeposit: boolean}> {
    const url = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/Employee/${employeeId}/payroll`
    try {
      const res = await this.axiosInstance.get(url);
      return res.data
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to get payment method.",
        error
      );
    }
  }

  public async getOnboardingPaymentMethodSetting() {
    let paymentMethodSetting = {};
    try {
      const response = await this.axiosInstance.get(
        getLocalAppsettings().ClientSide.WorkforceManagement + "/v1/GeneralClientSettings"
      );
      paymentMethodSetting = {
        isPaperCheck: response.data.isPaperCheck,
        isDirectDeposit: response.data.isDirectDeposit,
      };
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to get the onboarding payment setting.",
        error
      );
    }
    return paymentMethodSetting;
  }
}

export const onboardingDirectDepositApi = new OnboardingDirectDepositApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
