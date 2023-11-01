import { UploadPayload } from "@/models/onboarding/WOTC/UploadPayload";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import OnboardingQuickHireWOTC from "../../models/onboarding/WOTC/OnboardingQuickHireWOTC";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";

export class OnboardingQuickHireWOTCApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1`;
    super(interceptors, baseUrl);
  }

  public async getOnboardingQuickHireWOTC(employeeId: number, formId: number) {
    let quickHireWOTC: UploadPayload<OnboardingQuickHireWOTC> = {} as UploadPayload<OnboardingQuickHireWOTC>;
    try {
      const response = await this.axiosInstance.get<UploadPayload<OnboardingQuickHireWOTC>>(
        `employees/${employeeId}/formFieldValue?formId=${formId}`
      );

      if (response && response.data && response.status === 200) {
        quickHireWOTC = response.data;
      } else {
        throw new Error("Failed to parse quick hire wotc data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the quick hire wotc data.",
        error
      );
    }
    return quickHireWOTC;
  }

  public async updateOnboardingQuickHireWOTC(
    employeeId: number,
    formData: Partial<UploadPayload<OnboardingQuickHireWOTC>>
  ) {
    try {
      await this.axiosInstance.post<UploadPayload<OnboardingQuickHireWOTC>>(
        `employees/${employeeId}/formFieldValue`,
        formData
      );
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the quick hire wotc data.",
        error
      );
    }
  }
}
export const onboardingQuickHireWOTCApi = new OnboardingQuickHireWOTCApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
