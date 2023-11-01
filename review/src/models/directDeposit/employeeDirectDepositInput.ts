export class EmployeeDirectDepositInput {
    employeeDirectDepositId: number;
    employeeId: number;
    bankRoutingNumber: string;
    bankAccountNumber: string;
    accountTypeId: number;
    distributionMethodId: number;
    distributionAmount: number;
    ordinalPosition: number;
    isPrenoteRequired: boolean;
    voidedCheckFilePath: string;
    isActive: boolean;
    isDeleted: boolean;
    updateEmployeeId: number;
    description: string;
    employeeDirectDepositFsNo: number | null;
    approvalStatusId: number;
    public constructor(init?: Partial<EmployeeDirectDepositInput>) {
        Object.assign(this, init);
    }
}