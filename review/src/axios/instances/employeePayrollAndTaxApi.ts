
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ActionType } from "@/enums/ActionType";
import { EmployeePayrollAndTax } from "../../models/employees/EmployeePayrollAndTax";

export default class employeePayrollAndTaxApi extends AxiosBase {
    constructor(interceptors: Array<any>) {
        const baseUrl = getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + "/api/v1";
        super(interceptors, baseUrl, 'employee payroll and tax');
    }

    public async switchEmployeePaymentMethodAsync(isDirectDeposit: boolean, employeeId: number): Promise<boolean> {
        try {
            return await this.PerformPatch<boolean>(`/employees/${employeeId}/directDeposit/switchpayment/${isDirectDeposit}`, null);
        } catch (error) {
            console.error(this.errormessage(ActionType.Update), error);
            throw error;
        }
    }

    public async getEmployeePayrollAndTaxAsync(employeeId: number): Promise<EmployeePayrollAndTax> {
        try {
            const response = await this.PerformFetch<EmployeePayrollAndTax>(`/EmployeePayrollAndTax/${employeeId}`);
            return response;
        } catch (error) {
            console.error(this.errormessage(ActionType.Update), error);
            throw error;
        }
    }
}

export const employeePayrollAndTaxesApi = new employeePayrollAndTaxApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
]);