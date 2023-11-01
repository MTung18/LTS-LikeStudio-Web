<script setup lang="ts">
import { computed, onBeforeMount } from "vue";
import { ApexOptions } from "apexcharts";
import VueApexCharts from "vue3-apexcharts";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";

interface Props {
  employeeStatuses?: Object;
}
const props = withDefaults(defineProps<Props>(), {
  employeeStatuses: null,
});

let currentMonthStatuses: number[] = [];
let previousMonthStatuses: number[] = [];
let twoMonthsAgoStatuses: number[] = [];
let threeMonthsAgoStatuses: number[] = [];

const filterDate = new Date();
filterDate.setFullYear(filterDate.getFullYear() - 1);
filterDate.setMonth(filterDate.getMonth() + 1);
filterDate.setDate(1);
filterDate.setHours(0, 0, 0);

function getStatusCounts(): void {
  if (props.employeeStatuses != null) {
    const employeeStatuses: any = Object.entries(props.employeeStatuses);
    for (const item of employeeStatuses) {
      const list: string = item[0];
      const values: any = item[1];
      if (list == "currentMonth") {
        currentMonthStatuses = values;
      } else if (list == "previousMonth") {
        previousMonthStatuses = values;
      } else if (list == "twoMonthsAgo") {
        twoMonthsAgoStatuses = values;
      } else if (list == "threeMonthsAgo") {
        threeMonthsAgoStatuses = values;
      }
    }
  }
}

const chartOptionsData: ApexOptions = {
  chart: {
    type: "line",
    toolbar: {
      show: false
    },
  },
  stroke: {
    show: true,
    curve: 'smooth',
    width: 3,
    colors: ["transparent"],
  },
  xaxis: {
    type: "category",
    labels: {
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
  },
  yaxis: {
    labels: {
      // formatter: (value: number) => this.$filters.formatCurrency(value),
      style: {
        fontSize: "12px",
        fontWeight: "bold",
      },
    },
  },
  plotOptions: {
    bar: {
      borderRadius: 2,
    },
  },
  tooltip: {
    shared: true,
    intersect: false,
    // y: {
    //     formatter: (value: number) => this.$filters.formatCurrency(value),
    // }
  },
  legend: {
    position: "top",
  },
  dataLabels: {
    enabled: false,
    // formatter(value: string | number | number[], { seriesIndex, dataPointIndex, w }: any): string {
    //     return this.$filters.formatCurrency(value);
    // },
  },
};

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const currentMonthOffset = (months: number): number => {
  const currentMonth = new Date().getMonth();
  let monthOffset = currentMonth + (months % 12);
  if (monthOffset < 0) {
    monthOffset = 12 + monthOffset;
  } else if (monthOffset > 11) {
    monthOffset = -1 + monthOffset;
  }
  return monthOffset;
};

const chartSeries = computed(() => [
  {
    name: "New Hires",
    data: [
      {
        x: monthNames[currentMonthOffset(-3)],
        y: threeMonthsAgoStatuses.filter(s => s == EmployeeStatusEnum.QuickHire || s == EmployeeStatusEnum.Onboard).length,
      },
      {
        x: monthNames[currentMonthOffset(-2)],
        y: twoMonthsAgoStatuses.filter(s => s == EmployeeStatusEnum.QuickHire || s == EmployeeStatusEnum.Onboard).length,
      },
      {
        x: monthNames[currentMonthOffset(-1)],
        y: previousMonthStatuses.filter(s => s == EmployeeStatusEnum.QuickHire || s == EmployeeStatusEnum.Onboard).length,
      },
      {
        x: monthNames[currentMonthOffset(0)],
        y: currentMonthStatuses.filter(s => s == EmployeeStatusEnum.QuickHire || s == EmployeeStatusEnum.Onboard).length,
      },
    ],
    color: "#FF5094",
  },
  {
    name: "Active",
    data: [
      {
        x: monthNames[currentMonthOffset(-3)],
        y: threeMonthsAgoStatuses.filter(s => s == EmployeeStatusEnum.Active).length,
      },
      {
        x: monthNames[currentMonthOffset(-2)],
        y: twoMonthsAgoStatuses.filter(s => s == EmployeeStatusEnum.Active).length,
      },
      {
        x: monthNames[currentMonthOffset(-1)],
        y: previousMonthStatuses.filter(s => s == EmployeeStatusEnum.Active).length,
      },
      {
        x: monthNames[currentMonthOffset(0)],
        y: currentMonthStatuses.filter(s => s == EmployeeStatusEnum.Active).length,
      },
    ],
    color: "#1ABC9C",
  },
  {
    name: "Inactive",
    data: [
      {
        x: monthNames[currentMonthOffset(-3)],
        y: threeMonthsAgoStatuses.filter(s => s == EmployeeStatusEnum.Inactive || s == EmployeeStatusEnum.OnLeave).length,
      },
      {
        x: monthNames[currentMonthOffset(-2)],
        y: twoMonthsAgoStatuses.filter(s => s == EmployeeStatusEnum.Inactive || s == EmployeeStatusEnum.OnLeave).length,
      },
      {
        x: monthNames[currentMonthOffset(-1)],
        y: previousMonthStatuses.filter(s => s == EmployeeStatusEnum.Inactive || s == EmployeeStatusEnum.OnLeave).length,
      },
      {
        x: monthNames[currentMonthOffset(0)],
        y: currentMonthStatuses.filter(s => s == EmployeeStatusEnum.Inactive || s == EmployeeStatusEnum.OnLeave).length,
      },
    ],
    color: "#6E7C8F",
    opacity: 0.5
  },
  {
    name: "Terminated",
    data: [
      {
        x: monthNames[currentMonthOffset(-3)],
        y: threeMonthsAgoStatuses.filter(s => s == EmployeeStatusEnum.Terminated).length,
      },
      {
        x: monthNames[currentMonthOffset(-2)],
        y: twoMonthsAgoStatuses.filter(s => s == EmployeeStatusEnum.Terminated).length,
      },
      {
        x: monthNames[currentMonthOffset(-1)],
        y: previousMonthStatuses.filter(s => s == EmployeeStatusEnum.Terminated).length,
      },
      {
        x: monthNames[currentMonthOffset(0)],
        y: currentMonthStatuses.filter(s => s == EmployeeStatusEnum.Terminated).length,
      },
    ],
    color: "#FF2A2A",
  },
]);

onBeforeMount(() => {
  getStatusCounts();
})
</script>

<template>
  <fs-card class="dashboard-card" no-body>
    <fs-card-header class="dashboard-card__header">
      <h2 class="hq-pg__title">Turnover Rate Per Month</h2>
    </fs-card-header>

    <fs-card-body class="dashboard-card__content">
      <VueApexCharts :options="chartOptionsData" :series="chartSeries" height="100%" width="100%" />
    </fs-card-body>
  </fs-card>
</template>
