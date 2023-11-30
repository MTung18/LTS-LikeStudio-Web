<template>
  <div class="template-edit-input" :class="[props.classBind, props.size]">
    <label :for="fieldsId" v-if="label" class="template-edit-input__label"
      >{{ props.label }}<span v-if="required" class="required">*</span></label
    >
    <div class="w-5/6">
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  fieldsId: {
    type: String,
    default: '',
  },
  required: {
    type: Boolean,
    default: false,
  },
  label: {
    type: String,
    default: '',
  },
  modelValue: {
    type: [String, Number],
    default: '',
  },
  size: {
    type: String,
    default: 'medium',
    validator(value) {
      return ['medium', 'small', 'xsmall'].includes(value);
    },
  },
  classBind: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.template-edit-input {
  display: flex;
  gap: 0 2rem;
  padding-bottom: 2.8rem;
}

.small.template-edit-input {
  padding-bottom: 1.4rem;
}

.template-edit-input:last-of-type {
  border-bottom: 1px solid var(--color-gray-ddd);
}

.template-edit-input__label {
  width: 18.3rem;
  padding: 1.3rem 0;
  font-size: var(--fz-m);
  font-weight: 700;
  line-height: 1;
}

.small .template-edit-input__label {
  width: 10rem;
}

.xsmall .template-edit-input__label {
  width: 10rem;
  padding: 0.6rem 0;
}

.required {
  font-size: var(--fz-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.template-edit-input__input-wrap {
  flex-grow: 1;
  flex-shrink: initial;
  min-width: 0;
  font-size: 0;
}
</style>
