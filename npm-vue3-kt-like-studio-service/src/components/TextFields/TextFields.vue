<template>
  <label
    class="text-fields"
    :for="props.inputId"
    :class="[
      props.size,
      props.classBind,
      isDisabled && 'is-disabled',
      isFocused && 'is-focus',
    ]"
  >
    <input
      v-bind="$attrs"
      :value="props.modelValue"
      :id="props.inputId"
      class="text-fields__input"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </label>
</template>

<script setup>
import { ref, useAttrs, watchEffect } from 'vue';

const props = defineProps({
  inputId: {
    type: String,
    required: true,
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  size: {
    type: String,
    default: 'large',
    validator(value) {
      return ['large', 'medium'].includes(value);
    },
  },
  classBind: {
    type: String,
    default: '',
  },
});
const attrs = useAttrs();
const isDisabled = ref(false);
const isFocused = ref(false);

watchEffect(() => {
  isDisabled.value = attrs.disabled !== undefined;
});
const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};
</script>

<style scoped>
.text-fields {
  display: inline-flex;
  align-items: center;
  border-radius: 0.6rem;
  border: 1px solid var(--color-gray-ddd);
}

.text-fields.is-disabled {
  background-color: #f6f6f6;
}

.text-fields.is-focus {
  border-color: var(--color-primary);
}

.text-fields.large {
  min-width: 58rem;
  padding: 1.6rem 2rem;
  height: 5.4rem;
}

.text-fields.medium {
  padding: 1.4rem 1.6rem;
  height: 4.8rem;
}

.text-fields__input {
  width: 100%;
  font-size: var(--fz-l);
}

.text-fields.medium .text-fields__input {
  font-size: var(--fz-m);
}

.text-fields__input::placeholder {
  color: var(--color-gray-777);
}
</style>
