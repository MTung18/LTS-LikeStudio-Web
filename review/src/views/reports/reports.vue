<script setup lang="ts">
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { Grid, Store } from "@bryntum/grid";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { getLocalAppsettings } from '@/helper/hqSuite/appSettingsHelper'
import { computed, reactive, ref, Ref } from "vue";
import reportSidebar from "@/components/viewComponents/reports/reportsSidebar.vue";
import { useReportsStore } from "@/stores/reportsStore";
import { ReportTypeGuid } from '@/enums/ReportType';
import { useRouter } from "vue-router";
import { storeToRefs } from 'pinia';
import {
  IReportGet,
  IData
} from "@/models/report/Report";
import { useLoadingStore } from "@/stores/loadingStore";

const router = useRouter();

const reportStore = useReportsStore();
const { setLoading } = useLoadingStore();
const { reportsCriteriaStore } = storeToRefs(reportStore);

const defaultSorter = {
  field: "title",
  ascending: true,
};

const stimulsoftApiUrl = computed(() => getLocalAppsettings().ClientSide.StimulsoftApiUrl + '/viewer') 

function includeStimulsoftLib(): void {
  if (!window.hasOwnProperty('Stimulsoft')) {
    const stiScript: HTMLScriptElement = document.createElement('script');
    stiScript.setAttribute('src', stimulsoftApiUrl.value);
    stiScript.setAttribute('type', 'text/javascript');
    document.body.appendChild(stiScript);
  }
}

includeStimulsoftLib()

const data = reactive<IData>({
  isOpen: false,
  type: ReportTypeGuid.PendingAndApprovedTimeOff,
  title: "",
});

const filterCount = ref(0);
const nonFilteredProps = ["id"];
const gridLocalStorageKey = ref(new Array<any>());
const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey.value}SearchText`) ?? ""
);

function filterBryntumStore() {
  filterStoreDataBySearchText(
    gridLocalStorageKey.value,
    nonFilteredProps,
    searchText.value,
    gridStore.value
  );
}

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
    onFilter: () => {
      if (
        searchText.value &&
        gridStore.value.filters.count < filterCount.value
      ) {
        filterBryntumStore();
      }
      filterCount.value = gridStore.value.filters.count;
    },
    data: [
      {
        id: 1,
        title: "Pending and Approved Time Off Report",
        type: ReportTypeGuid.PendingAndApprovedTimeOff,
      },
      {
        id: 2,
        title: "Time Off Balance Report",
        type: ReportTypeGuid.TimeOffBalance,
      },
      {
        id: 3,
        title: "Employee Contact Information",
        type: ReportTypeGuid.EmployeeContactInformation,
      },
      {
        id: 4,
        title: "W-2 Electronic Consent Report",
        type: ReportTypeGuid.W2ElectronicConsent,
      },
    ],
  })
);

const reportLocalStorageKey = "reportList";
const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(reportLocalStorageKey),
  ...getStatefulSortFeature(reportLocalStorageKey, defaultSorter),
  minHeight: "80vh",
  emptyText: "",
  rowHeight: 50,
  features: {
    search: true,
  },
  columns: [
    {
      flex: 8,
      text: "Name",
      id: "title",
      field: "title",
      htmlEncode: false,
      cellCls: 'ps-4',
      cls: 'ps-4',
    },
    {
      flex: 2,
      text: "Actions",
      type: "action",
      htmlEncode: false,
      cellCls: "b-action-cell--hover",
      actions: [
        {
          renderer: () => `
          <i class="b-action-item b-fa b-fa-external-link btn btn-link text-success no-underline"><span>View</span></i>`,
          onClick: async ({ record }) => {
            setLoading(true);
            data.type = record.data.type;
            reportsCriteriaStore.value = {} as IReportGet;
            await reportStore.fetchReportCriteriaStore(data.type);
            setLoading(false);
            data.isOpen = true;
          },
        },
      ],
    },
  ],
});

const grid: Ref<Grid> = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);

function hideFilterBar() {
  gridStore.value.clearFilters();
  gridFeatures.value.filterBar.hideFilterBar();
}

// #region BryntumSearchBar
function saveGridSettings() {
  localStorage.setItem(
    `${reportLocalStorageKey}State`,
    JSON.stringify((gridStore.value as any).state)
  );

  localStorage.setItem(`${reportLocalStorageKey}SearchText`, searchText.value);
}

function clearGridSettings() {
  gridStore.value.clearFilters();
  gridStore.value.clearSorters();
  localStorage.removeItem(`${reportLocalStorageKey}State`);
  localStorage.removeItem(`${reportLocalStorageKey}SearchText`);
}

function generateReport(dataReceive) {
  localStorage.setItem('report', JSON.stringify(dataReceive))

  router.push({
    name: 'reportGenerate', params: {
      guid: data.type
    }
  })
}

</script>
<template>
  <div class="hq-pg list">
    <bryntum-search-bar title="Report List" :show-settings-button="true" :show-filter-button="true"
      :local-storage-key="reportLocalStorageKey" @save-settings="saveGridSettings()" @clear-settings="clearGridSettings()"
      @hide-filter-bar="hideFilterBar()" @show-filter-bar="gridFeatures.filterBar.showFilterBar()">
    </bryntum-search-bar>
      <div class="action-grid list__table list__table--onpage list__b-grid--hover">
        <BryntumGrid v-bind="gridConfig" :store="gridStore" ref="grid"></BryntumGrid>
      </div>
  </div>
  <reportSidebar :isOpen="data.isOpen" @close="data.isOpen = false" :typeReport="data.type" @save="generateReport" />
</template>

