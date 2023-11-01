import { ref, Ref } from 'vue';
import { useEventHandler } from '@/composables/useEventHandler';

export function useAddressInputAndBlurEvent() {

    const address1Element: Ref<HTMLElement> = ref(null);
    const { onNative, offNative } = useEventHandler();

    function registerInputAndBlurEvent(addressId: string, blurEventCallBack: any, inputEventCallBack: any) {
        address1Element.value = document.getElementById(addressId);
        if (address1Element.value) {
            onNative('blur', blurEventCallBack, address1Element.value);
            onNative('input', inputEventCallBack, address1Element.value);
        }
    }
    function deRegisterInputAndBlurEvent(addressId: string, blurEventCallBack: any, inputEventCallBack: any) {
        if (address1Element.value) {
            offNative('blur', blurEventCallBack, address1Element.value);
            offNative('input', inputEventCallBack, address1Element.value);
        }
    }

    return {
        registerInputAndBlurEvent,
        deRegisterInputAndBlurEvent
    }

}

