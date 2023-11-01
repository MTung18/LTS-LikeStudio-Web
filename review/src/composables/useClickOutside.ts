import { Ref, onMounted, onBeforeUnmount } from "vue";

export function useClickOutside(el: Ref<Element>, fn: () => void) {
  const listener = (event) => {
    if (!el) return;

    if (
      event.target !== el.value &&
      event.composedPath().includes(el.value)
    ) {
      return;
    }

    fn();
  };

  onMounted(() => {
    window.addEventListener('click', listener);
  })

  onBeforeUnmount(() => {
    window.addEventListener('click', listener);
  })

  return {
    listener
  }
}