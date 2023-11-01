import { FieldModel, UploadFileStateForm } from './OnboardingQuickHireTaxWithHoldingInfo';

export interface OnboardingTaxWithholdingInfoSummary {
    fieldModels: FieldModel[],
    uploadFileStateForms: UploadFileStateForm[],
    formId: number;
    employeeId?: number;
    versionNo?: number;
}