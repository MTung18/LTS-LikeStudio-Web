import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { TaxGroup } from "../../models/foundationIntegration/TaxGroup";
import { getLocalAppsettings } from "../../helper/hqSuite/appSettingsHelper";

export default class PayrollLocalTaxGroupsApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = `${
      getLocalAppsettings().ClientSide.WorkforceManagement
    }/v1/PayrollLocalTaxGroups`;
    super(interceptors, baseUrl);
  }

  public async getPayrollLocalTaxGroups(): Promise<TaxGroup[]> {
    let payrollLocalTaxGroups: TaxGroup[];

    try {
      const response = await this.axiosInstance.get<TaxGroup[]>("");
      if (response?.data?.length > 0 && response.status === 200) {
        payrollLocalTaxGroups = response.data.map(
          (payrollLocalTaxGroup) => new TaxGroup(payrollLocalTaxGroup)
        );
      } else {
        throw new Error("Failed to parse payrollLocalTaxGroup list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the payrollLocalTaxGroup list.",
        error
      );

      return Promise.reject(error);
    }
    return payrollLocalTaxGroups;
  }
}

export const payrollLocalTaxGroupApi = new PayrollLocalTaxGroupsApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
