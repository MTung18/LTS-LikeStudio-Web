import Task from "@/models/task/Task";
import { acceptHMRUpdate, defineStore } from "pinia";
import { ref } from "vue";
import type { Ref } from "vue";
import { whqTaskApi } from "@/axios/instances/whqTaskApi";
import { TaskStatus } from "@/enums/TaskStatus";

export const useTaskStore = defineStore("task", () => {
  const taskList: Ref<Task[]> = ref(new Array<Task>());

  async function fetchTaskList(): Promise<void> {
    taskList.value = await whqTaskApi.getTasks();
  }

  async function updateTaskStatus(
    taskId: number,
    newTaskStatusId: TaskStatus
  ): Promise<void> {
    const updatedTask = await whqTaskApi.updateTaskStatus(
      taskId,
      newTaskStatusId
    );
    taskList.value = taskList.value.map((task) =>
      taskId === updatedTask.id ? updatedTask : task
    );
  }

  return {
    taskList,
    fetchTaskList,
    updateTaskStatus,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTaskStore, import.meta.hot));
}
