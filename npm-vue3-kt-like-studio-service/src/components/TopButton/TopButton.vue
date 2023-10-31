<template>
  <IconButton
    ref="topButtonRef"
    icon-name="arrow_top_bold"
    icon-color="var(--color-neutrals-white-100)"
    size="large"
    type="outlined"
    component="button"
    :class-bind="computedClasses"
    @click="handleGoToTop"
  />
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue';

import IconButton from '@/components/IconButton/IconButton.vue';

const topButtonRef = ref(null);
const isFixed = ref(true);
const stylesRef = computed(() => (isFixed.value ? 'fixed' : 'absolute'));
const staticClasses =
  'bottom-[2.5rem] right-[8rem] bg-neutrals-black !border-neutrals-black';
const computedClasses = computed(() => `${staticClasses} ${stylesRef.value}`);

const handleGoToTop = () => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: 'smooth',
  });
};

const handlerScroll = () => {
  const winY = window.pageYOffset;
  const winH = window.innerHeight;
  const root = document.querySelector('.root');
  const footer = document.querySelector('.footer');
  const rootScrollHeight = root.scrollHeight;
  const footerHeight = footer.offsetHeight;
  const currentY = winY + winH;
  const boundaryLine = rootScrollHeight - footerHeight;
  if (currentY >= boundaryLine) {
    isFixed.value = false;
  } else {
    isFixed.value = true;
  }
};
onMounted(() => {
  handlerScroll();
  window.addEventListener('scroll', handlerScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handlerScroll);
});
</script>
