<template>
  <div class="icon-wrap" :class="props.classBind" :style="style">
    <component :is="iconNameRef" />
  </div>
</template>

<script setup>
import { computed } from 'vue';

import iconMapping from '@/components/Icons/iconMapping';

const props = defineProps({
  width: {
    type: Number,
    default: 2.4,
  },
  height: {
    type: Number,
    default: 2.4,
  },
  iconName: {
    type: String,
    default: '',
  },
  iconColor: {
    type: String,
    required: false,
    default: 'var(--color-neutrals-black)',
  },
  classBind: {
    type: String,
    default: '',
  },
});

const style = computed(() => ({
  '--icon-color': props.iconColor,
  width: `${props.width}rem`,
  height: `${props.height}rem`,
}));

const iconNameRef = computed(() => iconMapping[props.iconName]);
</script>

<style scoped>
.icon-wrap {
  --icon-color: #111;
}

.icon-wrap svg {
  stroke: var(--icon-color);
}
</style>
