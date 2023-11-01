<script setup lang="ts">
import BryntumSearchBar from "@/components/shared/bryntumGrid/bryntumSearchBar.vue";
import DarkThemeModal from "@/components/shared/darkThemeModal.vue";
import ActionSidebar from "@/components/viewComponents/timeoff/actionSidebar.vue";
import RequestSidebar from "@/components/viewComponents/timeoff/requestSidebar.vue";
import { useAlerts } from "@/composables/useAlerts";
import { useBreakpoints } from "@/composables/useBreakpoints";
import { DURATION } from "@/constants/duration";
import {
  AlertEvent,
  AlertResourceType,
  AlertApplicationId
} from "@/enums/notifications/NotificationEnum";
import { RequestStatus } from "@/enums/timeoff/RequestStatus";
import { Request } from "@/models/timeoff/Request";
import { fsBryntumGridConfig } from "@/plugins/vue/bryntumGrid/defaults/gridConfigDefaults";
import { filterStoreDataBySearchText } from "@/plugins/vue/bryntumGrid/utils/filterStoreDataBySearchText";
import { getStatefulFilterFeature } from "@/plugins/vue/bryntumGrid/utils/statefulFilterFeature";
import { getStatefulSortFeature } from "@/plugins/vue/bryntumGrid/utils/statefulSortFeature";
import { useEmployeeStore } from "@/stores/employeeStore";
import { useNotificationStore } from "@/stores/notificationStore";
import { useTimeoffStore } from "@/stores/timeoffStore";
import { showDates } from "@/utilities/formatUtils";
import { Store } from "@bryntum/grid";
import { BryntumGrid } from "@bryntum/grid-vue-3";
import { library } from "@fortawesome/fontawesome-svg-core";
import { filterBlank } from '@/utilities/filterBlankValue';
import {
  faPenToSquare,
  faPlus,
  faTrashCan,
} from "@fortawesome/pro-light-svg-icons";
import {
  faAsterisk,
  faCheck,
  faExclamationCircle,
  faTimes,
} from "@fortawesome/pro-solid-svg-icons";
import { storeToRefs } from "pinia";
import type { Ref } from "vue";
import { computed, onMounted, ref, watch } from "vue";
import {
  INotificationObj
} from "@/models/notifications/Notification";

import { NOTIFICATION_MESSAGES } from '@/constants/notification';



const { fetchEmployeeList } = useEmployeeStore();
const { employeeList } = storeToRefs(useEmployeeStore());
const { responsive } = useBreakpoints();
const notificationStore = useNotificationStore();
const TIME = DURATION(3000);
library.add(
  faTimes,
  faPenToSquare,
  faTrashCan,
  faPlus,
  faExclamationCircle,
  faCheck,
  faAsterisk
);

const {
  fetchRequestList,
  approveRequest,
  rejectRequest,
  bulkApprove,
  bulkReject,
  cancelRequest,
  getListRequestedLeaveYears,
} = useTimeoffStore();
const { requestList } = storeToRefs(useTimeoffStore());
const { notifyError, notifySuccess } = useAlerts();

const showRequestSidebar = ref(false);
const showActionSidebar = ref(false);
const requestInfo = ref<Partial<Request>>(null);
const nonFilteredProps = ["id", "employeeId"];
const openRejectReasonModal = ref(false);
const openApproveConfirmModal = ref(false);
const openCancelConfirmModal = ref(false);
const rejectReason = ref<string>("");
const currentSelectedRows = ref<Partial<Request>[]>([]);
const currentStatusFilter = ref<string>(RequestStatus.PENDING);
const isEditingReason = ref(false);
const filterOptions = [
  { text: "Pending", value: RequestStatus.PENDING },
  { text: "Approved", value: RequestStatus.APPROVED },
  { text: "Rejected", value: RequestStatus.REJECTED },
];

const gridLocalStorageKey = "timeoffRequestListGrid";
const defaultSorter = {
  field: "id",
  ascending: false,
};

const grid = ref(null);
const gridFeatures = computed(
  () => (grid as any).value?.instance.value.features
);
const filterCount = ref(0);
const searchText = ref(
  localStorage.getItem(`${gridLocalStorageKey}SearchText`) ?? ""
);
const gridConfig = ref({
  ...fsBryntumGridConfig.gridConfig,
  ...getStatefulFilterFeature(gridLocalStorageKey),
  ...getStatefulSortFeature(gridLocalStorageKey, defaultSorter),
  minHeight: "100%",
  emptyText: "",
  selectionMode: {
    triggerEvent: "",
    row: false,
    checkboxOnly: true,
    flex: 1,
    minColumnWidth: 45,
    checkbox: true,
    showCheckAll: true,
  },
  features: {
    search: true,
    regionResize: false,
    columnPicker: {
      groupByRegion: true,
    },
  },
  columns: [
    {
      text: "Employee Name",
      field: "fullName",
      renderer: ({
        record
      }) => {
        return filterBlank(record.data.fullName)
      },
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      },
    },
    {
      text: "Dates",
      field: "dateFilter",
      htmlEncode: false,
      cellTooltip: true,
      renderer: ({
        record
      }) => {
        return filterBlank(record.data.dateFilter)
      },
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      },
    },
    {
      text: "Plan Type",
      field: "planTypeName",
      renderer: ({
        record
      }) => {
        return filterBlank(record.data.planTypeName)
      },
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
          autoWidth: false
        }
      }
    },
    {
      flex: 1,
      text: "Total Hours",
      field: "totalHours",
      renderer: ({ record }: { record: Partial<Request> }) => {
        return `${filterBlank(record.totalHours.toFixed(2))}`;
      },
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      }
    },
    {
      text: "Supervisor",
      field: "supervisorFullName",
      renderer: ({
        record
      }) => {
        return filterBlank(record.data.supervisorFullName)
      },
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      },
    },
    {
      locked: false,
      minWidth: 120,
      text: "Actions",
      type: "action",
      cellCls: "b-action-cell--hover",
      cls: "d-block",
      region: 'right',
      responsiveLevels: {
        small: {
          autoWidth: true,
        },
        large: {
          flex: 1,
        }
      },
      actions: [
        {
          renderer: () => {
            return responsive.breakpoint === "sm"
              ? `<div class="b-action-item b-fa b-fa-arrow-up-right-from-square btn-view cursor-pointer no-underline me-3 text-success visible">View</div>`
              : `<div class="b-action-item b-fa b-fa-arrow-up-right-from-square btn-view cursor-pointer no-underline me-3 text-success">View</div>`;
          },
          onClick: ({ record }: { record: Request }) => {
            requestInfo.value = record;
            currentSelectedRows.value = [record];
            showRequestSidebar.value = true;
          },
        },
        {
          renderer: () => {
            return responsive.breakpoint === "sm"
              ? `<div class="b-action-item b-fa b-fa-times-circle btn-view cursor-pointer no-underline text-danger visible">Cancel</div>`
              : `<div class="b-action-item b-fa b-fa-times-circle btn-view cursor-pointer no-underline text-danger">Cancel</div>`;
          },
          onClick: ({ record }: { record: Request }) => {
            requestInfo.value = record;
            openCancelConfirmModal.value = true;
          },
        },
      ],
    },
  ],
  listeners: {
    selectionChange: (data) => {
      if (isSelectionChangeInProgress) {
        return;
      }

      isSelectionChangeInProgress = true;

      if (currentStatusFilter.value === RequestStatus.PENDING) {
        if (Array.isArray(data.selection) && data.selection.length > 0) {
          showActionSidebar.value = true;
          currentSelectedRows.value = data.selection.map((item) => item.data);
        } else {
          currentSelectedRows.value = [];
          grid.value.instance.value.deselectAll();
          showActionSidebar.value = false;
        }
      }

      isSelectionChangeInProgress = false;
    },
  },
});
let isSelectionChangeInProgress = false;

const filteredRequestList = ref(new Array<Request>());

const gridStore: Ref<Store> = ref(
  new Store({
    ...fsBryntumGridConfig.gridStoreConfig,
    sorters: [defaultSorter],
    onFilter: () => {
      // Ensures that store is always set correctly based on search text
      if (
        searchText.value &&
        gridStore.value.filters.count < filterCount.value
      ) {
        if (searchText.value !== "") {
          filterBryntumStore();
        }
      }
      filterCount.value = gridStore.value.filters.count;
    },
  })
);

async function populateBryntumStore() {
  if (filteredRequestList.value) {
    gridStore.value.data = filteredRequestList.value;
  }

  const gridState = localStorage.getItem(`${gridLocalStorageKey}State`);
  if (gridState) {
    (gridStore.value as any).state = JSON.parse(gridState);
  }
}

function filterBryntumStore() {
  filterStoreDataBySearchText(
    filteredRequestList.value,
    nonFilteredProps,
    searchText.value,
    gridStore.value
  );
}

const handleApproveSingleRequest = async (payload?) => {
  const requestId = payload ? payload : currentSelectedRows.value[0].id;
  const selectedRow = currentSelectedRows.value.find((row) => row.id === requestId);
  await approveRequest({
    id: requestId,
    rejectReason: "",
  }).then(async (res) => {
    if (res.status !== 200) {
      const msg = res.errorMessage.split(":");
      notifyError(msg[1], TIME.MILLISECOND);
    } else if (res.status === 200) {
      notifySuccess("Request approved.");
      const messageToEmployees = NOTIFICATION_MESSAGES.EmployeeTimeOffRequestApproved.replace('[planType]', `[${selectedRow.planTypeName}]`).replace('[requestDate]', `[${showDates(selectedRow.requestDates)}]`)

      const notificationToEmployee: INotificationObj = {
        alertEventId: AlertEvent.Approved,
        alertResourceTypeId: AlertResourceType.TimeOffRequest,
        alertApplicationId: AlertApplicationId.Ess,
        messageType: 'create',
        messagePayload: messageToEmployees,
        resourceId: requestId,
        userRecipients: [mapEmployeeList.value[selectedRow.employeeId]]
      }
      await notificationStore.createNotification(notificationToEmployee)
    }
    await refreshRequestList();
  });
  refreshSelectRow();
};

const handleRejectSingleRequest = async (payload?) => {
  const requestId = payload ? payload : currentSelectedRows.value[0].id;
  const selectedRow = currentSelectedRows.value.find((row) => row.id === requestId);
  try {
    await rejectRequest({
      id: requestId,
      rejectReason: rejectReason.value,
    }).then(async (res) => {
      if (res.status === 200) {
        await refreshRequestList();
        notifySuccess("Request rejected.");
        const messageToEmployees = NOTIFICATION_MESSAGES.EmployeeTimeOffRequestRejected.replace('[planType]', `[${selectedRow.planTypeName}]`).replace('[requestDate]', `[${showDates(selectedRow.requestDates)}]`)
        const notificationToEmployee: INotificationObj = {
          alertEventId: AlertEvent.Approved,
          alertResourceTypeId: AlertResourceType.TimeOffRequest,
          alertApplicationId: AlertApplicationId.Ess,
          messageType: 'create',
          messagePayload: messageToEmployees,
          resourceId: requestId,
          userRecipients: [mapEmployeeList.value[selectedRow.employeeId]]
        }
        notificationStore.createNotification(notificationToEmployee)
      } else {
        const msg = res.errorMessage.split(":");
        notifyError(msg[1], TIME.MILLISECOND);
        await refreshRequestList();
      }
    });
  } catch (error) {
    throw new Error("failed to reject this request", error);
  } finally {
    refreshSelectRow();
  }
};


const handleApproveRequest = async () => {
  if (currentSelectedRows.value.length === 1) {
    await handleApproveSingleRequest();
  }
  if (currentSelectedRows.value.length > 1) {
    const approveRequests = currentSelectedRows.value.map((row) => ({
      id: row.id,
      rejectReason: "",
    }));
    await bulkApprove(approveRequests).then(async (res) => {
      if (res.status !== 200) {
        const msg = res.errorMessage.split(":");
        notifyError(msg[1], TIME.MILLISECOND);
      } else if (res.status === 200) {
        notifySuccess("Request approved.");
        const notificationToEmployee: INotificationObj = {
          alertEventId: AlertEvent.Approved,
          alertResourceTypeId: AlertResourceType.TimeOffRequest,
          alertApplicationId: AlertApplicationId.Ess,
          messageType: 'create',
        }
        for (const selectedRow of currentSelectedRows.value) {
          const messageToEmployees = NOTIFICATION_MESSAGES.EmployeeTimeOffRequestApproved.replace('[planType]', `[${selectedRow.planTypeName}]`).replace('[requestDate]', `[${showDates(selectedRow.requestDates)}]`)
          notificationToEmployee.userRecipients = [mapEmployeeList.value[selectedRow.employeeId]];
          notificationToEmployee.resourceId = selectedRow.id;
          notificationToEmployee.messagePayload = messageToEmployees;
          notificationStore.createNotification(notificationToEmployee)
        }
      }
      await refreshRequestList();
      refreshSelectRow();
    });
  }
  currentSelectedRows.value = [];
  grid.value.instance.value.deselectAll();
  showActionSidebar.value = false;
};

const handleRejectRequest = async () => {
  if (validateRejectReason.value) {
    openRejectReasonModal.value = false;
    try {
      if (currentSelectedRows.value.length === 1) {
        await handleRejectSingleRequest();
      }
      if (currentSelectedRows.value.length > 1) {
        const rejectRequests = currentSelectedRows.value.map((row) => ({
          id: row.id,
          rejectReason: rejectReason.value,
        }));

        await bulkReject(rejectRequests).then(async (res) => {
          if (res.status === 200) {
            notifySuccess("Request rejected.");
            await refreshRequestList();
            const notificationToEmployee: INotificationObj = {
              alertEventId: AlertEvent.Approved,
              alertResourceTypeId: AlertResourceType.TimeOffRequest,
              alertApplicationId: AlertApplicationId.Ess,
              messageType: 'create',
            }

            for (const selectedRow of currentSelectedRows.value) {
              const messageToEmployees = NOTIFICATION_MESSAGES.EmployeeTimeOffRequestRejected.replace('[planType]', `[${selectedRow.planTypeName}]`).replace('[requestDate]', `[${showDates(selectedRow.requestDates)}]`)
              notificationToEmployee.userRecipients = [mapEmployeeList.value[selectedRow.employeeId]];
              notificationToEmployee.resourceId = selectedRow.id;
              notificationToEmployee.messagePayload = messageToEmployees;
              notificationStore.createNotification(notificationToEmployee)
            }
          } else {
            const msg = res.errorMessage.split(":");
            notifyError(msg[1], TIME.MILLISECOND);
            await refreshRequestList();
          }
        });
      }
    } catch (error) {
      console.error("There was an error when reject request", error);
    } finally {
      refreshSelectRow();
      rejectReason.value = "";
    }
    rejectReason.value = "";
    isEditingReason.value = false;
    currentSelectedRows.value = [];
    grid.value.instance.value.deselectAll();
    showActionSidebar.value = false;
  } else {
    isEditingReason.value = true;
  }
};

const resetRejectReason = () => {
  rejectReason.value = "";
};
const tableKey = ref(0);

watch(currentStatusFilter, async () => {
  await refreshRequestList();
  if (searchText.value !== "") {
    filterBryntumStore();
  }
  if (currentStatusFilter.value === RequestStatus.PENDING) {
    gridConfig.value = {
      ...gridConfig.value,
      selectionMode: {
        triggerEvent: "",
        row: false,
        checkboxOnly: true,
        flex: 1,
        minColumnWidth: 45,
        checkbox: true,
        showCheckAll: true,
      },
    };
    tableKey.value++;
  } else {
    gridConfig.value.selectionMode = {
      ...gridConfig.value.selectionMode,
      checkboxOnly: false,
      checkbox: false,
      showCheckAll: false,
    };
    tableKey.value++;
  }
});

// #region BryntumSearchBar
const saveGridSettings = () => {
  localStorage.setItem(
    `${gridLocalStorageKey}State`,
    JSON.stringify((gridStore.value as any).state)
  );
};

const clearGridSettings = () => {
  gridStore.value.clearFilters();
  gridStore.value.clearSorters();
  localStorage.removeItem(`${gridLocalStorageKey}State`);
};

const hideFilterBar = () => {
  gridStore.value.clearFilters();
  gridFeatures.value.filterBar.hideFilterBar();
};

const refreshRequestList = async () => {
  await fetchRequestList({
    status: currentStatusFilter.value,
    year: selectedYear.value,
  });
  filteredRequestList.value = [...requestList.value];
  await populateBryntumStore();
  if (searchText.value !== "") {
    filterBryntumStore();
  }
  showRequestSidebar.value = false;
  showActionSidebar.value = false;
};

const refreshSelectRow = () => {
  currentSelectedRows.value = [];
  grid.value.instance.value.deselectAll();
  showActionSidebar.value = false;
};

const closeActionSidebar = () => {
  showActionSidebar.value = false;
  grid.value.instance.value.deselectRows(
    currentSelectedRows.value.map((row) => row.id)
  );
};

const closeRequestSidebar = () => {
  showRequestSidebar.value = false;
  grid.value.instance.value.deselectRow(requestInfo.value.id);
};

const closeRejectReasonModal = () => {
  resetRejectReason();
  openRejectReasonModal.value = false;
  isEditingReason.value = false;
};

const validateRejectReason = computed(() => {
  return rejectReason.value !== "";
});

const closeCancelRequestConfirmModal = async () => {
  await refreshRequestList();
  openCancelConfirmModal.value = false;
  showRequestSidebar.value = false;
};

const handleCancelRequest = async () => {
  try {
    await cancelRequest(requestInfo.value.id);
    notifySuccess("Request cancelled.");
  } catch (error) {
    notifyError("Request cancelled unsuccessfully.");
  }
  await refreshRequestList();
  openCancelConfirmModal.value = false;
  showRequestSidebar.value = false;
};

const CURRENT_YEAR = new Date().getFullYear();
const selectedYear = ref(CURRENT_YEAR);
const years = ref();

//-- Get user recipients
const mapEmployeeList = computed(() => {
  const employeeListObj = {}
  for (const employee of employeeList.value) {
    employeeListObj[employee.id] = {
      userGuid: employee.aspNetUserId,
      clientId: employee.clientId
    }
  }
  return employeeListObj
})

onMounted(async () => {
  fetchEmployeeList();
  years.value = await getListRequestedLeaveYears();
  if (years.value.length !== 0) {
    years.value;
  } else years.value = [CURRENT_YEAR];
  await fetchRequestList({
    status: currentStatusFilter.value,
    year: selectedYear.value,
  });
  filteredRequestList.value = [...requestList.value];
  populateBryntumStore();
  if (searchText.value !== "") {
    filterBryntumStore();
  }
});

watch(selectedYear, async () => {
  await refreshRequestList();
});
</script>

<template>
  <div class="hq-pg pb-0" id="timeOffHRM">
    <div class="hq-pg__grid">

      <bryntum-search-bar title="Time Off Requests" :local-storage-key="gridLocalStorageKey" :show-settings-button="true"
        :show-filter-button="true" :show-search-button="false" :show-footer-search="false"
        @save-settings="saveGridSettings()" @clear-settings="clearGridSettings()" @hide-filter-bar="hideFilterBar()"
        @show-filter-bar="gridFeatures.filterBar.showFilterBar()" @refresh-grid="refreshRequestList()">
        <template #headers>
          <fs-form-select class="form-select" v-model="selectedYear" :options="years"></fs-form-select>
        </template>
      </bryntum-search-bar>

      <div class="stateFilter">
        <fs-form-radio-group v-model="currentStatusFilter" :options="filterOptions" button-variant="outline"
          name="timeoff request state" buttons></fs-form-radio-group>
      </div>

      <div class="dashboard-card__content action-grid list__table list__table--onpage list__b-grid--hover">
        <!-- <div class=" b-stripe-vertical b-grid-header-no-border"> -->
        <bryntum-grid v-bind="gridConfig" :store="gridStore" ref="grid" :key="tableKey" />
        <!-- </div> -->
      </div>

      <fs-modal id="reject-reason-modal" ref="modal" content-class="content-fsModal" body-class="body-fsModal"
        header-bg-variant="blue" header-text-variant="white" header-close-variant="white" :hide-footer="true"
        no-close-on-backdrop no-close-on-esc v-model="openRejectReasonModal" @close="closeRejectReasonModal"
        @ok="handleRejectRequest">
        <template #modal-header>
          <div class="w-100 d-flex align-items-center justify-content-between">
            <div class="title">Rejection Reason</div>
            <fs-link class="text-white" tag="a" @click="closeRejectReasonModal">
              <font-awesome-icon :icon="['fal', 'times']" size="lg" class="text-white"></font-awesome-icon>
            </fs-link>
          </div>
        </template>
        <VeeForm ref="form" @submit="handleRejectRequest">
          <VField name="rejectReason" v-model="rejectReason" rules="required">
            <textarea class="d-block w-100 p-2 rounded-2 textarea-form" rows="3" maxLength="225"
              @input="isEditingReason = true" v-model="rejectReason" />
          </VField>
          <p class="text-danger mt-1" v-if="isEditingReason && !validateRejectReason">
            A reason is required to reject a time off request.
          </p>
          <div class="d-flex justify-content-end">
            <fs-button-group>
              <fs-button @click="closeRejectReasonModal" variant="light" class="m-2 text-uppercase rounded-2">cancel
              </fs-button>
              <fs-button type="submit" variant="danger" class="m-2 text-uppercase rounded-2">Reject</fs-button>
            </fs-button-group>
          </div>
        </VeeForm>
      </fs-modal>

      <!-- approve confirmation -->
      <fs-modal id="approve-request-modal" ref="modal" content-class="content-fsModal" body-class="body-fsModal"
        header-bg-variant="blue" header-text-variant="light" no-close-on-backdrop no-close-on-esc
        footer-bg-variant="light" v-model="openApproveConfirmModal" @ok="handleApproveRequest"
        @search-text-input="searchText = $event">
        <div class="text-black py-2 confirm-request">
          <font-awesome-icon class="text-warning me-2" :icon="['fa-solid', 'fa-circle-exclamation']" size="lg" />
          {{ `Are you sure you want to approve` }}
          {{ currentSelectedRows.length > 1 ? `these` : `this` }}
          <span class="fw-bold">{{
            `Time Off Request${currentSelectedRows.length > 1 ? "s" : ""}`
          }}</span>
          {{
            currentSelectedRows.length === 1
            ? `of ${currentSelectedRows[0]?.fullName}?`
            : ``
          }}
        </div>
        <template #modal-header="{ cancel }">
          <div class="w-100 d-flex align-items-center justify-content-between my-2">
            <div class="title">Approval Confirmation</div>
            <fs-link class="text-secondary" tag="a" @click="cancel">
              <font-awesome-icon :icon="['fal', 'times']" size="lg" class="text-white"></font-awesome-icon>
            </fs-link>
          </div>
        </template>
        <template #modal-footer="{ ok, cancel }">
          <fs-button @click="cancel" variant="light" class="bg-white text-black m-2 text-uppercase">Cancel
          </fs-button>
          <fs-button @click="ok" variant="success" class="m-2 text-uppercase">Approve
          </fs-button>
        </template>
      </fs-modal>

      <DarkThemeModal title="Cancel this request" :show-modal="openCancelConfirmModal" cancel-btn-variant="light"
        okText="OK" okTextVariant="danger" cancelText="CANCEL" cancelTextVariant="outline"
        @close="closeCancelRequestConfirmModal" @ok="handleCancelRequest">
        <template #content>
          <div class="d-flex my-2">
            <font-awesome-icon :icon="['fas', 'circle-exclamation']" class="text-danger me-2 mt-1" />
            <span class="text-lg">
              Do you really want to cancel this request? This process cannot be
              undone.
            </span>
          </div>
        </template>
      </DarkThemeModal>

      <request-sidebar :isShowSidebar="showRequestSidebar" :id="requestInfo?.id"
        :currentStatusFilter="currentStatusFilter" @close-sidebar="closeRequestSidebar"
        @approve-request="openApproveConfirmModal = true" @cancel-request="openCancelConfirmModal = true"
        @reject-request="openRejectReasonModal = true" />

      <action-sidebar :isShowSidebar="showActionSidebar" :selectedRows="currentSelectedRows"
        @close-sidebar="closeActionSidebar" @approve-request="openApproveConfirmModal = true"
        @reject-request="openRejectReasonModal = true" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.state-filter {
  .btn~.btn {
    margin-left: 0;
  }
}

:deep(.btn-group-toggle.btn-group > label) {
  margin-right: 1rem;
  border: none;
  padding: 10px 22px 10px 22px;
  border-radius: 50px !important;
}

:deep(.btn-group-toggle.btn-group > label.active) {
  background: #425afb;
  border-radius: 50px;
  color: #fff;
}

:deep(label.active:hover) {
  opacity: 0.8;
}

.btn-group-toggle.btn-group :deep(label:not(.active)):hover {
  background: #6e80f8;
  transition: all ease-in-out 0.3s;
  color: #fff;
}

.divider {
  border-top: 1px solid rgba(110, 124, 143, 0.31);
}

.stateFilter {
  padding: 12px 18px;
  display: flex;
  align-items: center;

  @media screen and (max-width: 767px) {
    padding: 12px;
  }
}

.action-bars {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid #e1e4e8;
  padding: 12px 18px;
  transition: all ease-in-out 0.3s;
}

:deep(.b-grid-cell.b-checkbox-selection) {
  background-color: #fff;
}

:deep(.content-fsModal) {
  background-color: #193755;
}

:deep(.ellipsis-text) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  line-height: 46px;
}

:deep(.modal-body.body-fsModal) {
  width: fit-content;
}

:deep(.b-grid-cell),
:deep(.b-grid-header) {
  padding-left: 24px;
  padding-right: 24px;
}

:deep(.b-check-cell),
:deep(.b-check-header) {
  padding-left: 0;
  padding-right: 0;
}

.title {
  font-weight: 600;
  font-size: 16px;
  line-height: 28px;
}

:deep(.b-action-item) {
  font-size: 1em;
  cursor: pointer;
}

:deep(.b-action-item:hover) {
  transform: none;
}

:deep(.b-action-item::before) {
  display: block;
}

:deep(.b-grid-cell.b-action-cell) {
  visibility: hidden;
  transition: all ease-in-out 0.3s;
}

:deep(.b-grid-row:hover .b-grid-cell.b-action-cell) {
  visibility: visible;
}

:deep(.b-grid-splitter) {
  display: none;
}

:deep(.b-grid-header[data-column="action"]) {
  align-self: flex-start;
}

:deep(.b-yscroll-pad) {
  display: none !important;
}

:deep(.list__table--onpage) {
  overflow: hidden !important;
  width: 100% !important;}
:deep(.contain) {
  padding-left: 16px;
}
</style>
