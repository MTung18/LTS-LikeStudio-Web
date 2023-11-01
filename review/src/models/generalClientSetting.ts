export class GeneralClientSetting {
    hRContactEmail: string;
    hRContactPhoneNumber: string;
    isPaperCheck: boolean;
    isDirectDeposit: boolean;
    isReminderForDirectDepositNotification: boolean;
    public constructor(init?: Partial<GeneralClientSetting>) {
        Object.assign(this, init);
    }
}