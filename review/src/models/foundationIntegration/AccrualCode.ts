export class AccrualCode{
    id: number;
    fsAccrualCode: string;
    phqClientId: number;
    accrualCodeName: string;
    accrualCodeShortName: string;
    accrualMethod: string;
    isActive: boolean;
    updateEmployeeId: number

    public constructor(init?: Partial<AccrualCode>) {
      Object.assign(this, init);
    }
}