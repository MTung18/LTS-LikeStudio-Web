export enum IntegrationFunction {
    Employee = 1,
    EarnCode = 2,
    AccrualCode = 3,
    AccrualPlan = 4,
    MiscDeduction = 5,
    Department = 6,
    Minority = 7,
    Shift = 8,
    Trade = 9,
    LocalTaxAuthority = 10,
    Union = 11,
    TaxState = 12,
    Crew = 13,
    CostCode = 14,
    WorkersCompState = 15,
    WorkersCompClass = 16,
    GeneralLiabilityState = 17,
    GeneralLiabilityClass = 18,
    PayPeriod = 19,
    MiscDeductionCycle = 20,
    TaxGroup = 21
}

export class IntegrationFunctionMap {
    public static displayName(integrationFunction : IntegrationFunction): string {
        const displayNameMap: { [key: string]: string } = {
            [IntegrationFunction.Employee]: 'Employee',
            [IntegrationFunction.EarnCode]: 'Earn Code',
            [IntegrationFunction.AccrualCode]: 'Accrual Code',
            [IntegrationFunction.AccrualPlan]: 'Accrual Plan',
            [IntegrationFunction.MiscDeduction]: 'Misc. Deduction',
            [IntegrationFunction.Department]: 'Department',
            [IntegrationFunction.Minority]: 'Minority',
            [IntegrationFunction.Shift]: 'Shift',
            [IntegrationFunction.Trade]: 'Trade',
            [IntegrationFunction.LocalTaxAuthority]: 'Tax Local',
            [IntegrationFunction.Union]: 'Union',
            [IntegrationFunction.TaxState]: 'Tax State',
            [IntegrationFunction.Crew]: 'Crew',
            [IntegrationFunction.CostCode]: 'Cost Code',
            [IntegrationFunction.WorkersCompState]: 'Workers Comp. State',
            [IntegrationFunction.WorkersCompClass]: 'Workers Comp. Class',
            [IntegrationFunction.GeneralLiabilityState]: 'General Liability State',
            [IntegrationFunction.GeneralLiabilityClass]: 'General Liability Class',
            [IntegrationFunction.PayPeriod]: 'Pay Period',
            [IntegrationFunction.MiscDeductionCycle]: 'Misc. Deduction Cycle',
            [IntegrationFunction.TaxGroup]: 'Tax Group'
        };
        return displayNameMap[integrationFunction];
    }
}

