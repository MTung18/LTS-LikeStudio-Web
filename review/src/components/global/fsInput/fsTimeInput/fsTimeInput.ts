import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { faClock } from '@fortawesome/pro-light-svg-icons';
import { useFsInput } from '@/composables/useFsInput';
import { defineComponent, PropType, Ref, ref, watch } from 'vue';

library.add(
    faClock as IconDefinition,
);


export default defineComponent({
    name: 'fsTimeInput',
    props: {
        id: String,
        disabled: Boolean,
        readonly: Boolean,
        maxlength: Number,
        placeholder: String,
        name: String,
        modelValue: String,
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
