import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { RestOfTimeOff } from "@/models/employees/timeOff/RestOfTimeOff";

export class HistoryPlanType extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + "/api/v1";
    super(interceptors, baseUrl);
  }

  public async getRestTimeOff(empId, accrualCodeFsNo): Promise<RestOfTimeOff> {
    let historyOfPlanType: RestOfTimeOff;
    try {
      const response = await this.axiosInstance.get<RestOfTimeOff>(`timeOffRequests/planTypeFigure/${empId}`, {
        params: {
          accrualCodeFsNo: accrualCodeFsNo
        }
      });
      if (response && response.data && response.status === 200) {
        historyOfPlanType = response.data;
      } else {
        throw new Error("Failed to parse time-off plan list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the time-off plan list.",
        error,
      );
    }
    return historyOfPlanType;
  }
}

export const historyPlanType = new HistoryPlanType([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
