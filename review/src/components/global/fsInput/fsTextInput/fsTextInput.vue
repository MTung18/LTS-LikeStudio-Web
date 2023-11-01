<template>
    <fs-input-group v-if="!appends">
        <template #prepend><slot name="prepend"></slot></template>
        <fs-form-input
            v-model="myValue"
            :type="inputType"
            :label="label"
            :id="id"
            :name="name"
            :disabled="disabled"
            :readonly="readonly"
            :maxlength="maxlength"
            :max="maxvalue"
            :min="minvalue"
            :step="step"
            :placeholder="placeholder"
            :class="{ 'fs-input__input--error inputError' : errorBag.length > 0, classname }"
            :data-maska="maskFormat"
            class="fs-input__input"
            @blur="onBlur"
            @focus="onFocus"
            @change="onChange"
            @input="onInput" 
            v-maska />
        <slot name="input-group-content"></slot>
        <template #append><slot name="append"></slot></template>
        <slot name="sensitive-content"></slot>
        <span v-if="showCharacterCount" class="fs-input__character-count">{{characterCount}} {{characterCount === 1 ? 'character' :'characters'}} left</span>
    </fs-input-group>
    <fs-form-input
        v-else
        v-model="myValue"
        :type="inputType"
        :label="label"
        :id="id"
        :name="name"
        :disabled="disabled"
        :readonly="readonly"
        :maxlength="maxlength"
        :max="maxvalue"
        :min="minvalue"
        :placeholder="placeholder"
        :class="{ 'fs-input__input--error inputError' : errorBag.length > 0, classname }"
        :data-maska="maskFormat"
        class="fs-input__input"
        @blur="onBlur"
        @focus="onFocus"
        @change="onChange"
        @input="onInput"
        v-maska
        style="max-width: 25%;" />
</template>
<script lang="ts" src="./fsTextInput.ts"></script>
