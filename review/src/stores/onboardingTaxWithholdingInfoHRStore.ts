import { Ref, ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";
import { onboardingTaxWithHoldingInfoHRApi } from "../axios/instances/onboardingTaxWithholdingInfoHRApi";
import FormField from "../models/onboarding/FormField";
import {
    FEDERAL_FILING_STATUS_OPTIONS, 
    FEDERAL_AUTHORITY_OPTIONS, 
    STATE_FILING_STATUS_OPTIONS, 
    FEDERAL_TAX_WITHHOLDING_INFO_OVERRIDE_OPTIONS, 
    NON_FEDERAL_TAX_WITHHOLDING_INFO_OVERRIDE_OPTIONS, 
    TAX_WITHHOLDING_INFO_ADD_ON_OPTIONS, 
    YES_NO_OPTIONS 
} from '@/constants/common';
import { payrollStateTaxCodeApi } from "@/axios/instances/payrollStateTaxCodeApi";
import PayrollStateTaxCode from "@/models/foundationIntegration/PayrollStateTaxCode";

export const useOnboardingTaxWithholdingInfoHRStore = defineStore('onboardingTaxWithholdingInfoHRStore', () => {
    const onboardingTaxWithholdingInfoHR: Ref<FormField | undefined> = ref(undefined);
    const stateOptions: Ref<PayrollStateTaxCode[]> = ref([]);
    const formattedStateOptions = ref([]);

    const federalFilingStatusOptions = FEDERAL_FILING_STATUS_OPTIONS;
    const federalOverrideOptions = FEDERAL_TAX_WITHHOLDING_INFO_OVERRIDE_OPTIONS;
    const nonFederalOverrideOptions = NON_FEDERAL_TAX_WITHHOLDING_INFO_OVERRIDE_OPTIONS;
    const federalAuthorityOptions = FEDERAL_AUTHORITY_OPTIONS;
    const stateFilingStatusOptions = STATE_FILING_STATUS_OPTIONS;
    const addOnOptions = TAX_WITHHOLDING_INFO_ADD_ON_OPTIONS;
    const yesNoOptions = YES_NO_OPTIONS;

    async function getOnboardingTaxWithHoldingInfoHR(employeeId: number, formId: number) {
        onboardingTaxWithholdingInfoHR.value = await onboardingTaxWithHoldingInfoHRApi.getOnboardingTaxWithHoldingInfoHR(employeeId, formId)
    }

    async function getStateTaxCodes(): Promise<void> {
        stateOptions.value = await payrollStateTaxCodeApi.getPayrollStateTaxCodes();
        formattedStateOptions.value = stateOptions.value.map((option) => {
            return {
                value: option.id,
                text: option.payrollStateTaxCodeFsNo,
                name: option.payrollStateTaxCodeName,
            }
        })
    }

    async function updateOnboardingTaxWithHoldingInfoHR(employeeId: number, formData: FormField) {
        await onboardingTaxWithHoldingInfoHRApi.updateOnboardingTaxWithHoldingInfoHR(employeeId, formData);
    }

    return {
        federalFilingStatusOptions,
        federalOverrideOptions,
        nonFederalOverrideOptions,
        federalAuthorityOptions,
        stateFilingStatusOptions,
        formattedStateOptions,
        addOnOptions,
        yesNoOptions,
        onboardingTaxWithholdingInfoHR,
        stateOptions,
        getStateTaxCodes,
        getOnboardingTaxWithHoldingInfoHR,
        updateOnboardingTaxWithHoldingInfoHR
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useOnboardingTaxWithholdingInfoHRStore, import.meta.hot)
    );
}