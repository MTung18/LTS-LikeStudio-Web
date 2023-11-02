<template>
  <button
    v-if="props.component === 'button'"
    type="button"
    class="round-button"
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
    class="round-button"
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
    default: 'filed',
    validator(value) {
      return ['filed', 'outlined', 'lightOutlined'].includes(value);
    },
  },
  size: {
    type: String,
    required: true,
    default: 'medium',
    validator(value) {
      return ['medium', 'small'].includes(value);
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
.round-button {
  display: inline-block;
  padding-left: 1.8rem;
  padding-right: 1.8rem;
  border-radius: 0.4rem;
  font-size: var(--fz-m);
  font-weight: 500;
  text-align: center;
  line-height: 1;
}

.round-button.is-icon {
  display: inline-flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
  padding-left: 1.4rem;
  padding-right: 1.4rem;
}

.round-button:disabled {
  pointer-events: none;
}

.round-button.medium {
  min-width: 7.5rem;
  height: 4.6rem;
  padding-top: 1.3rem;
  padding-bottom: 1.3rem;
}

.round-button.small {
  min-width: 6.4rem;
  height: 3.6rem;
  padding-top: 0.8rem;
  padding-bottom: 0.8rem;
  font-size: var(--fz-s);
}

.round-button.filed {
  color: var(--color-neutrals-white-100);
  background-color: var(--color-neutrals-black);
}

.round-button.filed:hover {
  background-color: var(--color-gray-777);
}

.round-button.filed:disabled {
  background-color: var(--color-gray-ddd);
  color: var(--color-gray-777);
}

.round-button.outlined {
  border: 1px solid var(--color-neutrals-black);
  background-color: var(--color-neutrals-white-100);
}

.round-button.outlined:hover {
  border-color: var(--color-gray-777);
  color: var(--color-gray-777);
}

.round-button.outlined:disabled {
  border-color: var(--color-gray-ddd);
  color: var(--color-gray-bbb);
}

.round-button:disabled :deep(svg) {
  stroke: var(--color-gray-777) !important;
}

.round-button.lightOutlined {
  border: 1px solid var(--color-gray-ddd);
  background-color: var(--color-neutrals-white-100);
}

.round-button.lightOutlined:hover {
  border-color: var(--color-neutrals-black);
  color: var(--color-neutrals-black);
}

.round-button.lightOutlined:disabled {
  border-color: var(--color-gray-ddd);
  color: var(--color-gray-bbb);
}
</style>
