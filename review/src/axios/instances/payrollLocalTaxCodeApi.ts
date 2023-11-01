import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { LocalTaxCode } from "../../models/foundationIntegration/LocalTaxCode";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";

export default class PayrollLocalTaxCodesApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${
      getLocalAppsettings().ClientSide.WorkforceManagement
    }/v1/PayrollLocalTaxCodes`;
    super(interceptors, baseUrl);
  }

  public async getPayrollLocalTaxCodes(): Promise<LocalTaxCode[]> {
    let payrollLocalTaxCodes: LocalTaxCode[];

    try {
      const response = await this.axiosInstance.get<LocalTaxCode[]>("");
      if (response?.data?.length > 0 && response.status === 200) {
        payrollLocalTaxCodes = response.data.map(
          (payrollLocalTaxCode) => new LocalTaxCode(payrollLocalTaxCode)
        );
      } else {
        throw new Error("Failed to parse payrollLocalTaxCode list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the payrollLocalTaxCode list.",
        error
      );

      return Promise.reject(error);
    }
    return payrollLocalTaxCodes;
  }
}

export const payrollLocalTaxCodeApi = new PayrollLocalTaxCodesApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
