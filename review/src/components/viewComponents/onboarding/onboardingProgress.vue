<script setup lang="ts">
import { ApexOptions } from 'apexcharts';
import VueApexCharts from 'vue3-apexcharts';

interface Props {
    progressValue?: number;
}

const props = withDefaults(defineProps<Props>(), {
    progressValue: 0,
});

// Color blue.
var fillColor = '#0080ff';

if (props.progressValue < 50) {
    // Color orange.
    fillColor = '#ffa500';
} else if (props.progressValue == 100) {
    // Color green.
    fillColor = '#2eb82e';
}

const roundedChartOptions: ApexOptions = {
    chart: {
        type: 'radialBar',
    },
    plotOptions: {
        radialBar: {
            track: {
                background: '#d3d3d3'
            },
            hollow: {
                size: '50%',
            },
            dataLabels: {
                name: {
                    show: false
                },
                value: {
                    fontSize: '12',
                    fontWeight: 'bold',
                    offsetY: 5,
                }
            }
        },
    },
    fill: {
        colors: [fillColor]
    }
    ,
};

const roundedChartSeries = [props.progressValue];
</script>

<template>
    <div class="parent">
        <VueApexCharts width="130" :options="roundedChartOptions" :series="roundedChartSeries"></VueApexCharts>
    </div>
</template>