<template>
  <div class="calendar__wrap">
    <CalendarInput
      :model-value="props.startDate"
      @update:modelValue="updateStartDate"
      :isDisabled="isDisabled"
    />
    <span class="calendar__between">~</span>
    <CalendarInput
      :model-value="props.endDate"
      @update:modelValue="updateEndDate"
      :isDisabled="isDisabled"
    />
  </div>
</template>

<script setup>
import CalendarInput from '@/components/CalendarInput/CalendarInput.vue';

const props = defineProps({
  startDate: {
    type: String,
    default: null,
  },
  endDate: {
    type: String,
    default: null,
  },
  isDisabled: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['update:startDate', 'update:endDate']);

const updateStartDate = (newValue) => {
  console.log('updateStartDate', newValue);
  emit('update:startDate', newValue);
};
const updateEndDate = (newValue) => {
  console.log('updateEndDate', newValue);
  emit('update:endDate', newValue);
};
</script>

<style scoped>
.calendar__wrap {
  display: flex;
  align-items: center;
  gap: 0 0.8rem;
}

.calendar__between {
  font-size: var(--ttl-s);
}
</style>
