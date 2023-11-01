export class WorkersCompClass {
  id: number;
  workersCompClassFsNo: string;
  workersCompClassName: string;
  isActive: boolean;
  isDeleted: boolean;

  public constructor(init?: Partial<WorkersCompClass>) {
    Object.assign(this, init);
  }
}