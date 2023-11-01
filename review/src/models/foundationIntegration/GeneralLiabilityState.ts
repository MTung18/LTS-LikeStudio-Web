export class GeneralLiabilityState{
  id: number;
  generalLiabilityStateName: string;
  generalLiabilityStateFsNo: string;
  isActive: boolean;
  isDeleted: boolean;

  public constructor(init?: Partial<GeneralLiabilityState>) {
    Object.assign(this, init);
  }
}