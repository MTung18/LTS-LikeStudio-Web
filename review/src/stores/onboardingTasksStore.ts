import { acceptHMRUpdate, defineStore } from "pinia";
import OnboardingTask from "@/models/onboarding/OnboardingTask";
import { Ref, ref } from "vue";
import { onboardingTasksApi } from "@/axios/instances/onboardingTasksApi";

export const useOnboardingTasksStore = defineStore("onboardingTasks", () => {
  const listOfTasks: Ref<OnboardingTask[]> = ref(new Array<OnboardingTask>());
  const task: Ref<OnboardingTask> = ref(new OnboardingTask());
  const switchPage = ref(0);

  async function seedTasks(employeeId: number) {
    return await onboardingTasksApi.seedTasks(employeeId);
  }

  async function getDataForOnePage(employeeId?: number) {
    let response = await onboardingTasksApi.getListOfTasks(employeeId);
    if (response.list.length == 0 || response.list == undefined) {
      response = await onboardingTasksApi.getListOfTasks(employeeId);
    }
    listOfTasks.value = response.list;
  }

  async function updateTask(employeeId: number, employeeTaskId: number, isComplete: boolean): Promise<boolean> {
    return await onboardingTasksApi.updateTask(employeeId, employeeTaskId, isComplete);
  }

  async function removeTask(id: number, employeeId: number) {
    return await onboardingTasksApi.removeTask(id, employeeId);
  }

  return {
    listOfTasks,
    task,
    switchPage,
    seedTasks,
    getDataForOnePage,
    updateTask,
    removeTask
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useOnboardingTasksStore, import.meta.hot)
  );
}
