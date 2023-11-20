<template>
  <div class="calendar__wrap">
    <CalendarInput @date="fromDate" />
    <span class="calendar__between">~</span>
    <CalendarInput @date="toDate" />
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
</script>

<style scoped>
.calendar__wrap {
  display: flex;
  align-items: center;
  gap: 0 1.2rem;
  margin-right: 1.7rem;
}

.calendar__between {
  font-size: var(--ttl-s);
}
</style>
