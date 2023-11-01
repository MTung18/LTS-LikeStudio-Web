<template>
    <fs-form-select
        v-model="myValue"
        :aria-invalid="ariaInvalid"
        :autofocus="autofocus"
        :disabled="disabled"
        :disabled-field="disabledField"
        :form="form"
        :html-field="htmlField"
        :id="id"
        :label-field="labelField"
        :label="label"
        :multiple="multiple"
        :name="name"
        :options="options"
        :options-field="optionsField"
        :plain="plain"
        :required="required"
        :select-size="selectSize"
        :size="size"
        :state="state"
        :text-field="textField"
        :value-field="valueField"
        :class="errorBag?.length > 0 ? 'fs-input__input--error inputError' : ''"
        class="fs-input__input"
        @blur="onBlur"
        @change="onChange"
        @input="onInput" >
        <slot name="first"></slot>

    </fs-form-select>
</template>
<script lang="ts" src="./fsSelect.ts"></script>
