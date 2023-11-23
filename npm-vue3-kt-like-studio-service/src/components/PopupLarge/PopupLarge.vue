<template>
  <Teleport to="#popup" v-if="isOpen">
    <div class="popup large">
      <div class="popup__wrap">
        <div class="popup__area">
          <button
            type="button"
            v-if="props.useCloseButton"
            class="popup__close-button"
            @click="closePopup"
          >
            <Icons
              icon-name="delete_bold"
              icon-color="var(--color-neutrals-white-100)"
            />
          </button>
          <div class="popup__content" v-bind="$attrs">
            <slot />
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { onBeforeUnmount, onMounted, watch } from 'vue';

import Icons from '@/components/Icons/Icons.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  useCloseButton: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close-button']);

watch(
  () => props.isOpen,
  (newValue) => {
    if (newValue) {
      disableBodyScroll(document.body);
    } else {
      enableBodyScroll(document.body);
    }
  },
);

function closePopup() {
  emit('close-button', false);
}
onMounted(() => {
  if (props.isOpen) {
    disableBodyScroll(document.body);
  }
});

onBeforeUnmount(() => {
  enableBodyScroll(document.body);
});
</script>
<style scoped>
.popup {
  position: fixed;
  left: 0;
  top: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  overflow-y: auto;
  z-index: 9999;
}

.popup__wrap {
  position: relative;
  width: 100%;
}

.popup__area {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 11.1rem auto 15.6rem auto;
  padding: 0 24px;
}

.popup.large .popup__area {
  width: 120rem;
}

.popup__content {
  border-radius: 2.4rem;
  background-color: var(--color-neutrals-white-100);
}

.popup__close-button {
  position: absolute;
  right: -5.6rem;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.6rem;
  height: 4.6rem;
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
