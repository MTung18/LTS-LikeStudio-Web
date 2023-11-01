export default class OnboardingTask {
  public employeeId: number;
  public employeeTaskId: number;
  public employeeTaskName: string;
  public isComplete: boolean;
  public isDelete: boolean;
  public phqClientId: number;
  public updateEmployeeId: number;

  public id: number;
  public subject: string;
  public status: number;
  public constructor(init?: Partial<OnboardingTask>) {
    Object.assign(this, init);
  }
}

