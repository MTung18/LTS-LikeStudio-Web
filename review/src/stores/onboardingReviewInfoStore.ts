import { acceptHMRUpdate, defineStore } from "pinia";
import { whqOnboardingApi } from '../axios/instances/whqOnboardingApi';
import { DownloadReviewPDFPayload } from '../models/onboarding/OnboardingFinalReview';
import { ref } from "vue";

export const useOnboardingFinalReviewStore = defineStore("onboardingFinalReview", () => {
    const hasPressedComplete = ref(false); 
    async function downloadFinalReview(payload: DownloadReviewPDFPayload) {
        await whqOnboardingApi.downloadFinalReview(payload);
    }

    function changePressComplete(hasPress: boolean) {
        hasPressedComplete.value = hasPress;
    }

    return {
        hasPressedComplete,
        changePressComplete,
        downloadFinalReview
    }
});

if (import.meta.hot) {
    import.meta.hot.accept(
        acceptHMRUpdate(useOnboardingFinalReviewStore, import.meta.hot)
    );
}