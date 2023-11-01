import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import { AccrualUsage } from "../../models/employees/timeOff/AccrualUsage";
import { VacationType } from "@/models/employees/timeOff/VacationType";


/* Sample class on how to split out axios instances.  
For now since we are using one API, we should still split out these instances by API controller or where it makes sense to do so. 
This makes it easier when we split to multiple micro-services */
export default class EmployeeAccrualPlanApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1/employees";
        super(interceptors, baseUrl);
    }

    public async getAccrualUsages(employeeId, accrualCodeFsNo): Promise<AccrualUsage[]> {
        try {
            const response = await this.axiosInstance.get<AccrualUsage[]>(`/${employeeId}/assignedPlans/accrualUsage`, {
                params: { accrualCodeFsNo: accrualCodeFsNo }
            });

            if (
                response &&
                response.data &&
                response.status === 200
            ) {
                return response.data;
            } else {
                throw new Error("Failed to parse accrual usage");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve accrual usage.",
                error
            );
        }
    }

    public async getEmployeePlanTypes(employeeId: string): Promise<VacationType[]> {
        try {
            const response = await this.axiosInstance.get<VacationType[]>(`/${employeeId}/assignedPlans/historyPlanTypes`);

            if (
                response &&
                response.data &&
                response.status === 200
            ) {
                return response.data;
            } else {
                throw new Error("Failed to parse employee plan type");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to retrieve employee plan type.",
                error
            );
        }
    }

    public async hasActivePlanWithType(employeeId: string, accrualPlanId: number): Promise<boolean> {
        try {
            const response = await this.axiosInstance.get<boolean>(`/${employeeId}/assignedPlans/activePlan?accrualPlanId=${accrualPlanId}`);

            if (
                response &&
                response.data &&
                response.status === 200
            ) {
                return response.data;
            } else {
                throw new Error("Failed to check active plan");
            }
        } catch (error) {
            console.error(
                "An unexpected error occurred attempting to check active plan.",
                error
            );
        }
    }
}

export const employeeAccrualPlanApi = new EmployeeAccrualPlanApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);
