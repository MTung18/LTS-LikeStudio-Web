<template>
  <div class="template container-1200">
    <h2 class="template__title">{{ props.title }}</h2>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.template {
  padding-top: 7.2rem;
  padding-bottom: 12rem;
}

.template__title {
  text-align: center;
  font-size: var(--ttl-xl);
  font-weight: 700;
}
</style>
