export interface EmployeeContact {
  id: number;
  firstName: string;
  middleName: string;
  lastName: string;
  relation: string;
  relationshipId: number;
  phoneId: number;
  phoneNumber: string;
  phoneExtension: string;
  emailAddress: string;
  emailId: number;
  gender: string;
  genderId: number;
  birthDate: string;
  ssn: string;
  isEmergencyContact: boolean;
  isDependent: boolean;
  isBeneficiary: boolean;
  isPrimaryContact: boolean;
  namePrefixId: number;
  prefix: string;
  suffix: string;
  address: Address;
  namePrefixOption: EmployeeContactTypeOption;
  relationshipTypeOption: EmployeeContactTypeOption;
  genderOption: EmployeeContactTypeOption;
  stateOption: EmployeeContactStateTypeOption;
}

export interface EmployeeContactSave {
  id: number;
  employeeId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  relationTypeId: number;
  phone: Phone;
  email: Email;
  genderId: number;
  birthDate: string;
  ssn: string;
  isEmergencyContact: boolean;
  isDependent: boolean;
  isBeneficiary: boolean;
  isPrimaryContact: boolean;
  prefixId: number;
  suffix: string;
  address: Address
}
export interface EmployeeContactTypeOption {
  id: number;
  name: string;
}

export interface EmployeeContactStateTypeOption {
  id: string;
  name: string;
}

export interface Address {
  id: number;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  addressType: string;
  addressTypeId?: number;
}

export interface Phone {
  id: number;
  phoneTypeId: number;
  phoneNumber: string;
  phoneExtension: string
};

export interface Email {
  id: number;
  emailAddressTypeId: number;
  email: string
};

export interface EmployeeContactReactive {
  data: EmployeeContact;
}
