import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";
import { UploadPayload } from "../../models/onboarding/WOTC/UploadPayload";
import { OnboardingWOTC8850Ess } from "../../models/onboarding/WOTC/HrOnboardingWOTC8850Ess";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";

export class OnboardingWOTC8850Api extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1`;
    super(interceptors, baseUrl);
  }

  public async getOnboardingWOTC8850Ess(employeeId: number, formId: number) {
    let quickHireWOTC: UploadPayload<OnboardingWOTC8850Ess> = {} as UploadPayload<OnboardingWOTC8850Ess>;
    try {
      const response = await this.axiosInstance.get<UploadPayload<OnboardingWOTC8850Ess>>(
        `employees/${employeeId}/formFieldValue?formId=${formId}`
      );

      if (response && response.data && response.status === 200) {
        quickHireWOTC = response.data;
      } else {
        throw new Error("Failed to parse wotc form 8850 data");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the wotc form 8850 data.",
        error
      );
    }
    return quickHireWOTC;
  }

  public async updateOnboardingWOTC8850Ess(
    employeeId: number,
    formData: Partial<UploadPayload<OnboardingWOTC8850Ess>>
  ) {
    try {
      await this.axiosInstance.post<UploadPayload<OnboardingWOTC8850Ess>>(
        `employees/${employeeId}/formFieldValue`,
        formData
      );
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the wotc form 8850 data.",
        error
      );
    }
  }
}

export const onboardingWOTC8850EssApi = new OnboardingWOTC8850Api([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
