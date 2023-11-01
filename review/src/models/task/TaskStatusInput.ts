export default class TaskStatusInput {
  public taskStatusId: number;

  public constructor(init?: Partial<TaskStatusInput>) {
    Object.assign(this, init);
  }
}
