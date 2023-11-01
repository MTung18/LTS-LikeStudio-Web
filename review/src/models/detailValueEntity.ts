export class DetailValueEntity {
    public title: string;
    public value: any;
    public constructor(init?: Partial<DetailValueEntity>) {
        Object.assign(this, init);
    }
}