import { UploadPayload } from "@/models/onboarding/OnboardingVEVRAASelfIdentification";
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import FormField from "../../models/onboarding/FormField";
import { OnboardingFormVEVRAAModel } from "@/models/onboarding/OnboardingVEVRAASelfIdentificationUploadFile";

export class OnboardingVEVRAASelfIdentificationApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1/`;
    super(interceptors, baseUrl);
  }

  public async getVEVRAASelfIdentificationByEmployeeId(empId: number, formId: number) {
    let VEVRAASelfIdentification: OnboardingFormVEVRAAModel = {} as OnboardingFormVEVRAAModel;

    try {
      const response =
        await this.axiosInstance.get<OnboardingFormVEVRAAModel>(
          `employees/${empId}/formFieldValue?formId=${formId}`
        );
      if (response && response.data && response.status === 200) {
        VEVRAASelfIdentification = response.data;
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the VEVRAA Self-identification record",
        error
      );
    }
    return VEVRAASelfIdentification;
  }

  public async getVEVRAAFile(employeeId: number, formId: number) {
    let onboardingEEOSelfIdentification: FormField | undefined;
    try {
      const response = await this.axiosInstance.get<FormField>(`employees/${employeeId}/formFieldValue?formId=${formId}`);
      if (response.data && response.status === 200) {
        onboardingEEOSelfIdentification = response.data;
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Onboarding VEVRAA Self-identification files",
        error
      )
      throw error;
    }
    return onboardingEEOSelfIdentification;
  }

  public async updateVEVRAASelfIdentificationById(
    empId: number,
    formData: Partial<OnboardingFormVEVRAAModel>
  ) {
    try {
      await this.axiosInstance.post<OnboardingFormVEVRAAModel>(
        `employees/${empId}/formFieldValue`,
        formData
      );
    } catch (error) {
      return {
        status: error.response.status,
        errorMessage: error.response.data.errorMessage,
        success: false
      }
    }
  }
}

export const onboardingVEVRAASelfIdentificationApi =
  new OnboardingVEVRAASelfIdentificationApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
  ]);
