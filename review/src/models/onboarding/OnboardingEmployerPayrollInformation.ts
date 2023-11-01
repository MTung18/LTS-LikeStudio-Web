export interface EarnCodes {
  id: number;
  earnCodeName: string;
  earnCodeShortName: string;
  earnTypeId: string;
  isActive: boolean;
  earnCodeFsNo: number;
  isDeleted: boolean;
}

export interface PayPeriods {
  id: number;
  payPeriodName: string;
  isActive: boolean;
  payPeriodFsNo: string;
  isDeleted: boolean;
}