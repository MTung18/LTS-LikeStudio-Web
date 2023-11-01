<script setup lang="ts">
import { useOnboardingStore } from '@/stores/onboardingStore';
import { ApexOptions } from 'apexcharts';
import { storeToRefs } from 'pinia';
import { computed, onMounted, onBeforeMount } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

const { fetchOnboardingProgressStatus } = useOnboardingStore();
const { employeeOnboardingCountStatuses } = storeToRefs(useOnboardingStore());

const chartOptionsData: ApexOptions = {
    chart: {
        type: 'pie'
    },
    colors: ['#6E7C8F', '#FBC117', '#E41767', '#03A9F4'],
    labels: ["Not Started", "In Progress (<7 Days)", "In Progress (≥7 Days)", "Submitted"],
    legend: {
        show: true,
        fontSize: '16px',
        fontFamily: 'Arial',
        fontWeight: 500,
        position: 'left',
        markers: {
            width: 16,
            height: 16,
            strokeColor: '#fee',
            fillColors: ['#6E7C8F', '#FBC117', '#E41767', '#03A9F4'],
            radius: 3,
        }
    },
    dataLabels: {
        enabled: false
    },
  responsive: [
    {
      breakpoint: 640,
      options: {
        legend: {
          fontSize: '12px',
        },
      }
    }
  ]

};
const chartSeries = computed(() => [employeeOnboardingCountStatuses.value.notStarted, employeeOnboardingCountStatuses.value.inProgressLessThan7Days, employeeOnboardingCountStatuses.value.inProgressGreaterOrEqualThan7Days, employeeOnboardingCountStatuses.value.submitted]);

onBeforeMount(async () => {
    await fetchOnboardingProgressStatus();
});
</script>

<template>
  <fs-card class="dashboard-card" no-body>
    <fs-card-header class="dashboard-card__header">
      <h2 class="hq-pg__title">Onboarding Progress</h2>
    </fs-card-header>

    <fs-card-body class="dashboard-card__content pie-chart">
      <VueApexCharts :options="chartOptionsData" :series="chartSeries" height="100%" width="100%" />
    </fs-card-body>
  </fs-card>
</template>

<style scoped>
:deep(.apexcharts-legend-text) {
  vertical-align: top;
}
</style>