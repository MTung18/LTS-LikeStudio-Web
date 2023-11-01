import { acceptHMRUpdate, defineStore } from "pinia";
import { deductionApi } from "@/axios/instances/deductionApi";
import {
  Deduction,
  OptionDeduction,
} from "@/models/benefitsDeductions/Deduction";
import { DeductionMode } from "@/enums/DeductionMode";
import { DeductionType } from "@/enums/DeductionType";
import { ApiResponse } from "@/models/ApiResponse";

export const useDeductionStore = defineStore("deduction", () => {
  async function getDeductionList(param?: DeductionType): Promise<Deduction[]> {
    return await deductionApi.getListOfDeductions(param);
  }

  async function getDeductionOptionList(mode: DeductionMode): Promise<OptionDeduction[]> {
    return await deductionApi.getListOptionDeductions(mode);
  }

  async function getDeductionDetail(id: number): Promise<Deduction> {
    return await deductionApi.getDeductions(id);
  }

  async function activateDeduction(data: Deduction): Promise<ApiResponse> {
    return await deductionApi.activateDeduction(data);
  }

  async function updateDeduction(data: Deduction): Promise<ApiResponse> {
    return await deductionApi.updateDeduction(data);
  }

  async function deactivateDeduction(deductionId: number, deductionName: string) {
    return await deductionApi.deactivateDeduction(deductionId, deductionName);
  }

  return {
    getDeductionList,
    getDeductionOptionList,
    getDeductionDetail,
    activateDeduction,
    deactivateDeduction,
    updateDeduction,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useDeductionStore, import.meta.hot));
}
