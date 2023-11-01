import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";

export default class CurrentOnboards {
  public aspNetUserId: string;
  public clientId: number;
  public driversLicenseExpirationDate: Date
  public driversLicenseNumber: string;
  public driversLicenseState: string;
  public employeeStatusId: number;
  public employmentStatus: string;
  public firstName: string;
  public fsEmployeeId: string;
  public fullName: string;
  public hireDate?: Date;
  public id: number;
  public isActive: boolean;
  public isDeleted: boolean;
  public isFoundationSynced: boolean;
  public isMultiracial: boolean;
  public isNonBinaryTransgender: boolean;
  public isNonResidentAlien: boolean;
  public isVeteran: boolean;
  public jobTitle: string;
  public lastName: string;
  public middleName: string;
  public minorityCodeId: string;
  public suffix: string;
  public terminationDate?: Date;

  //Computed
  public employeeStatusName: string;
  public isFormSubmit: boolean

  public constructor(init?: Partial<CurrentOnboards>) {
    if (init?.hireDate) {
      init.hireDate = new Date(init.hireDate);
    }

    if (init?.terminationDate) {
      init.terminationDate = new Date(init.terminationDate);
    }

    Object.assign(this, init);
    this.employeeStatusName = EmployeeStatusEnum[this.employeeStatusId]
  }
}

export class EmployeeOnboardList {
  employeeId: number;
  employeeStatusId: number;
  formDoneAmount: number;
  formHRDoneAmount: number;
  fullName: string;
  hireDate: Date;  
  isSubmitted: boolean;
  jobTitleName: string;
  onboardingCompletedUTC: Date;
  reportingManagerName: string;
  totalFormAmount: number;
}