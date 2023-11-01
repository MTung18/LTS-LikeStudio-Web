export default interface DirectDepositAccount {
  employeeDirectDepositId: number | string;
  phqClientId?: number;
  employeeId?: number;
  bankRoutingNumber: string;
  bankAccountNumber: string;
  accountTypeId: number;
  distributionMethodId: number;
  accountTypeName: string;
  distributionMethodName: string;
  distributionAmount: number;
  ordinalPosition: number;
  isPrenoteRequired: boolean;
  voidedCheckFilePath: string;
  approvalStatusId: number;
  approvalStatusName: string;
  status?: string;
  isActive: boolean;
  isDeleted?: boolean;
  updateEmployeeId?: number;
  description: string;
  rowUniqueId?: number;
  id?: string | number;
}

export interface AccountType {
  accountTypeId: number;

}

export interface DirectDepositMetaDataT {
  distributionMethodList: MetaFieldT[];
  accountTypeList: MetaFieldT[];
  approvalStatusList: MetaFieldT[];
}

export interface MetaFieldT {
  id: number,
  name: string
}

export interface PaymentMethodT {
  employeeId: number,
  isDirectDeposit: boolean,
  lastSyncTimeUTC: string,
  updateEmployeeId: number,
  payPeriodId: number
}