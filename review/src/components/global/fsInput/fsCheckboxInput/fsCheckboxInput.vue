<template>
    <fs-form-checkbox
        v-model="myChecked"
        :aria-label="ariaLabel"
        :aria-labelledby="ariaLabelledby"
        :autofocus="autofocus"
        :button="button"
        :button-varian="buttonVariant"
        :checked="checked"
        :disabled="disabled"
        :form="form"
        :id="id"
        :indeterminate="indeterminate"
        :inline="inline"
        :name="name"
        :plain="plain"
        :required="required"
        :size="size"
        :state="state"
        :switch="switcher"
        :type="type"
        :unchecked-value="uncheckedValue"
        :value="value"
        :validation-errors="validationErrors"
        :is-required="isRequired"
        :class="errorBag.length > 0 ? 'fs-checkbox--error' : ''"
        @change="onChange"
        @input="onInput" >
        <slot></slot>
    </fs-form-checkbox>
</template>
<script lang="ts" src="./fsCheckboxInput.ts"></script>
