<template>
  <button type="button" class="favor-btn" @click="toggleActive">
    <Icons icon-name="bookmark" v-show="isActive" />
    <Icons icon-name="bookmark_filled" v-show="!isActive" />
  </button>
</template>

<script setup>
import { ref } from 'vue';

import Icons from '@/components/Icons/Icons.vue';

const isActive = ref(false);
function toggleActive() {
  isActive.value = !isActive.value;
}
</script>

<style scoped>
.favor-btn {
  padding: 1.1rem;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 50%;
}
</style>
