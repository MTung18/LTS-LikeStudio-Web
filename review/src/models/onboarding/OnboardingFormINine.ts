export interface OnboardingFormINineModel {
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
  payload: PayloadObject;
}
export interface FileForm {
  fileName: string;
  fileObject?: File;
  filePath: string;
  description?: string;
  payload: PayloadObject;
}
export interface PayloadObject {
  type: number
}
export interface FieldModels {
  formFieldId: number;
  fieldKey: string;
  fieldValue: string;
}

export interface OnboardingI9Summary {
  formFiles: string;
  employeeId: string;
  note: string;
}

export interface OnboardingI9Employer {
  formFiles: string;
  employeeId: string;
  employeeLastName: string;
  employeeFirstName: string;
  employeeMiddleName: string;
  employeeCitizenStatus: number;
  listSelected: number | string;
  listAFirstDocumentTitle: string;
  listAFirstIssuingAuthority: string;
  listAFirstDocumentNumber: string;
  listAFirstExpirationDate: Date | string;
  listASecondDocumentTitle: string;
  listASecondIssuingAuthority: string;
  listASecondDocumentNumber: string;
  listASecondExpirationDate: Date | string;
  listAThirdDocumentTitle: string;
  listAThirdIssuingAuthority: string;
  listAThirdDocumentNumber: string;
  listAThirdExpirationDate: Date;
  listBDocumentTitle: string;
  listBIssuingAuthority: string;
  listBDocumentNumber: string;
  listBExpirationDate: Date | string;
  listBAdditionalInformation: string;
  listCDocumentTitle: string;
  listCIssuingAuthority: string;
  listCDocumentNumber: string;
  listCExpirationDate: Date | string;
  employerDayOfEmployment: string;
  employerSignaturePath: string;
  employerSignatureDate: Date | string;
  employerSignature?: string;
  employerTitle: string;
  employerLastName: string;
  employerFirstName: string;
  employerBusinessOrganizeName: string;
  employerBusinessOrganizeAddress: string;
  employerCityOrTown: string;
  employerState: string;
  employerZipCode: string;
  reverificationRehiresFirstName: string;
  reverificationRehiresMI: string;
  reverificationRehiresLastName: string;
  reverificationRehiresDateHire: Date | string;
  reverificationRehiresDocumentTitle: string;
  reverificationRehiresDocumentNumber: string;
  reverificationRehiresExpDate: Date | string;
  reverificationRehiresSignaturePath: string;
  reverificationRehiresSignatureDate: Date | string;
  reverificationRehiresSignature?: string;
  reverificationRehiresName: string;
  status: number | string;
}

export interface OnboardingI9Employee {
  formINineId: number | string;
  employeeId: number;
  lastName: string;
  firstName: string;
  middleName: string;
  lastNameUsed: string;
  address: string;
  aptNumber: string;
  city: string;
  state: StateForm;
  stateEnum?: string;
  zipCode: string;
  dateOfBirth: Date | string;
  socialSecurityNumber: string;
  emailAddress: string;
  telePhone: string;
  attestCitizenshipStatusId: number;
  alienRegistrationUSCISNumber: string;
  authorizedExpirationDate: Date | string;
  attestCitizenshipFourId: number;
  alienRegistrationNumber: string;
  formAdmissionNumber: string;
  foreignPassportNumber: string;
  countryOfIssuance: CountryForm;
  employeeSignaturePath: string;
  dateSignatureUTC: Date | string;
  isTranslator: boolean | string;
  translatorSignaturePath: string;
  translatorSignatureDate: Date | string;
  translatorLastName: string;
  translatorFirstName: string;
  translatorAddress: string;
  translatorCity: string;
  translatorState: StateForm;
  translatorZipCode: string;
  status: number | string;
  uploadFile?: FileFormI9[];
}

export interface StateForm {
  file: string;
  text: string;
  value: string
}

export interface CountryForm {
  code: string;
  name: string;
}