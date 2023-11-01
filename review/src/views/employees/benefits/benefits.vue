<script setup lang="ts">
import { Ref, computed, onMounted, ref, watch, inject } from "vue";
import employeeHeader from '@/components/navigation/EmployeesHeader/employeeHeader.vue';
import employeeDeductionsTab from '@/views/employees/benefits/employeeDeductionsTab.vue';
import { useRoute } from "vue-router";
import { useEmployeeStore } from '@/stores/employeeStore';
import { storeToRefs } from "pinia";
import EmployeeDeduction from "@/models/employees/EmployeeDeduction";
import { DeductionType, DeductionTypeName } from "@/enums/DeductionType";
import loadingWave from '@/assets/images/Loading_Wave.svg';

const permissions = inject('$providePermissions');

const { fetchEmployeeDeductionsList } = useEmployeeStore();
const { employeeDeductions } = storeToRefs(useEmployeeStore());

const benefits: Ref<EmployeeDeduction[]> = ref(new Array<EmployeeDeduction>());
const deductions: Ref<EmployeeDeduction[]> = ref(new Array<EmployeeDeduction>());
const isLoading = ref(false);
const showSplashScreen: Ref<boolean> = ref(false);

const route = useRoute();

const employeeId = computed<number>(() => +route.params?.id);

const isReload: Ref<boolean> = ref(false);
const emitReload = (reload: boolean) => {
  isReload.value = reload;
}
watch(() => isReload.value, async () => {
  await handleGetEmployeeDeductionsList();
})

const handleGetEmployeeDeductionsList = async () => {
  await fetchEmployeeDeductionsList(employeeId.value);
  if (!employeeDeductions.value || employeeDeductions.value.length === 0) {
    showSplashScreen.value = true;
  } else {
    benefits.value = employeeDeductions.value.filter(x => x.deductionTypeId == DeductionType.BENEFIT);
    deductions.value = employeeDeductions.value.filter(x => x.deductionTypeId == DeductionType.DEDUCTION);
  }
  isReload.value = false;
}

onMounted(async () => {
  isLoading.value = true;
  await handleGetEmployeeDeductionsList();
  isLoading.value = false;
});

</script>
<template>
  <fs-overlay :show="isLoading" class="fsi-pg__overlay" no-wrap>
    <template #overlay>
      <div class="text-center">
        <img :src="loadingWave" />
      </div>
    </template>
  </fs-overlay>
  <div class="hq-pg">
    <employeeHeader :employeeId="employeeId" class="position-relative">
    </employeeHeader>
    <fs-tabs pills active-nav-item-class="bg-index-color-0 hq-pg__tab--active"
      nav-wrapper-class="hq-pg__header hq-pg__header--sticky justify-content-center contain"
      content-class="flex-fill mb-4">

      <fs-tab title="Benefits" active title-item-class="mx-1" title-link-class="hq-pg__tab" v-if="permissions['WHQ_253_3152']" >
        <employeeDeductionsTab @reload="emitReload" :deductions="benefits" :title="DeductionTypeName.BENEFIT"
          :showSplashScreen="showSplashScreen">
        </employeeDeductionsTab>
      </fs-tab>

      <fs-tab title="Deductions" title-item-class="mx-1" title-link-class="hq-pg__tab" v-if="permissions['WHQ_253_3153']" >
        <employeeDeductionsTab :deductions="deductions" :title="DeductionTypeName.DEDUCTION"
          :showSplashScreen="showSplashScreen">
        </employeeDeductionsTab>
      </fs-tab>

    </fs-tabs>
  </div>
</template>
