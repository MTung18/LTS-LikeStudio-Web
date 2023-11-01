import { TaskStatus } from "@/enums/TaskStatus";

export default class Task {
  public id: number;
  public title: string;
  public taskStatusId: number;
  public taskStatusName: string;
  public taskTypeId: number | null;
  public taskTypeName: string;
  public dueDateUTC: Date;
  public completedDateUTC: Date;
  public assignedToEmployeeId: number | null;
  public assignedToEmployeeName: string;
  public taskForEmployeeId: number | null;
  public taskForEmployeeName: string;
  public isComplete: boolean;

  public constructor(init?: Partial<Task>) {
    Object.assign(this, init);
  }

  static getMockedData(): Array<Task> {
    return [
      new Task({
        id: 1,
        title: "Goodies",
        taskStatusId: TaskStatus.New,
        taskStatusName: 'New',
        dueDateUTC: new Date('06/05/2022'),
        assignedToEmployeeName: 'Courtney Kopache'
      }),
      new Task({
        id: 2,
        title: "Set Up Desk",
        taskStatusId: TaskStatus.New,
        taskStatusName: 'New',
        dueDateUTC: new Date('06/27/2022'),
        assignedToEmployeeName: 'Bruno Catalano'
      }),
      new Task({
        id: 3,
        title: "Goodies",
        taskStatusId: TaskStatus.InProgress,
        taskStatusName: 'InProgress',
        dueDateUTC: new Date('09/07/2022'),
        assignedToEmployeeName: 'Bruno Catalano'
      }),
      new Task({
        id: 4,
        title: "Schedule Tour",
        taskStatusId: TaskStatus.InProgress,
        taskStatusName: 'InProgress',
        dueDateUTC: new Date('10/09/2022'),
        assignedToEmployeeName: 'Bruno Catalano'
      }),
      new Task({
        id: 5,
        title: "Request New Computer",
        taskStatusId: TaskStatus.Complete,
        taskStatusName: 'Complete',
        dueDateUTC: new Date('06/08/2022'),
        assignedToEmployeeName: 'Jenna Daghstani'
      }),
      new Task({
        id: 3,
        title: "Goodies Kit 2",
        taskStatusId: TaskStatus.InProgress,
        taskStatusName: 'InProgress',
        dueDateUTC: new Date('09/13/2022'),
        assignedToEmployeeName: 'Bruno Catalano'
      }),
      new Task({
        id: 4,
        title: "Schedule Tour",
        taskStatusId: TaskStatus.InProgress,
        taskStatusName: 'InProgress',
        dueDateUTC: new Date('10/09/2022'),
        assignedToEmployeeName: 'Bruno Catalano'
      }),
      new Task({
        id: 5,
        title: "Request New Computer",
        taskStatusId: TaskStatus.New,
        taskStatusName: 'New',
        dueDateUTC: new Date('06/08/2022'),
        assignedToEmployeeName: 'Jenna Daghstani'
      }),
    ];
  }
}
