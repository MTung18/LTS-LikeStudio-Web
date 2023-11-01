<script setup lang="ts">
import { ref, Ref } from "vue";
import taskList from "@/components/viewComponents/tasks/taskList.vue";
import { TaskStatus } from "@/enums/TaskStatus";
const enum Tab {
  NEW = "new",
  COMPLETED = "completed",
}
const activeTab: Ref<Tab> = ref(Tab.NEW);

function setActiveTab(tab: Tab) {
  activeTab.value = tab;
}
</script>
<template>
  <fs-card class="dashboard-card" no-body>
    <fs-card-header class="dashboard-card__header">
        <h2 class="hq-pg__title text-cyan">Tasks</h2>
      <div class="ms-auto filter-tabs">
        <fs-button-group>
          <fs-button
            variant="link"
            @click="setActiveTab(Tab.NEW)"
            :class="{ active: activeTab === Tab.NEW }"
            >New
          </fs-button>
          <fs-button
            variant="link"
            @click="setActiveTab(Tab.COMPLETED)"
            :class="{ active: activeTab === Tab.COMPLETED }"
            >Completed
          </fs-button>
        </fs-button-group>
      </div>
    </fs-card-header>
    <fs-card-body class="dashboard-card__content ">
      <task-list
        :task-status-filter="
          activeTab === Tab.COMPLETED
            ? TaskStatus.Complete
            : [TaskStatus.New, TaskStatus.InProgress]
        "
      />
    </fs-card-body>
  </fs-card>
</template>
