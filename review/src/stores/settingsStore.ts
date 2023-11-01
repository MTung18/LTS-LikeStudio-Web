import { acceptHMRUpdate, defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { whqHrmSettingsApi } from "../axios/instances/whqHrmSettingsApi";
import { PayStubDateT } from "@/models/hrmSettings/payrollAndTax/payStub/payStubDate";
import { PayStubShowSectionT } from "@/models/hrmSettings/payrollAndTax/payStub/showSections";
import { ApiResponse } from "@/models/ApiResponse";

export const useSettingsStore = defineStore("settings", () => {
  const payStubList: Ref<PayStubDateT[]> = ref<PayStubDateT[]>([]);
  const showSection: Ref<PayStubShowSectionT> = ref<PayStubShowSectionT>(
    {} as PayStubShowSectionT
  );

  async function fetchPayStub(): Promise<void> {
    payStubList.value = await whqHrmSettingsApi.getPayStub();
  }

  async function fetchShowSection(): Promise<void> {
    showSection.value = await whqHrmSettingsApi.getShowSection();
  }

  async function deletePayStub(payDateId: number | string): Promise<void> {
    await whqHrmSettingsApi.deletePayStub(payDateId)
  }

  async function addPayStub(payStub: PayStubDateT): Promise<ApiResponse> {
    return await whqHrmSettingsApi.addPayStub(payStub)
  }

  async function changePayStub({
    payStubDate,
    payStubId,
  }: {
    payStubDate: PayStubDateT;
    payStubId: number;
  }): Promise<ApiResponse> {
    return await whqHrmSettingsApi.changePayStub({
      payStubDate,
      payStubId,
    })
  }

  async function changeShowSection({
    payrollAndTaxesSettingId,
    sections,
  }: {
    payrollAndTaxesSettingId: number;
    sections: Omit<PayStubShowSectionT, "payrollAndTaxesSettingId">;
  }): Promise<void> {
    await whqHrmSettingsApi.changeShowSection({
      payrollAndTaxesSettingId,
      sections,
    })
  }

  return {
    showSection,
    payStubList,
    fetchPayStub,
    fetchShowSection,
    changeShowSection,
    deletePayStub,
    changePayStub,
    addPayStub,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSettingsStore, import.meta.hot));
}
