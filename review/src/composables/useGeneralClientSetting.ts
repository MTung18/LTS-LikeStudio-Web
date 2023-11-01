import { computed, onMounted } from 'vue';
import { storeToRefs } from "pinia";
import { useGeneralClientSettingStore } from "@/stores/generalClientSettingStore";
export function useGeneralClientSetting() {

    const generalClientSettingsStore = useGeneralClientSettingStore();
    const { generalClientSetting } = storeToRefs(generalClientSettingsStore);
    const isDirectDepositEnabled = computed(() => generalClientSetting.value.isDirectDeposit);
    const isPaperCheckEnabled = computed(() => generalClientSetting.value.isPaperCheck);
    const isPaperCheckAndDirectDepositEnabled = computed(() => isDirectDepositEnabled.value && isPaperCheckEnabled.value);

    onMounted(() => {
        generalClientSettingsStore.fetchGeneralClientSetting();

    });
    return {
        isDirectDepositEnabled,
        isPaperCheckEnabled,
        isPaperCheckAndDirectDepositEnabled
    }

}