export class Trade{
  id: number;
  tradeName: string;
  tradeFsNo: string;
  isActive: boolean;
  isDeleted: boolean;

  public constructor(init?: Partial<Trade>) {
    Object.assign(this, init);
  }
}