<template>
  <div class="detail-answer">
    <div class="detail-answer__tag">라이크 스튜디오의 답변입니다.</div>
    <div class="detail-answer__content">{{ props.content }}</div>
    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  content: {
    type: String,
    required: true,
    default: '',
  },
});
</script>

<style scoped>
.detail-answer {
  position: relative;
  padding-top: 6rem;
  padding-bottom: 6rem;
}

.detail-answer::after {
  position: absolute;
  top: -1px;
  left: 0;
  content: '';
  width: 100%;
  height: 1px;
  background-color: var(--color-primary);
}

.detail-answer__tag {
  display: inline-block;
  min-width: 20.2rem;
  height: 4.4rem;
  line-height: 4.4rem;
  margin-bottom: 2rem;
  border-radius: 0.6rem;
  text-align: center;
  background-color: var(--color-primary);
  font-size: var(--fz-m);
  font-weight: 700;
  color: var(--color-neutrals-white-100);
}

.detail-answer__content {
  margin-bottom: 4rem;
}
</style>
