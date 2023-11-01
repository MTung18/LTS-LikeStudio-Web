<template>

    <fs-input-group>
        <fs-form-input
            v-model="myValue"
            type="date"
            :id="id"
            :name="name"
            :disabled="disabled"
            :readonly="readonly"
            :maxlength="maxlength"
            :placeholder="placeholder"
            class="fs-input__input fs-input__input--datepicker"
            :class="errorBag.length > 0 ? 'fs-input__input--error inputError' : ''"
            @blur="onBlur"
            @change="onChange"
            @input="onInput" />
            <fs-button :variant="errorBag.length > 0 ? 'outline-danger' : 'outline-success'" :disabled="disabled">
                <font-awesome-icon :icon="['fal', 'calendar-alt']" size="lg"/>
            </fs-button>
    </fs-input-group>

</template>
<script lang="ts" src="./fsDateInput.ts"></script>
