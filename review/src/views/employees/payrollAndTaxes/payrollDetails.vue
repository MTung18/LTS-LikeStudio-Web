<script setup lang="ts">
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { usePayrollStore } from "@/stores/payrollStore";
import { Grid, GridRowModel, Store, StringHelper } from "@bryntum/grid";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faAddressCard,
  faCalendarDays,
  faMapLocation,
} from "@fortawesome/pro-solid-svg-icons";
import {
  faPrint,
  faCircleArrowLeft,
} from "@fortawesome/pro-light-svg-icons";
import { storeToRefs } from "pinia";
import { onMounted, ref, Ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { formatCurrency, formatNumber } from "@/utilities/formatUtils";
import FsPaystubDetail from "@/models/payroll/PayrollHistory";
import { useBreakpoints } from "../../../composables/useBreakpoints";
import moment from 'moment';

const tableKey = ref(0);
const route = useRoute();
const router = useRouter();
const dateParam = router.currentRoute.value.params.checkDate as string;
const { responsive } = useBreakpoints();
library.add(faPrint, faMapLocation, faCalendarDays, faAddressCard, faCircleArrowLeft);

const { fetchPayrollDetails, fetchPayrollList } = usePayrollStore();
const { fsPaystubDetail, payrollList } = storeToRefs(usePayrollStore());
const payPeriodString = ref("");

const grid: Ref<Grid> = ref(null);

const userData: Ref<FsPaystubDetail> = ref(null);


const namePaystub = ref("");

const { id: employeeId, payrollId: payrollId, year: year } = route.params;

function printPage(areaId) {
  const printContent = document.getElementById(areaId).outerHTML;
  const originalContent = document.body.outerHTML;
  document.body.outerHTML = printContent;
  window.print();
  document.body.outerHTML = originalContent;
  //To fix bug lost event element
  location.reload();
}

const defaultSorter = {
  field: "description",
  ascending: true,
};

const payrollCurrentEarningStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  }),
);

const payrollYearEarningStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  }),
);

class Tax extends GridRowModel {
  static get fields() {
    return [
      {
        name: "currentVal",
        type: "number",
      },
      {
        name: "ytdVal",
        type: "number",
      },
    ];
  }
}

const taxDeductStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
    modelClass: Tax,
  }),
);

const fringesStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  }),
);

async function populateCurrentEarningStore() {
  if (userData.value.paycheckCurrentEarningsList) {
    payrollCurrentEarningStore.value.data = userData.value.paycheckCurrentEarningsList;
  }
}

async function populateYearEarningStore() {
  if (userData.value.paycheckYTDEarningsList) {
    payrollYearEarningStore.value.data = userData.value.paycheckYTDEarningsList;
  }
}

async function populateTaxDeductStore() {
  const taxDeductList = Array.of(userData.value.fedTaxList, userData.value.stateTaxList, userData.value.localTaxList, userData.value.miscDeductionsList, userData.value.unionDeductionsList);
  if (taxDeductList.length > 0) {
    const mapTaxDeduct: any[] = [];
    taxDeductList.forEach(item => {
      if(item && item.length > 0) {
        const obj = Object.create({
          description: item[0].shortDesc,
          expanded: true,
          children: item
        })
        mapTaxDeduct.push(obj)
      }
    })
    taxDeductStore.value.data = mapTaxDeduct;
  }
}

async function populateFringesStore() {
  if (userData.value.fringesList) {
    fringesStore.value.data = userData.value.fringesList;
  }
}

const storeType = {
  HoursEarning: "HoursEarning",
  YearToDate: "YearToDate",
  TaxDeduction: "TaxDeduction",
  Fringes: "Fringes"
}

const gridLocalStorageKey = "payrollDetailsGrid";

const getGridConfig = (type: string) => {
  let cols;
  if (type === storeType.HoursEarning) {
    cols = [
      {
        autoHeight: true,
        autoWidth: responsive.mobile,
        sortable: false,
        flex: 1,
        text: "Description",
        id: "description",
        field: "earnTypeDescription",
        groupable: false,
        htmlEncode: false,
        sum: "add",
        summaryRenderer: () => {
          return "TOTAL";
        },
      },
      {
        autoHeight: true,
        autoWidth: responsive.mobile,
        sortable: false,
        flex: 1,
        text: "Hours",
        id: "hours",
        field: "hours",
        cls: "text-align-right",
        groupable: false,
        htmlEncode: false,
        sum: "sum",
        renderer: ({ value }) => `${formatNumber(value) == "0.00" ? "" : formatNumber(value)}`,
        summaryRenderer: ({ sum }) => {
          return `${formatNumber(sum)}`;
        },
      },
      {
        autoHeight: true,
        autoWidth: responsive.mobile,
        sortable: false,
        flex: 1,
        text: "Pay Rate",
        id: "payRate",
        field: "payRate",
        cls: "text-align-right",
        groupable: false,
        htmlEncode: false,
        renderer: ({ value }) => `${formatCurrency(value) == "$0.00" ? "" : formatCurrency(value)}`,
      },
      {
        autoHeight: true,
        autoWidth: responsive.mobile,
        sortable: false,
        flex: 1,
        text: "Earnings",
        id: "amount",
        field: "amount",
        cls: "text-align-right",
        groupable: false,
        htmlEncode: false,
        sum: "sum",
        renderer: ({ value }) => `${formatCurrency(value) == "$0.00" ? "" : formatCurrency(value)}`,
        summaryRenderer: ({ sum }) => {
          return `${formatCurrency(sum)}`;
        },
      },
    ];
  } else if (type === storeType.YearToDate) {
    cols = [
      {
        autoHeight: true,
        autoWidth: responsive.mobile,
        sortable: false,
        flex: 1,
        text: "Description",
        id: "earnType",
        field: "earnType",
        groupable: false,
        htmlEncode: false,
        sum: "add",
        summaryRenderer: () => {
          return "TOTAL";
        },
      },
      {
        autoHeight: true,
        autoWidth: responsive.mobile,
        sortable: false,
        flex: 1,
        text: "Hours",
        id: "hours",
        field: "ytdHours",
        cls: "text-align-right",
        groupable: false,
        htmlEncode: false,
        sum: "sum",
        renderer: ({ value }) => `${formatNumber(value) == "0.00" ? "" : formatNumber(value)}`,
        summaryRenderer: ({ sum }) => {
          return `${formatNumber(sum)}`;
        },
      },
      {
        autoHeight: true,
        autoWidth: responsive.mobile,
        sortable: false,
        flex: 2,
        text: "Earnings",
        id: "amount",
        field: "ytdAmount",
        cls: "text-align-right",
        groupable: false,
        htmlEncode: false,
        sum: "sum",
        renderer: ({ value }) => `${formatCurrency(value) == "$0.00" ? "" : formatCurrency(value)}`,
        summaryRenderer: ({ sum }) => {
          return `${formatCurrency(sum)}`;
        },
      },
    ];
  } else if (type === storeType.TaxDeduction) {
    cols = [
      {
        autoHeight: true,
        sortable: false,
        autoWidth: true,
        text: "Description",
        field: "description",
        flex: 1,
        type: "tree",
        touchConfig: { editor: false },
        htmlEncode: false,
        renderer({ value, record, row }) {
          if (record.data.parentId === null) {
            row.addCls("highlight");
            return `${StringHelper.encodeHtml(value)}`;
          }
          return StringHelper.encodeHtml(value);
        },
        sum: "sum",
        summaryRenderer: () => `TOTAL`,
      },
      {
        sortable: false,
        autoHeight: true,
        autoWidth: responsive.mobile,
        type: "aggregate",
        text: "Current",
        id: "currentVal",
        field: "currentVal",
        cls: "text-align-right",
        flex: 1,
        sum: (result, record) => {
          const { parentId, currentVal } = record.data;
          if (parentId === null || !("parentId" in record.data)) {
            result += currentVal != undefined ? currentVal : 0;
          }

          return result;
        },
        renderer: ({ value }) => `${formatCurrency(value) == "$0.00" ? "" : formatCurrency(value)}`,
        summaryRenderer: ({ sum }) => `${formatCurrency(sum)}`,
      },
      {
        sortable: false,
        autoHeight: true,
        autoWidth: responsive.mobile,
        type: "aggregate",
        text: "YTD",
        id: "ytdVal",
        field: "ytdVal",
        cls: "text-align-right",
        flex: 2,
        sum: (result, record) => {
          const { parentId, ytdVal } = record.data;

          if (parentId === null || !("parentId" in record.data)) {
            result += ytdVal != undefined ? ytdVal : 0;
          }

          return result;
        },
        renderer: ({ value }) => `${formatCurrency(value) == "$0.00" ? "" : formatCurrency(value)}`,
        summaryRenderer: ({ sum }) => `${formatCurrency(sum)}`,
      },
    ];
  } else if (type === storeType.Fringes) {
    cols = [
      {
        flex: 1,
        autoHeight: true,
        autoWidth: responsive.mobile,
        sortable: false,
        text: "Description",
        id: "description",
        field: "description",
        type: "tree",
        htmlEncode: false,
        touchConfig: { editor: false },
        renderer({ value, record, row }) {
          if (record.data.parentId === null) {
            row.addCls("highlight");
            return value;
          }
          return value;
        },
        sum: "sum",
        summaryRenderer: () => `TOTAL`,
      },
      {
        sortable: false,
        autoHeight: true,
        autoWidth: responsive.mobile,
        flex: 1,
        type: "aggregate",
        text: "Current",
        field: "currentVal",
        cls: "text-align-right",
        sum: (result, record) => {
          const { parentId, currentVal } = record.data;
          if (parentId === null || !("parentId" in record.data)) {
            result += currentVal != undefined ? currentVal : 0;
          }

          return result;
        },
        renderer: ({ value }) => `${formatCurrency(value) == "$0.00" ? "" : formatCurrency(value)}`,
        summaryRenderer: ({ sum }) => `${formatCurrency(sum)}`,
      },
      {
        sortable: false,
        autoHeight: true,
        autoWidth: responsive.mobile,
        type: "aggregate",
        text: "YTD",
        field: "ytdVal",
        cls: "text-align-right",
        flex: 2,
        sum: (result, record) => {
          const { parentId, ytdVal } = record.data;

          if (parentId === null || !("parentId" in record.data)) {
            result += ytdVal != undefined ? ytdVal : 0;
          }

          return result;
        },
        renderer: ({ value }) => `${formatCurrency(value) == "$0.00" ? "" : formatCurrency(value)}`,
        summaryRenderer: ({ sum }) => `${formatCurrency(sum)}`,
      },
    ];
  }

  const baseGridConfig = gridConfigBase();

  return {
    ...baseGridConfig,
    columns: [...cols],
  };
};

const gridConfigBase = () => {
  return {
    ...fsBryntumGridConfig.gridConfig,
    ...getStatefulFilterFeature(gridLocalStorageKey),
    ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
    autoHeight: true,
    rowHeight: 25,
    features: {
      summary: true,
    },
    emptyText: "",
  };
};

watch(() => responsive.breakpoint, () => {
  tableKey.value++
})

onMounted(async () => {
  const selectedYear = Number(route.query.year);
  await fetchPayrollDetails(employeeId as string, dateParam);
  await fetchPayrollList(employeeId as string , selectedYear);
  userData.value = fsPaystubDetail.value;
  await populateCurrentEarningStore();
  await populateYearEarningStore();
  await populateTaxDeductStore();
  await populateFringesStore();
  if(payrollList.value && payrollList.value.length > 0) {
    namePaystub.value = payrollList.value.find(item => moment(item.payDate).format("MM/DD/YYYY") === moment(userData.value?.payStubGeneral?.checkDate).format("MM/DD/YYYY")).namePayStub;
  }
  if(userData.value.payStubGeneral.periodStartsString && userData.value.payStubGeneral.periodEndsString) {
    payPeriodString.value = `${userData.value.payStubGeneral.periodStartsString} - ${userData.value.payStubGeneral.periodEndsString}`
  }
});
</script>

<template>
  <div class="hq-pg">
    <fs-container fluid class="hq-pg__header hq-pg__header--sub contain">
      <fs-row align-v="center my-2">
        <fs-col class="payroll-header">
          <span @click="router.go(-1)">
            <font-awesome-icon :icon="['fal', 'circle-arrow-left']" class="back-icon" />
          </span>

          <span>
            <h2 class="hq-pg__title custom-hq-pg__title">{{ namePaystub }}</h2>
          </span>
        </fs-col>
        <fs-col cols="auto">
          <fs-button variant="outline-primary" @click="printPage('wrapper')"><font-awesome-icon
              :icon="['fal', 'print']" /><span class="d-none d-lg-inline">Print</span>
          </fs-button>
        </fs-col>
      </fs-row>
    </fs-container>
    <hr class="my-0 " />
    <div id="wrapper">
      <fs-container fluid class="contain hq-pg__container" id="card-header">
        <fs-row class="mt-4">
          <fs-col lg="6" xl="4" class="mb-3 print-responsive">
            <fs-card class="rounded" no-body>
              <div class="dashboard-card__header">
                <font-awesome-icon class="me-2" :icon="['fas', 'map-location']" /><span>
                  <div class="hq-pg__title custom-hq-pg__title ml-8">Preview Company</div>
                </span>
              </div>
              <div>
                <fs-container class="px-3 pb-3" fluid>
                  <fs-row class="py-0">
                    <fs-col>
                      <p class="ps-font-12">
                        {{ userData?.payStubGeneral?.companyName }}
                      </p>
                      <p class="ps-font-12">
                        {{ userData?.payStubGeneral?.companyAddress }}
                      </p>
                      <p class="ps-font-12">
                        {{ userData?.payStubGeneral?.companyAddressLocation }}
                      </p>
                      <p class="ps-font-12">
                        {{ userData?.payStubGeneral?.companyPhone }}
                      </p>
                    </fs-col>
                  </fs-row>
                </fs-container>
              </div>
            </fs-card>
          </fs-col>
          <fs-col lg="6" xl="4" class="mb-3 print-responsive">
            <fs-card class="rounded" no-body>
              <div class="dashboard-card__header">
                <font-awesome-icon class="me-2" :icon="['fas', 'calendar-days']" />
                <div class="hq-pg__title custom-hq-pg__title ml-8">Earnings Statement</div>
              </div>
              <div>
                <fs-container class="px-3 pb-3" fluid>
                  <fs-row>
                    <fs-col cols="3">
                      <strong class="ps-font-16">Check number</strong>
                    </fs-col>
                    <fs-col class="ps-text-end ps-font-16">
                      {{ userData?.payStubGeneral?.checkNo }}
                    </fs-col>
                  </fs-row>
                  <fs-row>
                    <fs-col  cols="3">
                      <strong class="ps-font-16">Pay date</strong>
                    </fs-col>
                    <fs-col class="ps-text-end ps-font-16">
                      {{ userData?.payStubGeneral?.checkDateString }}
                    </fs-col>
                  </fs-row>
                  <fs-row>
                    <fs-col  cols="3">
                      <strong class="ps-font-16">Pay period</strong>
                    </fs-col>
                    <fs-col class="ps-text-end ps-font-16">
                      {{ payPeriodString }}
                    </fs-col>
                  </fs-row>
                </fs-container>
              </div>
            </fs-card>
          </fs-col>
          <fs-col lg="6" xl="4" class="mb-3 print-responsive">
            <fs-card class="rounded" no-body>
              <div class="dashboard-card__header">
                <font-awesome-icon :icon="['fas', 'address-card']" /><span>
                  <h2 class="hq-pg__title custom-hq-pg__title ml-8">
                    {{ fsPaystubDetail?.payStubGeneral?.fullName }}
                  </h2>
                </span>
              </div>
              <div>
                <fs-container class="px-3 pb-3" fluid>
                  <fs-row>
                    <fs-col  cols="3">
                      <strong class="ps-font-16">Employee ID </strong>
                    </fs-col>
                    <fs-col class="ps-text-end ps-font-16">
                      {{ fsPaystubDetail?.payStubGeneral?.empNo }}
                    </fs-col>
                  </fs-row>
                  <fs-row>
                    <fs-col  cols="3">
                      <strong class="ps-font-16">Address</strong>
                    </fs-col>
                    <fs-col class="ps-text-end ps-font-16">
                      {{ fsPaystubDetail?.payStubGeneral?.address }}
                    </fs-col>
                  </fs-row>
                </fs-container>
              </div>
            </fs-card>
          </fs-col>
        </fs-row>
      </fs-container>
      <div fluid class="contain hq-pg__container" id="listGrid">
        <fs-row class="dashboard__row mt-4">
          <fs-col v-if="payrollCurrentEarningStore.data && payrollCurrentEarningStore.data.length > 0">
            <fs-card class="rounded" no-body>
              <fs-card-header>
                <h2 class="hq-pg__title custom-hq-pg__title">Current Hours & Earnings</h2>
              </fs-card-header>
              <div class="action-grid list__table--onpage list__b-grid--hover">
                <bryntum-grid v-bind="getGridConfig(storeType.HoursEarning)" :store="payrollCurrentEarningStore" ref="grid"
                  :key="tableKey" />
              </div>
            </fs-card>
          </fs-col>
        </fs-row>

        <fs-row class="dashboard__row mt-4">
          <fs-col v-if="payrollYearEarningStore.data && payrollYearEarningStore.data.length > 0">
            <fs-card class="rounded" no-body>
              <fs-card-header>
                <h2 class="hq-pg__title custom-hq-pg__title">Year To Date Hours & Earnings</h2>
              </fs-card-header>
              <div class="action-grid list__table--onpage list__b-grid--hover">
                <bryntum-grid v-bind="getGridConfig(storeType.YearToDate)" :store="payrollYearEarningStore" ref="grid"
                  :key="tableKey" />
              </div>
            </fs-card>
          </fs-col>
        </fs-row>


        <fs-row class="dashboard__row mt-4">
          <fs-col v-if="taxDeductStore.data && taxDeductStore.data.length > 0">
            <fs-card class="rounded" no-body>
              <fs-card-header>
                <h2 class="hq-pg__title custom-hq-pg__title">Taxes & Deductions</h2>
              </fs-card-header>
              <div class="action-grid list__table--onpage list__b-grid--hover">
                <bryntum-grid v-bind="getGridConfig(storeType.TaxDeduction)" ref="grid" :store="taxDeductStore" :key="tableKey" />
              </div>
            </fs-card>
          </fs-col>
          <fs-col v-if="fringesStore.data && fringesStore.data.length > 0">
            <fs-card class="rounded" no-body>
              <fs-card-header>
                <h2 class="hq-pg__title custom-hq-pg__title">Fringes</h2>
              </fs-card-header>
              <div class="action-grid list__table--onpage list__b-grid--hover">
                <bryntum-grid v-bind="getGridConfig(storeType.Fringes)" :store="fringesStore" ref="grid" :key="tableKey" />
              </div>
            </fs-card>
          </fs-col>
          <div id="net-pay">
            <div class="dashboard__row mt-4 p-3 bg-gray rounded" align-v="center">
              <fs-row align-v="center">
                <fs-col>
                  <h2 class="hq-pg__title custom-hq-pg__title">Net Pay</h2>
                </fs-col>
                <fs-col cols="auto">
                  <div class="ps-text-end fw-bold">
                    {{ userData?.payStubGeneral?.checkAmount ? `$${formatNumber(userData?.payStubGeneral?.checkAmount)}` : '' }}
                  </div>
                </fs-col>
              </fs-row>
            </div>
          </div>
        </fs-row>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
:deep(.dashboard-card__header) {
  flex-direction: row;
  align-items: center;
  justify-content: unset;
}

@media (max-width: 420px) {
  :deep(.dashboard-card__header) {
    min-height: fit-content;
    padding: 12px 16px;
  }
}

.ps-text-end {
  text-align: start;
}

.ps-font-12 {
  font-size: 12px;
}

:deep(.hq-pg__container) {
  padding-top: 0px;
  padding-bottom: 0px;
  margin: 0;
}

p {
  margin-bottom: 0px;
}

h2.ml-8 {
  margin-left: 8px !important;
}

:deep(svg) {
  font-size: 12px;
}

:deep(#card-header .rounded) {
  height: 100%;
}

:deep(.row.dashboard__row.mt-4) {
  .rounded {
    border-bottom: none;
    margin-top: -15px;
  }
}

:root {
  --font-size-12: 12px;
}

:deep(.b-grid-footers-normal) {
  width: 100%;
  background-color: #eff1f3;
  border-bottom: 1px solid #d8d9da;
}

:deep(.b-grid-footer) {
  background-color: #eff1f3;
  border: none;
  font-weight: bold;
  font-size: var(--font-size-12);
}

:deep(.b-grid-cell) {
  font-size: var(--font-size-12);
}

.dashboard-card {
  border: none;
}

:deep(.b-grid-header-text-content) {
  font-size: var(--font-size-12);
}

.bg-gray {
  background-color: #eff1f3;
}

:deep(.fa-map-location) {
  width: 18px;
  height: 12px;
  font-family: "Font Awesome 6 Pro";
  font-style: normal;
  font-weight: 900;
  font-size: var(--font-size-12);
  line-height: 12px;
  /* identical to box height */
  color: #03a9f4;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
}

:deep(.fa-calendar-days) {
  width: 14px;
  height: 12px;

  font-family: "Font Awesome 6 Pro";
  font-style: normal;
  font-weight: 900;
  font-size: var(--font-size-12);
  line-height: 12px;
  /* identical to box height */

  color: #7b61ff;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
}

:deep(.fa-address-card) {
  width: 18px;
  height: 12px;

  font-family: "Font Awesome 6 Pro";
  font-style: normal;
  font-weight: 900;
  font-size: var(--font-size-12);
  line-height: 12px;
  /* identical to box height */

  /* Flowkit/Red */
  color: #fc5555;

  /* Inside auto layout */
  flex: none;
  order: 0;
  flex-grow: 0;
}

:deep(.b-icon) {
  display: none;
}

#taxGrid {
  :deep(.b-grid-row) {
    [data-column-id="current"] {
      .b-tree-cell-inner {
        padding-left: 0px !important;
      }
    }

    [data-column-id="ytd"] {
      .b-tree-cell-inner {
        padding-left: 0px !important;
      }
    }
  }
}

:deep(.b-grid-row) {

  [data-column="hours"],
  [data-column="payRate"],
  [data-column="earnings"],
  [data-column="currentVal"],
  [data-column="ytdVal"],
  [data-column="amount"],
  [data-column="ytdHours"],
  [data-column="ytdAmount"] {
    justify-content: end;
  }
}

.back-icon {
  font-size: 40px;
  color: #1abc9c;
  cursor: pointer;
}

.payroll-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

#net-pay {
  margin-top: -15px;
  padding-bottom: 0px !important;

  .rounded {
    border: 1px solid #e1e4e8;
  }
}

@media print {
  @page {
    margin: 0;
  }

  :deep(.hq-pg__header) {
    display: none;
  }

  .ps-font-12 {
    font-size: var(--font-size-12);
  }
}

:deep(.text-align-right) {
  text-align: right;
}

:deep(.highlight) {
  background: #fafafa;
  font-weight: bold;
  text-transform: capitalize;
}

:deep(#wrapper) {
  font-size: 12px;
}

.dashboard-card__header {
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  text-transform: capitalize;
  color: #15181c;
  margin: 0;
}

:deep(.hq-pg__title .custom-hq-pg__title) {
  font-style: normal;
  font-weight: 700;
  line-height: 150%;
  text-transform: capitalize;
  color: #15181c;
  margin: 0;
  font-size: 12px;


  svg {
    font-size: 20px;
    padding-right: 7px;
  }
}

#wrapper {
  height: 88vh;
  overflow-y: auto;
}

@media print and (max-width: 991px) {
  .print-responsive {
    flex: 0 0 auto !important;
    width: 33.33333333% !important;
  }

  #wrapper {
    height: 99vh;
    overflow-y: auto;
  }

}

.hq-pg__title {
  text-transform: capitalize;
  margin-bottom: 0;
  margin-right: 10px;
  font-size: 12px;
  font-weight: 900;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:deep(.b-widget) {
  min-height: auto !important;
}

hr {
  border: 1px solid #e1e4e8;
}

:deep(.b-tree-parent-row) {
  .b-tree-cell-inner {
    padding-left: 0px !important;
  }
}
</style>
