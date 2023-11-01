export class FailureItem {
    public failureTitle: string;
    public failureReason: string;
    public constructor(init?: Partial<FailureItem>) {
        Object.assign(this, init);
    }
}