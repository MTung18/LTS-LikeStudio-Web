import { library } from '@fortawesome/fontawesome-svg-core';
import { faAsterisk, faCheckSquare, faTimesCircle, faCheck, faInfoCircle } from '@fortawesome/pro-solid-svg-icons';
import { defineComponent, PropType, Ref, ref, watch } from 'vue';
import { useFsInput } from '@/composables/useFsInput';

library.add(
    faAsterisk,
    faTimesCircle,
    faCheck,
    faCheckSquare,
    faInfoCircle,
);

export default defineComponent({
    name: 'FsSelect',
    props: {
        ariaInvalid: {
            type: [Boolean, String],
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        },
        disabledField: {
            type: String,
            default: 'disabled'
        },
        form: String,
        htmlField: {
            type: String,
            default: 'html'
        },
        id: String,
        label: String,
        labelField: {
            type: String,
            default: 'label'
        },
        multiple: {
            type: Boolean,
            default: false
        },
        name: String,
        options: {
            type: [Array, Object] as PropType<any[] | object>,
            default: (): any[] => []
        },
        optionsField: {
            type: String,
            default: 'options'
        },
        plain: {
            type: Boolean,
            default: false
        },
        required: {
            type: Boolean,
            default: false
        },
        selectSize: {
            type: Number,
            default: 0
        },
        size: String,
        state: {
            type: Boolean,
            default: null
        },
        textField: {
            type: String,
            default: 'text'
        },
        modelValue: null,
        valueField: {
            type: String,
            default: 'value'
        },
        errorBag: {
            type: Array as PropType<String[]>,
            default: (): String[] => []
        }
    },
    emits: ['blur', 'input', 'change', 'click', 'update:modelValue'],
    setup(props, { emit }) {

        const { onBlur, onInput, onChange, onClick, myValue } = useFsInput(emit, props);

        return {
            myValue,
            onBlur,
            onInput,
            onChange,
            onClick
        };
    }
})