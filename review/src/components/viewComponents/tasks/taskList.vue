<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref, Ref, watch } from "vue";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Grid, GridConfig, Store } from "@bryntum/grid";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import Task from "@/models/task/Task";
import { useTaskStore } from "@/stores/taskStore";
import { storeToRefs } from "pinia";
import { TaskStatus } from "@/enums/TaskStatus";
interface Props {
  taskStatusFilter?: TaskStatus | Array<TaskStatus>;
}

const props = withDefaults(defineProps<Props>(), {
  taskStatusFilter: null,
});

const enum EmitNames {
  UPDATE = "updateTask",
}

const emits = defineEmits<{
  (e: EmitNames.UPDATE, value: Task): void;
}>();

const defaultSorter = {
  field: "name",
  ascending: true,
};
const grid: Ref<Grid> = ref(null);
const gridConfig: ComputedRef<Partial<GridConfig>> = computed(() => {
  return {
    ...fsBryntumGridConfig.gridConfig,
    minHeight: "100%",
    emptyText: "", // TODO: empty text is displaying with data
    columns: [
      {
        flex: 2,
        text: "Title",
        id: "title",
        field: "title",
        groupable: false,
        sortable: true,
        htmlEncode: false,
        renderer: ({ record }) =>
          `<span class="${
            record.data.taskStatusId === TaskStatus.Complete
              ? "action-item__table--completed"
              : ""
          }">${record.data.title}</span>`,
      },
      {
        flex: 2,
        text: "Complete",
        id: "taskStatusId",
        groupable: false,
        htmlEncode: false,
        vue: true,
        align: "center",
        renderer: ({ record }) => {
          return {
            is: "fs-form-checkbox",
            modelValue: record.data.taskStatusId === TaskStatus.Complete,
            onmousedown: (event, taskId = record.data.id) => {
              event.stopPropagation();
              onCompleteCheckboxClick(event, taskId);
            },
          };
        },
      },
    ],
  };
});

const gridStore: ComputedRef<Store> = computed(() => {
  const store = new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
    data: filteredTaskList.value,
  });
  store.data = filteredTaskList.value;
  return store;
});

const filteredTaskList: ComputedRef<Array<Task>> = computed(() => {
  if (props.taskStatusFilter !== null) {
    return taskList.value.filter((task: Task) => {
      if (Array.isArray(props.taskStatusFilter)) {
        return props.taskStatusFilter.indexOf(task.taskStatusId) >= 0;
      } else {
        return task.taskStatusId === props.taskStatusFilter;
      }
    });
  }
  return taskList.value;
});

const { fetchTaskList, updateTaskStatus } = useTaskStore();
const { taskList } = storeToRefs(useTaskStore());

async function onCompleteCheckboxClick(
  event: any,
  taskId: number
): Promise<void> {
  setTimeout(async () => {
    event.target.disabled = true;
    const taskIndex = filteredTaskList.value.findIndex(
      (task) => task.id === taskId
    );
    const newTaskStatusId =
      filteredTaskList.value[taskIndex].taskStatusId === TaskStatus.Complete
        ? TaskStatus.InProgress
        : TaskStatus.Complete;
    await updateTaskStatus(taskId, newTaskStatusId);
    event.target.disabled = false;
  }, 100);
}

onMounted(async () => {
  await fetchTaskList();
});
</script>
<template>
  <div class="action-grid list__table list__table--onpage list__b-grid--hover">
    <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" />
  </div>
</template>
