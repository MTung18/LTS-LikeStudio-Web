import { StateT } from "./UploadPayload";

export interface OnboardingWOTC8850Hr {
  status: string;
  isFormDone: boolean;
  name: string;
  phone: string;
  ein: string;
  address: string;
  city: string;
  state: StateT;
  zipCode: string;
  otherPerson: string;
  otherPhone: string;
  otherAddress: string;
  otherCity: string;
  otherState: StateT;
  otherZipCode: string;
  group: StateT;
  gaveInformationDate: string;
  offeredJobDate: string;
  hiredDate: string;
  startedJobDate: string;
  employeeSignaturePath: string;
  employeeSignature: string;
  dateSignatureUTC: string;
}
