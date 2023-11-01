import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";

export default class Employee {
  public id: number;
  public clientId: number;
  public phqPersonId: number;
  public firstName: string;
  public middleName: string;
  public lastName: string;
  public fullName: string;
  public suffix: string;
  public jobTitle: string;
  public employmentStatus: string;
  public isFoundationSynced: boolean;
  public hireDate?: Date;
  public terminationDate?: Date;
  public isActive: boolean;
  public isDeleted: boolean;
  public employeeStatusId: number;
  public aspNetUserId: string;

  //Computed
  public employeeStatusName: string;

  public constructor(init?: Partial<Employee>) {
    if (init.hireDate) {
      init.hireDate = new Date(init.hireDate);
    }

    if (init.terminationDate) {
      init.terminationDate = new Date(init.terminationDate);
    }

    Object.assign(this, init);
    this.employeeStatusName = EmployeeStatusEnum[this.employeeStatusId]
  }
}
