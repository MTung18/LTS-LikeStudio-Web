export class EarnCode {
    id: number;
    earnCodeFsNo: string;
    earnCodeName: string;
    isActive: boolean;

    public constructor(init?: Partial<EarnCode>) {
        Object.assign(this, init);
    }
}