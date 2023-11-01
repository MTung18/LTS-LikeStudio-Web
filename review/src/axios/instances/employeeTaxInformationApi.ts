
import { ActionType } from "@/enums/ActionType";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { EmployeeTaxInformation } from "../../models/employees/EmployeeTaxInformation";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";

export default class EmployeeTaxInformationApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1/Employee";
    super(interceptors, baseUrl);
  }

  public async getEmployeeTaxInformation(employeeId: number): Promise<EmployeeTaxInformation> {
    try {
      const response = await this.PerformFetch<EmployeeTaxInformation>(`${employeeId}/taxInformation`);
      return response;
    } catch (error) {
      console.error(this.errormessage(ActionType.Update), error);
      throw error;
    }
  }

  public async editEmployeeTaxInformation(data: EmployeeTaxInformation): Promise<boolean> {
    try {
      const response = await this.PerformPost<boolean>(`${data.employeeId}/taxInformation`, data);
      return response;
    } catch (error) {
      console.error(this.errormessage(ActionType.Update), error);
      throw new Error("Failed to update Tax Info.");
    }
  }
}

export const employeeTaxInformationApi = new EmployeeTaxInformationApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
