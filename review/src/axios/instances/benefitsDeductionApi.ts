import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { ApiResponse } from "../../models/ApiResponse";
import { BenefitsDeduction, UpSertDeductionRequestModel } from "../../models/benefitsDeductions/BenefitsDeduction";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { HttpStatusCode } from "axios";
import { MESSAGE } from "@/data/message";
import { useAlerts } from '@/composables/useAlerts';
const { notifyError } = useAlerts();

/* Sample class on how to split out axios instances.  
For now since we are using one API, we should still split out these instances by API controller or where it makes sense to do so. 
This makes it easier when we split to multiple micro-services */

export const baseUrlBenefitsDeductionApi = "employees";
export default class BenefitsDeductionApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + '/v1';
    super(interceptors, baseUrl);
  }

  public async getDeductionDetails(employeeId: string, deductionDetailId: number): Promise<BenefitsDeduction> {
    let deductionDetail: BenefitsDeduction;
    try {
      const response = await this.axiosInstance.get<BenefitsDeduction>(
        `${baseUrlBenefitsDeductionApi}/${employeeId}/deductions/${deductionDetailId}`,
      );

      if (response && response.status === 200) {
        deductionDetail = response.data;
      } else {
        throw new Error("Failed to parse deduction");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the deduction.",
        error,
      );
    }
    return deductionDetail;
  }

  public async updateDeduction(request: UpSertDeductionRequestModel): Promise<ApiResponse> {
    try {
      const response = await this.axiosInstance.patch(
        `${baseUrlBenefitsDeductionApi}/${request.employeeId}/deductions/${request.employeeDeductionId}`,
        request.data
      );

      if (response && response.status === 200) {
        return {
          success: true,
          errorMessage: ` updated.`
        };
      } else {
        return {
          success: false,
          errorMessage: "An unexpected error occurred attempting to update deduction"
        };
      }
    } catch (error) {
      if (error.response.data.status === HttpStatusCode.Conflict && error.response.data.detail === MESSAGE.HR_APPROVAL.UPDATE_ERROR_DETAIL_RESPONSE) {
        notifyError(MESSAGE.HR_APPROVAL.UPDATE_ERROR);
      }
      return {
        success: false,
        errorMessage: error.response?.data?.errorMessage?.replace("InvokeActionMethodAsync :", "")
      };
    }
  }
}

export const benefitsDeductionApi = new BenefitsDeductionApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);