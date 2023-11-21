<template>
  <div class="template">
    <h2 class="template__title">{{ props.title }}</h2>
    <div
      :class="[
        props.containerSize === 'full' ? 'container-full' : 'container-1200',
      ]"
    >
      <slot />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  containerSize: {
    type: String,
    default: 'default',
    validator(value) {
      return ['full', 'default'].includes(value);
    },
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
