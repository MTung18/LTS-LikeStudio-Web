export default class NamePrefix {
    public id: number;
    public name: string;

    public constructor(init?: Partial<NamePrefix>) {
        Object.assign(this, init);
    }
}