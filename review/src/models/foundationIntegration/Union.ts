export class Union{
  id: number;
  unionName: string;
  unionFsNo: string;
  isActive: boolean;
  isDeleted: boolean;

  public constructor(init?: Partial<Union>) {
    Object.assign(this, init);
  }
}