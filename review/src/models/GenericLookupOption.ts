export class GenericLookupOption {
    public id: number;
    private basicName?: string;
    public active: boolean = true;
    public get name(): string {
        return this.basicName;
    }
    public set name(name: string) {
        this.basicName = name;
    }

    public constructor(init?: Partial<GenericLookupOption>) {
        Object.assign(this, init);
    }
}
