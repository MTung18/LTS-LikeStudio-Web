<script setup lang="ts">
import employeeOnboardingOverviewWidget from "@/components/viewComponents/employees/employeeOnboardingOverviewWidget.vue";
import taskWidget from "@/components/viewComponents/tasks/taskWidget.vue";
import { useEmployeeOnboardingStore } from "@/stores/employeeOnboardingStore";
import { useEmployeeStore } from "@/stores/employeeStore";
import EmployeeOnboarding from "@/models/employees/EmployeeOnboarding";
import { storeToRefs } from "pinia";
import { ComputedRef, computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import employeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';

const { getEmployeeOnboarding } = storeToRefs(useEmployeeOnboardingStore());
const { fetchEmployeeOnboarding } = useEmployeeOnboardingStore();
const { getEmployeeDetails } = storeToRefs(useEmployeeStore());
const { fetchEmployeeDetails } = useEmployeeStore();

const employeeId: ComputedRef<string> = computed(() => useRoute().params?.id?.toString());

fetchEmployeeOnboarding(employeeId.value);
await fetchEmployeeDetails(employeeId.value);


</script>

<template>
  <div class="hq-pg">
    <employeeHeader employeeId="employeeId">
        </employeeHeader>
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain">
      <fs-row align-v="center">
        <fs-col>
          <h2 class="hq-pg__title">Onboarding</h2>
        </fs-col>
        <fs-col cols="auto">
          <fs-button variant="outline-primary" class="btn outline-primary"
            >VIEW ONBOARDING</fs-button
          >
        </fs-col>
        <fs-col cols="auto">
          <fs-button variant="btn-primary" class="btn btn-primary"
            >APPROVE ONBOARDING</fs-button
          >
        </fs-col>
      </fs-row>
    </fs-container>
    <fs-container fluid class="contain hq-pg__container">
      <fs-row class="dashboard__row">
        <fs-col cols="6">
          <fs-container fluid class="contain hq-pg__container">
            <fs-row class="dashboard__row">
              <fs-col>
                <employeeOnboardingOverviewWidget
                  :employeeOnboarding="getEmployeeOnboarding"
                  :employeeDetails="getEmployeeDetails"
                />
              </fs-col>
            </fs-row>
            <fs-row class="dashboard__row mt-3">
              <fs-col>
                <task-widget />
              </fs-col>
            </fs-row>
          </fs-container>
        </fs-col>
      </fs-row>
    </fs-container>
  </div>
</template>
