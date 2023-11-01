import { EarnCodes, PayPeriods } from "@/models/onboarding/OnboardingEmployerPayrollInformation";

export interface OnboardingPayrollInformationModel {
  fieldModels: FieldModels[];
  uploadFileStateForms: FileFormI9[];
  formId: number;
  employeeId: number;
  versionNo: number;
}

export interface FileFormI9 {
  formFieldId: number;
  fileName: string;
  filePath: string;
  description: string;
  documentCategoryId: number;
  uploadDateUTC: Date;
}

export interface FieldModels {
  formFieldId: number;
  fieldKey: string;
  fieldValue: string;
}

export interface OnboardingPayrollInformation {
  payType: PayType;
  earnCode: EarnCodes;
  payPeriod: PayPeriods;
  payRatePerPayPeriod: number;
  payPeriodsPerYear: string;
  hoursRequiredForSalary: boolean | string;
  certifiedPayroll: boolean | string;
  futaFusaExempt: boolean | string;
}

export interface PayType {
  text: string;
  value: number;
}