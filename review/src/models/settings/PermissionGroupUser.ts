export default class PermissionGroupUser {
  public employeeId: number;
  public name: string;
  public lastFirstName: string;
  public firstName: string;
  public middleName?: string;
  public lastName: string;
  public emailAddress: string;
  public permissionGroup: string;
  public isActive: boolean;
  public employeeStatusId: number;
  public employeeStatusName: string;
  public selected?: boolean;

  public constructor(init?: Partial<PermissionGroupUser>) {
    if(!init.firstName) init.firstName = '';
    if(!init.lastName)  init.lastName = '';
    
    Object.assign(this, init);
    
    if(this.middleName && this.middleName !== "")
    {
      this.name = `${this.firstName} ${this.middleName} ${this.lastName}`;
      this.lastFirstName = `${this.lastName} ${this.middleName} ${this.firstName}`; 
    }
    else
    {
      this.name = `${this.firstName} ${this.lastName}`;
      this.lastFirstName = `${this.lastName} ${this.firstName}`; 
    }
  }
}