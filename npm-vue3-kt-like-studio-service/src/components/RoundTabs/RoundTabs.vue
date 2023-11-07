<template>
  <button
    type="button"
    class="round-tabs"
    :class="[props.classBind, props.isSelected && 'is-selected']"
    @click="handleTabClick()"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  isSelected: {
    type: Boolean,
    default: false,
  },
  classBind: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['tab-selected']);

function handleTabClick(id) {
  emit('tab-selected', id);
}
</script>

<style scoped>
.round-tabs {
  position: relative;
  min-width: 20rem;
  padding-top: 1.6rem;
  padding-bottom: 1.4rem;
  font-size: var(--fz-xl);
  color: var(--color-gray-777);
  border-radius: 1.2rem 1.2rem 0 0;
}

.round-tabs::before {
  position: absolute;
  left: 0;
  bottom: 0;
  content: '';
  width: 100%;
  height: 1px;
  background-color: #fbc6c9;
}

.round-tabs.is-selected {
  background-color: #fef1f2;
  border: 1px solid #fbc6c9;
  border-bottom: 0;
  font-weight: 700;
  color: var(--color-primary);
}

.round-tabs.is-selected::before {
  display: none;
}
</style>
