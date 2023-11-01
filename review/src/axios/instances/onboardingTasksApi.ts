import AxiosBase from "./axiosBase";
import AccessTokenRequestInterceptor from "../interceptors/accessToken-request-interceptor";
import AccessTokenResponseInterceptor from "../interceptors/accessToken-response-interceptor";
import OnboardingTasks from "@/models/onboarding/OnboardingTask";
import { getLocalAppsettings } from "@/helper/hqSuite/appSettingsHelper";

export default class OnboardingTasksApi extends AxiosBase {
  constructor(interceptors: Array<any>) {
    const baseUrl = getLocalAppsettings().ClientSide.WorkforceManagement + '/v1';
    super(interceptors, baseUrl);
  }

  public async seedTasks(
    employeeId: number
  ): Promise<boolean> {
      const response = await this.axiosInstance.post<boolean>(`/employee/tasks/seeddata?employeeId=${employeeId}`);
      if (response && response.data && response.status === 200) {
        return response.data
      } else {
        throw new Error('Unable to seed tasks for onboarding');
      }
  }

  public async getListOfTasks(
    employeeId?: number
  ): Promise<{ list: OnboardingTasks[] }> {
    let listOfTasks: OnboardingTasks[];
    try {
      const response = await this.axiosInstance.get<OnboardingTasks[]>(`/employee/${employeeId}/tasks`);

      if (response && response.data && response.status === 200) {
        listOfTasks = response.data;
      } else {
        throw new Error("Failed to parse Tasks list");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to retrieve the Tasks list.",
        error
      );
    }
    return new Promise((resolve) => {
      resolve({
        list: listOfTasks,
      });
    });
  }

  public async updateTask(
    employeeId: number,
    taskId: number,
    isComplete: boolean
  ): Promise<boolean> {
    try {
      const response = await this.axiosInstance.put<OnboardingTasks>(
        `/employee/${employeeId}/tasks/${taskId}/complete?isComplete=${isComplete}`
      );
      if (response && response.status === 200) {
        return true;
      } else {
        throw new Error("Failed to update task.");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to update the task.",
        error
      );
    }

    return false;
  }

  public async removeTask(taskId: number, employeeId: number): Promise<boolean> {
    try {
      const response = await this.axiosInstance.delete<OnboardingTasks>(
        `/employee/${employeeId}/tasks/${taskId}`,
      );
      if (response && response.status === 200) {
        return true;
      } else {
        throw new Error("Failed to delete task.");
      }
    } catch (error) {
      console.error(
        "An unexpected error occurred attempting to delete the task.",
        error
      );
    }

    return false;
  }
}

export const onboardingTasksApi = new OnboardingTasksApi([
  AccessTokenRequestInterceptor,
  AccessTokenResponseInterceptor,
]);
