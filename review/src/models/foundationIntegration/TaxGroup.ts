export class TaxGroup {
    id: number;
    isDeleted: boolean;
    payrollLocalTaxGroupName: string;
    isActive: boolean;
    payrollLocalTaxGroupFsNo: string;

    public constructor(init?: Partial<TaxGroup>) {
        Object.assign(this, init)
    }
}