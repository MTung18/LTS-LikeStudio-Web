<template>
  <div>
    <NotCreatedTeamRoom v-if="notPossession" />
    <TeamRoomList v-else />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

import NotCreatedTeamRoom from '@/containers/my-studio/TeamRoom/NotCreatedTeamRoom.vue';
import TeamRoomList from '@/containers/my-studio/TeamRoom/TeamRoomList.vue';

const route = useRoute();
const { notPossession } = route.query;
</script>

<style scoped></style>
