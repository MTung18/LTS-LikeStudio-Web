<template>
  <button
    type="button"
    class="tabs"
    :class="[props.type, props.selected && 'selected']"
  >
    <slot />
  </button>
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'block',
    validator(value) {
      return ['block', 'underbar'].includes(value);
    },
  },
  selected: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.tabs.block {
  min-width: 8.2rem;
  padding: 0 2.6rem;
  height: 4.8rem;
  line-height: 4.8rem;
  border-radius: 4.8rem;
  font-size: var(--fz-l);
  font-weight: 500;
  border: 1px solid var(--color-gray-ddd);
  color: var(--color-neutrals-black);
}

.tabs.block.selected {
  background-color: var(--color-neutrals-black);
  border-color: var(--color-neutrals-black);
  color: var(--color-neutrals-white-100);
}

.tabs.underbar {
  position: relative;
  font-size: var(--fz-xl);
  color: var(--color-gray-444);
  padding-bottom: 1rem;
}

.tabs.underbar.selected {
  font-weight: 700;
  color: var(--color-primary);
}

.tabs.underbar::before {
  position: absolute;
  left: 0;
  bottom: 0;
  content: '';
  width: 100%;
  height: 2px;
}

.tabs.underbar.selected::before {
  background-color: var(--color-primary);
}
</style>
