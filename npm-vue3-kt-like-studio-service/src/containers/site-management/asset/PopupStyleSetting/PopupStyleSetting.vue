<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="스타일 설정"
    @close-button="handleClose"
  >
    <div class="fields pb-[2.4rem] border-b-[1px] border-gray-gray-ddd">
      <p class="fields__title">사용구분</p>
      <div class="fields__option">
        <Radio :check-list="'제목용'" :id="'use1'" :name="'use'" />
        <Radio :check-list="'본문용'" :id="'use2'" :name="'use'" />
        <Radio :check-list="'기타'" :id="'use3'" :name="'use'" />
      </div>
    </div>

    <div class="fields fields pt-[2.4rem]">
      <p class="fields__title">형태</p>
      <div class="fields__option">
        <Radio :check-list="'고딕'" :id="'form1'" :name="'form'" />
        <Radio :check-list="'명조'" :id="'form2'" :name="'form'" />
        <Radio :check-list="'캘리그라피'" :id="'form3'" :name="'form'" />
        <Radio :check-list="'그래픽'" :id="'form4'" :name="'form'" />
        <Radio :check-list="'기타'" :id="'form5'" :name="'form'" />
      </div>
    </div>

    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <Button
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        >취소</Button
      >
      <Button component="button" color-type="primary" size="small"
        >업로드</Button
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import Button from '@/components/Button/Button.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import Radio from '@/components/Radio/Radio.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped>
.fields__title {
  margin-bottom: 1.2rem;
  font-size: var(--fz-m);
  font-weight: 700;
}

.fields__option {
  display: flex;
  gap: 0 3rem;
}
</style>
