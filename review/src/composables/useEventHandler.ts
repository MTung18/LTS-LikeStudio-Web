
export function useEventHandler() {

    function emitNative(eventName: string, value: any, element?: HTMLElement | any): void {
        const customEvent: Event = new CustomEvent(eventName, { detail: { value }, bubbles: true });
        (element ? element : document)?.dispatchEvent(customEvent);
    }

    function onNative(eventName: string, event: EventListenerOrEventListenerObject, element?: HTMLElement | any): void {
        (element ? element : document)?.addEventListener(eventName, event);
    }

    function offNative(eventName: string, event: EventListenerOrEventListenerObject, element?: HTMLElement | any): void {
        (element ? element : document)?.removeEventListener(eventName, event);
    }

    function addListeners(eventNames: string[], event: EventListenerOrEventListenerObject, element?: HTMLElement | any): void {
        eventNames.forEach((eventName: string) => {
            onNative(eventName, event, element);
        });
    }

    function removeListeners(eventNames: string[], event: EventListenerOrEventListenerObject, element?: HTMLElement | any): void {
        eventNames.forEach((eventName: string) => {
            offNative(eventName, event, element);
        });
    }

    return {
        emitNative,
        onNative,
        offNative,
        addListeners,
        removeListeners
    }
}