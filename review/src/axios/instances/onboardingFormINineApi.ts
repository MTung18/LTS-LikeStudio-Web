import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ApiResponse } from "@/models/ApiResponse";
import { OnboardingFormINineModel } from "@/models/onboarding/OnboardingFormINine";

export default class OnboardingFormINine extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + "/api/v1";
    super(interceptors, baseUrl);
  }

  public async getFormINine(employeeId: number, formType: number): Promise<OnboardingFormINineModel[]> {
    const endPoint = `/employees/${employeeId}/formFieldValue?formId=${formType}`;
    let formI9Data: OnboardingFormINineModel[] = [];
    try {
      const response = await this.axiosInstance.get<OnboardingFormINineModel[]>(endPoint);

      if (response && response.data && response.status === 200) {
        formI9Data = response.data;
      } else {
        throw new Error("Failed to get Form I9 data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve Form I9 data.",
        error,
      );
    }
    return formI9Data;
  }
  public async updateFormINine(data: Partial<OnboardingFormINineModel>, formType: number): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post(
        `/employees/${data.employeeId}/formFieldValue?formId=${formType}`,
        data
      );
      if (response && response.status === 201) {
        return {
          success: true,
          errorMessage: "Form i-9 Updated"
        };
      } else {
        return {
          success: false,
          errorMessage: "An unexpected error occurred attempting to update form i-9"
        };
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to add Form i-9.",
        error
      );
    }
  }
}

export const OnboardingFormINineApi = new OnboardingFormINine([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
