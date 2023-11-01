import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import Task from "@/models/task/Task";
import TaskStatusInput from "@/models/task/TaskStatusInput";
import { TaskStatus } from "@/enums/TaskStatus";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";
import { ActionType } from "@/enums/ActionType";

export const baseUrlTaskApi = "task";

export default class WhqTaskApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + "/v1";
    super(interceptors, baseUrl, '/task');
  }

  public async getTasks(): Promise<Task[]> {
    let taskList: Task[] = new Array<Task>();
    try {
      taskList = await this.PerformFetch<Task[]>(`${baseUrlTaskApi}`);
    } catch (error) {
      console.error(this.errormessage(ActionType.Fetch), error);
    }
    return taskList;
  }

  public async updateTaskStatus(
    taskId: number,
    newTaskStatusId: TaskStatus | number
  ): Promise<Task> {
    let updatedTask: Task;
    try {
      await this.PerformPost<Task[]>(`${baseUrlTaskApi}/${taskId}/status`,
        new TaskStatusInput({
          taskStatusId: newTaskStatusId,
        }));
    } catch (error) {
      console.error(this.errormessage(ActionType.Update), error);
    }
    return updatedTask;
  }
}

export const whqTaskApi = new WhqTaskApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
