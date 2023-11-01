import { ApiResponse } from "@/models/ApiResponse";
import { PayStubDateT } from "@/models/hrmSettings/payrollAndTax/payStub/payStubDate";
import { PayStubShowSectionT } from "@/models/hrmSettings/payrollAndTax/payStub/showSections";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";
import { Setting } from "@/models/settings/Setting";

export type requestBody = {
  id: number;
  rejectReason?: string;
};

export default class WhqHrmSettingsApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getPayStub(): Promise<PayStubDateT[]> {
    const endPoint = "PayStubs";
    let payStubs: PayStubDateT[];
    try {
      const result = await this.axiosInstance.get<PayStubDateT[]>(endPoint);
      if (result && result.status === 200) {
        payStubs = [...result.data];
      } else {
        throw new Error("Failed to get pay stub list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the pay stub list."
      );
    }
    return payStubs;
  }

  public async getShowSection(): Promise<PayStubShowSectionT> {
    const endPoint = `PayrollAndTaxesSetting`;
    let showSections: PayStubShowSectionT;
    try {
      const result = await this.axiosInstance.get<PayStubShowSectionT>(
        endPoint
      );
      if (result.status == 200) {
        Object.keys(result.data).length > 0 ? showSections = result.data : showSections = new PayStubShowSectionT();
      } else {
        throw new Error("Failed to parse pay stub show section settings");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the pay stub show section settings."
      );
    }
    return showSections;
  }

  public async addPayStub(payStub): Promise<ApiResponse> {
    const endPoint = `PayStubs`;
    try {
      const response = await this.axiosInstance.post<PayStubDateT>(endPoint, {
        payDate: payStub.payDate,
        availableToEmployeeOnDate: payStub.availableToEmployeeOnDate,
      });
      if (response && response.status === 200) {
        return { success: true };
      } else {
        return {
          success: false,
          errorMessage:
            "An unexpected error occurred attempting to add request.",
        };
      }
    } catch (error) {
      return {
        success: false,
        status: error.response.status,
        errorMessage: "An unexpected error occurred attempting to add request.",
      };
    }
  }

  public async changePayStub({
    payStubDate,
    payStubId,
  }: {
    payStubDate: PayStubDateT;
    payStubId: number;
  }): Promise<ApiResponse> {
    const endPoint = `PayStubs/${payStubId}`;
    try {
      const response = await this.axiosInstance.put<PayStubDateT>(
        endPoint,
        payStubDate
      );
      if (response && response.status === 200) {
        return { success: true };
      } else {
        return {
          success: false,
          errorMessage:
            "An unexpected error occurred attempting to update request.",
        };
      }
    } catch (error) {
      return {
        success: false,
        status: error.response.status,
        errorMessage:
          "An unexpected error occurred attempting to update request.",
      };
    }
  }

  public async deletePayStub(payStubId: number | string): Promise<void> {
    const endPoint = `PayStubs/${payStubId}`;
    try {
      await this.axiosInstance.delete(endPoint);
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to delete this pay stub."
      );
    }
  }

  public async changeShowSection({
    payrollAndTaxesSettingId,
    sections,
  }: {
    payrollAndTaxesSettingId: number;
    sections: Omit<PayStubShowSectionT, "payrollAndTaxesSettingId">;
  }): Promise<void> {
    const endPoint = `PayrollAndTaxesSetting/${payrollAndTaxesSettingId}`;
    try {
      await this.axiosInstance.put<Setting>(endPoint, sections);
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the HRM settings."
      );
    }
  }
}

export const whqHrmSettingsApi = new WhqHrmSettingsApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
