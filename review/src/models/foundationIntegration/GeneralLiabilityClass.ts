export class GeneralLiabilityClass{
  id: number;
  generalLiabilityClassName: string;
  generalLiabilityClassFsNo: string;
  isActive: boolean;
  isDeleted: boolean;
  generalLiabilityStateId: number;
  displayName: string;

  public constructor(init?: Partial<GeneralLiabilityClass>) {
    Object.assign(this, init);
  }
}