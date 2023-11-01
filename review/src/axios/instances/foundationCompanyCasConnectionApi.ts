import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ActionType } from "@/enums/ActionType";
import { FoundationCompanyCasConnection } from "@/models/foundationIntegration/FoundationCompanyCasConnection";

export default class FoundationCompanyCasConnectionApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement;
        super(interceptors, baseUrl, 'foundationCompanyCasConnection');
    }

    public async getCompanyCasConnection(): Promise<FoundationCompanyCasConnection | null> {
        let result: FoundationCompanyCasConnection;
        try {
            const url = `v1/foundation/CompanyCasConnection`;
            const response = await this.PerformFetch<FoundationCompanyCasConnection>(url);
            if (typeof(response) === 'string') {
                return null;
            }
            result = new FoundationCompanyCasConnection(response);
        } catch (error) {
            console.error(this.errormessage(ActionType.Fetch), error);
            return null;
        }
        return result;
    }
}

export const foundationCompanyCasConnectionApi = new FoundationCompanyCasConnectionApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);
