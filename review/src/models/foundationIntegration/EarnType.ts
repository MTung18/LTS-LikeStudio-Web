export class EarnType{
    id: number;
    earnTypeId: string;
    earnTypeName: string;
    earnTypeShortName: string;
    earnTypeFlag: string;
    isActive: boolean;

    public constructor(init?: Partial<EarnType>) {
        Object.assign(this, init);
    }
}