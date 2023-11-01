import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { W2Form } from "@/models/w2/W2Form";
import { w2FormSetting } from "@/models/hrmSettings/payrollAndTax/w2Form/w2FormSetting";
import { W2Consent } from "@/models/w2/W2Consent";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import * as FileSaver from 'file-saver';
import { ApiResponse } from "@/models/ApiResponse";

export default class W2FormApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }

  public async getW2FormsByEmployeeId(
    employeeId: string,
    year: number | string
  ): Promise<W2Form[]> {
    let w2FormList: W2Form[];
    try {
      const response = await this.axiosInstance.get<W2Form[]>(
        `W2FormSetting/myW2?year=${year}&employeeId=${employeeId}`
      );

      if (response.status === 200 && response.data) {
        w2FormList = response.data;
      } else {
        throw new Error("Failed to parse w2-form list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the W-2 Form List."
      );
    }
    return w2FormList;
  }

  public async getEmployeeConsentStatus(
    employeeId: string
  ): Promise<W2Consent> {
    let isW2Consent: W2Consent;
    try {
      const response = await this.axiosInstance.get(`ConsentHistories/${employeeId}`);

      if (response.status === 200 && response.data) {
        isW2Consent = response.data;
      } else {
        throw new Error("Failed to parse w2-consent status");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the W-2 Consent Status."
      );
    }
    return isW2Consent;
  }

  public async getW2Settings(year: number) {
    let w2Settings: w2FormSetting;
    try {
      const response = await this.axiosInstance.get(`W2FormSetting?year=${year}`);

      if (response.status === 200 && response.data) {
        w2Settings = response.data;
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the W-2 Settings.",
        error
      );
    }

    return w2Settings;
  }

  public async updateW2Settings(data: w2FormSetting): Promise<ApiResponse> {
    let result: boolean;
    try {
      result = await this.PerformPost<boolean>(`W2FormSetting`, data);
    } catch (error) {
      result = false;
    }

    return {
      success: result,
      errorMessage: result ? `W-2 Settings updated.` : 'An unexpected error occurred when update w2 settings.'
    };
  }

  public async downloadW2FormByYear(employeeId: number, year: number, formType: string, fileName: string): Promise<void> {
    try {
      const data = await this.axiosInstance.get(`W2FormSetting/w2FormPDF?employeeId=${employeeId}&year=${year}&type=${formType}`, {
        responseType: 'blob'
      });
      const blob: Blob = new Blob([data.data], { type: 'application/pdf' })
      FileSaver.saveAs(blob, fileName);
    } catch (error) {
      console.error('An unexpected error occurred attempting to retrieve the W-2 Form.', error)
    }
  }
}

export const w2FormApi = new W2FormApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
