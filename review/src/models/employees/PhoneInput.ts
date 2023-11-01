export default class PhoneInput {
    id: number;
    phoneTypeId: number;
    phoneNumber: string;
    phoneExtension: string;

    public constructor(init?: Partial<PhoneInput>) {
        Object.assign(this, init);
    }
}