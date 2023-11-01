import AxiosBase from "../axiosBase";
import AccessTokenRequestInterceptor from "../../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../../interceptors/accessToken-response-interceptor";
import { AxiosInstance } from "axios";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { AppSecrets } from "@/models/settings/AppSecrets";

export default class AppSecretsApi extends AxiosBase {
    constructor(interceptors: Array<(axiosInstance: AxiosInstance) => Promise<void>>) {
        const baseUrl = getLocalAppsettings().ClientSide.SecretsApiRootUrl;
        super(interceptors, baseUrl);
    }

    public async getAppSecrets(): Promise<AppSecrets> {
        const response = await this.axiosInstance.get<AppSecrets>("api/workforcehq/web?api-version=1.0");
        if (response.data && response.status === 200) {
            const appSecrets = new AppSecrets(response.data);
            return appSecrets;
        } else {
            throw `Unable to fetch application settings: ${response.status}: ${response.statusText}`;
        }
    }
}

export const appSecretsApi = new AppSecretsApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);
