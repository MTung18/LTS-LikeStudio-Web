export default class CreateEmployeeInput {
  public honorificId: number; // called Prefix on Create Employee page
  public firstName: string;
  public middleName: string;
  public lastName: string;
  public suffix: string;
  public email: string;
  public phoneNumber: string;
  public startDate: Date;
  public supervisorId: number;
  public additionalSupervisors: number[];
  public securedAccess: boolean;
  public workLocations: number[]; // called Work Location on Create Employee page
  public permissionGroupId: number;
  public initialEmployeeStatusId: number; // called New Hire Type
  public employmentStatusId: number;


  public constructor(init?: Partial<CreateEmployeeInput>) {
    Object.assign(this, init);
  }
}