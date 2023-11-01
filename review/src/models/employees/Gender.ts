export default class Gender {
    public id: number;
    public name: string;

    public constructor(init?: Partial<Gender>) {
        Object.assign(this, init);
    }
}