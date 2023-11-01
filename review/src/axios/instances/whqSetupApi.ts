import { ApiResponse } from "@/models/ApiResponse";
import { HrContactInformation } from "@/models/settings/HrContactInformation";
import { Setting } from "@/models/settings/Setting";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import AxiosBase from "./axiosBase";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { PaymentMethod } from "@/models/settings/PaymentMethod";

export type requestBody = {
  id: number;
  rejectReason?: string;
};

export default class WhqSetupApi extends AxiosBase {

  url: string;
  keyHrContactInformation: string;
  keyGetPaymentMethod: string;
  keyUpdatePaymentMethod: string;

  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);

    this.url = "GeneralClientSettings";
    this.keyHrContactInformation = `GeneralClientSettings`;
    this.keyGetPaymentMethod = "getPaymentMethod";
    this.keyUpdatePaymentMethod = "updatePaymentMethod";
  }

  private async getEmployeeSetting(): Promise<Setting> {
    let showSections: Setting;
    const essUrl = getLocalAppsettings().ClientSide.WorkforceEmployeeManagement + "/api/v1";
    try {
      const result = await this.axiosInstance.get<Setting>(`${essUrl}/EmployeePayrollAndTax/getPaymentMethod`);
      if (result && result.status === 200) {
        showSections = result.data;
      } else {
        throw new Error("Failed to parse setting");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the setup",
      );
    }
    return showSections;
  }

  public async getGeneralClientSetting(): Promise<HrContactInformation> {
    let showSections: HrContactInformation;
    try {
      const result = await this.axiosInstance.get<HrContactInformation>(`${this.keyHrContactInformation}`);
      if (result && result.status === 200) {
        showSections = result.data;
      } else {
        throw new Error("Failed to parse setting");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the setup",
      );
    }
    return showSections;
  }

  private async changeSetting(setting): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.post<Setting>(this.url, setting);
      if (response && response.status === 200) {
        return {
          success: true
        };
      }

      return {
        success: false,
        errorMessage: "An unexpected error occurred attempting to add request.",
      };
    } catch (error) {
      return {
        success: false,
        status: error.response.status,
        errorMessage: "An unexpected error occurred attempting to add request.",
      };
    }
  }

  public async saveHrContactInformation(hrContactInformation: HrContactInformation): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.put<Setting>(this.keyHrContactInformation, hrContactInformation);
      if (response && response.status === 200) {
        return {
          success: true
        };
      }

      return {
        success: false,
        errorMessage: "An unexpected error occurred attempting to add request.",
      };
    } catch (error) {
      return {
        success: false,
        status: error.response.status,
        errorMessage: "An unexpected error occurred attempting to add request.",
      };
    }
  }

  public async getPaymentMethod(): Promise<PaymentMethod> {
    const result = await this.getEmployeeSetting();
    if (result) {
      const showSections = JSON.parse(result.value);
      return showSections;
    }
    return new PaymentMethod();
  }

  public async savePaymentMethod(paymentMethod: PaymentMethod): Promise<ApiResponse> {
    const setting = new Setting();
    setting.name = this.keyUpdatePaymentMethod;
    setting.value = JSON.stringify(paymentMethod);

    return await this.changeSetting(setting);
  }
}
export const whqSetupApi = new WhqSetupApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);