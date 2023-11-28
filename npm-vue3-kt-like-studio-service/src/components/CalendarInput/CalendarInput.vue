<template>
  <!-- <div class="datepicker" :class="[props.isDisabled && 'is-disabled']">
    <date-picker :value="props.modelValue" @input="updateValue"> -->
  <div class="datepicker">
    <date-picker v-model="date">
      <template #default="{ inputValue, togglePopover }">
        <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events -->
        <div
          class="datepicker__area"
          @click="togglePopover"
          role="button"
          tabindex="0"
        >
        <!-- <input
            class="datepicker__input"
            v-bind="$attrs"
            :value="inputValue"
            :disabled="isDisabled"
            readonly
          /> -->
          <input class="datepicker__input" :value="inputValue" readonly />
          <Icons icon-name="calender_bold" icon-color="var(--color-gray-777)" />
        </div>
      </template>
    </date-picker>
  </div>
</template>

<script setup>
import { DatePicker } from 'v-calendar';
import { ref, watch } from 'vue';

import Icons from '@/components/Icons/Icons.vue';

const date = ref(new Date());

const emit = defineEmits(['date']);

watch(date, (newValue) => {
  emit('date', newValue);
});

const props = defineProps({
  inputValue: {
    type: String,
    default: '',
  },
});

watch(() => props.inputValue, (newInputValue) => {
  date.value = newInputValue;
});

// const props = defineProps({
//   modelValue: {
//     type: String,
//     default: '',
//   },
//   isDisabled: {
//     type: Boolean,
//     default: false,
//   },
// });


// const emit = defineEmits(['update:modelValue']);

// const updateValue = (newValue) => {
//   console.log('CalendarInput', newValue);
//   emit('update:modelValue', newValue);
// };
</script>

<style scoped>
.datepicker {
  height: 4.6rem;
  border-radius: 0.4rem;
  border: 1px solid var(--color-gray-ddd);
  background: var(--color-neutrals-white-100);
}

.datepicker.is-disabled {
  background-color: #f6f6f6;
}

.datepicker:hover {
  border-color: var(--color-primary);
}

.datepicker__area {
  display: flex;
  align-items: center;
  gap: 0 1.2rem;
  height: 100%;
  padding: 0 1.6rem;
}

.datepicker__input {
  width: 7.4rem;
  font-size: var(--fz-m);
  line-height: 1;
}

.datepicker :deep(.vc-popover-caret) {
  display: none;
}

.datepicker :deep(.vc-pane) {
  min-width: 29.6rem;
}

.datepicker :deep(.vc-header) {
  height: auto;
  margin: 0;
  padding: 1rem;
  background-color: #f6f6f6;
}

.datepicker :deep(.vc-title) {
  position: relative;
  font-size: var(--fz-l);
  font-weight: 500;
  color: var(--color-neutrals-black);
  line-height: 1.4;
}

.datepicker :deep(.vc-arrow) {
  width: 24px;
  height: 24px;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 9999px;
  background: var(--color-neutrals-white-100);
}

.datepicker :deep(.vc-arrow) svg {
  width: 1.4rem;
}

.datepicker :deep(.vc-nav-item.is-active) {
  background-color: var(--color-primary);
}

:deep(.vc-weeks) {
  padding: 1.6rem;
}

:deep(.vc-week + .vc-week) {
  margin-top: 0.4rem;
}

:deep(.vc-weekdays) {
  margin-bottom: 1.2rem;
}

:deep(.vc-weekday) {
  padding: 0;
  font-size: var(--fz-s);
  font-weight: 500;
  color: var(--color-gray-777);
}

:deep(.vc-highlight-bg-solid) {
  width: 100%;
  height: 100%;
  background-color: var(--color-primary);
}

:deep(.vc-day) {
  min-height: 3.6rem;
}

:deep(.vc-day-content) {
  font-size: var(--fz-s);
}

:deep(.vc-monthly) .is-not-in-month * {
  opacity: 1;
  color: var(--color-gray-bbb);
}
</style>
