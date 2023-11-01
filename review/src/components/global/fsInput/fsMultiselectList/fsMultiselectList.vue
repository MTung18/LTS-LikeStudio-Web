<template>
    <div class="multiselect__wrapper">
        <multiselect 
            v-model="myValue" 
            v-bind="$attrs"
            :placeholder="placeholder" 
            :disabled="disabled"
            :options="typeaheaddata" 
            :label="typeaheadkey" 
            :track-by="typeaheadvalueattribute"
            :customLabel="customLabel"
            :showLabels="false"
            :multiple="multiple"
            :close-on-select="closeOnSelect"
            :class="{'multiselect--tags' : multiple, 'fs-input__input--error inputError': errorBag.length > 0}"
            :ref="`multiselect${id}`"
            :taggable="taggable"
            :tagPlaceholder="tagPlaceholder"
            @open="onMultiSelectOpen"
            @tag="createNew"
            @select="onSelect"
            @remove="onRemove"
            >
            <!-- Single Label Slot -->
            <template v-slot:singleLabel="props">
                <slot name="multiselect-label-icon" :option="props.option"></slot>
                {{ getOptionLabel(props.option, typeaheadkey) }}
            </template>
            <!-- Option Slot -->
            <template v-slot:option="props">
                <span v-if="props.option.$isLabel" class="option__title group__header">{{ props.option.$groupLabel }}</span>
                <span v-else class="multiselect__option-span d-flex" :class="{ disabled__option : props.option.$isDisabled, 'multiselct__option--inactive':  isInactive(props.option) }">
                    <div :class="{'inactive': isInactive(props.option)}">
                        <span v-if="showCheck">
                            <font-awesome-icon v-if="multiselectOptionIsSelected(props.option)" :icon="['fas', 'check']" class="multiselect__icon--selected multiselect__icon" />
                        </span>
                        <slot v-if="!tagErrorOnlyOnSelected" name="multiselect-option-icon" :option="props.option"></slot>
                        <span>{{ getOptionLabel(props.option, typeaheadkey) }}</span>
                        <span v-if="sublabel" class="d-block">{{ props.option[sublabel]}}</span>
                    </div>
                </span>
                <slot name="option-details" :option="props.option"></slot>
            </template>
            <!-- Slot at the end of options list -->
            <template v-if="$slots['multiselect-after-list']" #afterList>
                <slot name="multiselect-after-list"></slot>
            </template>
            <template #tag="props">
                <fs-button-group size="sm" class="multiselect__btn-tag">
                    <fs-button :variant="isTagError(props.option) ? 'danger' : isTagErrorAlt(props.option) ? 'warning' : 'cyan'" class="multiselect__btn-tag-label" disabled>
                        <slot name="multiselect-option-icon" :option="props.option"></slot>
                        <span>{{ getOptionLabel(props.option, typeaheadkey) }}</span>
                        <div>
                            <span v-if="sublabel" class="d-block">{{ props.option[sublabel]}}</span>
                        </div>
                    </fs-button>
                    <div class="btn multiselect__btn-tag-close" :class="isTagError(props.option)? 'btn-danger' : isTagErrorAlt(props.option) ? 'btn-warning' :'btn-cyan'"
                         @keypress.enter.prevent="props.remove(props.option)"
                         @mousedown.prevent=""
                         @mouseup.prevent="props.remove(props.option)"
                    >
                        <font-awesome-icon :icon="['fal','times']"/>
                    </div>
                </fs-button-group>
            </template>

        </multiselect>
        <fs-button 
            v-if="showClearButton"
            variant="link"
            class="fs-input__button fs-input__button--right"
            tabindex="-1"
            @click="clearValue">
            <font-awesome-icon tabindex="-1" :icon="['fas', 'times-circle']" class="fs-input__button-icon fs-input__button-icon--right" />
        </fs-button>
    </div>
</template>
<script lang="ts" src="./fsMultiselectList.ts"></script>
