export interface BenefitsDeduction {
  id: number;
  fixedDedAmount: number;
  deductionPercent: number;
  planName: string;
  employeeDeductionId: number;
}

export interface DeductionOption {
  text: string,
  value: string
}

export interface UpSertDeductionRequestModel {
  data: BenefitsDeduction;
  employeeId: string;
  employeeDeductionId: number;
}