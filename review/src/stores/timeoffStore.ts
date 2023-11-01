import { acceptHMRUpdate, defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { requestBody, whqTimeoffRequestApi } from "@/axios/instances/whqTimeoffRequestApi";
import { Request } from "@/models/timeoff/Request";
import { ApiResponse } from "@/models/ApiResponse";
import { Event } from "@/models/timeoff/Event";

export const useTimeoffStore = defineStore("timeoff", () => {
  const requestList: Ref<Request[]> = ref(new Array<Request>());

  async function fetchRequestList(params?): Promise<void> {
    requestList.value = await whqTimeoffRequestApi.getRequests(params);
  }

  async function getRequest(id: number): Promise<Request> {
    return await whqTimeoffRequestApi.getRequest(id)
  }

  async function approveRequest(request: requestBody): Promise<ApiResponse> {
    return await whqTimeoffRequestApi.approveRequest(request)
  }

  async function cancelRequest(id: string | number): Promise<ApiResponse> {
    return await whqTimeoffRequestApi.cancelRequest(id)
  }

  async function rejectRequest(request: requestBody): Promise<ApiResponse> {
    return await whqTimeoffRequestApi.rejectRequest(request)
  }

  async function bulkApprove(requests: requestBody[]): Promise<ApiResponse> {
    return await whqTimeoffRequestApi.bulkApprove(requests)
  }

  async function bulkReject(requests: requestBody[]): Promise<ApiResponse> {
    return await whqTimeoffRequestApi.bulkReject(requests)
  }

  async function addEvent(event: Event): Promise<Event> {
    if (event.notificationDate === null) delete event.notificationDate;
    return await whqTimeoffRequestApi.addEvent(event);
  }

  async function updateEvent(event: Event): Promise<void> {
    if (!event.sendNotification) delete event.notificationDate;
    return await whqTimeoffRequestApi.updateEvent(event);
  }

  async function deleteEvent(event: Event): Promise<void> {
    return await whqTimeoffRequestApi.deleteEvent(event);
  }

  async function getListRequestedLeaveYears() {
    return await whqTimeoffRequestApi.getRequestedLeaveYears();
  }

  return {
    requestList,
    fetchRequestList,
    getRequest,
    rejectRequest,
    approveRequest,
    cancelRequest,
    bulkApprove,
    bulkReject,
    addEvent,
    updateEvent,
    deleteEvent,
    getListRequestedLeaveYears
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useTimeoffStore, import.meta.hot));
}
