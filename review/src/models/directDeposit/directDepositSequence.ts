export default class DirectDepositSequenceInput {
    directDepositId: number;
    pendingDirectDepositId: number;
    sequenceNumber: number;

    public constructor(init?: Partial<DirectDepositSequenceInput>) {
        Object.assign(this, init);
    }
}
