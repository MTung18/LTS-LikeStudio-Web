import { EmployeeType } from "@/enums/EmployeeType";

export default class EmployeeFormModel {
  public clientId: number;
  public phqPersonId: number;
  public company: string;
  public firstName: string;
  public middleName: string;
  public lastName: string;
  public suffix: string;
  public emailAddress: string;
  public jobTitle: string;
  public employeeType: EmployeeType;
  public hireDate: Date;
  public hrRepresentative: string;
  public onboardingPlan: string;
  public defaultProjectRole: string;

  public constructor(init?: Partial<EmployeeFormModel>) {
    Object.assign(this, init);
  }
}