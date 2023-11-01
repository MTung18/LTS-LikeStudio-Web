
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ActionType } from "@/enums/ActionType";
import { GeneralClientSetting } from "@/models/generalClientSetting";

export default class WhqGeneralClientSettingsApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + '/v1';
        super(interceptors, baseUrl, 'general client setting');
    }

    public async getGeneralClientSettingAsync(): Promise<GeneralClientSetting> {
        var result = new GeneralClientSetting();
        try {
            const url = `/GeneralClientSettings`;
            const response = await this.PerformFetch<GeneralClientSetting>(url);
            result = new GeneralClientSetting(response);
        } catch (error) {
            console.error(this.errormessage(ActionType.Fetch), error);
            throw error;
        }
        return result;
    }

    public async upsertGeneralClientSettingAsync(data: GeneralClientSetting, allowEmptyContact: boolean = false): Promise<boolean> {
        try {
            const url = `/GeneralClientSettings${allowEmptyContact ? '?allowEmptyContact=true' : ''}`;
            return await this.PerformPut<boolean>(url, data, true);
        } catch (error) {
            console.error(this.errormessage(ActionType.Fetch), error);
            throw error;
        }
    }

    public async checkAnyProfileIsLocked(): Promise<boolean> {
        var result: boolean = false;
        try {
            const url = `/GeneralClientSettings/lockedProfiles`;
            result = await this.PerformFetch<boolean>(url);
        } catch (error) {
            console.error(this.errormessage(ActionType.Fetch), error);
            throw error;
        }
        return result;
    }


    public async switchEmployeePaymentMethodAsync(isDirectDeposit: boolean, employeeId: number): Promise<boolean> {
        try {
            return await this.PerformPost<boolean>(`/employees/${employeeId}/directDeposit/switchpayment/${isDirectDeposit}`, null);
        } catch (error) {
            console.error(this.errormessage(ActionType.Update), error);
            throw error;
        }
    }

}

export const WhqGeneralClientSettingApi = new WhqGeneralClientSettingsApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);