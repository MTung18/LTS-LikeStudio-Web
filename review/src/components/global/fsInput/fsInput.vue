<template>
  <VeeField
    :rules="rules"
    v-slot="{ errors, field }"
    :name="$attrs['data-vv-name']||$attrs.name"
    :ref="$attrs.name||$attrs['data-vv-name']"
    :value="myValue"
    :validateOnMount="validateOnMount"
    :validateOnInput="validateOnInput"
    :validateOnChange="validateOnChange"
    :validateOnBlur="validateOnBlur"
    :validateOnModelUpdate="validateOnModelUpdate"
  >
      <fs-form-group v-if="!appends"
          class="fs-input__form-group"
          v-bind="$attrs"
          v-bind:label="label"
          :labelClass="labelClass"
          :class="{'fs-input__form-group--tags' : $attrs.multiple}"
          > 
          <component 
              :is="type" 
              :config="type == 'fsCurrencyInput'? config : null"
              v-bind="$attrs, field"
              v-bind:label="label"
              v-model="myValue" 
              :class="errors?.length > 0 ? 'fs-input__form-group--error' : ''"
              :warning="warning" 
              :isRequired="($attrs.required === true || $attrs.required === '' || null)" 
              :errorBag="errors"
              :showClear="(showClear || null)"
              :appends="appends"
              :readonly="sensitiveContent ? !showSensitiveContent : $attrs['readonly']"
              @blur="showSensitiveContent = errors?.length > 0"
              @focus="showSensitiveContent = true"
            >
                <template #multiselect-label-icon="{option}">
                    <slot name="multiselect-label-icon" :option="option"></slot>
                </template>
                <template #prepend>
                    <slot name="prepend"></slot>
                </template>
                <template #append>
                    <slot name="append"></slot>
                </template>
                <template #input-group-content>
                    <slot name="input-group-content"></slot>
                </template>
                <template #multiselect-option-icon="{option}">
                  <slot name="multiselect-option-icon" :option="option"></slot>
                </template>
                <template #multiselect-after-list>
                  <slot name="multiselect-after-list"></slot>
                </template>
                <template #option-details="{option}">
                  <slot name="option-details" :option="option"></slot>
                </template>

                <template #sensitive-content v-if="sensitiveContent">                 
                  <div>                    
                    <fs-button
                      pill
                      variant="outline-green"
                      class="px-2 mx-2"
                      style="height: 19px; width: 30px; position: absolute; top: 50%; transform: translateY(-50%); z-index: 999;"
                      :style="{'right': type === 'fsDateInput' ? '45px' : '0px'}"
                      disabled
                    >
                      <font-awesome-icon
                        :icon="['fal', showSensitiveContent ? 'eye-slash' : 'eye']"
                        size="sm"
                      />
                    </fs-button>
                  </div>
                </template>
              <template><slot></slot></template>
          </component>

          <span v-if="errors[0]" 
            id="error" class="fs-input__message fs-input__message--error">
            {{ errors[0] }}
            <font-awesome-icon v-if="errors[0] && $attrs.showErrorTooltip && errors[0].includes('exists')"
              :icon="['fa', 'info-circle']" :id="`popover-${$attrs.popoverTarget}`" />
          </span>
          <span v-else-if="warning && !errors[0]" id="warning" 
            class="fs-input__message fs-input__message--warning"
            v-bind:class="$attrs.warningClass">
            {{ warning }}
            <font-awesome-icon v-if="warning && $attrs.showTooltip" :icon="['fa', 'info-circle']"
              :id="`popover-${$attrs.popoverTarget}`" />
          </span>
          <span v-if="$attrs.isRequired&&!$attrs.hideIndicator" class="fs-input__table-required-indicator">
            <font-awesome-icon :icon="['fas', 'asterisk']" class="text-danger" />
          </span>
          <slot name="fs-input-message"></slot>

          <span :style="{ display: 'none'}"></span>

          <template #label>
              {{ label }}
              <font-awesome-icon :icon="['fas', 'asterisk']" v-if="$attrs.required&&!$attrs.hideIndicator" class="fs-input__indicator" />
          </template>
      </fs-form-group>
      <component v-else :is="type" 
              v-bind="$attrs, field"
              v-bind:label="label"
              v-model="myValue" 
              :class="errors?.length > 0 ? 'fs-input__form-group--error' : ''"
              :warning="warning" 
              :isRequired="($attrs.required === true || $attrs.required === '' || null)" 
              :errorBag="errors"
              :showClear="(showClear || null)"
              :appends="appends"
            >
          </component> 
             
  </VeeField>
</template>
<script lang="ts" src="./fsInput.ts"></script>
