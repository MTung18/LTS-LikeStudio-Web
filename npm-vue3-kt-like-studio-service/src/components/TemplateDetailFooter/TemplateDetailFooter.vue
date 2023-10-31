<template>
  <div class="detail-footer">
    <Button
      v-if="useRemoveButton"
      component="button"
      color-type="outlined"
      size="large"
      class-bind="!min-w-[14rem]"
      @click="onDeleteButton"
      >삭제</Button
    >
    <Button
      component="a"
      :href="props.toListHref"
      color-type="standard"
      size="large"
      class-bind="!min-w-[14rem]"
      >목록</Button
    >
  </div>
</template>

<script setup>
import Button from '@/components/Button/Button.vue';

const props = defineProps({
  useRemoveButton: {
    type: Boolean,
    default: false,
  },
  toListHref: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['on-delete']);
const onDeleteButton = () => {
  emit('on-delete', '삭제');
};
</script>

<style scoped>
.detail-footer {
  display: flex;
  justify-content: center;
  gap: 0 1rem;
}
</style>
