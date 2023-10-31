<template>
  <button
    v-if="props.component === 'button'"
    type="button"
    class="button"
    :class="[
      props.size,
      props.colorType,
      props.classBind,
      isIcon ? 'is-icon' : '',
    ]"
    :disabled="props.disabled"
  >
    <slot />
  </button>
  <RouterLink
    v-else-if="props.component === 'a'"
    :to="props.href"
    class="button"
    :class="[
      props.size,
      props.colorType,
      props.classBind,
      isIcon ? 'is-icon' : '',
    ]"
    :disabled="props.disabled"
  >
    <slot />
  </RouterLink>
</template>

<script setup>
const props = defineProps({
  component: {
    type: String,
    required: true,
    default: 'button',
    validator(value) {
      return ['button', 'a'].includes(value);
    },
  },
  colorType: {
    type: String,
    required: true,
    default: 'standard',
    validator(value) {
      return ['standard', 'primary', 'outlined'].includes(value);
    },
  },
  size: {
    type: String,
    required: true,
    default: 'small',
    validator(value) {
      return ['big', 'large', 'medium', 'small'].includes(value);
    },
  },
  href: {
    type: String,
    default: '',
  },
  isIcon: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  classBind: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.button {
  display: inline-block;
  padding-left: 2.4rem;
  padding-right: 2.4rem;
  border-radius: 4rem;
  font-size: 1.6rem;
  font-weight: 700;
  text-align: center;
}

.button.is-icon {
  display: inline-flex;
  gap: 1rem;
  justify-content: center;
}

.button:disabled {
  pointer-events: none;
}

.button.big {
  min-width: 13.4rem;
  height: 5.8rem;
  padding-right: 2rem;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
  font-size: var(--ttl-s);
}

.button.large {
  min-width: 9.3rem;
  height: 5.6rem;
  padding-top: 1.7rem;
  padding-bottom: 1.7rem;
}

.button.medium {
  min-width: 9.3rem;
  height: 4.8rem;
  padding-top: 1.3rem;
  padding-bottom: 1.3rem;
}

.button.small {
  min-width: 8.7rem;
  height: 4rem;
  padding-top: 1rem;
  padding-bottom: 1rem;
  font-size: var(--fz-m);
}

.button.standard {
  color: var(--color-neutrals-white-100);
  background-color: var(--color-neutrals-black);
}

.button.standard:hover {
  background-color: var(--color-gray-444);
}

.button.standard:disabled {
  background-color: var(--color-gray-ddd);
  color: var(--color-gray-777);
}

.button.standard:disabled :deep(svg) {
  stroke: var(--color-gray-777) !important;
}

.button.outlined {
  border: 1px solid var(--color-neutrals-black);
  background-color: var(--color-neutrals-white-100);
}

.button.outlined:hover {
  border-color: var(--color-gray-777);
}

.button.outlined:disabled {
  border-color: var(--color-gray-ddd);
  color: var(--color-gray-ddd);
}

.button.primary {
  color: var(--color-neutrals-white-100);
  background-color: var(--color-primary);
}

.button.primary:hover {
  background-color: #8e7bff;
}

.button.primary:disabled {
  background-color: #f1efff;
  color: #ccc4ff;
}
</style>
