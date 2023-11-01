<template>
  <fs-input-group :prepend="$props.prepend">
    <fs-form-input classname="p-0 m-0" ref="inputRef" type="text" v-model="formattedValue" :label="label" :id="id"
      :name="name" :disabled="disabled" :readonly="readonly" :maxlength="maxlength" :max="maxvalue" :min="minvalue"
      :placeholder="placeholder" :class="{ 'fs-input__input--error inputError': errorBag.length > 0, classname }"
      class="fs-input__input" @blur="onBlur" @change="onChange" @input="onInput" />
  </fs-input-group>
</template>

<script lang="ts">
import { PropType, watch } from 'vue';
import { CurrencyInputOptions, useCurrencyInput } from 'vue-currency-input';
import { useFsInput } from '@/composables/useFsInput';

export default {
  name: 'FsCurrencyInput',
  props: {
    modelValue: Number, // Vue 2: value
    config: Object as PropType<CurrencyInputOptions>,
    id: String,
    type: String,
    inputType: {
      type: String,
      default: 'text'
    },
    name: String,
    disabled: Boolean,
    classname: String,
    placeholder: String,
    label: String,
    maxlength: Number,
    maxvalue: Number,
    minvalue: Number,
    readonly: Boolean,
    step: Number,
    warning: String,
    validationErrors: {
      type: Array as PropType<string[]>,
      default: () => []
    },
    pattern: String,
    showCharacterCount: Boolean,
    isRequired: {
      type: Boolean,
      default: false
    },
    errorBag: {
      type: Array as PropType<string[]>,
      default: (): string[] => []
    },
    prepend: String
  },
  emits: ['blur', 'input', 'change', 'update:modelValue'],
  setup(props, { emit }) {
    const { onBlur, onInput, onChange, onClick, myValue, characterCount } = useFsInput(emit, props, true);
    const { inputRef, setValue, formattedValue } = useCurrencyInput(props.config);

    watch(
      () => props.modelValue,
      (value: any) => {
        setValue(value);
      },
      { immediate: true, deep: true }
    )

    return {
      myValue,
      inputRef,
      formattedValue,
      onBlur,
      onInput,
      onChange,
      onClick
    }
  }
}
</script>