<template>
    <fs-input-group>
        <fs-form-input
            v-model="myValue"
            type="password"
            :label="label"
            :id="id"
            :name="name"
            :disabled="disabled"
            :readonly="readonly"
            :maxlength="maxlength"
            :max="maxvalue"
            :min="minvalue"
            :placeholder="placeholder"
            :class="errorBag.length > 0 ? 'fs-input__input--error inputError' : ''"
            class="fs-input__input"
            @blur="onBlur"
            @change="onChange"
            @input="onInput" />
        <span v-if="showCharacterCount" class="fs-input__character-count">{{characterCount}} {{characterCount === 1 ? 'character' :'characters'}} left</span>
        <slot name="input-group-content"></slot>
    </fs-input-group>
</template>
<script lang="ts" src="./fsPasswordInput.ts"></script>
