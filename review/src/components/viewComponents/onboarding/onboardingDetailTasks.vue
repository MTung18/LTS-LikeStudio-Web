<script setup lang="ts">
import { ref, onBeforeMount } from "vue";
import { useOnboardingTasksStore } from "@/stores/onboardingTasksStore";
import { faCircleMinus, faClipboardListCheck, faCircleCheck, faTriangleExclamation } from "@fortawesome/pro-light-svg-icons";
import { faCircle } from "@fortawesome/pro-regular-svg-icons";
import { faCircleExclamation } from "@fortawesome/pro-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { TaskStatus } from "@/enums/TaskStatus";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router"
import darkThemeModal from "@/components/shared/darkThemeModal.vue";

library.add(faCircleMinus, faCircleCheck, faCircle, faCircleCheck, faCircleExclamation, faClipboardListCheck, faTriangleExclamation);
const store = useOnboardingTasksStore();
const onActiveNew = ref(true);
const onActiveCompleted = ref(false);
const isTableLoading = ref(false);
const selectedRemoveTaskName = ref('');
const selectedRemoveTaskId = ref(null);
const isShowModal = ref(false);

const route = useRoute();
const employeeId = Number(route.params.id)

const fields = [
  {
    key: "employeeTaskName",
    label: "employeeTaskName",
    thStyle: { width: "90%" },
    tdClass: "align-middle py-0 px-4"
  },
  {
    key: "actions",
    label: "Actions",
    thStyle: { width: "10%" },
  },
];

const items = ref([]);
const { listOfTasks } = storeToRefs(store);

const updateStatus = ref(false);
const changeHandler = async (
  employeeTaskId: number,
  isComplete: boolean,
) => {
  isTableLoading.value = true;
  try {
    updateStatus.value = await store.updateTask(employeeId, employeeTaskId, isComplete);
    await store.getDataForOnePage(employeeId);
    if (updateStatus.value) {
      const status = onActiveNew.value ? TaskStatus.New : TaskStatus.Complete;
      await filterTable(status);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isTableLoading.value = false;
  }

};

const removeItem = async (id: number, subject: string) => {
  if (!id || !subject) return;
  isShowModal.value = true;
  selectedRemoveTaskName.value = subject;
  selectedRemoveTaskId.value = id;
};

const filterTable = async (value: number) => {
  isTableLoading.value = true;
  if (value == TaskStatus.New) {
    onActiveCompleted.value = false;
    onActiveNew.value = true;
    items.value = listOfTasks.value.filter((e: any) => !e.isComplete);
    isTableLoading.value = false;
  }

  if (value == TaskStatus.Complete) {
    onActiveCompleted.value = true;
    onActiveNew.value = false;
    items.value = listOfTasks.value.filter((e: any) => e.isComplete);
    isTableLoading.value = false;
  }
};
const onLoad = async () => {
  isTableLoading.value = true;
  try {
    await store.getDataForOnePage(employeeId);
  } finally {
    items.value = listOfTasks.value.filter((e: any) => e.isComplete == false);
    isTableLoading.value = false;
  }
};

const handleRemoveTask = async (id: number) => {
  if (!id) return;
  isTableLoading.value = true;
  try {
    const response = await store.removeTask(id, employeeId);
    if (response) {
      await store.getDataForOnePage(employeeId);
      const status = onActiveNew.value
        ? TaskStatus.New
        : TaskStatus.Complete;
      await filterTable(status);
    }
  } catch (error) {
    console.error(error);
  } finally {
    isShowModal.value = false;
    isTableLoading.value = false;
  }
}

onBeforeMount(async () => {
  await onLoad();
});
</script>
<template>
  <fs-card id="onboardingTaskList" class="dashboard-card p-0" no-body>
    <fs-card-header class="dashboard-card__header">
      <div class="d-flex align-items-center gap-2 fw-bold">
        <font-awesome-icon :icon="faClipboardListCheck" style="color: #FF5094 !important" size="lg" />
        <h2 class="hq-pg__title">Checklist</h2>
      </div>
      <div class="filter-tabs pb-0 ms-auto">
        <fs-button-group>
          <fs-button variant="link" @click="filterTable(TaskStatus.New)" :class="onActiveNew ? 'active' : ''">
            New
          </fs-button>
          <fs-button variant="link" @click="filterTable(TaskStatus.Complete)" :class="onActiveCompleted ? 'active' : ''">
            Completed
          </fs-button>          
        </fs-button-group>

      </div>
    </fs-card-header>
    <fs-card-body class="p-0 fs-7 overflow-auto" style="height: 300px;">
      <fs-list-group flush>
        <fs-list-group-item v-for="item in items" href="#" class="py-0">
          <div class="d-flex align-items-center">
            {{ item.employeeTaskName }}
            <div class="ms-auto d-flex">
              <fs-button 
                v-if="item.isComplete" 
                variant="link" 
                class="d-flex flex-column align-items-center text-decoration-none"
                @click="changeHandler(item.employeeTaskId, !item.isComplete)">
                <font-awesome-icon :icon="['fas', 'circle-check']" size="lg" /> Mark Incomplete
              </fs-button>
              <fs-button 
                v-if="!item.isComplete" 
                variant="link" 
                class="d-flex flex-column align-items-center text-decoration-none"
                @click="changeHandler(item.employeeTaskId, !item.isComplete)">
                <font-awesome-icon :icon="['fal', 'circle-check']" size="lg" /> Complete
              </fs-button>
              <fs-button 
                variant="link" 
                class="text-danger d-flex flex-column align-items-center text-decoration-none"
                @click="removeItem(item.employeeTaskId, item.employeeTaskName)">
                <font-awesome-icon :icon="['fal', 'circle-minus']" size="lg" /> Remove
              </fs-button>
            </div>
          </div>
        </fs-list-group-item>
      </fs-list-group>
    </fs-card-body>
  </fs-card>

  <dark-theme-modal :show-modal="isShowModal" title="Remove Task" ok-text="YES, REMOVE" cancel-text="NO, GO BACK"
    ok-text-variant="danger" @close="isShowModal = false" @ok="handleRemoveTask(selectedRemoveTaskId)"
    cancel-btn-variant="light">
    <template #content>
      <span class="py-3">
        <div class="mb-3 d-block">
          Are you sure you want to remove the following task?
        </div>
        <strong>
          <p class="pb-3">"Send an informative welcome email."
          </p>
          <p>
            <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fal', 'fa-triangle-exclamation']" size="lg" />
            This action cannot be undone
          </p>
        </strong>
      </span>
    </template>
  </dark-theme-modal>
</template>