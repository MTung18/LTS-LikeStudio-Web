<template>
  <div
    class="search"
    :class="[
      props.styleType,
      props.colorType,
      props.size,
      props.classBind,
      isFocused ? 'is-focused' : '',
    ]"
  >
    <button type="button">
      <Icons
        icon-name="search"
        :width="props.size === 'large' ? 2.4 : 1.6"
        :height="props.size === 'large' ? 2.4 : 1.6"
      />
    </button>
    <label class="search__input-wrap">
      <input
        class="search__input"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="handleFocus"
        @blur="handleBlur"
        v-bind="$attrs"
      />
    </label>
    <button
      v-if="props.modelValue !== '' && props.modelValue.length > 0"
      type="button"
      @click="removeModelValue"
    >
      <Icons
        icon-name="delete_bold"
        icon-color="var(--color-gray-777)"
        :width="props.size === 'large' ? 2.4 : 1.6"
        :height="props.size === 'large' ? 2.4 : 1.6"
      />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

import Icons from '@/components/Icons/Icons.vue';

const props = defineProps({
  styleType: {
    type: String,
    default: 'rounded',
    validator(value) {
      return ['rounded', 'square'].includes(value);
    },
  },
  colorType: {
    type: String,
    default: 'black',
    validator(value) {
      return ['black', 'gray'].includes(value);
    },
  },
  size: {
    type: String,
    default: 'large',
    validator(value) {
      return ['large', 'medium'].includes(value);
    },
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  classBind: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);
const isFocused = ref(false);

const handleFocus = () => {
  isFocused.value = true;
};

const handleBlur = () => {
  isFocused.value = false;
};

const removeModelValue = () => {
  emit('update:modelValue', '');
};
</script>

<style scoped>
.search {
  display: inline-flex;
  align-items: center;
  gap: 0 1.2rem;
  width: 100%;
  border: 1px solid;
  background: var(--color-neutrals-white-100);
}

.search .search__input-wrap {
  flex: 1;
  text-align: left;
  line-height: 1;
}

.search.is-focused {
  border-color: var(--color-primary) !important;
}

.search.large {
  height: 5.6rem;
  padding: 0 2.4rem;
  font-size: var(--fz-xl);
  font-weight: 500;
}

.search.large .search__input {
  width: 100%;
  height: 2.4rem;
}

.search.large .search__input::placeholder {
  color: var(--color-gray-777);
  font-weight: 400;
}

.search.medium {
  padding: 0 1.6rem;
  height: 4.6rem;
  font-size: var(--fz-m);
}

.search.medium .search__input {
  width: 100%;
  height: 2rem;
}

.search.rounded {
  border-radius: 5.6rem;
}

.search.square {
  border-radius: 0.6rem;
}

.search.black {
  border-color: var(--color-neutrals-black);
}

.search.gray {
  border-color: var(--color-gray-ddd);
}
</style>
