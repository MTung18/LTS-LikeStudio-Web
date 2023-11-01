import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { EarnCodes, PayPeriods } from "@/models/onboarding/OnboardingEmployerPayrollInformation";

export default class OnboardingEmployerPayrollInformation extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getPayPeriods(): Promise<PayPeriods[]> {
    const endPoint = "/FoundationIntegration/payperiods?isSynced=true";
    let payPeriodsData: PayPeriods[] = [];
    try {
      const response = await this.axiosInstance.get<PayPeriods[]>(endPoint);

      if (response && response.data && response.status === 200) {
        payPeriodsData = response.data;
      } else {
        throw new Error("Failed to get Pay Periods data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve Pay Periods data.",
        error,
      );
    }
    return payPeriodsData;
  }

  public async getEarnCodes(): Promise<EarnCodes[]> {
    const endPoint = "/FoundationIntegration/earncodes?isSynced=true";
    let earnCodesData: EarnCodes[] = [];
    try {
      const response = await this.axiosInstance.get<EarnCodes[]>(endPoint);

      if (response && response.data && response.status === 200) {
        earnCodesData = response.data;
      } else {
        throw new Error("Failed to get Earn Codes data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve Earn Codes data.",
        error,
      );
    }
    return earnCodesData;
  }
}

export const OnboardingEmployerFormPayrollInformationApi = new OnboardingEmployerPayrollInformation([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
