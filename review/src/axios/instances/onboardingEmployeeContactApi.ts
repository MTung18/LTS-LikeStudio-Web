import { EmployeeContact, EmployeeContactSave } from "@/models/onboarding/OnboardingEmployeeContact";
import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ApiResponse } from "@/models/ApiResponse";

export class OnboardingEmployeeContactListApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1`;
    super(interceptors, baseUrl);
  }

  public async getEmployeeContacts(employeeId: number): Promise<EmployeeContact[]> {
    let employeeContactList: EmployeeContact[];
    try {
      const response = await this.axiosInstance.get<EmployeeContact[]>(
        `Employee/${employeeId}/contact`,
      );
      if (
        response &&
        response.data &&
        response.data.length > 0 &&
        response.status === 200
      ) {
        response.data.map((item: any) => {
          item.contactPerson = `${item.prefix ?? ""} ${item.firstName} ${item.middleName ?? ""
            } ${item.lastName} ${item.suffix ?? ""}`;
        });
        employeeContactList = response.data;
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Employees Contact list.",
        error
      );
    }
    return employeeContactList;
  }

  public async addEmployeeContact(data: EmployeeContactSave): Promise<ApiResponse> {
    try {
      await this.axiosInstance.post<EmployeeContactSave[]>(
        `/Employee/contact`, data
      );

      return {
        success: true,
        apiMessage: `Employee contact added.`
      };
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Employees Contact list.",
        error
      );
    }
  }

  public async deleteEmployeeContact(contactId: number): Promise<ApiResponse> {
    try {
      await this.axiosInstance.delete(
        `/Employee/contact/${contactId}`,
      );
      return {
        success: true,
        apiMessage: `Employee contact deleted.`
      };
    } catch (error) {
      console.error("Delete error.", error);
    }
  }

  public async updateEmployeeContactDetail(data: EmployeeContactSave): Promise<ApiResponse> {
    try {
      await this.axiosInstance.put<EmployeeContactSave[]>(
        `/Employee/contact`, data
      );
      return {
        success: true,
        apiMessage: `Employee contact updated.`
      };
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Employees Contact list.",
        error
      );
    }
  }

  public async fetchEmployeeContactDetail(employeeId: number, contactId: number): Promise<EmployeeContact> {
    let employeeContactDetail: EmployeeContact;
    try {
      const response = await this.axiosInstance.get<EmployeeContact>(
        `/Employee/${employeeId}/contact/${contactId}`
      );

      if (response && response.data && response.status === 200) {
        employeeContactDetail = response.data;
      } else {
        throw new Error("Failed to get employee contact detail");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Employees Contact list.",
        error
      );
    }
    return employeeContactDetail;
  }

  public async fetchEmployeeContactSsn(employeeContactId: number): Promise<string> {
    let result: string;
    try {
      const response = await this.axiosInstance.get(
        `/Employee/contact/${employeeContactId}/ssn`,
      );
      if (response && response.status === 200) {
        result = response.data;
      } else {
        throw new Error("Failed to retrieve employee SSN");
      }
    } catch (error) {
      console.error("Error retrieving employee SSN.",
        error)
    }
    return result;
  }
}

export const onboardingEmployeeContactListApi = new OnboardingEmployeeContactListApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
