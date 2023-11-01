import { acceptHMRUpdate, defineStore } from "pinia";
import { benefitsDeductionApi } from "../axios/instances/benefitsDeductionApi";
import { BenefitsDeduction, UpSertDeductionRequestModel } from "@/models/benefitsDeductions/BenefitsDeduction";
import { ApiResponse } from "@/models/ApiResponse";

export const useBenefitsDeductionStore = defineStore("benefitsDeduction", () => {
  async function getBenefitsDetail(employeeId: string, deductionDetailId: number): Promise<BenefitsDeduction> {
    return await benefitsDeductionApi.getDeductionDetails(employeeId, deductionDetailId);
  }

  async function editbenefits(request: UpSertDeductionRequestModel): Promise<ApiResponse> {
    return await benefitsDeductionApi.updateDeduction(request);
  }
  return {
    getBenefitsDetail,
    editbenefits
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useBenefitsDeductionStore, import.meta.hot));
}
