<script setup lang="ts">
import employeeList from "@/components/viewComponents/employees/employeeList.vue";
import { Ref, ref, watch } from "vue";
import Employee from "@/models/employees/Employee";
import { useRouter } from "vue-router";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
const router = useRouter();
const employeeTable = ref(null);

const selectedEmployee: Ref<Employee> = ref(null);

const isOnboarding = (employeeStatusId: number) : boolean => {
  const isOnboarding = employeeStatusId === EmployeeStatusEnum.Onboard || employeeStatusId === EmployeeStatusEnum.QuickHire
    || employeeStatusId === EmployeeStatusEnum.PendingOnboard || employeeStatusId === EmployeeStatusEnum.PendingQuickhire; 
  return isOnboarding;
}

watch(selectedEmployee, () => {
  if(isOnboarding(selectedEmployee.value.employeeStatusId)) {
    router.push({
      name: "onboardingDetail",
      params: {
        id: selectedEmployee.value.id,
      }
    });
  }
  else {
    router.push({
      name: "employeeInformation",
      params: {
        id: selectedEmployee.value.id,
      },
    });
  }
});

const onSaveSettingsClick = () => {};

const onClearSettingsClick = () => {};

const onRefresh = () => {};
</script>

<template>
  <div class="hq-pg list">
    <div class="list__table">
      <employee-list ref="employeeTable" v-model="selectedEmployee" />
    </div>
  </div>
</template>
