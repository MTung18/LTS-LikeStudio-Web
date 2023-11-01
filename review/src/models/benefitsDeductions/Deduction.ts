export interface Deduction {
  id: number;
  deductionName: string;
  customizedName: string;
  isViewInESS: boolean;
  isActive: boolean;
  deductionTypeId: number;
  deductionFsNo: string;
  isWHQEditable: boolean;
  isDeleted: boolean;
  foundationDisplayName: string;
  foundationDeduction: any;
}

export interface OptionDeduction {
  miscellaneousDeductionId: string; 
  description: string;
  isActive: boolean;
}

