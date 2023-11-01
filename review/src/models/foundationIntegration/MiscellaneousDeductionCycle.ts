export class MiscellaneousDeductionCycle {
    id: number;
    miscellaneousDeductionCycleFsNo: string;
    miscellaneousDeductionCycleName: string;
    isActive: boolean;
    isDeleted: boolean;
  
    public constructor(init?: Partial<MiscellaneousDeductionCycle>) {
      Object.assign(this, init);
    }
  }