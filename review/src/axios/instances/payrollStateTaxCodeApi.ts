import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import PayrollStateTaxCode from "@/models/foundationIntegration/PayrollStateTaxCode";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class PayrollStateTaxCodesApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${getLocalAppsettings().ClientSide.WorkforceManagement}/v1/PayrollStateTaxCodes`;
    super(interceptors, baseUrl);
  }

  public async getPayrollStateTaxCodes(): Promise<PayrollStateTaxCode[]> {
    let payrollStateTaxCodes: PayrollStateTaxCode[]

    try {
        const response = await this.axiosInstance.get<PayrollStateTaxCode[]>("");
        if (response?.data?.length > 0 && response.status === 200) {
          payrollStateTaxCodes = response.data.map((stateTaxCode) => new PayrollStateTaxCode(stateTaxCode));
        } else {
          throw new Error("Failed to parse state tax code list");
        }
      } catch (error) {
        console.error(
          "An unexpected error occurred attempting to retrieve the state tax code list.",
          error
        );
  
        return Promise.reject(error);
      }
      return payrollStateTaxCodes;
  }
}

export const payrollStateTaxCodeApi = new PayrollStateTaxCodesApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
  