import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";
import { HrOnboardingWOTC } from "../../models/onboarding/WOTC/OnboardingHrWOTC";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";

export class OnboardingHrWOTCApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1`;
    super(interceptors, baseUrl);
  }

  public async getOnboardingHrWOTC(employeeId: number, formId: number) {
    let quickHireWOTC: UploadPayload<HrOnboardingWOTC> = {} as UploadPayload<HrOnboardingWOTC>;
    try {
      const response = await this.axiosInstance.get<UploadPayload<HrOnboardingWOTC>>(
        `employees/${employeeId}/formFieldValue?formId=${formId}`
      );

      if (response && response.data && response.status === 200) {
        quickHireWOTC = response.data;
      } else {
        throw new Error("Failed to parse hr wotc data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the hr wotc data.",
        error
      );
    }
    return quickHireWOTC;
  }

  public async updateOnboardingHreWOTC(
    employeeId: number,
    formData: Partial<UploadPayload<HrOnboardingWOTC>>
  ) {
    try {
      await this.axiosInstance.post<UploadPayload<HrOnboardingWOTC>>(
        `employees/${employeeId}/formFieldValue`,
        formData
      );
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the hr wotc data.",
        error
      );
    }
  }
}
export const onboardingHrWOTCApi = new OnboardingHrWOTCApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
