import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import OnboardingEmployeeInformation from "@/models/onboarding/OnboardingEmployeeInformation";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import CurrentOnboards from "@/models/CurrentOnboards";
import { PersonalInformation, UpdatePersonalInfoRequestModel } from "@/models/onboarding/PersonalInformation";
import { OnboardingEmployeeMaritalStatus } from "@/models/onboarding/OnboardingEmployeeMaritalStatus";
import { ApiResponse } from "@/models/ApiResponse";

export default class OnboardingEmployeeInformationApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceEmployeeManagement;
    super(interceptors, baseUrl);
  }

  public async seedProgressData(employeeId: number): Promise<boolean> {
    const response = await this.axiosInstance.post<boolean>(`/api/v1/ProgressSidebars/seedData?employeeId=${employeeId}`);

    if (response && response.data && response.status === 200) {
      return response.data;
    } else {
      throw new Error('Unable to seed progress data for onboarding');
    }
  }

  public async getListOnboardingEmployeeInformation(employeeId: number): Promise<{
    list: OnboardingEmployeeInformation[];
  }> {
    let listOfEmployeeInformation: OnboardingEmployeeInformation[];
    try {
      const response = await this.axiosInstance.get<
        OnboardingEmployeeInformation[]
      >(`/api/v1/ProgressSidebars/onboardingSummaries/${employeeId}`);

      if (response && response.data && response.status === 200) {
        listOfEmployeeInformation = response.data;
      } else {
        throw new Error("Failed to parse employee information list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the employee information list.",
        error
      );
    }
    return new Promise((resolve) => {
      resolve({
        list: listOfEmployeeInformation,
      });
    });
  }

  public async getProgressOverview(empId: number): Promise<{
    list: CurrentOnboards[];
  }> {
    let progressOverview: CurrentOnboards[];
    try {
      const response = await this.axiosInstance.get<
        CurrentOnboards
      >(`api/v1/currentOnboard/${empId}`);

      if (response && response.data && response.status === 200) {
        progressOverview = Array(response.data);
      } else {
        throw new Error("Failed to parse employee information list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the employee information list.",
        error
      );
    }
    return new Promise((resolve) => {
      resolve({
        list: progressOverview,
      });
    });
  }

  public async getEmployeeInformationDetail(id: string | number) {
    let PersonalInformation: PersonalInformation;
    try {
      const response = await this.axiosInstance.get<PersonalInformation>(getLocalAppsettings().ClientSide.WorkforceManagement + `/v1/Employee/${id}/details`);

      if (response && response.data && response.status === 200) {
        PersonalInformation = response.data;
      } else {
        throw new Error("Failed to get employee's personal information");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Employees's personal information.",
        error,
      );
    }
    return PersonalInformation;
  }

  public async putEmployeeInformationDetail(data: UpdatePersonalInfoRequestModel): Promise<ApiResponse> {
    try {
      await this.axiosInstance.put(`${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/Employee/${data.employeeId}/personalInfo`, data);
      return {
        success: true,
        apiMessage: "Personal Information updated"
      };
    }
    catch (error) {
      return {
        success: false,
        apiMessage: "Failed to update personal information."
      };
    }
  }

  public async getPersonalInfoFormStatus(id) {
    try {
      const response = await this.axiosInstance.get(
        getLocalAppsettings().ClientSide.WorkforceManagement + `/v1/Employee/formsubmit?employeeId=${id}`);
      if (response && response.status === 200) {
        return response.data;
      } else {
        throw new Error("Failed to update employee contact");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Employees Contact list.",
        error,
      );
    }
  }

  public async getPersonalInformationSsn(id: string | number): Promise<string> {
    let ssn: string;
    try {
      const response = await this.axiosInstance.get<string>(getLocalAppsettings().ClientSide.WorkforceManagement + `/v1/Employee/${id}/ssn`);

      if (response && response.data && response.status === 200) {
        ssn = response.data;
      } else {
        throw new Error("Failed to get employee's personal information");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Employees's personal information.",
        error,
      );
    }
    return ssn;
  }

  public async fetchMaritalStatusList() {
    let maritalStatus: OnboardingEmployeeMaritalStatus[];
    try {
      const response = await this.axiosInstance.get<any[]>(getLocalAppsettings().ClientSide.WorkforceManagement + `/v1/Employee/maritalStatus`);

      if (response && response.data && response.status === 200) {
        maritalStatus = response.data.map(item => {
          return {
            maritalStatusId: item.maritalStatusId,
            maritalStatusName: item.maritalStatusName,
          }
        });
      } else {
        throw new Error("Failed to get Marital list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Marital list.",
        error
      );
    }
    return maritalStatus;
  }

  public async submitReview(payload) {
    try {
      const response = await this.axiosInstance.post<any>(getLocalAppsettings().ClientSide.WorkforceManagement + `/Employee/formsubmit`, payload);
      if (response && response.data && response.status === 200) {
        return
      } else {
        throw new Error("Failed to parse employee information list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the employee information list.",
        error
      );
    }
    return
  }
}

export const onboardingEmployeeInformationApi =
  new OnboardingEmployeeInformationApi([
    AccessTokenRequestInterceptor,
    AccessTokenResponseInterceptor,
  ]);
