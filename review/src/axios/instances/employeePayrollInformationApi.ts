
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ActionType } from "@/enums/ActionType";
import { PayrollInformation } from "@/models/employees/PayrollInformation";

export default class WhqEmployeePayrollInformationApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + '/v1/employee';
    super(interceptors, baseUrl);
  }

  public async getPayrollInformation(employeeId: number | string): Promise<PayrollInformation> {
    let response = new PayrollInformation();
    try {
      response = await this.PerformFetch<PayrollInformation>(`${employeeId}/payroll`);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return response;
  }

  public async editPayrollInformation(data: PayrollInformation): Promise<boolean> {
    try {
      return await this.PerformPost<boolean>(`${data.employeeId}/payroll`, data);
    } catch (error) {
      console.error(this.errormessage(ActionType.Create), error);
    }
    return false;
  }
}

export const whqEmployeePayrollInformationApi = new WhqEmployeePayrollInformationApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);