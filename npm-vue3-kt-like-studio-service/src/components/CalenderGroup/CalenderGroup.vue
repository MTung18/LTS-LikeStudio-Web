<template>
  <div class="calendar__wrap">
    <CalendarInput :inputValue="fromDateValue" v-model="fromDateValue" @date="fromDate" />
    <span class="calendar__between">~</span>
    <CalendarInput :inputValue="toDateValue" v-model="toDateValue" @date="toDate" />
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
