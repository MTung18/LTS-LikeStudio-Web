import { StateT } from "./UploadPayload";

export interface OnboardingWOTC8850Ess {
  status: string;
  isFormDone: boolean;
  firstName: string;
  middleInitial: string;
  lastName: string;
  socialSecurityNumber: string;
  address1: string;
  address2: string;
  city: string;
  state: StateT;
  zipCode: string;
  county: string;
  isUnderForty: boolean;
  telePhone: string;
  dateOfBirth: string;
  isReceivedAConditional: boolean;
  isStatementsApply: boolean;
  isVeteranAndUnemployed: boolean;
  isVeteranEntitledUSArmed: boolean;
  isVeteranEntitledSixMonths: boolean;
  isMemberOfFamily: boolean;
  isPeriodOfUnemployment: boolean;
  dateSignatureUTC: string;
  employeeSignaturePath: string;
  formFiles: string;
}
