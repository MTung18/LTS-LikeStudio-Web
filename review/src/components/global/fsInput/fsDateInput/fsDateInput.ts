import { IconDefinition, library } from '@fortawesome/fontawesome-svg-core';
import { faCalendarAlt } from '@fortawesome/pro-light-svg-icons';
import { useFsInput } from '@/composables/useFsInput';
import { defineComponent, PropType, Ref, ref, watch } from 'vue';
import moment from "moment";

library.add(
    faCalendarAlt as IconDefinition,
);

export default defineComponent({
    name: 'FsDateInput',
    props: {
        id: String,
        name: String,
        disabled: Boolean,
        readonly: Boolean,
        maxlength: Number,
        placeholder: String,
        modelValue: {
            type: [Date, String] as PropType<Date | string>,
        },
        errorBag: {
            type: Array as PropType<string[]>,
            default: (): string[] => []
        }
    },
    emits: ['blur', 'input', 'change', 'click', 'update:modelValue'],
    setup(props, { emit }) {

        const { onBlur, onInput, onChange, onClick } = useFsInput(emit, props);

        const myValue: Ref<any> = ref('');

        watch(() => props.modelValue,
            (newValue: any, _oldValue: any) => {
                if (newValue) {
                    myValue.value = moment(newValue).format('YYYY-MM-DD');
                } else {
                    myValue.value = '';
                }
            },
            { immediate: true, deep: true }
        );

        watch(myValue, (newValue: any, _oldValue: any) => {
            if (props.modelValue instanceof Date) {
                /* 
                In case the model value type is 'date',
                the value received from fs-form-input (the actual HTML date picker) is cast to a date.
                Otherwise, it means it received a string, and it will return a string. 
                */
                emit('update:modelValue', new Date(newValue));
            }
            else {
                emit('update:modelValue', newValue);
            }
        });

        return {
            myValue,
            onBlur,
            onInput,
            onChange,
            onClick
        };
    }
})