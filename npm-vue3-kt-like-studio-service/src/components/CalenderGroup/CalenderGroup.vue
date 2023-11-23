<template>
  <div class="calendar__wrap">
    <!-- <CalendarInput
      :model-value="props.startDate"
      @update:modelValue="updateStartDate"
      :isDisabled="isDisabled"
    /> -->
    <CalendarInput @date="fromDate" />
    <span class="calendar__between">~</span>
    <CalendarInput @date="toDate" />
    <!-- <CalendarInput
      :model-value="props.endDate"
      @update:modelValue="updateEndDate"
      :isDisabled="isDisabled"
    /> -->
  </div>
</template>

<script setup>
import CalendarInput from '@/components/CalendarInput/CalendarInput.vue';
import moment from 'moment';
import { ref, watch } from 'vue';
const fromDateValue = ref();
const toDateValue = ref();

async function fromDate(date) {
  fromDateValue.value = moment(date).format("YYYY-MM-DD");
  console.log("fromDateValue: ", fromDateValue.value);
}

async function toDate(date) {
  toDateValue.value = moment(date).format("YYYY-MM-DD");
  console.log("toDateValue: ", toDateValue.value);
}

const emit = defineEmits(['fromDate', 'toDate']);
watch(fromDateValue, (newValue) => {
  emit('fromDate', newValue);
});
watch(toDateValue, (newValue) => {
  emit('toDate', newValue);
});

// const props = defineProps({
//   startDate: {
//     type: String,
//     default: null,
//   },
//   endDate: {
//     type: String,
//     default: null,
//   },
//   isDisabled: {
//     type: Boolean,
//     default: false,
//   },
// });

// const emit = defineEmits(['update:startDate', 'update:endDate']);

// const updateStartDate = (newValue) => {
//   console.log('updateStartDate', newValue);
//   emit('update:startDate', newValue);
// };
// const updateEndDate = (newValue) => {
//   console.log('updateEndDate', newValue);
//   emit('update:endDate', newValue);
// };
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
