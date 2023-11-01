
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { EmployeeDirectDeposit } from "@/models/employees/employeeDirectDepositModel";
import { ActionType } from "@/enums/ActionType";
import DirectDepositMasterData from "@/models/directDeposit/directDepositMasterData";

export default class WhqEmployeeDirectDepositsApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + "/api/v1";
        super(interceptors, baseUrl, 'direct deposit account');
    }

    public async submitEmployeeDirectDeposit(data: EmployeeDirectDeposit[], employeeId: number): Promise<boolean> {
        try {
            return await this.PerformPut<boolean>(`/employees/${employeeId}/directDeposit`, data);
        } catch (error) {
            console.error(this.errormessage(ActionType.Create), error);
            throw error;
        }
    }

    public async fetchDirectDeposit(employeeId: number = null): Promise<EmployeeDirectDeposit[]> {
        let result: EmployeeDirectDeposit[] = [];
        try {
            const url = `/employees/${employeeId}/directDeposit?IsDeleted=false`;
            const response = await this.PerformFetch<EmployeeDirectDeposit[]>(url);
            result = response.map(dd => new EmployeeDirectDeposit(dd));
        } catch (error) {
            console.error(this.errormessage(ActionType.Fetch), error);
        }
        return result;
    }

    public async deleteDirectDeposit(employeeId: number, directDepositId?: number, throwErrorIfAny: boolean = false): Promise<boolean> {
        try {
            return await this.PerformDelete<boolean>(`/employees/${employeeId}/directDeposit/${directDepositId}`);
        } catch (error) {
            console.error(this.errormessage(ActionType.Delete), error);
            if (throwErrorIfAny)
                throw error;
        }
        return false;
    }

    public async getDirectDepositMasterData(employeeId: number): Promise<DirectDepositMasterData> {
        let result: DirectDepositMasterData = new DirectDepositMasterData();
        try {
            const url = `/employees/${employeeId}/directDeposit/masterdata`;
            result = await this.PerformFetch<DirectDepositMasterData>(url);
        } catch (error) {
            console.error(this.errormessage(ActionType.Fetch), error);
        }
        return result;
    }

    public async getPaymentMethod(employeeId: number): Promise<boolean> {
      let result: boolean;
      try {
          const url = `/employees/${employeeId}/directDeposit/paymentMethod`;
          result = await this.PerformFetch<boolean>(url);
      } catch (error) {
          console.error(this.errormessage(ActionType.Fetch), error);
      }
      return result;
  }

    public async editPaymentMethod(employeeId: number): Promise<boolean> {
        let result: boolean;
        try {
            const url = `/employees/${employeeId}/directDeposit/paymentMethod`;
            const response = await this.axiosInstance.patch(url);
            if (response && response.data && response.status === 200) {
                result = response.data;
            } else {
                throw new Error("Failed to payment method change");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the payment method change.",
                error,
            );
        }
        return result;
    }
}

export const WhqEmployeeDirectDepositApi = new WhqEmployeeDirectDepositsApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);