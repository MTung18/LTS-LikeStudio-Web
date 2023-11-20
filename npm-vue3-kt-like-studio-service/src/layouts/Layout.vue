<template>
  <component :is="layoutComponent">
    <slot />
  </component>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';

import DefaultLayout from '@/layouts/DefaultLayout.vue';
import AnotherLayout from '@/layouts/NoHeaderFooterLayout.vue';

const route = useRoute();
const layoutComponent = computed(() => {
  const layoutName = route.meta.layout || 'DefaultLayout';
  if (layoutName === 'DefaultLayout') {
    return DefaultLayout;
  }
  return AnotherLayout;
});
</script>

<style scoped></style>
