export class CostCode{
  id: number;
  costCodeName: string;
  costCodeFsNo: string;
  isActive: boolean;
  isDeleted: boolean;

  public constructor(init?: Partial<CostCode>) {
    Object.assign(this, init);
  }
}