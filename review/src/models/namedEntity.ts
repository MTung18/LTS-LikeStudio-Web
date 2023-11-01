export class NamedEntity {
    public id: number;
    public name: string;
    // Extended Property for disabling entry in fsMultiselectList
    public $isDisabled: boolean = false;

    public constructor(init?: Partial<NamedEntity>) {
        Object.assign(this, init);
    }
}