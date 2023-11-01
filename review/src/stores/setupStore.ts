import { acceptHMRUpdate, defineStore } from "pinia";
import type { Ref } from "vue";
import { ref } from "vue";
import { whqSetupApi } from "../axios/instances/whqSetupApi";
import { HrContactInformation } from "@/models/settings/HrContactInformation";
import { PaymentMethod } from "@/models/settings/PaymentMethod";
import { ApiResponse } from "@/models/ApiResponse";

export const useSetupStore = defineStore("setup", () => {

  const hrContactInformation: Ref<HrContactInformation> = ref<HrContactInformation>({} as HrContactInformation);
  const paymentMethod: Ref<PaymentMethod> = ref<PaymentMethod>({} as PaymentMethod);

  async function fetchHrContactInformation(): Promise<void> {
    hrContactInformation.value = await whqSetupApi.getGeneralClientSetting();
  }

  async function fetchPaymentMethod(): Promise<void> {
    paymentMethod.value = await whqSetupApi.getPaymentMethod();
  }

  async function savePaymentMethod(paymentMethod: PaymentMethod): Promise<ApiResponse> {
    const response = await whqSetupApi.savePaymentMethod(paymentMethod);
    return response;
  }

  return {
    hrContactInformation,
    fetchHrContactInformation,
    paymentMethod,
    fetchPaymentMethod,
    savePaymentMethod
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSetupStore, import.meta.hot));
}
