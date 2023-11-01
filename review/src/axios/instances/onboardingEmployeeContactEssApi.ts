import { OnboardingEmployeeRelationship } from "@/models/onboarding/OnboardingEmployeeRelationship";
import { OnboardingEmployeePrefix } from "@/models/onboarding/OnboardingEmployeePrefix";
import { OnboardingEmployeeGender } from "@/models/onboarding/OnboardingEmployeeGender";
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export class OnboardingEmployeeContactEssApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceEmployeeManagement}/api/v1`;
    super(interceptors, baseUrl);
  }

  hrmUrl() {
    return getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
  }

  public async fetchRelationshipList(): Promise<OnboardingEmployeeRelationship[]> {
    let relationshipList: OnboardingEmployeeRelationship[];
    try {
      const response =
        await this.axiosInstance.get<OnboardingEmployeeRelationship[]>(`${this.hrmUrl()}/employee/relationshipType`);

      if (response && response.data && response.status === 200) {
        relationshipList = response.data;
      } else {
        throw new Error("Failed to get relationship list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Relationship list.",
        error
      );
    }
    return relationshipList;
  }

  public async fetchPrefixList(): Promise<OnboardingEmployeePrefix[]> {
    let prefixList: OnboardingEmployeePrefix[];
    try {
      const response = await this.axiosInstance.get<OnboardingEmployeePrefix[]>(`/employeeContact/namePrefix`);

      if (response && response.data && response.status === 200) {
        prefixList = response.data;
      } else {
        throw new Error("Failed to get Prefix list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Prefix list.",
        error
      );
    }
    return prefixList;
  }

  public async fetchGenderList(): Promise<OnboardingEmployeeGender[]> {
    let genderList: OnboardingEmployeeGender[];
    try {
      const response = await this.axiosInstance.get<OnboardingEmployeeGender[]>(`${this.hrmUrl()}/employee/gender`);

      if (response && response.data && response.status === 200) {
        genderList = response.data;
      } else {
        throw new Error("Failed to get Gender list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Gender list.",
        error
      );
    }
    return genderList;
  }
}

export const onboardingEmployeeContactEssApi = new OnboardingEmployeeContactEssApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
