<template>
  <div class="template-edit-input">
    <label :for="fieldsId" v-if="label" class="template-edit-input__label"
      >{{ props.label }}<span v-if="required" class="required">*</span></label
    >
    <div class="template-edit-input__input-wrap">
      <TextFields
        v-if="component === 'input'"
        v-bind="$attrs"
        :input-id="props.fieldsId"
        :model-value="modelValue"
        class-bind="template-edit-input__fields"
      />
      <TextArea
        v-else-if="component === 'textarea'"
        v-bind="$attrs"
        :textarea-id="props.fieldsId"
        :model-value="modelValue"
        class-bind="template-edit-input__fields"
      />
      <p v-if="error" class="edit__input-error">에러 메세지 입니다.</p>
    </div>
  </div>
</template>

<script setup>
import TextArea from '@/components/TextArea/TextArea.vue';
import TextFields from '@/components/TextFields/TextFields.vue';

const props = defineProps({
  fieldsId: {
    type: String,
    required: true,
  },
  component: {
    type: String,
    required: true,
    default: 'input',
    validator(value) {
      return ['input', 'textarea'].includes(value);
    },
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
  error: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.template-edit-input {
  display: flex;
  gap: 0 2rem;
  padding-bottom: 4rem;
}

.template-edit-input:last-of-type {
  border-bottom: 1px solid var(--color-gray-ddd);
}

.template-edit-input__label {
  width: 18.3rem;
  padding: 1.45rem 0;
  font-size: var(--fz-xl);
  font-weight: 700;
}

.required {
  font-size: var(--fz-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.template-edit-input__input-wrap {
  flex-grow: 1;
}

.template-edit-input__fields {
  width: 100%;
}
</style>
