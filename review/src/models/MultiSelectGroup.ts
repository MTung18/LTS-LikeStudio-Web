export class MultiselectGroup {
    public groupName: string;
    public options: any[];

    constructor(init?: Partial<MultiselectGroup>) {
        Object.assign(this, init);
    }
}
