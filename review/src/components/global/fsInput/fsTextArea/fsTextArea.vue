<template>
    <fs-form-textarea
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
        :rows="rows"
        :max-rows="maxrows"
        :class="errorBag.length > 0 ? 'fs-input__input--error' : ''"
        class="fs-input__input"
        @blur="onBlur"
        @change="onChange"
        @input="onInput" />
    <span v-if="showCharacterCount" class="fs-input__character-count">{{characterCount}} {{characterCount === 1 ? 'character' :'characters'}} left</span>
</template>
<script lang="ts" src="./fsTextArea.ts"></script>
