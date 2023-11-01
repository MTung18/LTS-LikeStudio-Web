import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import { onboardingEmployeeWithholdingCertificateApi } from '../axios/instances/onboardingEmployeeWithholdingCertificateApi';
import FormFieldModel from "../models/onboarding/FormField";

export const useOnboardingEmployeeWithholdingCertificateStore = defineStore('onboardingEmployeeWithholdingCertificate', () => {
    const onboardingEmployeeWitholdingCertificate: Ref<FormFieldModel | undefined> = ref(undefined);

    async function getOnboardingEmployeeWitholdingCertificate(employeeId: number, formId: number) {
        onboardingEmployeeWitholdingCertificate.value = await onboardingEmployeeWithholdingCertificateApi.getOnboardingEmployeeWithholdingCertificate(employeeId, formId)
    }

    return {
        onboardingEmployeeWitholdingCertificate,
        getOnboardingEmployeeWitholdingCertificate,
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useOnboardingEmployeeWithholdingCertificateStore, import.meta.hot)
    );
}