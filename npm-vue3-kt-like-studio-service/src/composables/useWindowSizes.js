import { onMounted, onUnmounted, ref } from 'vue';

export default function useWindowSizes() {
  const windowWidth = ref(window.innerWidth);
  const windowHeight = ref(window.innerHeight);

  function hanlder() {
    windowWidth.value = window.innerWidth;
    windowHeight.value = window.innerHeight;
  }

  onMounted(() => window.addEventListener('resize', hanlder));
  onUnmounted(() => window.removeEventListener('resize', hanlder));

  return { windowWidth, windowHeight };
}
