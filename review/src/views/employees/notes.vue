<script setup lang="ts">
import NoteList from "@/components/viewComponents/employees/noteList.vue";
import employeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';
import { storeToRefs } from "pinia";
import { ComputedRef, computed, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useEmployeeStore } from "@/stores/employeeStore";

interface Props {
  readOnly: boolean;
}
const employeeDetails = ref(null);
const { fetchEmployeeDetails } = useEmployeeStore();
const { getEmployeeDetails } = storeToRefs(useEmployeeStore());

const props = withDefaults(defineProps<Props>(), {
  readOnly: false
});

const route = useRoute();

const employeeId: ComputedRef<string> = computed(() => route.params?.id?.toString());
onMounted(() => {
  fetchEmployeeDetails(employeeId.value).then(() => {
    employeeDetails.value = getEmployeeDetails.value;
  });
});
</script>
<template>
  <div class="hq-pg list">
    <employeeHeader :employeeId="employeeId" class="position-relative">
        </employeeHeader>
    <div class="list__table">
      <note-list :readOnly="readOnly" :showCreate="true"></note-list>
    </div>
  </div>
</template>
