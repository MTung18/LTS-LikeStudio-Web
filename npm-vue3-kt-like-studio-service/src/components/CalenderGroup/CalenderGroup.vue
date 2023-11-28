<template>
  <div class="calendar__wrap">
    <!-- <CalendarInput
      :model-value="props.startDate"
      @update:modelValue="updateStartDate"
      :isDisabled="isDisabled"
    /> -->
    <CalendarInput :inputValue="fromDateValue" v-model="fromDateValue" @date="fromDate" />
    <span class="calendar__between">~</span>
    <CalendarInput :inputValue="toDateValue" v-model="toDateValue" @date="toDate" />
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
}

async function toDate(date) {
  toDateValue.value = moment(date).format("YYYY-MM-DD");
}

const emit = defineEmits(['fromDate', 'toDate']);
watch(fromDateValue, (newValue) => {
  emit('fromDate', newValue);
});
watch(toDateValue, (newValue) => {
  emit('toDate', newValue);
});

const props = defineProps({
  startDate: {
    type: String,
    default: null,
  },
  endDate: {
    type: String,
    default: null,
  }
});

watch(() => props.startDate, (newStartDate) => {
  fromDateValue.value = newStartDate;
});

watch(() => props.endDate, (newEndDate) => {
  toDateValue.value = newEndDate;
});
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
