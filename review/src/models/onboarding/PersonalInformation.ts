export interface PersonalInformation {
  id: number;
  fullName: string;
  jobTitle: string;
  employmentStatus: string;
  employeeType: number;
  isFoundationSynced: boolean;
  hireDate: string | Date;
  terminationDate: string | Date;
  terminationReason: string | Date;
  isActive: boolean;
  isDeleted: boolean;
  employeeStatusId: number | string;
  aspNetUserId: string;
  isVeteran: boolean;
  isNonResidentAlien: boolean;
  isMultiracial: boolean;
  isNonBinaryTransgender: boolean;
  minorityCodeId: number;
  driversLicenseState: string;
  driversLicenseSelectState?: StateObject;
  driversLicenseNumber: string;
  driversLicenseExpirationDate: Date | string;
  firstName: string;
  middleName: string;
  lastName: string;
  suffix: string;
  clientId: number;
  fsEmployeeId: string;
  phqPersonId: number;
  email: string;
  mainPhone: PhoneObject;
  address: AddressObject;
  gender: GenderObject;
  maritalStatus: MaritalObject;
  maritalSelectState?: MaritalObjectSelect;
  genderId: number;
  genderSelectState?: GenderObject;
  honorificId: number;
  prefixSelectState?: HonorificObject;
  dateOfBirth: Date | string;
  ssn: string;
  phoneNumber?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  stateSelectState?: StateObject;
  zip?: string;
}

export interface PhoneObject {
  id: number;
  phoneId: number;
  personId: number;
  phoneNumber: string;
  phoneExtension: string;
  isMain: boolean;
  allowText: boolean;
  phoneNumberType: number;
  changeTrackingDate: Date | string;
}

export interface AddressObject {
  id: number;
  addressId: number;
  personId: number;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  personAddressType: number;
  changeTrackingDate: Date | string;
}

export interface GenderObject {
  id: string | number;
  name: string;
}

export interface MaritalObject {
  maritalStatusId: number;
  maritalStatusName: string;
}

export interface MaritalObjectSelect {
  maritalStatusId: number;
  maritalStatusName: string;
}

export interface HonorificObject {
  honorificId: number;
  honorificName: string;
}

export interface StateObject {
  value: string;
  text: string;
  file?: string;
}

export interface UpdatePersonalInfoRequestModel {
  employeeId: number;
  general: {
    honorificId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    suffix: string;
    email: string;
    phoneNumber: string;
    address: {
      id: number;
      address1: string;
      address2: string;
      city: string;
      state: string;
      zip: string;
      country: string;
      addressType: string | number;
      addressTypeId: number;
    };
    genderId: string | number;
    maritalStatusId: number;
    dateOfBirth: Date | string;
    ssn: string;
  };
  eeo: {
    isVeteran: boolean;
    isNonResidentAlien: boolean;
    isMultiracial: boolean;
    isNonBinaryTransgender: boolean;
    minorityCodeId: number;
  };
  sensitive: {
    driversLicenseState: string;
    driversLicenseNumber: string;
    driversLicenseExpirationDate: Date | string;
  };
}