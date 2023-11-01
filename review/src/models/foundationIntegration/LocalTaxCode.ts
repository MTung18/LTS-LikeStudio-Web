import PayrollStateTaxCode from './PayrollStateTaxCode';

export class LocalTaxCode {
    id: number;
    payrollLocalTaxCodeFsNo: string;
    payrollLocalTaxCodeName: string;
    isActive: boolean;
    payrollStateTaxCodeId: number;
    isDeleted: boolean;
    displayName: string;
    payrollStateTaxCode: PayrollStateTaxCode;

    public constructor(init?: Partial<LocalTaxCode>) {
        Object.assign(this, init);
    }
}