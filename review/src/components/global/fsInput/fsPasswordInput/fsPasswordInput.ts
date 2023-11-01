import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { faAsterisk, faCheckSquare, faTimesCircle, faCheck, faInfoCircle, faEye } from '@fortawesome/pro-solid-svg-icons';
import { defineComponent, PropType } from 'vue';
import { useFsInput } from '@/composables/useFsInput';
library.add(
    faAsterisk as IconDefinition,
    faTimesCircle as IconDefinition,
    faCheck as IconDefinition,
    faCheckSquare as IconDefinition,
    faInfoCircle as IconDefinition,
    faEye as IconDefinition,
);

export default defineComponent({
    name: 'FsPasswordInput',
    props: {
        id: String,
        type: String,
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
        validationErrors: {
            type: Array as PropType<string[]>,
            default: (): string[] => []
        },
        pattern: String,
        showCharacterCount: Boolean,
        isRequired: {
            type: Boolean,
            default: false
        },
        modelValue: String,
        errorBag: {
            type: Array as PropType<string[]>,
            default: []
        }
    },
    emits: ['blur', 'input', 'change', 'click', 'update:modelValue'],
    setup(props, { emit }) {

        const { onBlur, onInput, onChange, onClick, myValue, characterCount } = useFsInput(emit, props);

        return {
            characterCount,
            myValue,
            onBlur,
            onInput,
            onChange,
            onClick
        };
    }
})