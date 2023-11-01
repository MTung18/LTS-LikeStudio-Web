export default class PayrollStateTaxCode {
    id: number;
    payrollStateTaxCodeName: string;
    payrollStateTaxCodeFsNo: string;
    isActive: boolean;
    isDeleted: boolean;

    public constructor(init?: Partial<PayrollStateTaxCode>) {
      Object.assign(this, init);
    }
}