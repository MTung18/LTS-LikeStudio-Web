<template>
  <div>
    <NotPossessionProject v-if="notPossession" />
    <PossessionProject v-else />
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

import NotPossessionProject from '@/containers/my-studio/MyProject/NotPossessionProject.vue';
import PossessionProject from '@/containers/my-studio/MyProject/PossessionProject.vue';

const route = useRoute();
const { notPossession } = route.query;
</script>

<style scoped></style>
