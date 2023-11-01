import { FieldModel, UploadFileStateForm } from './OnboardingQuickHireTaxWithHoldingInfo';

export default interface OnboardingEmployerInformation {
    fieldModels: FieldModel[],
    uploadFileStateForms: UploadFileStateForm[],
    formId: number;
    employeeId?: number;
    versionNo?: number;
}