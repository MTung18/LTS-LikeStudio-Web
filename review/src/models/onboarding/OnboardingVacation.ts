export interface OnboardingFormVacation {
  fieldModels: FieldModels[];
  uploadFileStateForms: [];
  formId: number;
  employeeId: number;
  versionNo: number;
}
export interface OnboardingVacation {
  planType: PlanTypeObj;
  plan: PlanObj;
}
export interface FieldModels {
  formFieldId: number;
  fieldKey: string;
  fieldValue: string;
}

export interface PlanTypeObj {
  id: number;
  name: string;
}

export interface PlanObj {
  id: number;
  name: string;
  planTypeId: number;
}