export class MinorityCode {
    id: number;
    minorityCodeName: string;
    minorityCodeFsNo: string;
    isActive: boolean;
    isDeleted: boolean;

    public constructor(init?: Partial<MinorityCode>) {
      Object.assign(this, init);
    }
}