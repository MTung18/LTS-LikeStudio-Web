export interface OnboardingVEVRAASelfIdentification {
  veteranStatusId: number | string;
  isDisabledVeteran: boolean,
  isRecentlySeparatedVeteran: boolean,
  isActiveWartimeOrCampaign: boolean,
  isArmedForcesServiceMedal: boolean,
  employeeSignaturePath: string,
  employeeSignature: string;
  dateSignatureUTC: string;
  veteranStatusEss: string;
  veteranStatusEssOption : VeteranStatusOption
}

export interface VeteranStatusOption {
  id: string;
  name: string;
}

interface FieldModel {
  formFieldId: number;
  formFieldValueId?: number;
  fieldKey: keyof OnboardingVEVRAASelfIdentification;
  fieldValue: OnboardingVEVRAASelfIdentification[keyof OnboardingVEVRAASelfIdentification];
}

export interface UploadPayload {
  fieldModels: FieldModel[];
  uploadFileStateForms: any[];
  formId: number;
  employeeId: number | string;
  versionNo: number;
}

export interface OnboardingVEVRAASelfIdentificationReactive {
  data: OnboardingVEVRAASelfIdentification;
}
