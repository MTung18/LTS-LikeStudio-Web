import { defineStore } from 'pinia';
import { ref } from 'vue';

const useMainStore = defineStore('main', () => {
  const popupSliderLayoutIsOpen = ref(false);

  const handleSliderLayoutPopupOpen = () => {
    popupSliderLayoutIsOpen.value = true;
  };

  const handleSliderLayoutPopupClose = () => {
    popupSliderLayoutIsOpen.value = false;
  };

  return {
    popupSliderLayoutIsOpen,
    handleSliderLayoutPopupOpen,
    handleSliderLayoutPopupClose,
  };
});

export default useMainStore;
