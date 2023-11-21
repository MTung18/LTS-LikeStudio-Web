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
    v-bind="$attrs"
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
    v-bind="$attrs"
    :disabled="props.disabled"
  >
    <slot />
  </RouterLink>
</template>

<script setup>
/** *
 * @
 */
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
  display: inline-flex;
  padding-left: 2.4rem;
  padding-right: 2.4rem;
  border-radius: 4rem;
  font-size: var(--fz-l);
  font-weight: 700;
  text-align: center;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.button.is-icon {
  display: inline-flex;
  gap: 1rem;
  justify-content: center;
  align-items: center;
}

.button:disabled {
  pointer-events: none;
}

.button.big {
  min-width: 13.4rem;
  height: 5.8rem;
  padding-right: 2rem;
  padding-top: 1.6rem;
  padding-bottom: 1.4rem;
  font-size: var(--ttl-s);
}

.button.large {
  min-width: 9.3rem;
  height: 5.6rem;
  padding-top: 1.8rem;
  padding-bottom: 1.6rem;
}

.button.medium {
  min-width: 9.3rem;
  height: 4.8rem;
  padding-top: 1.4rem;
  padding-bottom: 1.2rem;
}

.button.small {
  min-width: 8.7rem;
  height: 4rem;
  padding: 1.1rem 2.2rem 0.9rem 2.2rem;
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
  background-color: #f4777c;
}

.button.primary:disabled {
  background-color: #fcddde;
  color: #f4777c;
}
</style>
