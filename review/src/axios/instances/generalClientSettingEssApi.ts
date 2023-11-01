
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ActionType } from "@/enums/ActionType";
import { ClientPaymentSetting } from '@/models/ClientPaymentSetting';
export default class ESSGeneralClientSettingsApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + '/v1';
        super(interceptors, baseUrl, 'ess general client setting');
    }

    public async switchEmployeesPaymentMethodByClientAsync(isDirectDeposit: boolean, isPaperCheck: boolean): Promise<boolean> {
        try {
            
            return await this.PerformPost<boolean>(`generalClientSetting/switchEmployeePaymentMethods`, new ClientPaymentSetting({  isDirectDeposit, isPaperCheck}));
        } catch (error) {
            console.error(this.errormessage(ActionType.Update), error);
            throw error;
        }
    }

}

export const ESSGeneralClientSettingApi = new ESSGeneralClientSettingsApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);