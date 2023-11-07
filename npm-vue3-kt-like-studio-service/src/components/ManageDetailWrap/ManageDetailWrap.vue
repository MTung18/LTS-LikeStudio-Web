<template>
  <div class="template container-1200">
    <div class="template__title-area">
      <h2 class="template__title">{{ props.title }}</h2>
      <p class="sub-txt">필수 입력 항목<b class="red">*</b></p>
    </div>
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
.template__title-area {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #000;
  padding-bottom: 1.6rem;
}
.template__title {
  text-align: center;
  font-size: var(--ttl-l);
  font-weight: 700;
  color: var(--color-neutrals-black);
}
.sub-txt {
  font-size: var(--fz-m);
  margin-top: auto;
}
.red {
  color: var(--color-primary);
}
.template {
  padding-top: 7.2rem;
  padding-bottom: 12rem;
}
</style>
