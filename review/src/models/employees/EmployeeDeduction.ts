export default class EmployeeDeduction {
    employeeId: number;
    employeeDeductionId: number;
    fixedDedAmount: number;
    deductionPercent: number;
    planName: string;
    customizedName: string;
    deductionTypeId: number;
    isWHQEditable: boolean;
    deductionFsNo: string;

    public constructor(init?: Partial<EmployeeDeduction>) {
        Object.assign(this, init);
    }
}