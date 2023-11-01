import { FieldModel, UploadFileStateForm } from "./OnboardingQuickHireTaxWithHoldingInfo";

export default interface OnboardingQuickHireEEO {
    fieldModels: FieldModel[],
    uploadFileStateForms: UploadFileStateForm[],
    formId: number;
    employeeId?: number;
    versionNo?: number;
}