<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, ref, watch, computed, reactive, ComputedRef } from "vue";
import type { Ref } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useRoute } from "vue-router";
import { faPhone, faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { faPlus } from "@fortawesome/pro-solid-svg-icons";
import { useEmployeeContactStore } from "@/stores/onboardingEmployeeContactStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { FormatPhoneNumberUs } from "@/utilities/formatUtils";
import { Grid, Popup, Store } from "@bryntum/grid";
import { useLoadingStore } from "@/stores/loadingStore";
import { useBreakpoints } from "@/composables/useBreakpoints";

library.add(faPhone, faPlus, faEye, faEyeSlash);

const { fetchEmployeeContactList, fetchEmployeeContactSsnById } = useEmployeeContactStore();
const { employeeContactList, employeeContactSSNById } = storeToRefs(useEmployeeContactStore());

const { responsive } = useBreakpoints();
const breakpoint = computed(() => responsive.breakpoint);
const employeeId: ComputedRef<string> = computed(() => useRoute().params?.id?.toString());
const gridLocalStorageKey = "employeeListGrid";

const defaultSorter = {};
const tableKey = ref(0);
const grid: Ref<Grid> = ref(null);

const handleIconBeneficiary = async (id) => {
  const itemSelect: any = gridStoreBeneficiary.value.data.find((item: any) => item.id == id)
  if (itemSelect.isCallApiSsn) {
    gridStoreBeneficiary.value.data = gridStoreBeneficiary.value.data.map((e: any) => ({
      ...e,
      isShowSsn: e.id == id ? !e.isShowSsn : e.isShowSsn
    }))
    return
  }
  await fetchEmployeeContactSsnById(id)
  gridStoreBeneficiary.value.data = gridStoreBeneficiary.value.data.map((e: any) => ({
    ...e,
    socialSecurityNumber: e.id == id ? employeeContactSSNById : e.socialSecurityNumber,
    isShowSsn: e.id == id ? !e.isShowSsn : e.isShowSsn,
    isCallApiSsn: e.id == id ? true : e.isCallApiSsn,
  }))
};
const handleIconDependent = async (id) => {
  const itemSelect: any = gridStoreDependent.value.data.find((item: any) => item.id == id)
  if (itemSelect.isCallApiSsn) {
    gridStoreDependent.value.data = gridStoreDependent.value.data.map((e: any) => ({
      ...e,
      isShowSsn: e.id == id ? !e.isShowSsn : e.isShowSsn
    }))
    return
  }
  await fetchEmployeeContactSsnById(id)
  gridStoreDependent.value.data = gridStoreDependent.value.data.map((e: any) => ({
    ...e,
    socialSecurityNumber: e.id == id ? employeeContactSSNById : e.socialSecurityNumber,
    isShowSsn: e.id == id ? !e.isShowSsn : e.isShowSsn,
    isCallApiSsn: e.id == id ? true : e.isCallApiSsn,
  }))
};

const gridConfig = reactive({
  beneficiary: {
    ...fsBryntumGridConfig.gridConfig,
    ...getStatefulFilterFeature(gridLocalStorageKey),
    ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
    autoHeight: true,
    responsiveLevels: {
      small: 400,
      medium: 800,
      large: "*",
    },
    emptyText: "No Beneficiary.",
    subGridConfigs: {
      left: {
        flex: "1",
      },
      right: {
        width: 120,
      },
    },
    columns: [
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "Contact Person",
        field: "contactPerson",
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "Relationship",
        field: "relation",
        groupable: false,
        htmlEncode: false,
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "gender",
        field: "gender",
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "socialSecurityNumber",
        field: "socialSecurityNumber",
        class: "socialSecurityNumber",
        type: "action",
        htmlEncode: false,
        actions: [
          {
            renderer: ({ record }) =>
              record.data.isShowSsn
                ? `<span class="cursor-pointer visible">${record.data.socialSecurityNumber}</span> <div class="b-action-item b-fa b-fa-eye btn-eye btn-link socialSecurityNumberBtn"></div>`
                : `<span class="cursor-pointer visible">XXX-XX-XXXX</span> <div class="b-action-item b-fa b-fa-eye-slash btn-eye-slash socialSecurityNumberBtn btn-link"></div>`,
            onClick: ({ record }) => handleIconBeneficiary(record.data.id),
          },
        ],
      },
    ],
  },
  dependent: {
    ...fsBryntumGridConfig.gridConfig,
    ...getStatefulFilterFeature(gridLocalStorageKey),
    ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
    autoHeight: true,
    responsiveLevels: {
      small: 400,
      medium: 800,
      large: "*",
    },
    emptyText: "No Dependent.",
    subGridConfigs: {
      left: {
        flex: "1",
      },
      right: {
        width: 120,
      },
    },
    columns: [
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "Contact Person",
        field: "contactPerson",
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "Relationship",
        field: "relation",
        groupable: false,
        htmlEncode: false,
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "gender",
        field: "gender",
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "socialSecurityNumber",
        field: "socialSecurityNumber",
        class: "socialSecurityNumber",
        type: "action",
        htmlEncode: false,
        actions: [
          {
            renderer: ({ record }) =>
              record.data.isShowSsn
                ? `<span class="cursor-pointer visible">${record.data.socialSecurityNumber}</span> <div class="b-action-item b-fa b-fa-eye btn-eye btn-link socialSecurityNumberBtn"></div>`
                : `<span class="cursor-pointer visible">XXX-XX-XXXX</span> <div class="b-action-item b-fa b-fa-eye-slash btn-eye-slash socialSecurityNumberBtn btn-link"></div>`,
            onClick: ({ record }) => handleIconDependent(record.data.id),
          },
        ],
      },
    ],
  },
  contactPerson: {
    ...fsBryntumGridConfig.gridConfig,
    ...getStatefulFilterFeature(gridLocalStorageKey),
    ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
    autoHeight: true,
    responsiveLevels: {
      small: 400,
      medium: 800,
      large: "*",
    },
    emptyText: "No Emergency Contacts.",
    subGridConfigs: {
      left: {
        flex: "1",
      },
      right: {
        width: 120,
      },
    },
    columns: [
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "Contact Person",
        field: "contactPerson",
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "Relationship",
        field: "relation",
        groupable: false,
        htmlEncode: false,
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "Mobile",
        field: "phoneNumber",
        filterable({ value, record }) {
          if (
            record.data.phoneNumber
              .trim()
              .toLowerCase()
              .includes(value.trim().toLowerCase())
          ) {
            return record;
          }
          return false;
        },
      },
      {
        flex: 1,
        autoWidth: false,
        region: false,
        text: "email",
        field: "emailAddress",
      },
    ],
  },
});

const gridStoreEmergencyContacts: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  })
);

const gridStoreBeneficiary: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  })
);

const gridStoreDependent: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
  })
);

const { setLoading } = useLoadingStore();

function filterByType(list: any[], type: string) {
  if (list) {
    return list.filter((item) => item[type]);
  }
}

async function fetchEmployeeContact() {
  try {
    await fetchEmployeeContactList(Number(employeeId.value));
    const dataEmployeeEmergencyContactsList = filterByType(
      employeeContactList.value,
      "isEmergencyContact"
    );
    const dataEmployeeBeneficiaryList = filterByType(
      employeeContactList.value,
      "isBeneficiary"
    );
    const dataEmployeeDependentList = filterByType(
      employeeContactList.value,
      "isDependent"
    );

    if (employeeContactList.value !== undefined) {
      const formattedEmployeeEmergencyContactsList =
        dataEmployeeEmergencyContactsList.map((item: any) => ({
          ...item,
          phoneNumber: item.phoneNumber
            ? FormatPhoneNumberUs(item.phoneNumber)
            : "",
        }));
    }

    return {
      dataEmployeeEmergencyContactsList,
      dataEmployeeBeneficiaryList,
      dataEmployeeDependentList,
    };
  } catch (error) {
    console.error(error);
  }
}

onMounted(async () => {
  setLoading(true);
  const {
    dataEmployeeEmergencyContactsList,
    dataEmployeeBeneficiaryList,
    dataEmployeeDependentList,
  } = await fetchEmployeeContact();
  gridStoreEmergencyContacts.value.data = dataEmployeeEmergencyContactsList;
  gridStoreBeneficiary.value.data = dataEmployeeBeneficiaryList.map(e => ({
    ...e,
    isCallApiSsn: false,
    isShowSsn: false,
  }));
  gridStoreDependent.value.data = dataEmployeeDependentList.map(e => ({
    ...e,
    isCallApiSsn: false,
    isShowSsn: false,
  }));

  gridConfig.contactPerson.columns[
    gridConfig.contactPerson.columns.length - 1
  ].region = false;

  gridConfig.beneficiary.columns[
    gridConfig.beneficiary.columns.length - 1
  ].region = false;

  gridConfig.dependent.columns[gridConfig.dependent.columns.length - 1].region =
    false;
  tableKey.value++;
  setLoading(false);
});

watch(breakpoint, () => {
  const breakpointValue = breakpoint.value;

  if (breakpointValue === "sm") {
    gridConfig.contactPerson.columns.forEach((col) => {
      col.autoWidth = true;
    });
    gridConfig.beneficiary.columns.forEach((col) => {
      col.autoWidth = true;
    });
    gridConfig.dependent.columns.forEach((col) => {
      col.autoWidth = true;
    });
  } else {
    gridConfig.contactPerson.columns.forEach((col) => {
      col.autoWidth = false;
      col.region = false;
    });
    gridConfig.beneficiary.columns.forEach((col) => {
      col.autoWidth = false;
      col.region = false;
    });
    gridConfig.dependent.columns.forEach((col) => {
      col.autoWidth = false;
      col.region = false;
    });
  }

  tableKey.value++;
});
</script>

<template>
  <div>
    <fs-card class="dashboard-card my-0 mx-2 mb-3" no-body>
      <fs-card-body class="dashboard-card__content" id="onboarding__emergencyContacts">
        <bryntum-search-bar icon="phone" title="Emergency Contacts" :local-storage-key="gridLocalStorageKey"
          :show-icon="true" class="height48">
        </bryntum-search-bar>
        <div class="list__table">
          <bryntum-grid v-bind="gridConfig.contactPerson" :store="gridStoreEmergencyContacts" ref="grid"
            :key="tableKey" />
        </div>
      </fs-card-body>
    </fs-card>
    <fs-card class="dashboard-card my-0 mx-2 mb-3" no-body>
      <fs-card-body class="dashboard-card__content" id="onboarding__beneficiary">
        <bryntum-search-bar icon="badge-dollar" title="Beneficiary" :local-storage-key="gridLocalStorageKey"
          :show-icon="true" class="height48">
        </bryntum-search-bar>
        <div class="list__table">
          <bryntum-grid v-bind="gridConfig.beneficiary" :store="gridStoreBeneficiary" ref="grid" :key="tableKey" />
        </div>
      </fs-card-body>
    </fs-card>
    <fs-card class="dashboard-card my-0 mx-2 mb-3" no-body>
      <fs-card-body class="dashboard-card__content" id="onboarding__dependent">
        <bryntum-search-bar icon="family-pants" title="Dependent" :local-storage-key="gridLocalStorageKey"
          :show-icon="true" class="height48">
        </bryntum-search-bar>
        <div class="list__table">
          <bryntum-grid v-bind="gridConfig.dependent" :store="gridStoreDependent" ref="grid" :key="tableKey" />
        </div>
      </fs-card-body>
    </fs-card>
  </div>
</template>

<style scoped lang="scss">
#onboarding__emergencyContacts,
#onboarding__beneficiary,
#onboarding__dependent {
  min-height: 183px;
}

.height48 {
  :deep(.hq-pg__header) {
    height: 48px;
    min-height: 48px;
  }
}

:deep(.b-grid-subgrid[data-region="locked"]) {
  box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
  -webkit-box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
  -moz-box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
}

:deep(.b-grid-headers) {
  align-items: start;
}
</style>
