<script setup lang="ts">
import { computed, ComputedRef, onMounted, ref } from 'vue';
import { storeToRefs } from 'pinia';
import { BryntumGrid } from '@bryntum/grid-vue-3';
import { useRoute } from 'vue-router';
import { formatUTCToLocalDate } from '@/functions/DateUtilityFunctions';
import { useEmployeeNotesStore } from '@/stores/EmployeeNotesStore';
import employeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';

const employeeNotesStore = useEmployeeNotesStore();
const { employeeNotes } = storeToRefs(employeeNotesStore);
const route = useRoute();

const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());


const grid = ref(null);
const gridConfig = ref({
    columns: [
        {
            flex: 1,
            text: 'Date',
            id: 'date',
            field: 'date',
            groupable: false,
            renderer: ({ row, value }) => {
                return formatUTCToLocalDate(value);
            }
        },
        {
            flex: 1,
            text: 'Created By',
            id: 'createdBy',
            field: 'createdBy',
            groupable: false,
        },
        {
            flex: 1,
            text: 'Title',
            id: 'title',
            field: 'title',
            groupable: false,
            renderer: ({ row, value }) => {
                row.eachElement(el => el.style.background = '#ffffff');
                return value;
            }
        },
        {
            flex: 2,
            text: 'Notes',
            id: 'note',
            field: 'note',
            groupable: false,
        }
    ]
});

onMounted(async () => {
    await employeeNotesStore.fetchEmployeeNotes(+employeeId.value);
});
</script>

<template>
    <div class="hq-pg">
        <employeeHeader employeeId="employeeId" class="position-relative">
        </employeeHeader>
        <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
            <fs-row align-v="center">
                <fs-col>
                    <h2 class="hq-pg__title">Notes</h2>
                </fs-col>
                <fs-col cols="auto">
                    <fs-button variant="btn-primary" class="btn btn-primary">CREATE NOTE</fs-button>
                </fs-col>
            </fs-row>
        </fs-container>
        <fs-container fluid class="contain">
            <fs-card-body class="dashboard-card__content list__table">
                <div class="list__table b-stripe-vertical b-grid-header-no-border">
                    <bryntum-grid :readOnly="true" ref="grid" v-bind="gridConfig" :data="employeeNotes" />
                </div>
            </fs-card-body>
        </fs-container>
    </div>
</template>