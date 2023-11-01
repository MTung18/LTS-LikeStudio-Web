<template>
  <div class="dashboard hq-pg">
    <fs-container fluid class="contain hq-pg__container dashboard__container">
      <fs-row class="dashboard__row">
        <fs-col cols="12">
          <fs-row class="dashboard__row">
            <fs-col>
              <fs-card class="dashboard-card--no-min-height" no-body>
                <fs-card-header class="dashboard-card__header">
                  <h2 class="hq-pg__title">Employees</h2>
                </fs-card-header>

                <fs-card-body class="dashboard-card__content log-card__content">
                  <icons-toolbar-widget :status-items="employeeIconsToolbarItems" />
                </fs-card-body>
              </fs-card>
            </fs-col>
          </fs-row>

          <fs-row class="dashboard__row">
            <fs-col lg="6" class="mt-4">
              <onboarding-progess-widget />
            </fs-col>

            <fs-col lg="6" class="mt-4">
              <turnover-rate-widget v-if="doneLoading" :employeeStatuses="employeeStatusList" />
              <empty-grid-layout v-else :emptyMessage="MESSAGE.COMMON.NO_DATA" />
            </fs-col>
          </fs-row>

          <!-- TODO: TASK_WIDGET -->
          <!-- <fs-row class="dashboard__row mt-4">
            <fs-col>
              <homeTaskWidget />
            </fs-col>
          </fs-row> -->
        </fs-col>
      </fs-row>
    </fs-container>
  </div>
</template>

<script setup lang="ts">
import onboardingProgessWidget from "@/components/viewComponents/home/onboardingProgressWidget.vue";
import turnoverRateWidget from "@/components/viewComponents/home/turnoverRateWidget.vue";

import iconsToolbarWidget from "@/components/shared/iconsToolbarWidget.vue";
import emptyGridLayout from '@/components/shared/emptyGridLayout.vue';

import IconsToolbarItem from "@/models/IconsToolbarItem";
import { onMounted, ref } from "vue";
import { useEmployeeStore } from "@/stores/employeeStore";
import { storeToRefs } from "pinia";
import { EmployeeStatusFilter } from "@/enums/EmployeeStatusFilter";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import { MESSAGE } from '@/data/message';
import { useRouter } from 'vue-router';

const { fetchEmployeeList, fetchEmployeeStatusList } = useEmployeeStore();
const { employeeList, employeeStatusList } = storeToRefs(useEmployeeStore());

const activeCount = ref(0);
const employeeCount = ref(0);
const onLeaveCount = ref(0);
const newHireCount = ref(0);
const inactiveCount = ref(0);
const doneLoading = ref(false);

const router = useRouter();

const navigateToEmployeesPage = (event, filterValue) => {
  localStorage.setItem('employeeType', `${filterValue}`);
  router.push({name: 'employees'});
};

const employeeIconsToolbarItems: IconsToolbarItem[] = [
  {
    id: EmployeeStatusFilter.Employee,
    icon: ["fal", "users"],
    selectedBackground: "rgba(3,169,244,1)",
    background: "rgba(3,169,244,.1)",
    selectedColor: "white",
    color: "rgba(3,169,244,1)",
    title: "All",
    label: employeeCount,
    onClickFunction: navigateToEmployeesPage,
  },
  {
    id: EmployeeStatusFilter.Active,
    icon: ["fal", "user"],
    selectedBackground: "rgba(26,188,156,1)",
    background: "rgba(26,188,156,.1)",
    selectedColor: "white",
    color: "rgba(26,188,156,1)",
    title: "Active",
    label: activeCount,
    onClickFunction: navigateToEmployeesPage,
  },
  {
    id: EmployeeStatusFilter.NewHire,
    icon: ["fal", "fa-user-plus"],
    selectedBackground: "rgba(255,80,148,1)",
    background: "rgba(255,80,148,.1)",
    selectedColor: "white",
    color: "rgba(255,80,148,1)",
    title: "New&nbsp;Hire", // Ensure that two words always go together
    label: newHireCount,
    onClickFunction: navigateToEmployeesPage,
  },
  {
    id: EmployeeStatusFilter.OnLeave,
    icon: ["fal", "user-hard-hat"],
    selectedBackground: "rgba(3,155,177,1)",
    background: "rgba(3,155,177,.1)",
    selectedColor: "white",
    color: "rgba(3,155,177,1)",
    title: "On Leave",
    label: onLeaveCount,
    onClickFunction: navigateToEmployeesPage,
  },
  {
    id: EmployeeStatusFilter.Inactive,
    icon: ["fal", "user"],
    selectedBackground: "rgba(110,124,143,1)",
    background: "rgba(110,124,143,.1)",
    selectedColor: "white",
    color: "rgba(110,124,143,1)",
    title: "Inactive",
    label: inactiveCount,
    onClickFunction: navigateToEmployeesPage,
  },

];

function populateStatusCounts(): void {

  employeeCount.value = 0;
  activeCount.value = 0;
  onLeaveCount.value = 0;
  newHireCount.value = 0;
  inactiveCount.value = 0;

  employeeList.value?.forEach(employee => {
    employeeCount.value += 1;

    switch (employee.employeeStatusId) {
      case EmployeeStatusEnum.Active: activeCount.value += 1; break;
      case EmployeeStatusEnum.OnLeave: onLeaveCount.value += 1; break;
      case EmployeeStatusEnum.Onboard: newHireCount.value += 1; break;
      case EmployeeStatusEnum.QuickHire: newHireCount.value += 1; break;
      case EmployeeStatusEnum.Inactive: inactiveCount.value += 1; break;
    }
  });
}

onMounted(async () => {
  await fetchEmployeeList();
  await fetchEmployeeStatusList();
  doneLoading.value = true;
  populateStatusCounts();
});
</script>
