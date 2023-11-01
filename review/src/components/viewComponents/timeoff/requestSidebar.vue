<script setup lang="ts">
import { RequestStatus } from "@/enums/timeoff/RequestStatus";
import { Request } from "@/models/timeoff/Request";
import { useTimeoffStore } from "@/stores/timeoffStore";
import { convertUTCDateTimeToLocalDateTime } from "@/utilities/formatUtils";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faExclamationCircle } from "@fortawesome/pro-solid-svg-icons";
import { defineProps, ref, watch } from "vue";
import { filterBlank } from '@/utilities/filterBlankValue'

const { getRequest } = useTimeoffStore();

interface Props {
  isShowSidebar?: boolean;
  id: number;
  currentStatusFilter: string;
}

library.add(faExclamationCircle);

const props = defineProps<Props>();

const enum EmitNames {
  CLOSE = "closeSidebar",
  APPROVE_REQUEST = "approveRequest",
  REJECT_REQUEST = "rejectRequest",
  CANCEL_REQUEST = "cancelRequest",
}

const onClose = () => {
  emit(EmitNames.CLOSE);
};

const emit = defineEmits<{
  (e: EmitNames, param?: number): void;
}>();

const requestInfo = ref<Partial<Request>>({})

watch(() => props.id, async () => {
  requestInfo.value = await getRequest(props.id);
})
</script>

<template>
  <fs-sidebar :visible="props.isShowSidebar" sidebar-class="fsi-sidebar" right no-close-on-esc no-close-on-backdrop
    backdrop-variant="transparent" bg-variant="white" width="425px" shadow="sm"
    header-class="border-bottom bg-grey--000 details_panel_header" backdrop footer-class="border-top"
    :title="requestInfo?.fullName">
    <template #header>
      <div class="fs-sidebar-header border-bottom bg-grey--000 details_panel_header">
        <strong>{{ requestInfo?.fullName }}</strong>
        <div class="ms-auto">
          <fs-link class="text-secondary" tag="a" @click="onClose">
            <font-awesome-icon :icon="['fal', 'times']" size="lg"></font-awesome-icon>
          </fs-link>
        </div>
      </div>
    </template>

    <div class="px-3 py-2 bg-white w-100 h-100">
      <fs-alert :show="requestInfo?.totalHours > requestInfo?.currentBalance" variant="danger">
        <font-awesome-icon icon="fa-solid fa-circle-exclamation" class="text-danger" />
        <span class="text-black ms-2">{{
          `This request is exceeding current available time off by ${Number(
            requestInfo?.totalHours - requestInfo?.currentBalance,
          ).toFixed(2)} hours!`
        }}</span>
      </fs-alert>
      <div class="warning-zone" v-if="currentStatusFilter === RequestStatus.REJECTED && requestInfo?.rejectReason">
        <span class="text-black fw-bold">Rejection Reason</span>
        <div class="text-black">{{ filterBlank(requestInfo?.rejectReason) }}</div>
      </div>
      <fs-container class="container-fluid">
        <fs-row class="py-3">
          <div class="label">Dates</div>
          <div class="content_text">
            <template v-for="(date, index) in requestInfo?.requestDates" :key="index">
              <span>
                {{
                  filterBlank(convertUTCDateTimeToLocalDateTime(date))
                }}
              </span>
              <br />
            </template>
          </div>
        </fs-row>
        <fs-row class="py-3">
          <div class="label">Plan Type</div>
          <div class="content_text">{{ filterBlank(requestInfo?.planTypeName) }}</div>
        </fs-row>
        <fs-row class="py-3">
          <div class="label">Total Hours</div>
          <div class="content_text">
            {{
              `${filterBlank(requestInfo?.totalHours && requestInfo?.totalHours.toFixed(2))}
                        hour${Number(requestInfo?.totalHours) > 1 ?
                `s` : ``
              }`
            }}
          </div>
        </fs-row>
        <fs-row class="py-3">
          <div class="label">Supervisor</div>
          <div class="content_text">{{ filterBlank(requestInfo?.supervisorFullName) }}</div>
        </fs-row>
        <fs-row class="py-3">
          <div cols="4" class="label">Note</div>
          <div cols="8" class="content_text">{{ filterBlank(requestInfo?.note) }}</div>
        </fs-row>
      </fs-container>
    </div>

    <template #footer>
      <div class="d-flex justify-content-between contain py-2 bg-grey--000">
        <div><fs-button size="small" variant="outline-secondary" @click="$emit('cancelRequest', requestInfo?.id)">Cancel
            Request</fs-button></div>
        <div> <fs-button size="small" variant="danger" v-if="currentStatusFilter === RequestStatus.PENDING"
            @click="$emit('rejectRequest', requestInfo?.id)">Reject</fs-button>
          <fs-button size="small" variant="success" v-if="currentStatusFilter === RequestStatus.PENDING"
            @click="$emit('approveRequest', requestInfo?.id)">Approve</fs-button>
        </div>
      </div>
    </template>
  </fs-sidebar>
</template>

<style lang="scss" scoped>
:deep(.fs-sidebar) {
  top: 44px;
  height: calc(100vh - 44px);
  width: 450px;
  background-color: #fff;
}

:deep(.b-sidebar-header) {
  padding: 16px;
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), #e1e4e8;
}

.label {
  font-weight: 700;
  font-size: 14px;
  line-height: 150%;
}

.content_text {
  font-weight: 400;
  font-size: 14px;
  line-height: 150%;
}

.warning-zone {
  background: linear-gradient(0deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.9)), #ff2a2a;
  padding: 12px 10px;
  border: 1px dashed #ff2a2a;
  border-radius: 6px;
}
</style>
