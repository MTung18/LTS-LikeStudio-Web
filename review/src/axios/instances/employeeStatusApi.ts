import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import EmployeeStatus, { EmployeeStatusReason } from '@/models/employees/EmployeeStatus';
import { ActionType } from '@/enums/ActionType';

export class EmployeeStatusApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getEmployeeStatusId(empId: string) {
    let employeeStatusId: number;
    try {
      const response = await this.axiosInstance.get(`Employee/${empId}/status`);

      if (response && response.data && response.status === 200) {
        employeeStatusId = response.data;
      } else {
        throw new Error("Failed to parse employee status id");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the employee status id.",
        error
      );
    }
    return employeeStatusId;
  }

  public async getEmployeeSubmitStatusId(empId: string) {
    let employeeSubmitStatusId: boolean;
    try {
      const response = await this.axiosInstance.get(`Employee/formsubmit?employeeId=${empId}`);

      if (response && response.data && response.status === 200) {
        employeeSubmitStatusId = response.data;
      } else {
        throw new Error("Failed to parse employee status id");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the employee status id.",
        error
      );
    }
    return employeeSubmitStatusId;
  }

  public async getEmployeeStatusReasons(): Promise<EmployeeStatusReason[]> {
    let employeeStatusReasons: EmployeeStatusReason[] = [];

    try {
      employeeStatusReasons = await this.PerformFetch<EmployeeStatusReason[]>('EmployeeStatusReasons');
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return employeeStatusReasons;
  }

  public async getEmployeeStatus(employeeId: number): Promise<EmployeeStatus> {
    let employeeStatus: EmployeeStatus = new EmployeeStatus({ employeeId });

    try {
      employeeStatus = await this.PerformFetch<EmployeeStatus>(`EmployeeStatuses/${employeeId}`);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return employeeStatus;
  }

  public async updateEmployeeStatus(data: EmployeeStatus): Promise<boolean> {
    try {
      return await this.PerformPut<boolean>(`EmployeeStatuses/${data.employeeId}`, data);
    } catch (error) {
      console.error(this.errormessage(ActionType.Create), error);
    }
    return false;
  }
}

export const employeeStatusApi = new EmployeeStatusApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
