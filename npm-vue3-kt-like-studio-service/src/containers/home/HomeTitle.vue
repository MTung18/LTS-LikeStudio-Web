<template>
  <div class="wrap">
    <h2 class="wrap__title">{{ props.title }}</h2>
    <p class="wrap__desc">{{ props.desc }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.wrap {
  text-align: center;
  font-size: var(--ttl-xl);
}

.wrap__title {
  font-weight: 700;
}

.wrap__desc {
  font-weight: 300;
}
</style>
