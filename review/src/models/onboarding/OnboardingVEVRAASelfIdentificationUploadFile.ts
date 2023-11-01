export interface OnboardingFormVEVRAAModel {
  fieldModels: FieldModels[]
  uploadFileStateForms: FileFormVEVRAA[]
  formId: number
  employeeId: number
  versionNo: number
}

export interface FileFormVEVRAA {
  formFieldId: number
  fileName: string
  filePath: string
  description: string
  documentCategoryId: number
  uploadDateUTC: Date
}
export interface FileForm {
  fileName: string,
  fileObject?: File,
  filePath: string
}
export interface OnboardingVEVRAASelfIdentification {
  veteranStatusId: number | string;
  isDisabledVeteran: boolean,
  isRecentlySeparatedVeteran: boolean,
  isActiveWartimeOrCampaign: boolean,
  isArmedForcesServiceMedal: boolean,
  employeeSignaturePath: string,
  dateSignatureUTC: string,
  status?: number | string, 
  employeeSignature: string;
  veteranStatusEss: string;
  veteranStatusEssOption : VeteranStatusOption
}

export interface VeteranStatusOption {
  id: string;
  name: string;
}

interface FieldModels {
  formFieldId: number,
  formFieldValueId: number,
  fieldKey: string;
  fieldValue: unknown
}

export interface OnboardingVEVRAA {
  formFiles: string
  note?: string
  veteranStatus?: string
}
