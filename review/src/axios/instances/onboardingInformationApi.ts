import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import OnboardingProgressOverview from "@/models/onboarding/OnboardingProgressOverview";

export class OnboardingInformationApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1`;
    super(interceptors, baseUrl);
  }

  public async fetchOnboardingEmployeeInformation(employeeId: number): Promise<OnboardingProgressOverview> {
    let result: OnboardingProgressOverview;
    try {
      const response = await this.axiosInstance.get(
        `/Employee/onboardInformations?employeeId=${employeeId}`,
      );
      if (response && response.status === 200) {
        result = response.data;
      } else {
        throw new Error("Failed to fetch onboarding information for the employee");
      }
    } catch (error) {
      console.error("An error occurred while fetching onboarding information:",
        error)
    }
    return result;
  }

  public async updateOnboardInformation(employeeId: number, payload: Partial<OnboardingProgressOverview>): Promise<boolean> {
    let result: boolean;
    try {
      const response = await this.axiosInstance.post<boolean>(`Employee/onboardInformations?employeeId=${employeeId}`, payload);
      if (response.data && response.status === 200) {
        result = response.data
      }
    } catch (error) {
      console.error(error);
      throw Promise.reject(error);
    }
    return result;
  }

  public async completeOnboarding(employeeId: number): Promise<unknown> {
    const response = await this.axiosInstance.post(`FoundationIntegration/pendingEmployees/${employeeId}`);
    if (response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error('Submit of pending employee data failed');
    }
  }
}

export const onboardingInformationApi = new OnboardingInformationApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
