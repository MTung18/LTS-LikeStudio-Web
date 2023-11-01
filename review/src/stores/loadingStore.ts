import { ref } from "vue";
import { acceptHMRUpdate, defineStore } from "pinia";

export const useLoadingStore = defineStore("loading", () => {
  const loading = ref(false);

  function setLoading(param): any {
    loading.value = param;
  }

  return {
    loading,
    setLoading,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(
    acceptHMRUpdate(useLoadingStore, import.meta.hot)
  );
}
