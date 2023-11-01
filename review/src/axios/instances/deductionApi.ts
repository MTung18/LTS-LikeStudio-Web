import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import { ApiResponse } from "@/models/ApiResponse";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { Deduction, OptionDeduction } from "@/models/benefitsDeductions/Deduction";
import { DeductionType } from "@/enums/DeductionType";
import { propertyEncodeBase64 } from "@/functions/FormatterUtilityFunction";

/* Sample class on how to split out axios instances.  
For now since we are using one API, we should still split out these instances by API controller or where it makes sense to do so. 
This makes it easier when we split to multiple micro-services */
export default class DeductionApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl);
  }
  urlApi = "Deductions";

  public async getListOfDeductions(param?: DeductionType): Promise<Deduction[]> {
    let listOfDeductions: Deduction[];
    try {
      const response = await this.axiosInstance.get<Deduction[]>(this.urlApi, {
        params: { deductionType: param }
      });

      if (
        response &&
        response.data &&
        response.status === 200
      ) {
        listOfDeductions = response.data.filter(
          (item) => item.deductionTypeId === param
        );

      } else {
        throw new Error("Failed to parse list of deductions");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the list of deductions.",
        error
      );
    }
    return listOfDeductions;
  }

  public async deactivateDeduction(deductionId: number, deductionName: string): Promise<ApiResponse> {
    let result: boolean;
    try {
      result = await this.PerformPatch<boolean>(`${this.urlApi}/deactivate/${deductionId}`, null);
    } catch (error) {
      result = false;
    }

    return {
      success: result,
      errorMessage: result ? `${deductionName} deleted.` : 'An unexpected error occurred attempting to delete benefit/deduction'
    };
  }

  public async activateDeduction(data: Deduction): Promise<ApiResponse> {
    let result: boolean;
    try {
      const deductionInput = this.getDeductionWithEncodedProperties(data);
      
      result = await this.PerformPatch<boolean>(`${this.urlApi}/activate`, deductionInput);

    } catch (error) {
      result = false;
    }

    return {
      success: result,
      errorMessage: result ? 'Deduction created.' : 'An unexpected error occurred attempting to create benefit/deduction',
      };
  }

  public async updateDeduction(data: Deduction): Promise<ApiResponse> {
    let result: boolean;
    try {
      const input = this.getDeductionWithEncodedProperties(data);
      const deductions = [input];

      result = await this.PerformPut<boolean>(`${this.urlApi}`, deductions);
    } catch (error) {
      result = false;
    }

    return {
      success: result,
      errorMessage: result ? 'Deduction updated.' : 'An unexpected error occurred attempting to update benefit/deduction',
    };
  }

  public async getDeductions(id: string | number): Promise<Deduction> {
    let deduction: Deduction;
    try {
      const response = await this.axiosInstance.get<Deduction>(`${this.urlApi}/${id}`);
      if (response && response.data && response.status === 200) {
        deduction = response.data;
      } else {
        throw new Error("Failed to parse deduction");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the deduction.",
        error,
      );
    }

    return deduction;
  }

  public async getListOptionDeductions(param?): Promise<OptionDeduction[]> {
    let listOption: OptionDeduction[];
    try {
      const response = await this.axiosInstance.get<OptionDeduction[]>(
        `${this.urlApi}/listOfFoundationDeductions`, {
        params: { deductionMode: param }
      }
      );

      if (
        response &&
        response.data &&
        response.data.length > 0 &&
        response.status === 200
      ) {
        listOption = response.data.sort((a, b) => a.miscellaneousDeductionId.localeCompare(b.miscellaneousDeductionId));

      } else {
        throw new Error("Failed to parse list of deductions");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the list of deductions.",
        error
      );
    }

    return listOption;
  }

  getDeductionWithEncodedProperties(input: Deduction): Deduction {
    // Pproperties need to be Base 64 encoded
    const propertiesToEncode = ['deductionName', 'customizedName'];
    const encodedInput = { ...input };
    propertyEncodeBase64(propertiesToEncode, encodedInput);
    return encodedInput;    
  }
}

export const deductionApi = new DeductionApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
