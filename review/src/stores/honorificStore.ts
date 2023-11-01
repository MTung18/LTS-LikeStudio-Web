import { acceptHMRUpdate, defineStore } from 'pinia';
import { ref, Ref } from  "vue";
import { honorificsApi } from "@/axios/instances/honorificsApi";
import Honorific from '@/models/employees/Honorific';

export const useHonorificStore = defineStore("honorific", () => {
    const honorificDropdownData: Ref<Honorific[]> = ref([])

    async function fetchHonorificDropdownData(): Promise<void> {
        honorificDropdownData.value = await honorificsApi.getHonorifics();
    }

    return {
        honorificDropdownData,
        fetchHonorificDropdownData
    };
});

if (import.meta.hot) {
    import.meta.hot.accept(acceptHMRUpdate(useHonorificStore, import.meta.hot));
}
