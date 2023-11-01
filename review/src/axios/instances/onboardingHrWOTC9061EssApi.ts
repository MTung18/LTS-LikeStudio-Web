import { OnboardingWOTC9061Ess } from "../../models/onboarding/WOTC/HrOnboardingWOTC9061Ess";
import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";

export class OnboardingWOTC9061Api extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1`;
    super(interceptors, baseUrl);
  }

  public async getOnboardingWOTC9061Ess(employeeId: number, formId: number) {
    let onboardEss9061Form: UploadPayload<OnboardingWOTC9061Ess> = {} as UploadPayload<OnboardingWOTC9061Ess>;
    try {
      const response = await this.axiosInstance.get<UploadPayload<OnboardingWOTC9061Ess>>(
        `employees/${employeeId}/formFieldValue?formId=${formId}`
      );

      if (response && response.data && response.status === 200) {
        onboardEss9061Form = response.data;
      } else {
        throw new Error("Failed to parse wotc form 9061 data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the wotc form 9061 data.",
        error
      );
    }
    return onboardEss9061Form;
  }

  public async updateOnboardingWOTC9061Ess(
    employeeId: number,
    formData: Partial<UploadPayload<OnboardingWOTC9061Ess>>
  ) {
    try {
      await this.axiosInstance.post<UploadPayload<OnboardingWOTC9061Ess>>(
        `employees/${employeeId}/formFieldValue`,
        formData
      );
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the wotc form 9061 data.",
        error
      );
    }
  }
}
export const onboardingWOTC9061EssApi = new OnboardingWOTC9061Api([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
