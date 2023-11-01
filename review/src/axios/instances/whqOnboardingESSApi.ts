import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import OnboardingSummary from "../../models/onboarding/OnboardingSummary";


export default class WhqOnboardingESSApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + "/api/v1";
    super(interceptors, baseUrl, 'onboarding plan');
  }

  public async getOnboardingSideNavItems(employeeId: number): Promise<OnboardingSummary[]> {
    let result: OnboardingSummary[];
    try {
      const response = await this.axiosInstance.get(`ProgressSidebars/onboardingSummaries/${employeeId}`);
      if (response && response.status === 200) {
        result = response.data;
      } else {
        throw new Error("Failed to parse onboarding sidenav items");
      }
    } catch (error) {
      console.error("An unexpected error occurred attempting to fetch onboarding sidenav items.",
        error)
      throw Promise.reject(error);
    }
    return result;
  }

  public async markOnboardingSideNavItemAsDone(id: string, isDone: boolean, employeeId = null): Promise<void> {
    try {
      await this.axiosInstance.put(`ProgressSidebars/${id}/progressBarHRStatus?employeeId=${employeeId}`, isDone)
    } catch (error) {
      console.error("An unexpected error occurred attempting to update onboarding sidenav items.",
        error);
      throw error;
    }
  }

  public async updateMultipleForm(employeeId: number[], isClear: boolean): Promise<boolean> {
    let result: boolean;
    try {
      const response = await this.axiosInstance.post(`employees/skipOnboardingForEmployees?isClearValue=${isClear}`, employeeId)
      result = response.data;
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update form.",
        error
      );
    }
    return result;
  }

  public async updateMultipleSidebar(listEmployeeId: number[]): Promise<boolean> {
    let result: boolean;
    try {
      const response = await this.axiosInstance.put("ProgressSidebars/employeeSelfServiceStatus", listEmployeeId)
      result = response.data;
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update.",
        error
      );
    }
    return result;
  }

  public async clearOnboardingStartedDate(listEmployeeId: number[]): Promise<boolean> {
    let result: boolean;
    try {
      const response = await this.axiosInstance.put(getLocalAppsettings().ClientSide.WorkforceManagement + "/v1/Employee/skipOnboardInformations/Ids", listEmployeeId)
      result = response.data;
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update.",
        error
      );
    }
    return result;
  }
}

export const whqOnboardingESSApi = new WhqOnboardingESSApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
