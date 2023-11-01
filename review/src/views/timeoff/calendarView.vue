<script setup lang="ts">
import calendar from '@/components/viewComponents/timeoff/calendar.vue'
</script>

<template>
  <div class="hq-pg d-flex flex-column pb-0">
    <fs-container fluid class="contain hq-pg__header">
      <fs-row align-v="center">
        <fs-col>
            <h2 class="hq-pg__title">Calendar View</h2>

        </fs-col>
      </fs-row>
    </fs-container>

    <div class="dashboard-card__content list__table">
      <calendar />
    </div>
  </div>
</template>
