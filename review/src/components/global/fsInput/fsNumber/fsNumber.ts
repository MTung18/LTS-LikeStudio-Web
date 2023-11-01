import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { faAsterisk, faCheckSquare, faTimesCircle, faCheck, faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { useFsInput } from '@/composables/useFsInput';
import { defineComponent, PropType } from 'vue';
library.add(
    faAsterisk as IconDefinition,
    faTimesCircle as IconDefinition,
    faCheck as IconDefinition,
    faCheckSquare as IconDefinition,
    faInfoCircle as IconDefinition,
);

export default defineComponent({
    name: 'FsNumber',
    props: {
        appends: Boolean,
        id: String,
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
        isDecimal:  {
            type: Boolean,
            default: false
        },
        allowedDigits: {
            type: Number,
            default: 0
        }, 
        validationErrors:
        {
            type: Array as PropType<string[]>,
            default: () => []
        },
        pattern: String,
        showCharacterCount: Boolean,
        isRequired: {
            type: Boolean,
            default: false
        },
        modelValue: null,
        errorBag: {
            type: Array as PropType<string[]>,
            default: (): string[] => []
        }
    },
    emits: ['blur', 'input', 'change', 'click', 'update:modelValue'],
    setup(props, { emit }) {

        const { onBlur, onInput, onChange, onClick, myValue, characterCount } = useFsInput(emit, props, true);

        return {
            myValue,
            characterCount,
            onBlur,
            onInput,
            onChange,
            onClick
        };
    }
})

