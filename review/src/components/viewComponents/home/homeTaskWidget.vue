<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { BryntumGrid } from '@bryntum/grid-vue-3';
import { useTaskStore } from '@/stores/taskStore';
import { storeToRefs } from 'pinia';
import { formatUTCToLocalDate } from '@/functions/DateUtilityFunctions';

const taskStore = useTaskStore();
const { taskList } = storeToRefs(taskStore);

const grid = ref(null);
const gridConfig = ref({
    columns: [
        {
            flex: 2,
            text: 'Title',
            id: 'title',
            field: 'title',
            groupable: false,
            sortable: true,
            renderer: ({ row, value }) => {
                row.eachElement(el => el.style.background = row.index % 2 === 0 ? '#ffffff' : '#f9f9f9');
                return value;
            }
        },
        {
            flex: 1,
            text: 'Status',
            id: 'taskStatusName',
            field: 'taskStatusName',
            groupable: false,
            htmlEncode: false,
            renderer: ({ record }: any) => {
                let colorClass = '';
                if (record.taskStatusId == 1) {
                    colorClass = 'status-widget__new';
                } else if (record.taskStatusId == 2) {
                    colorClass = 'status-widget__inprogress';
                } else if (record.taskStatusId == 3) {
                    colorClass = 'status-widget__completed';
                }
                return `<span class="status-widget__small_icon ${colorClass}"></span> ${record.taskStatusName}`
            }
        },
        {
            flex: 1,
            text: 'Due Date',
            id: 'dueDateUTC',
            field: 'dueDateUTC',
            groupable: false,
            renderer: ({ row, value }) => {
                return formatUTCToLocalDate(value);
            }
        },
        {
            flex: 1,
            text: 'Assigned To',
            id: 'assignedToEmployeeName',
            field: 'assignedToEmployeeName',
            groupable: false,
            sortable: true
        },
    ]
});

const data = computed(() => taskList.value);
onMounted(async () => {
    await taskStore.fetchTaskList();
});
</script>

<template>
    <fs-card class="dashboard-card" no-body>
        <fs-card-header class="dashboard-card__header">
            <fs-col>
                <h2 class="hq-pg__title">Tasks</h2>
            </fs-col>
            <fs-button variant="outline-secondary" class="btn btn-outline-green">VIEW ALL</fs-button>
            <fs-button variant="btn-primary" class="btn btn-primary">CREATE TASK</fs-button>
        </fs-card-header>
        <fs-card-body class="dashboard-card__content list__table">
            <div class="list__table b-stripe b-stripe-vertical b-grid-header-no-border">
                <bryntum-grid :readOnly="true" ref="grid" v-bind="gridConfig" :data="data" />
            </div>
        </fs-card-body>
    </fs-card>
</template>