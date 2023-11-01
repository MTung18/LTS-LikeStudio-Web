export default class CreateEmployeeResult {
    public userGuid: string;
    public phqPersonId: number;
    public employeeId: number;
    
  public constructor(init?: Partial<CreateEmployeeResult>) {
    Object.assign(this, init);
  }
}