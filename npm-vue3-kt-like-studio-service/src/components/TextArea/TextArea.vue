<template>
  <label
    class="text-area"
    :for="textareaId"
    :class="[
      props.size,
      props.classBind,
      isDisabled && 'is-disabled',
      isFocused && 'is-focus',
    ]"
  >
    <textarea
      v-bind="$attrs"
      :value="props.modelValue"
      :id="props.textareaId"
      class="text-area__input"
      @input="$emit('update:modelValue', $event.target.value)"
      @focus="handleFocus"
      @blur="handleBlur"
    />
  </label>
</template>

<script setup>
import { ref, useAttrs, watchEffect } from 'vue';

const props = defineProps({
  textareaId: {
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
.text-area {
  display: inline-block;
  border-radius: 0.6rem;
  border: 1px solid var(--color-gray-ddd);
  overflow: hidden;
}

.text-area.medium {
  width: 100%;
}

.text-area.is-focus {
  border-color: var(--color-primary);
}

.text-area__input {
  display: inline-flex;
  align-items: center;
  width: 100%;
  font-size: var(--fz-m);
}

.text-area.large .text-area__input {
  min-width: 58rem;
  padding: 1.6rem 2rem;
  height: 28rem;
}

.text-area.medium .text-area__input {
  width: 100%;
  padding: 1.3rem 1.6rem;
  height: 11.8rem;
}

.text-area.is-disabled .text-area__input {
  background-color: #f6f6f6;
}

.text-area.medium .text-area__input {
  font-size: var(--fz-m);
}

.text-area__input::placeholder {
  color: var(--color-gray-777);
}
</style>
