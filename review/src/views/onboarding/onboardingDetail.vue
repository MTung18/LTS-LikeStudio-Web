<script setup lang="ts">
import { ApexOptions } from "apexcharts";
import VueApexCharts from "vue3-apexcharts";
import OnboardingDetailTasks from "@/components/viewComponents/onboarding/onboardingDetailTasks.vue";
import { storeToRefs } from "pinia";
import { useOnboardingEmployeeInformationStore } from "@/stores/onboardingEmployeeInformationStore";
import { employeeStatusBadgeRenderer } from '@/components/shared/bryntumGrid/customCells/employeeStatusBadge';
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleCheck } from "@fortawesome/pro-solid-svg-icons";
import { useRoute } from "vue-router";
import {
  faClipboardListCheck,
  faFileCircleCheck,
  faLandmark,
  faUser,
  faUserTie,
  faCircle1,
  faCircle2,
  faCircle3,
  faCircle4,
  faCircle5,
  faCircle6,
  faCircle7,
  faCircle8,
} from "@fortawesome/pro-light-svg-icons";
import { onMounted, ref, computed } from "vue";
import router from "@/router";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useLoadingStore } from '@/stores/loadingStore';
import { EmployeeStatusEnum } from '@/enums/EmployeeStatusEnum';
import moment from "moment";
import { useGeneralClientSettingStore } from "@/stores/generalClientSettingStore";
import { PaymentMethod } from "@/models/settings/PaymentMethod";
import OnboardingSummary from "@/models/onboarding/OnboardingSummary";

library.add(
  faClipboardListCheck,
  faFileCircleCheck,
  faCircleCheck,
  faUser,
  faUserTie,
  faLandmark,
  faCircle1,
  faCircle2,
  faCircle3,
  faCircle4,
  faCircle5,
  faCircle6,
  faCircle7,
  faCircle8
);
const isCompletedEmployee = ref(false);
const EMPLOYEE_INFORMATION_TYPE = 0;
const FEDERAL_REPORTING_TYPE = 1;
const EMPLOYER_INFORMATION_TYPE = 2;
const route = useRoute();
const employeeId = route.params.id as string;
const fullName = ref<string>('');
const { currentOnboards } = storeToRefs(useOnboardingStore());
const { fetchEmployeeDetails } = useEmployeeStore();
const { employeeDetails } = storeToRefs(useEmployeeStore());
const store = useOnboardingEmployeeInformationStore();
const { listOfEmployeeInformation, progressOverview } = storeToRefs(store);
const { setLoading } = useLoadingStore();
const arrEmployeeInformation = ref<any>([]);
const stepsEmployeeInformation = ref<number>(0);
const stepsEmployeeInformationFinished = ref<number>(0);
const generalClientSettingStore = useGeneralClientSettingStore();
const { clientPaymentMethod } = storeToRefs(generalClientSettingStore);
const arrFederalReporting = ref<any>([]);
const stepsfederalReporting = ref<number>(0);
const stepsfederalReportingFinished = ref<number>(0);
const paymentMethodData = ref<PaymentMethod>(new PaymentMethod());
const arrEmployerInformation = ref<any>([]);
const stepsEmployerInformation = ref<number>(0);
const stepsEmployerInformationFinished = ref<number>(0);
const itemDoneForChart = ref<number>(0);
const chartOptionsData: ApexOptions = {
  chart: {
    type: "radialBar",
    height: 350,
  },
  plotOptions: {
    radialBar: {
      startAngle: 0,
      endAngle: 360,
      hollow: {
        margin: 0,
        size: "60%",
        background: "#fff",
        image: undefined,
        imageOffsetX: 0,
        imageOffsetY: 0,
        position: "front",
        dropShadow: {
          enabled: false,
        },
      },
      track: {
        background: "#D9D9D9",
        strokeWidth: "80%",
        margin: 0,
        dropShadow: {
          enabled: false,
        },
      },

      dataLabels: {
        show: true,
        name: {
          show: false,
        },
        value: {
          color: "#111",
          fontSize: "30px",
          fontWeight: "600",
          offsetY: 13,
          show: true,
        },
      },
    },
  },
  responsive: [
    {
      breakpoint: 1500,
      options: {
        plotOptions: {
          radialBar: {
            dataLabels: {
              value: {
                fontSize: "25px",
              },
            },
          }
        },
      },
    },
    {
      breakpoint: 1300,
      options: {
        plotOptions: {
          radialBar: {
            dataLabels: {
              value: {
                offsetY: 8,
                fontSize: "20px",
              },
            },
          }
        },
      },
    }
  ],
  fill: {
    type: "gradient",
    gradient: {
      shade: "dark",
      type: "vertical",
      shadeIntensity: 0.5,
      gradientToColors: ["#68D7EF"],
      inverseColors: true,
      opacityFrom: 1,
      opacityTo: 1,
      stops: [0, 100],
    },
  },
  stroke: {
    lineCap: "round",
  },
};

const handleViewOnboardingInfo = () => {
  router.push(`/onboarding/${employeeId}/detail/subtab`);
};

const handleRouterFormInput = (nameRouter: string) => {
  if (isCompletedEmployee.value) {
    router.push({ name: 'onboardingReviewInfo', params: { id: employeeId } })
  } else {
    router.push({ name: nameRouter, params: { id: employeeId } });
  }
};

const subTabs = computed(() => {
  const subTabs = [];
  const onboardingSubTab = router.options.routes.find(
    (route) => route.name === "onboardingSubTab"
  );
  const children = onboardingSubTab ? onboardingSubTab.children : [];
  for (let i = 0; i < children.length; i++) {
    if (i >= 1 && i <= 8) {
      // get children with index from 1 to 8
      subTabs.push({
        name: children[i].name,
      });
    }
  }
  return subTabs;
});

onMounted(async () => {
  setLoading(true)
  try {
    Promise.allSettled([
      await store.getEmployeeInformation(+employeeId),
      await fetchEmployeeDetails(employeeId),
      await store.fetchProgressOverview(Number(employeeId)),
    ])
    await generalClientSettingStore.fetchGeneralClientSetting();
    paymentMethodData.value = clientPaymentMethod.value;

    if (employeeDetails.value.employeeStatusId === EmployeeStatusEnum.PendingOnboard || employeeDetails.value.employeeStatusId === EmployeeStatusEnum.PendingQuickhire) {
      isCompletedEmployee.value = true;
    }

    arrEmployeeInformation.value = listOfEmployeeInformation.value.filter((c) => c.progressSidebarType === EMPLOYEE_INFORMATION_TYPE)

    if (!paymentMethodData.value.isDirectDeposit) {
      arrEmployeeInformation.value = arrEmployeeInformation.value.filter(item => item.progressSidebarUrl !== 'onboardingDirectDeposit');
    }

    stepsEmployeeInformation.value = arrEmployeeInformation.value.length;
    stepsEmployeeInformationFinished.value = arrEmployeeInformation.value.filter((c) => c.isHRDone).length;

    arrFederalReporting.value = listOfEmployeeInformation.value.filter((c) => c.progressSidebarType === FEDERAL_REPORTING_TYPE)
    stepsfederalReporting.value = arrFederalReporting.value.length;
    stepsfederalReportingFinished.value = arrFederalReporting.value.filter((c) => c.isHRDone).length;

    arrEmployerInformation.value = listOfEmployeeInformation.value.filter((c) => c.progressSidebarType === EMPLOYER_INFORMATION_TYPE)
    stepsEmployerInformation.value = arrEmployerInformation.value.length;
    stepsEmployerInformationFinished.value = arrEmployerInformation.value.filter((c) => c.isHRDone).length;

    if (listOfEmployeeInformation.value.length === 0) {
      itemDoneForChart.value = 0
    } else {
      itemDoneForChart.value = Math.round(
        ((stepsEmployeeInformationFinished.value
          + stepsfederalReportingFinished.value
          + stepsEmployerInformationFinished.value) /
          listOfEmployeeInformation.value.length) *
        100
      );
    }
    currentOnboards.value.find(x => {
      if (x.id === Number(employeeId)) {
        fullName.value = x.fullName
      }
    })
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false)
  }
});

const getFormatedDate = (date: Date): string => {
  let result = '';
  if (date) {
    result = moment(date).format("MM/DD/YYYY");
  }
  return result;
}

const handleRoutePage = (routeList: OnboardingSummary[]) => {
  if (!routeList || routeList.length === 0) return;
  const firstUndonePage = routeList.find(route => route.isHRDone === false);
  if (firstUndonePage) {
    router.push({ name: firstUndonePage.progressSidebarUrl})
  }
}

</script>

<template>
  <div class="hq-pg pb-0">
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky contain d-flex align-items-center justify-content-between flex-row">
      <div class="d-flex align-items-center gap-3">
        <font-awesome-icon @click="router.push({ name: 'onboarding' })" :icon="['fal', 'circle-arrow-left']" size="2x"
          class="text-success cursor-pointer" />
        <h2 class="hq-pg__title">
          {{ employeeDetails.fullName }}
        </h2>
      </div>
      <fs-button variant="outline-primary" @click="handleViewOnboardingInfo">
        <span>View Info</span>
      </fs-button>
    </fs-container>
    <fs-container fluid class="contain hq-pg__container dashboard_container">
      <fs-row>
        <fs-col md="6" xs="12" class="mb-4">
          <fs-card no-body class="h-100 dashboard-card">
            <fs-card-header class="fs-7 font-weight-bold p-3 d-flex justify-content-between align-items-center">
              Onboarding Progress Overview
              <div v-if="employeeDetails.employeeStatusId"
                v-html="employeeStatusBadgeRenderer(EmployeeStatusEnum[employeeDetails.employeeStatusId])" />
            </fs-card-header>
            <fs-card-body class="d-flex align-items-center">
              <fs-row class="flex-fill">
                <fs-col lg="6" order-lg="2">
                  <VueApexCharts :options="chartOptionsData" :series="[itemDoneForChart]"></VueApexCharts>
                </fs-col>
                <fs-col lg="6" class="d-flex flex-column justify-content-center px-3">
                  <fs-row class="mb-2">
                    <fs-col lg="12" md class=" fs-7"><strong>Employee Start Date</strong></fs-col>
                    <fs-col lg="12" cols="auto">{{
                      progressOverview ? getFormatedDate(progressOverview.employeeStartDateUTC as Date) : ''
                    }}</fs-col>
                  </fs-row>

                  <fs-row class="mb-2">
                    <fs-col lg="12" md class=" fs-7"><strong> Onboarding Assigned</strong></fs-col>
                    <fs-col lg="12" cols="auto">{{
                      progressOverview ? getFormatedDate(progressOverview.onboardingAssignedUTC as Date) : ''
                    }}</fs-col>
                  </fs-row>

                  <fs-row class="mb-2">
                    <fs-col lg="12" md class=" fs-7"><strong>Onboarding Started</strong></fs-col>
                    <fs-col lg="12" cols="auto">{{
                      progressOverview ? getFormatedDate(progressOverview.onboardingStartedUTC as Date) : ''
                    }}</fs-col>
                  </fs-row>
                  <fs-row class="mb-2">
                    <fs-col lg="12" md class=" fs-7"><strong> Last Accessed</strong></fs-col>
                    <fs-col lg="12" cols="auto">{{
                      progressOverview ? getFormatedDate(progressOverview.lastAccessedUTC as Date) : ''
                    }}</fs-col>
                  </fs-row>
                </fs-col>

              </fs-row>
            </fs-card-body>
          </fs-card>
        </fs-col>
        <fs-col md="6" xs="12" class="mb-4">
          <fs-card no-body class="h-100 dashboard-card">
            <fs-card-header class="fs-7 font-weight-bold p-3 d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <font-awesome-icon :icon="['fal', 'user']" class="text-cornflower-blue-dark" size="lg" />
                Employee Information
              </div>
              <div class="flex-1">
                {{ stepsEmployeeInformationFinished }}<span class="fs-12px text-status-inactive font-weight-normal">{{
                  `/${stepsEmployeeInformation} Done`
                }}
                </span>
                <fs-button v-if="stepsEmployeeInformationFinished === 0" variant="primary"
                  class="ml-10px" @click="handleRoutePage(arrEmployeeInformation)">Start</fs-button>
                <fs-button v-if="stepsEmployeeInformationFinished > 0 && stepsEmployeeInformationFinished < stepsEmployeeInformation" variant="outline-primary"
                  class="ml-10px" @click="handleRoutePage(arrEmployeeInformation)">Continue</fs-button>
              </div>
            </fs-card-header>
            <fs-card-body class="p-0">
              <fs-list-group flush class="h-100">
                <fs-list-group-item v-for="(item, index) in arrEmployeeInformation" :key="'employee' + item.progressSidebarId"
                  class="d-flex gap-2 align-items-center py-3 px-3 h-100 fs-7"
                  href="#"
                  @click="handleRouterFormInput(item.progressSidebarUrl)">
                    <font-awesome-icon v-if="item.isHRDone" :icon="['fa', 'circle-check']"
                      class="text-task-cyan fs-8" />
                    <span v-else class="item-icon">{{ index + 1 }}</span>
                    <span class="text-decoration-none" style="cursor: pointer;">{{ item.progressSidebarName }}</span>
                </fs-list-group-item>
              </fs-list-group>
            </fs-card-body>
          </fs-card>
        </fs-col>
      </fs-row>
      <fs-row>
        <fs-col md="6" xs="12" class="mb-4">
          <fs-card no-body class="h-100 dashboard-card">
            <fs-card-header class="fs-7 font-weight-bold p-3 d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <font-awesome-icon :icon="['fal', 'landmark']" size="lg" style="color: #A03AFF ;"/>
                Federal Reporting
              </div>
              <div class="flex-1">
                {{ stepsfederalReportingFinished }}<span class="fs-12px text-status-inactive font-weight-normal">{{
                  `/${stepsfederalReporting} Done`
                }}</span>
                <fs-button v-if="stepsfederalReportingFinished === 0" variant="primary"
                  class="ml-10px" @click="handleRoutePage(arrFederalReporting)">Start</fs-button>
                <fs-button v-if="stepsfederalReportingFinished > 0 && stepsfederalReportingFinished < stepsfederalReporting" variant="outline-primary"
                  class="ml-10px" @click="handleRoutePage(arrFederalReporting)">Continue</fs-button>
              </div>
            </fs-card-header>
            <fs-card-body class="p-0">
              <fs-list-group flush class="h-100">
                <fs-list-group-item v-for="(item, index) in arrFederalReporting" :key="'employee' + item.progressSidebarId"
                  class="d-flex gap-2 py-3 px-3 h-100 fs-7"
                  href="#"
                  @click="handleRouterFormInput(item.progressSidebarUrl)">
                    <font-awesome-icon v-if="item.isHRDone" :icon="['fa', 'circle-check']"
                      class="text-task-cyan fs-8" />
                    <span v-else class="item-icon">{{ index + 1 }}</span>
                    <span class="text-decoration-none" style="cursor: pointer;">{{ item.progressSidebarName }}</span>
                </fs-list-group-item>
              </fs-list-group>
            </fs-card-body>
          </fs-card>
        </fs-col>
        <fs-col md="6" xs="12" class="mb-4">
          <fs-card no-body class="h-100 dashboard-card">
            <fs-card-header class="fs-7 font-weight-bold p-3 d-flex align-items-center justify-content-between">
              <div class="d-flex align-items-center gap-2">
                <font-awesome-icon :icon="['fal', 'fa-user-tie']" size="lg" style="color: #C43D97;"/>
                <h2 class="hq-pg__title">Employer Information</h2>
              </div>
              <div class="flex-1">
                {{ stepsEmployerInformationFinished }}<span class="fs-12px text-status-inactive font-weight-normal">{{
                  `/${stepsEmployerInformation} Done`
                }}</span>
                <fs-button v-if="stepsEmployerInformationFinished === 0" variant="primary" class="ml-10px" @click="handleRoutePage(arrEmployerInformation)">Start</fs-button>
                <fs-button v-if="stepsEmployerInformationFinished > 0 && stepsEmployerInformationFinished < stepsEmployerInformation" variant="outline-primary"
                  class="ml-10px" @click="handleRoutePage(arrEmployerInformation)">Continue</fs-button>
              </div>
            </fs-card-header>
            <fs-card-body class="p-0">
              <fs-list-group flush class="h-100">
                <fs-list-group-item v-for="(item, index) in arrEmployerInformation" :key="'employee' + item.progressSidebarId"
                  class="d-flex gap-2 py-3 px-3 h-100 fs-7"
                  href="#"
                  @click="handleRouterFormInput(item.progressSidebarUrl)">
                    <font-awesome-icon v-if="item.isHRDone" :icon="['fa', 'circle-check']"
                      class="text-task-cyan fs-8" />
                    <span v-else class="item-icon">{{ index + 1 }}</span>
                    <span class="text-decoration-none" style="cursor: pointer;">{{ item.progressSidebarName }}</span>
                </fs-list-group-item>
              </fs-list-group>
            </fs-card-body>
          </fs-card>
        </fs-col>
      </fs-row>
      <div>
        <onboarding-detail-tasks></onboarding-detail-tasks>
      </div>
    </fs-container>
  </div>
</template>
<style lang="scss" scoped>
.detail-onboarding {
  overflow: auto;
  height: 100%;
  width: 100%;
  position: relative;
}

.dashboard_container {
  background-color: #eff1f3;
}

.card {
  box-shadow: 0px 3px 12px 0px #0000000F
}

.card-header {
  background-color: #FFFFFF;
  padding: 10px;
}

.content {
  overflow: auto;
}

.cursor-pointer {
  cursor: pointer;

  &:hover {
    opacity: 0.8;
    transition: all 0.3s ease;
  }
}

.font-weight-bold {
  font-weight: bold;
}

.font-weight-normal {
  font-weight: normal;
}

.fs-8 {
  font-size: 24px;
}

.fs-7 {
  font-size: 16px;
}

.fs-12px {
  font-size: 12px;
}

.border-gray {
  border-bottom: 1px solid #E1E4E8;
}

.link-item {
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #EEEEEE;
  }
}

:deep(.employeestatus) {
  margin: 0;
}

.item-icon {
  border: 1px solid #03A9F4;
  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 100%;
  height: 24px;
  width: 24px;

  font-size: 14px;
  color: #03A9F4;
  transition: all ease 0.4s;
}

.ml-10px {
  margin-left: 10px
}
</style>