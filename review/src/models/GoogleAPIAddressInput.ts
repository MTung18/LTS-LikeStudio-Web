export class GoogleAPIAddressInput {
    public address1: string;
    public address2: string;
    public city: string;
    public state_Province: string;
    public zip_PostalCode: string;
    public country: string;

    public constructor(init?: Partial<GoogleAPIAddressInput>) {
        Object.assign(this, init);
    }
}
