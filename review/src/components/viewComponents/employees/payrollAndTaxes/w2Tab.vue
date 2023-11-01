<script lang="ts" setup>
import { ref, onMounted, watch, toRefs } from "vue";
import { faCircleCheck, faCircleXmark } from "@fortawesome/pro-solid-svg-icons";
import { faFileLines } from "@fortawesome/pro-light-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { Store } from "@bryntum/grid";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { W2Form } from "@/models/w2/W2Form";
import { useW2FormStore } from "@/stores/w2FormStore";
import { storeToRefs } from "pinia";
import { useRoute } from "vue-router";
import { formatTime } from "@/utilities/formatUtils";
import { useBreakpoints } from "../../../../composables/useBreakpoints";
import w2W4 from '@/assets/images/W2-W4.svg';
import { filterBlank } from '@/utilities/filterBlankValue';

const { responsive } = useBreakpoints();

library.add(faCircleCheck, faCircleXmark, faFileLines);

const props = defineProps(["employeeDetails"]);

const { employeeDetails } = toRefs(props);

const getYear = (time: string) => {
  return time?.split("-")[0];
};

const START_YEAR = Number(getYear(employeeDetails.value?.hireDate));
const CURRENT_YEAR = new Date().getFullYear();

const route = useRoute();

const filteredW2FormList = ref(new Array<W2Form>());
const w2Consent = ref(false);

const { fetchW2FormList, getW2ConsentStatus, downloadW2Form } = useW2FormStore();
const { w2FormList, isW2Consent } = storeToRefs(useW2FormStore());

const getListOfYears = () => {
  let totalYears = 0;
  let startYear = 0;
  if (!START_YEAR || isNaN(START_YEAR)) {
    totalYears = 0;
  } else {
    totalYears = CURRENT_YEAR - START_YEAR + 1;
    startYear = START_YEAR;
  }
  return Array(totalYears)
    .fill(startYear)
    .map((n, i) => n + i);
};

const selectedYear = ref(CURRENT_YEAR);

const { id: employeeId } = route.params;

const gridLocalStorageKey = "w2ListGrid";

const defaultSorter = {
  field: "issueDate",
  ascending: true,
};

const handleDownloadW2Form = (formType: W2Form) => {
  downloadW2Form(+employeeId, selectedYear.value, formType.type, formType.viewFormName);
}

const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  minHeight: "46em",
  emptyText: "",
  columns: [
    {
      flex: 1,
      text: "Issue Date",
      id: "issueDate",
      field: "issueDate",
      groupable: false,
      sortable: true,
      htmlEncode: false,
      cellCls: 'ps-4',
      cls: 'ps-4',
      renderer: ({ record }) => {
        return `<span>${filterBlank(formatTime(record.data.issueDate))}</span>`;
      },
    },
    {
      flex: 1,
      text: "View Form",
      id: "action",
      type: "action",
      field: "action",
      groupable: false,
      sortable: false,
      htmlEncode: false,
      actions: [
        {
          visible: true,
          renderer: ({ record }) => {
            return `<a class="b-action-item text-success">${record.data.viewFormName}</a>`
          },
          onClick: ({ record }) => {
            handleDownloadW2Form(record.data);
          }
        }
      ]
    },
  ],
});

watch(isW2Consent, newValue => {
  w2Consent.value = newValue.receive;
});

const refreshW2FormList = async (year: number) => {
  await fetchW2FormList(employeeId as string, year);

  if (w2FormList.value) {
    filteredW2FormList.value = w2FormList.value;
    gridConfig.value.emptyText = "";
  } else {
    filteredW2FormList.value = [];
    gridConfig.value.emptyText = "There is no data for this year";
  }
  await populateBryntumStore();
};

async function populateBryntumStore() {
  if (Array.isArray(filteredW2FormList.value)) {
    gridStore.value.data = filteredW2FormList.value;
  } else {
    gridStore.value.data = [filteredW2FormList.value];
  }
  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

const gridStore = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  }),
);

onMounted(async () => {
  await refreshW2FormList(selectedYear.value);
  await getW2ConsentStatus(employeeId as string);
});

watch(selectedYear, async newSelectedYear => {
  await refreshW2FormList(newSelectedYear);
});
</script>

<template>
  <div class="hq-pg__grid">
    <div>
      <fs-container fluid class="contain hq-pg__header">
        <fs-row align-v="center" v-if="w2Consent">
          <fs-col cols="auto">
            <span class="title">W-2 Forms</span>
          </fs-col>
          <fs-col cols="auto">
            <fs-form-select v-model="selectedYear" :options="getListOfYears()"></fs-form-select>
          </fs-col>
          <fs-col>
            <span class="d-flex justify-content-end px-4">
              <fs-button target="_blank" href="https://www.irs.gov/instructions/iw2w3" variant="outline-success">
                <font-awesome-icon :icon="['fal', 'file-lines']"/>
                <span class="ms-0" v-if="responsive.breakpoint !== 'sm'">FILING INSTRUCTION</span>
              </fs-button>
            </span>
          </fs-col>
        </fs-row>
      </fs-container>
      <fs-container v-if="w2Consent" class="contain py-2">
        <fs-alert variant="success" show class="mb-0">
          <font-awesome-icon icon="fa-solid fa-circle-check" />
          This employee consents to receive his/her W-2 Form electronically.
        </fs-alert>
      </fs-container>
    </div>

    <div v-if="w2Consent" class="action-grid list__table list__b-grid--hover">
      <BryntumGrid v-bind="gridConfig" :store="gridStore" />
    </div>
    <div v-else class="d-flex justify-content-center align-items-center flex-column vh-60">
      <div class="fw-bold f-size-18">This employee does not consent to receive their W-2 electronically.</div>
      <div><fs-img :src="w2W4" :height="140" /></div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-style: normal;
  font-weight: 700;
  font-size: 18px;
}

:deep(.b-grid-body-container.b-widget-scroller.b-resize-monitored) {
  min-height: 46px;
}

.vh-60 {
  height: 75vh;
}

.f-size-18 {
  font-size: 18px;
}

:deep(.b-action-item) {
  font-size: 14px;
  text-decoration: underline !important;
}
</style>
