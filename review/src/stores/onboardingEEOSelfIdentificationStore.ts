import { acceptHMRUpdate, defineStore } from "pinia";
import { Ref, ref } from "vue";
import FormField from "@/models/onboarding/FormField";
import { onboardingEEOSelfIdentificationApi } from '@/axios/instances/onboardingEEOSelfIdentificationApi';
import { PERSONAL_INFO_RACE_OPTIONS, PERSONAL_INFO_GENDER_OPTIONS } from '@/constants/common';

export const useOnboardingEEOSelfIdentificationStore = defineStore("onboardingEEOSelfIdentificationStore", () => {
    const onboardingEEOSelfIdentification: Ref<FormField | undefined> = ref(undefined);
    const genderOptionsId = [2, 1, 3];
    const genderList = genderOptionsId.map(id => {
        const option = PERSONAL_INFO_GENDER_OPTIONS.find(item => item.value === id);
        return { value: option.value, text: option.text };
    })
    
    const raceList = PERSONAL_INFO_RACE_OPTIONS;
    async function getOnboardingEEOSelfIdentification(employeeId: number, formId: number) {
        onboardingEEOSelfIdentification.value = await onboardingEEOSelfIdentificationApi.getOnboardingEEOSelfIdentification(employeeId, formId)
    }

    async function updateOnboardingEEOSelfIdentification(employeeId: number, formData: FormField) {
        await onboardingEEOSelfIdentificationApi.updateOnboardingEEOSelfIdentification(employeeId, formData);
    }

    return {
        onboardingEEOSelfIdentification,
        genderList,
        raceList,
        getOnboardingEEOSelfIdentification,
        updateOnboardingEEOSelfIdentification
    }
})

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useOnboardingEEOSelfIdentificationStore, import.meta.hot)
    );
}