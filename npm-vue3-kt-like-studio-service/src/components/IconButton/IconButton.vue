<template>
  <button
    v-if="props.component === 'button'"
    type="button"
    class="button"
    :class="[props.size, props.type, props.classBind]"
  >
    <Icons
      :width="props.size === 'large' || props.size === 'medium' ? 2.4 : 1.4"
      :height="props.size === 'large' || props.size === 'medium' ? 2.4 : 1.4"
      :icon-name="props.iconName"
      :icon-color="props.iconColor"
    />
  </button>
  <RouterLink
    v-else-if="props.component === 'a'"
    :to="props.href"
    class="button"
    :class="[props.size, props.type, props.classBind]"
  >
    <Icons
      :width="props.size === 'large' || props.size === 'medium' ? 2.4 : 1.4"
      :height="props.size === 'large' || props.size === 'medium' ? 2.4 : 1.4"
      :icon-name="props.iconName"
      :icon-color="props.iconColor"
    />
  </RouterLink>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';

const props = defineProps({
  component: {
    type: String,
    required: true,
    default: 'button',
    validator(value) {
      return ['button', 'a'].includes(value);
    },
  },
  href: {
    type: String,
    default: '',
  },
  type: {
    type: String,
    required: true,
    default: 'outlined',
    validator(value) {
      return ['outlined', 'filled'].includes(value);
    },
  },
  size: {
    type: String,
    required: true,
    default: 'large',
    validator(value) {
      return ['large', 'medium', 'semi-medium', 'small'].includes(value);
    },
  },
  iconName: {
    type: String,
    required: true,
    default: '',
  },
  iconColor: {
    type: String,
    default: 'var(--color-neutrals-black)',
  },
  classBind: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.button.outlined {
  border: 1px solid var(--color-gray-ddd);
  border-radius: 9999px;
}

.button.outlined:hover {
  border-color: var(--color-neutrals-black);
}

.button.outlined.large {
  width: 4.8rem;
  height: 4.8rem;
}

.button.outlined.medium {
  width: 4rem;
  height: 4rem;
}

.button.outlined.semi-medium {
  width: 3.4rem;
  height: 3.4rem;
}

.button.outlined.small {
  width: 2.4rem;
  height: 2.4rem;
}

.button.filed.medium {
  width: 4.6rem;
  height: 4.6rem;
}

.button.filed.small {
  width: 2.4rem;
  height: 2.4rem;
}
</style>
