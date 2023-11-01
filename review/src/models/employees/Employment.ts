export interface DropdownOption {
  id: number;
  name: string;
}
export class Employment {
  public employeeId: number;
  public employeeNumber: string;
  public employmentStatus?: string;
  public employmentStatusId: number;
  public jobTitle?: string;
  public jobTitleId: number;
  public department?: string;
  public departmentId: number;
  public i9Verified: boolean;
  public stateOfHire: string;
  public workLocations?: Array<string>
  public union?: string;
  public unionId: number
  public trade?: string;
  public tradeId: number;
  public acaExempt: boolean;
  public oshaLevel: string;
  public oshaCertificateNumber: string;
  public oshaTradeLicense: string;
  public reportingSupervisor?: string;
  public additionalSupervisors?: Array<string>
  public workerCompState?: string;
  public workersCompStateId: number;
  public workerCompClassNumber?: string;
  public workersCompClassId: number;
  public corporateOfficer: boolean;
  public costCodeNumber?: string;
  public costCodeId: number
  public generalLiabilityState?: string;
  public generalLiabilityStateId: number;
  public generalLiabilityClassNumber?: string;
  public generalLiabilityClassId: number;
  public ownerOperator: boolean;
  public employeeStatus: string;
  public employeeStatusId: number
  public dateHired: string;
  public startDate: string;
  public dateLastWorked: string;
  public statusReason: string;
  public dateTerminated: string;
  public dateRehired: string;
  public securedAccess: boolean;
  public deceased: boolean;
  public isSecuredAccess: boolean;
  public workLocationIds: Array<number>;
  public reportingSupervisorId: number;
  public additionalSupervisorIds: Array<number>;
  public onboardingStartedUTC?: string;
  public onboardingCompletedUTC?: string;

  public constructor(init?: Partial<Employment>) {
    Object.assign(this, init);
  }
}