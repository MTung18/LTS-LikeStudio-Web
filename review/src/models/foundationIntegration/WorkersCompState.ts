export class WorkersCompState {
  id: number;
  workersCompStateFsNo: string;
  workersCompStateName: string;
  isActive: boolean;
  isDeleted: boolean;

  public constructor(init?: Partial<WorkersCompState>) {
    Object.assign(this, init);
  }
}