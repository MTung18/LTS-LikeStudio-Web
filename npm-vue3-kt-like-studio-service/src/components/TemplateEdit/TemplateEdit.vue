<template>
  <div class="edit container-1200">
    <div class="edit__head">
      <h2 class="edit__title">{{ props.title }}</h2>
      <span class="edit__desc">
        필수 입력 항목 <span class="edit__required">*</span></span
      >
    </div>
    <div class="edit__body">
      <div class="edit__body__fields">
        <slot />
      </div>
    </div>
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
.edit {
  padding-top: 7.2rem;
  padding-bottom: 17.7rem;
}

.edit__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-neutrals-black);
}

.edit__title {
  font-size: var(--ttl-l);
  font-weight: 700;
}

.edit__desc {
  font-size: var(--fz-m);
  font-weight: 500;
}

.edit__required {
  font-size: var(--fz-xl);
  font-weight: 700;
  color: var(--color-primary);
}

.edit__body {
  padding-top: 4rem;
}
</style>
