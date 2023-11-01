<template>
    <fs-input-group v-if="!appends">
        <template #prepend><slot name="prepend"></slot></template>
        <fs-form-input
        v-model="myValue"
        type="number"
        :label="label"
        :id="id"
        :name="name"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :max="maxvalue"
        :min="minvalue"
        :placeholder="placeholder"
        :step="step"
        :class="{ 'fs-input__input--error inputError' : errorBag.length > 0, classname }"
        class="fs-input__input"
        @blur="onBlur"
        @change="onChange"
        @input="onInput" />
        <slot name="input-group-content"></slot>
        <template #append><slot name="append"></slot></template>
        <slot name="sensitive-content"></slot>
        <span v-if="showCharacterCount" class="fs-input__character-count">{{characterCount}} {{characterCount === 1 ? 'character' :'characters'}} left</span>
    </fs-input-group>
    <fs-form-input
        v-else
        v-model="myValue"
        type="number"
        :label="label"
        :id="id"
        :name="name"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :max="maxvalue"
        :min="minvalue"
        :placeholder="placeholder"
        :step="step"
        :class="{ 'fs-input__input--error inputError' : errorBag.length > 0, classname }"
        class="fs-input__input"
        @blur="onBlur"
        @change="onChange"
        @input="onInput" />
</template>
<script lang="ts" src="./fsNumber.ts"></script>
