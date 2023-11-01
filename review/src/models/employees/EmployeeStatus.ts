import DropdownOptions from '@/models/DropdownOptions';

export interface EmployeeStatusReason {
  employeeStatusReasonId: number;
  employeeStatusReasonName: string;
  isNewReason?: boolean;
}

export default class EmployeeStatus {
  public id: number;
  public employeeId: number;
  public employeeStatusId: number;
  public statusDropdown?: DropdownOptions;
  public employeeStatusReason?: EmployeeStatusReason;
  public terminationDate: string;
  public dateRehired: string;
  public dateHired: string;
  public startDate: string;
  public dateLastWorked: string;
  public securedAccess: boolean;
  public deceased: boolean;

  public constructor(init?: Partial<EmployeeStatus>) {
    Object.assign(this, init);
  }
}