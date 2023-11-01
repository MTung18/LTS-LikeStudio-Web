<script setup lang="ts">
import { ApexOptions } from 'apexcharts';
import { faEnvelope } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueApexCharts from 'vue3-apexcharts';
import { library } from '@fortawesome/fontawesome-svg-core';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import EmployeeOnboarding from '@/models/employees/EmployeeOnboarding';
import EmployeeDetails from '@/models/employees/EmployeeDetails';

library.add(faEnvelope);

interface Props {
  employeeOnboarding?: EmployeeOnboarding;
  employeeDetails?: EmployeeDetails;
}
const props = withDefaults(defineProps<Props>(), {
  employeeOnboarding: null,
  employeeDetails: null
});

const employeeOnboardingData = props.employeeOnboarding;
const chartOptionsData: ApexOptions = {
    chart: {
        type: 'radialBar'
    },
    plotOptions: {
        radialBar: {
            hollow: {
                size: '60%',
            },
            dataLabels: {
                name: {
                    show: false,
                },
                value:{
                    fontSize: '35px',
                    offsetY: 10
                }
            }
        },
    },
    labels: ['Onboarding progress'],
};

const chartSeries = [employeeOnboardingData.onboardingProgress];

const dateStarted = computed(() => {
    if (!employeeOnboardingData || !employeeOnboardingData.dateStarted) {
        return "Not Started Yet";
    }

    return employeeOnboardingData.dateStarted;
});

const dateCompleted = computed(() => {
    if(!employeeOnboardingData || !employeeOnboardingData.dateCompleted) {
        return "Not Completed";
    }

    return employeeOnboardingData.dateCompleted;
});

const daysElapsed = computed(() => {
    if (!employeeOnboardingData || !employeeOnboardingData.dateStarted) {
        return 0;
    }

    const currentDate = new Date();
    const startDate = new Date(employeeOnboardingData.dateStarted);
    const diffTime = Math.abs(currentDate.getTime() - startDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

const lastAccessed = computed(() => {
    if(!employeeOnboardingData || !employeeOnboardingData.lastAccessed) {
        return "Not Accessed Yet";
    }

    return employeeOnboardingData.lastAccessed;
});

</script>

<template>
    <fs-card class="dashboard-card" no-body>
        <fs-card-header class="dashboard-card__header">
            <h2 class="hq-pg__title text-employee-blue">Overview</h2>
        </fs-card-header>
        <fs-card-body
            class="dashboard-card__content "
        >
            <fs-container fluid class="mt-2">
                <fs-row class="dashboard__row">
                    <fs-col cols="8">
                        <fs-row class="py-1">
                        <fs-col cols="6">
                            <strong>Date Started</strong>
                        </fs-col>
                        <fs-col>
                            {{ dateStarted }}
                        </fs-col>
                        </fs-row>

                        <fs-row class="py-1">
                        <fs-col cols="6">
                            <strong>Date Completed</strong>
                        </fs-col>
                        <fs-col>
                            {{ dateCompleted }}
                        </fs-col>
                        </fs-row>

                        <fs-row class="py-1">
                        <fs-col cols="6">
                            <strong>Days Elapsed</strong>
                        </fs-col>
                        <fs-col>
                            {{ daysElapsed }}
                        </fs-col>
                        </fs-row>

                        <fs-row class="py-1">
                        <fs-col cols="6">
                            <strong>Last Accessed</strong>
                        </fs-col>
                        <fs-col>
                            {{ lastAccessed }}
                        </fs-col>
                        </fs-row>
                    </fs-col>
                    <fs-col cols="3" class="mr-50">
                        <fs-row>
                            <b>Onboarding Progress</b>
                        </fs-row>
                        <fs-row>
                            <VueApexCharts :options="chartOptionsData" :series="chartSeries" height="200px"></VueApexCharts>
                        </fs-row>
                    </fs-col>
                </fs-row>
            </fs-container>         
        </fs-card-body>
        <fs-card-footer class="dashboard-card__footer">
            <fs-button variant="outline-primary" class="btn outline-primary border-0">
                <font-awesome-icon :icon="['fal', 'envelope']">
                </font-awesome-icon>
                <a style="text-decoration:none" :href="'mailto:' + employeeDetails.email">Send Email To {{ employeeDetails.fullName }}</a>
            </fs-button>           
        </fs-card-footer>
    </fs-card>
</template>