export class ClientPaymentSetting {
    isPaperCheck: boolean;
    isDirectDeposit: boolean;
    public constructor(init?: Partial<ClientPaymentSetting>) {
        Object.assign(this, init);
    }
}

