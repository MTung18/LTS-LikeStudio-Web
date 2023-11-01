export default class MaritalStatus {
    public maritalStatusId: number;
    public maritalStatusName: string;

    public constructor(init?: Partial<MaritalStatus>) {
        Object.assign(this, init);
    }
}