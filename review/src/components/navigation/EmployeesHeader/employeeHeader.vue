<script setup lang="ts">
import { Ref, ref, onMounted } from 'vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faUser } from '@fortawesome/pro-light-svg-icons';
import { faCaretUp, faCaretDown } from '@fortawesome/pro-solid-svg-icons';
import { useEmployeeStore } from "@/stores/employeeStore";
import { storeToRefs } from "pinia";
import { employeeStatusBadgeRenderer } from '@/components/shared/bryntumGrid/customCells/employeeStatusBadge';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import { getFirstCharacter } from '@/utilities/formatUtils';

const { fetchEmployeeDetails } = useEmployeeStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());

library.add(faUser, faCaretDown, faCaretUp);

interface Props {
    employeeId?: number | string,
}

const props = withDefaults(defineProps<Props>(), {
    employeeId: null,
});

class EmployeeSwitcherPerson {
    public id: number;
    public fullName: string;
    public jobTitle: string;
    public employeeStatusId: number;
}

const headerEmployee: Ref<EmployeeSwitcherPerson> = ref(new EmployeeSwitcherPerson());
const initials: Ref<string> = ref('');
const employeeStatusContent: Ref<string> = ref('');

onMounted(async () => {
    await setHeaderValues(props.employeeId);
});

async function setHeaderValues(employeeId: string | number): Promise<void> {
    try {
        await fetchEmployeeDetails(employeeId).then(() => {
            headerEmployee.value = {
                id: employeeDetails.value.id,
                fullName: employeeDetails.value.fullName,
                jobTitle: employeeDetails.value.jobTitle,
                employeeStatusId: employeeDetails.value.employeeStatusId,
                
            }
        });
    } catch (e) {
        headerEmployee.value = null;
    }
    if (headerEmployee.value) {
        employeeStatusContent.value = EmployeeStatusEnum[headerEmployee.value.employeeStatusId]
    }
}
</script>

<template>
    <fs-container fluid class="hq-pg__header contain">
        <fs-row align-v="center">
            <fs-col cols="auto" class="pe-0">
                <div class="initial-avatar rounded-circle bg-grey--000 d-flex align-items-center justify-content-center">
                    <h2 v-if="headerEmployee" class="m-0 text-grey--500">{{ getFirstCharacter(employeeDetails?.firstName) }}{{ getFirstCharacter(employeeDetails?.lastName) }}</h2>
                </div>
            </fs-col>
            <fs-col>
                <div v-if="headerEmployee" class="mr-3 switcher__title text-dark">{{ headerEmployee.fullName }}</div>
                <div v-html="employeeStatusBadgeRenderer(employeeStatusContent)"/>
            </fs-col>
        </fs-row>
    </fs-container>
</template>

<style lang="scss" scoped>
.employmentStatus {
    margin: auto;
    margin-left: 0;
    font-size: 12px;
    text-transform: uppercase;
    color: #2dbc9a;
    font-weight: 600;
    border-radius: 30px;
    padding: 5px 10px;
    background-color: rgba(45, 188, 154, 0.15);
}

.initial-avatar {
    /* Rounded border */
    height: 3rem;
    width: 3rem;
}
</style>