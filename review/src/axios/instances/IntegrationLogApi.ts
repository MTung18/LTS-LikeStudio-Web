import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { IntegrationLog } from "@/models/foundationIntegration/IntegrationLog";

export default class IntegrationLogApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement;
        super(interceptors, baseUrl);
    }

    public async getIntegrationLogs(integrationProvider: number): Promise<IntegrationLog[]> {
        let logList: Array<IntegrationLog> = [];
        const url = `v1/IntegrationLogs?integrationProvider=${integrationProvider}`;

        try {
            const response = await this.axiosInstance.get(url);
            if (response && response.data && response.status == 200) {
                logList = response.data;
            }
        } catch (error) {
            console.log(error);
        }

        return logList;
    }
}

export const integrationLogApi = new IntegrationLogApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);
