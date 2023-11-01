export default class EmailAddress {
    id: number;
    emailAddressTypeId: number;
    email: string;

    public constructor(init?: Partial<EmailAddress>) {
        Object.assign(this, init);
    }
}