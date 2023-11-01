import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { Payroll, updateAvailableDateToEmployee } from "@/models/payroll/Payroll";
import { formatTime, getPeriodTimeOfMonth } from "@/utilities/formatUtils";
import FsPaystubDetail from "@/models/payroll/PayrollHistory";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class WhqPayrollApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getPayrollListByEmployeeId(employeeId: string, year: number): Promise<Payroll[]> {
    let payrollList: Payroll[];
    try {
      const response = await this.axiosInstance.get<Payroll[]>(
        `PayHistories/employees/${employeeId}/years/${year}`,
      );
      if (response.status === 200 && response.data) {
        payrollList = response.data;
        payrollList.forEach(item => {
          item.filterPayDate = formatTime(item.payDate);
          item.filterPayPeriod = getPeriodTimeOfMonth(item.payDate);
          item.filterAvailableToEmployeeOnDate = formatTime(item.availableToEmployeeOnDate);
        });
      } else {
        throw new Error("Failed to parse payroll list");
      }
    } catch (error) {
      console.error("An unexpected error occurred attempting to retrieve the Payroll List.");
    }

    return payrollList;
  }

  public async updateAvailablePayrollDateToEmployee(
    data: updateAvailableDateToEmployee,
  ): Promise<void> {
    try {
      await this.axiosInstance.put(`PayHistories/employees/${data.employeeId}/years/${data.year}`, data);
    } catch (error) {
      console.error("Error update available payroll date to employee:", error);
    }
  }

  public async getPayrollDetails(
    employeeId: string,
    checkDate: string
  ): Promise<FsPaystubDetail> {
    let fsPaystubDetails: FsPaystubDetail;

    try {
      const response = await this.axiosInstance.get<FsPaystubDetail>(
        `PayHistories/detail/employees/${employeeId}?checkDate=${checkDate}`
      );
      if (response && response.data && response.status === 200) {
        fsPaystubDetails = response.data;
      } else {
        throw new Error("Failed to parse payroll details");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the payroll details.",
        error,
      );
    }

    return fsPaystubDetails;
  }
}

export const whqPayrollApi = new WhqPayrollApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
