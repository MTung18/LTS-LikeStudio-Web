import { computed, ComputedRef, ref, Ref, watch } from 'vue';

export function useFsInput(emit: any, props: any, isInputTypeNumber: boolean = false) {

    const myValue: Ref<any> = ref('');

    function onBlur(): void {
        emit('blur');
    }
    function onFocus(): void {
        emit('focus');
    }
    function onInput(input: string): void {
        emit('input', input);
    }

    function onChange(input: string): void {
        emit('change', input);
    }

    function onClick(): void {
        emit('click');
    }

    const characterCount: ComputedRef<number> = computed(() => {
        if (!myValue.value) return props.maxlength
        return props.maxlength - myValue.value.toString().length;
    });

    watch(
        () => props.modelValue,
        (newValue: any, _oldValue: any) => {
            myValue.value = newValue;
        },
        { immediate: true, deep: true }
    )

    watch(myValue, (newValue: any, _oldValue: any) => {
        if (isInputTypeNumber && props.inputType === 'number' && newValue) {
            const numberValue: number = Number(newValue);
            if (!isNaN(numberValue)) {
                emit('update:modelValue', numberValue);
                return;
            }
        }
        emit('update:modelValue', newValue);
    })

    return {
        myValue,
        characterCount,
        onBlur,
        onFocus,
        onInput,
        onChange,
        onClick
    };

}

