<script setup lang="ts">
import { storeToRefs } from "pinia";
import { onMounted, ref, watch, computed, reactive, ComputedRef } from "vue";
import type { Ref } from "vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import { useRoute } from "vue-router";
import { faPhone, faEye, faEyeSlash, faCirclePlus } from "@fortawesome/pro-light-svg-icons";
import { useEmployeeContactStore } from "@/stores/onboardingEmployeeContactStore";
import { useOnboardingStore } from "@/stores/onboardingStore";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { FormatPhoneNumberUs } from "@/utilities/formatUtils";
import { Grid, Store } from "@bryntum/grid";
import { useLoadingStore } from "@/stores/loadingStore";
import { useBreakpoints } from "@/composables/useBreakpoints";
import DarkThemeModal from "@/components/viewComponents/onboarding/onboardingDirectDeposit/darkThemeModal.vue";
import { EmployeeStatusEnum } from "@/enums/EmployeeStatusEnum";
import { useAlerts } from "@/composables/useAlerts";
import router from "@/router";

library.add(faPhone, faCirclePlus, faEye, faEyeSlash);
const { notifySuccess } = useAlerts();
const { fetchEmployeeContactList, deleteEmployeeContactById, fetchEmployeeStatusId, fetchEmployeeSubmitStatusId, fetchEmployeeContactSsnById } =
  useEmployeeContactStore();
const { employeeContactList, employeeStatusId, employeeSubmitStatusId, employeeContactSSNById } = storeToRefs(useEmployeeContactStore());

const employeeStatus: Ref<number> = ref(0);
const employeeSubmitStatus: Ref<boolean> = ref();
const { responsive } = useBreakpoints();
const employeeId = computed(() => useRoute().params?.id?.toString());
const openDeleteConfirmModal = ref(false);
const deleteContact = ref(null);

onMounted(async () => {
  setLoading(true);
  try {
    await fetchEmployeeStatusId(employeeId.value);
    employeeStatus.value = employeeStatusId.value;
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
  }
});

const gridLocalStorageKey = "employeeListGrid";
const defaultSorter = {};
const tableKey = ref(0);
const tableKey1 = ref(0);
const tableKey2 = ref(0);
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
      {
        flex: 1,
        autoWidth: false,
        region: "right",
        locked: false,
        text: "Actions",
        type: "action",
        htmlEncode: false,
        responsiveLevels: {
          small: { flex: 1 },
        },
        actions: [
          {
            renderer: () =>
              employeeStatus.value === EmployeeStatusEnum.QuickHire || employeeSubmitStatus.value === true ?
                `<div class="b-action-item b-fa b-fa-edit btn-onboardingEdit updateContactBtn btn-link"></div>` : ``,
            onClick: ({ record }) => updateEmpContact(record),
          },
          {
            visible: true,
            renderer: () =>
              employeeStatus.value === EmployeeStatusEnum.QuickHire || employeeSubmitStatus.value === true ?
                `<div class="b-action-item b-fa b-fa-trash-alt btn-delete deleteContactBtn"></div>` : ``,
            onClick: ({ record }) => {
              deleteContact.value = record;
              openDeleteConfirmModal.value = true;
            },
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
      {
        flex: 1,
        autoWidth: false,
        region: "right",
        locked: false,
        text: "Actions",
        type: "action",
        htmlEncode: false,
        responsiveLevels: {
          small: { flex: 1 },
        },
        actions: [
          {
            visible: true,
            renderer: () =>
              employeeStatus.value === EmployeeStatusEnum.QuickHire || employeeSubmitStatus.value === true ?
                `<div class="b-action-item b-fa b-fa-edit btn-onboardingEdit updateContactBtn btn-link"></div>` : ``,
            onClick: ({ record }) => updateEmpContact(record),
          },
          {
            visible: true,
            renderer: () =>
              employeeStatus.value === EmployeeStatusEnum.QuickHire || employeeSubmitStatus.value === true ?
                `<div class="b-action-item b-fa b-fa-trash-alt btn-delete deleteContactBtn"></div>` : ``,

            onClick: ({ record }) => {
              deleteContact.value = record;
              openDeleteConfirmModal.value = true;
            },
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
      {
        flex: 1,
        autoWidth: false,
        region: "right",
        locked: false,
        text: "Actions",
        type: "action",
        htmlEncode: false,
        responsiveLevels: {
          small: { flex: 1 },
        },
        actions: [
          {
            visible: true,
            renderer: () =>
              employeeStatus.value === EmployeeStatusEnum.QuickHire || employeeSubmitStatus.value === true ?
                `<div class="b-action-item b-fa b-fa-edit btn-onboardingEdit updateContactBtn btn-link"></div>` : ``,
            onClick: ({ record }) => updateEmpContact(record),
          },
          {
            visible: true,
            renderer: () =>
              employeeStatus.value === EmployeeStatusEnum.QuickHire || employeeSubmitStatus.value === true ?
                `<div class="b-action-item b-fa b-fa-trash-alt btn-delete deleteContactBtn"></div>` : ``,
            onClick: ({ record }) => {
              deleteContact.value = record;
              openDeleteConfirmModal.value = true;
            },
          },
        ],
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
  setLoading(true);
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

  setLoading(false);

  return {
    dataEmployeeEmergencyContactsList,
    dataEmployeeBeneficiaryList,
    dataEmployeeDependentList,
  };
}

onMounted(async () => {
  setLoading(true);
  try {
    const {
      dataEmployeeEmergencyContactsList,
      dataEmployeeBeneficiaryList,
      dataEmployeeDependentList,
    } = await fetchEmployeeContact();

    await fetchEmployeeSubmitStatusId(employeeId.value);
    employeeSubmitStatus.value = employeeSubmitStatusId.value;

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

  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
  }

  gridConfig.contactPerson.columns[
    gridConfig.contactPerson.columns.length - 1
  ].region = false;

  gridConfig.beneficiary.columns[
    gridConfig.beneficiary.columns.length - 1
  ].region = false;

  gridConfig.dependent.columns[gridConfig.dependent.columns.length - 1].region =
    false;
  tableKey.value++;
  tableKey1.value++;
  tableKey2.value++;
});

const updateEmpContact = async (record: any) => {
  router.push({ name: "onboardingContactUpdate", params: { contactId: record.id } });
};
const breakpoint = computed(() => responsive.breakpoint);

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
  } else if (breakpointValue === "md") {
    gridConfig.contactPerson.columns[3].region = "right";
    gridConfig.beneficiary.columns[3].region = "right";
    gridConfig.dependent.columns[3].region = "right";
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
  tableKey1.value++;
  tableKey2.value++;
});
const { onboardingSideNavItem } = storeToRefs(useOnboardingStore());
const onboardingNavStore = useOnboardingStore();
const currentNavItem = ref(null)

const handleCheckSideBar = async (emergencyContact: boolean) => {
  if (onboardingSideNavItem.value.length == 0) {
    await onboardingNavStore.getOnboardingSideNavItems(Number(employeeId.value));
  }
  currentNavItem.value = onboardingSideNavItem.value.find(item => item.progressSidebarUrl.trim().toLowerCase() === 'onboardingContacts'.trim().toLocaleLowerCase());
  await onboardingNavStore.markOnboardingSidenavItemAsDone(currentNavItem.value.progressSidebarId, emergencyContact, Number(employeeId.value));
}

const onDelete = async () => {
  setLoading(true);
  try {
    await deleteEmployeeContactById(deleteContact.value.id);
    gridStoreDependent.value.remove(deleteContact.value);
    gridStoreBeneficiary.value.remove(deleteContact.value);
    gridStoreEmergencyContacts.value.remove(deleteContact.value);

    const {
      dataEmployeeEmergencyContactsList
    } = await fetchEmployeeContact();
    openDeleteConfirmModal.value = false;
    const emergencyContactIsDone = !!(dataEmployeeEmergencyContactsList && dataEmployeeEmergencyContactsList.length);
    await handleCheckSideBar(emergencyContactIsDone);
    deleteContact.value = null;
  } catch (error) {
    console.error(error)
  } finally {
    setLoading(false);
    notifySuccess(`Contact deleted.`);
  }
};

</script>

<template>
  <dark-theme-modal :showModal="openDeleteConfirmModal" title="Delete Contact" okText="delete" okTextVariant="danger"
    cancelText="cancel" cancelBtnVariant="light" @close="openDeleteConfirmModal = false" @ok="onDelete">
    <template #content>
      <span class="d-flex">
        <font-awesome-icon :class="['me-2', 'text-danger']" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
        <div>
          Do you really want to delete this contact?
          <br />
          This process cannot be undone.
        </div>
      </span>
    </template>
  </dark-theme-modal>
    <fs-container fluid class="hq-pg__header hq-pg__header--sticky hq-pg__header--sticky-sub contain" :class="{'hq-pg__header--sticky-sub-sub' : responsive.mobile}">
      <fs-row align-v="center">
        <fs-col class="text-truncate"> 
          <h2 class="hq-pg__title">Contact</h2>
          <p class="onboardingContactSubTitle mb-0 text-truncate">
            You need at least one emergency contact to complete the contact section.
          </p>
        </fs-col>
        <fs-col cols="auto" class="d-flex align-items-center">
          <fs-button class="btn bg-primary text-white border-primary" :to="{ name: 'onboardingDirectDeposit' }">
            NEXT</fs-button>
        </fs-col>        
      </fs-row>

    </fs-container>

    <div class="p-4" style="background-color: #EFF1F3;">
      <fs-card class="dashboard-card mb-3" no-body style="height: auto !important;">
        <fs-card-body class="dashboard-card__content" id="onboarding__emergencyContacts">
          <bryntum-search-bar icon="phone" title="Emergency Contacts" :local-storage-key="gridLocalStorageKey"
            :show-icon="true">
            <template #buttons>
              <fs-link variant="link" :to="{ name: 'onboardingContactAdd' }" class="text-decoration-none"
                v-if="employeeStatus === EmployeeStatusEnum.QuickHire || employeeSubmitStatus === true">
                <font-awesome-icon :icon="['fal', 'circle-plus']" /> ADD</fs-link>
            </template>
          </bryntum-search-bar>
          <div class="list__table">
            <bryntum-grid v-bind="gridConfig.contactPerson" :store="gridStoreEmergencyContacts" ref="grid"
              :key="tableKey" />
          </div>
        </fs-card-body>
      </fs-card>
      <fs-card class="dashboard-card mb-3" no-body style="height: auto !important;">
        <fs-card-body class="dashboard-card__content" id="onboarding__beneficiary">
          <bryntum-search-bar icon="badge-dollar" title="Beneficiary" :local-storage-key="gridLocalStorageKey"
            :show-icon="true">
            <template #buttons>
              <fs-link variant="link" :to="{ name: 'onboardingContactAdd' }" class="text-decoration-none"
                v-if="employeeStatus === EmployeeStatusEnum.QuickHire || employeeSubmitStatus === true">
                <font-awesome-icon :icon="['fal', 'circle-plus']" /> ADD</fs-link>
            </template>
          </bryntum-search-bar>
          <div class="list__table">
            <bryntum-grid v-bind="gridConfig.beneficiary" :store="gridStoreBeneficiary" ref="grid" :key="tableKey1" />
          </div>
        </fs-card-body>
      </fs-card>
      <fs-card class="dashboard-card mb-3" no-body style="height: auto !important;">
        <fs-card-body class="dashboard-card__content" id="onboarding__dependent">
          <bryntum-search-bar icon="family-pants" title="Dependent" :local-storage-key="gridLocalStorageKey"
            :show-icon="true">
            <template #buttons>
              <fs-link variant="link" :to="{ name: 'onboardingContactAdd' }" class="text-decoration-none"
                v-if="employeeStatus === EmployeeStatusEnum.QuickHire || employeeSubmitStatus === true">
                <font-awesome-icon :icon="['fal', 'circle-plus']" /> ADD</fs-link>
            </template>
          </bryntum-search-bar>
          <div class="list__table">
            <bryntum-grid v-bind="gridConfig.dependent" :store="gridStoreDependent" ref="grid" :key="tableKey2" />
          </div>
        </fs-card-body>
      </fs-card>
    </div>
</template>
<style scoped lang="scss">
:deep(.b-grid-subgrid[data-region="locked"]) {
  box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
  -webkit-box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
  -moz-box-shadow: -2px 1px 10px 0px rgba(145, 141, 141, 0.35);
}

:deep(.b-grid-headers) {
  align-items: start;
}

.onboardingContact_formHeader {
  height: 80px;
  border-bottom: 1px solid #e1e4e8;
  position: sticky;
  top: 0;
  left: 0;
  background-color: #fff;
  z-index: 2;
  font-size: 16px;
}
</style>
