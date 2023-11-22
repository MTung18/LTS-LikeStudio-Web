import { defineStore } from 'pinia';
import { onMounted, onUnmounted, ref } from 'vue';

const useCIBIStore = defineStore('cibi', () => {
  const scrollY = ref(null);
  const componentsPosition = ref([]);

  const setScrollY = () => {
    scrollY.value = window.pageYOffset;
  };

  const setComponentsPosition = (target, idx) => {
    if (!target) return;
    // console.log('target', target.offsetHeight);
    componentsPosition.value[idx] = target.offsetTop;
  };

  onMounted(() => {
    window.addEventListener('scroll', setScrollY);
  });

  onUnmounted(() => {
    window.removeEventListener('scroll', setScrollY);
  });

  return { scrollY, componentsPosition, setComponentsPosition };
});

export default useCIBIStore;
