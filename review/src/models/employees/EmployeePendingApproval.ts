export default class EmployeePendingApproval {
  public id: number;
  public fullName: string;
  public jobTitle: string;
  public avatar: string;

  public constructor(init?: Partial<EmployeePendingApproval>) {
    Object.assign(this, init);
  }
}