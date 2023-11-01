export default interface OnboardingQuickHireTaxWithHoldingInfo {
    fieldModels: FieldModel[],
    uploadFileStateForms: UploadFileStateForm[],
    formId: number;
    employeeId?: number;
    versionNo?: number;
}

export interface FieldModel {
    formFieldId?: number,
    formFieldValueId?: number,
    fieldKey?: string;
    fieldValue?: unknown
}

export interface UploadFileStateForm {
    formFieldId?: number;
    fileName?: string;
    filePath?: string;
    payload?: string | any;
    description?: string;
    documentCategory?: number | null;
    uploadDateUTC?: string
}