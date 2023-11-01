import AxiosBase from "./axiosBase";
import { getLocalAppsettings } from '@/helper/hqSuite/appSettingsHelper';
import {
    IReportGet
} from "@/models/report/Report";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";

export class ReportsApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        // This is currently not transformed in environments - will need replacement
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement;
        super(interceptors, baseUrl);
    }

    public async getReportCriteria(reportGuid: string): Promise<IReportGet> {
        let reportCriteria: IReportGet;

        try {
            const response = await this.axiosInstance.get<IReportGet>(`v1/ReportCriteria/${reportGuid}`);
            if (response && response.data && response.status === 200) {
                reportCriteria = response.data;
            } else {
                throw new Error("Failed to parse report criteria");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve the report criteria.",
                error,
            );
        }

        return reportCriteria;
    }
}

export const reportsApi = new ReportsApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);
