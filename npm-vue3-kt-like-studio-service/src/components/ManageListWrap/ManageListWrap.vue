<template>
  <div class="template container-managelist">
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
.template__title {
  text-align: center;
  font-size: var(--ttl-xl);
  font-weight: 700;
}
.container-managelist {
  margin: 0 auto;
  padding: 0 40px;
}
.template {
  padding-top: 7.2rem;
  padding-bottom: 12rem;
}
</style>
