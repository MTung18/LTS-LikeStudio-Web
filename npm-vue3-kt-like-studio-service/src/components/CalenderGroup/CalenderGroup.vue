<template>
  <div class="calendar__wrap">
    <CalendarInput />
    <span class="calendar__between">~</span>
    <CalendarInput />
  </div>
</template>

<script setup>
import CalendarInput from '@/components/CalendarInput/CalendarInput.vue';
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
