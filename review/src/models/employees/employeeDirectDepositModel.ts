export class EmployeeDirectDeposit {
    employeeDirectDepositId: number;
    pHQClientId: number;
    employeeId: number;
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
    status: string;
    isActive: boolean;
    isDeleted: boolean;
    updateEmployeeId: number;
    description: string;
    employeeDirectDepositFsNo: number | null;
    approvalStatusId: number;
    approvalStatusName: string;
    public constructor(init?: Partial<EmployeeDirectDeposit>) {
        Object.assign(this, init);
    }
}