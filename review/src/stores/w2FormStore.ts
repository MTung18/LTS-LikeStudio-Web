import { w2FormApi } from "@/axios/instances/w2FormApi";
import { W2Form } from "@/models/w2/W2Form";
import { w2FormSetting } from "@/models/hrmSettings/payrollAndTax/w2Form/w2FormSetting";
import { defineStore, acceptHMRUpdate } from "pinia";
import { ref, Ref } from "vue";
import { ApiResponse } from "@/models/ApiResponse";

export const useW2FormStore = defineStore("w2Form", () => {
  const w2FormList: Ref<W2Form[]> = ref(new Array<W2Form>());
  const isW2Consent = ref(null);
  const w2FormSetting: Ref<w2FormSetting> = ref(null);

  async function fetchW2FormList(employeeId: string, year: number): Promise<void> {
    w2FormList.value = await w2FormApi.getW2FormsByEmployeeId(employeeId, year);
  }

  async function getW2ConsentStatus(employeeId: string): Promise<void> {
    isW2Consent.value = await w2FormApi.getEmployeeConsentStatus(employeeId);
  }

  async function getW2SettingsByYear(year: number): Promise<void> {
    w2FormSetting.value = await w2FormApi.getW2Settings(year);
  }

  async function updateW2Settings(data: w2FormSetting): Promise<ApiResponse> {
    return await w2FormApi.updateW2Settings(data)
  }

  async function downloadW2Form(employeeId: number, year: number, formType: string, fileName: string): Promise<void> {
    await w2FormApi.downloadW2FormByYear(employeeId, year, formType, fileName);
  }

  return {
    w2FormList,
    isW2Consent,
    w2FormSetting,
    getW2SettingsByYear,
    getW2ConsentStatus,
    fetchW2FormList,
    updateW2Settings,
    downloadW2Form
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useW2FormStore, import.meta.hot));
}
