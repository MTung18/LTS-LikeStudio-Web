export interface PayTypeDropdown {
  id: number;
  payTypeName: string
}

export interface EarnCodeDropdown {
  id: number;
  earnCodeName: string
}

export interface PayPeriodDropdown {
  id: number;
  payPeriodName: string
}

export class PayrollInformation {
  public employeeId: number;
  public payTypeId: number;
  public earnCodeId: number;
  public payPeriodId: number;
  public payType?: PayTypeDropdown;
  public earnCode?: EarnCodeDropdown;
  public payPeriod?: PayPeriodDropdown;
  public payRate: number;
  public payPeriodsPerYear: number;
  public isHoursRequiredForSalary: boolean;
  public isCertifiedPayroll: boolean;
  public isFutaSutaExempt: boolean;
  public isDirectDeposit: boolean;
  public isDirectDepositEnabled: boolean;

  public constructor(init?: Partial<PayrollInformation>) {
    Object.assign(this, init);
  }
}

