export class PayPeriod {
    id: number;
    payPeriodFsNo: string;
    payPeriodName: string;
    isActive: boolean;

    public constructor(init?: Partial<PayPeriod>) {
        Object.assign(this, init);
    }
}