export class EmployeePayrollAndTax {
    employeePayrollAndTaxId: number;
    pHQClientId: number;
    employeeId: number;
    isActive: boolean;
    isDeleted: boolean;
    isDirectDeposit: boolean;
    isDirectDepositEnabled: boolean;
    lastSyncTimeUTC: string;
    updateEmployeeId: number;
    payPeriodId: number | null;
    isFutaSutaExempt: boolean | null;
    payTypeId: number | null;
    payRate: number | null;
    payPeriodsPerYear: number | null;
    isCertifiedPayroll: boolean | null;
    earnCodeId: number | null;
    payrollLocalTaxGroupId: number | null;
    isResidenceTax: boolean | null;
    isHoursRequiredForSalary: boolean | null;

    public constructor(init?: Partial<EmployeePayrollAndTax>) {
        Object.assign(this, init);
    }
}