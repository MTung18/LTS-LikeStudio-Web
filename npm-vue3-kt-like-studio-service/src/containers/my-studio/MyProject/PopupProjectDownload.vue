<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="다운로드"
    @close-button="handleClose"
  >
    <div class="download__wrap">
      <p class="download__desc">
        KT라이크 스튜디오는<br />어떤 파일을 만들 수 있는지 확인해볼까요?
      </p>
      <UIButton
        component="button"
        color-type="primary"
        size="small"
        @click="handleOpenFaqPopup"
        >다운로드 FAQ</UIButton
      >
    </div>
    <TemplateEditTextFields
      label="슬라이드 프리셋"
      size="small"
      class="items-center"
    >
      <div class="flex items-center gap-x-[2rem]">
        <Radio
          :check-list="'PNG'"
          :id="'png'"
          :name="'fileType'"
          shape-type="arrow"
        />
        <Radio
          :check-list="'JPG'"
          :id="'jpg'"
          :name="'fileType'"
          shape-type="arrow"
        />
        <Radio
          :check-list="'PDF'"
          :id="'pdf'"
          :name="'fileType'"
          shape-type="arrow"
        />
      </div>
    </TemplateEditTextFields>
    <div class="py-[2.4rem] border-b-gray-gray-ddd border-b-[1px]">
      <div class="flex gap-x-[2rem]">
        <p class="min-w-[10rem] text-fz-m font-bold">페이지 수</p>
        <div class="flex flex-1 flex-col gap-y-[1.4rem]">
          <CheckBox
            :check-list="'전체 슬라이드'"
            :id="'no'"
            :shape-type="'square'"
            :name="'choice'"
          ></CheckBox>
          <TextFields
            class="w-full"
            size="medium"
            :textarea-id="'dummyRangeValue'"
            v-model="dummyRangeValue"
            placeholder="예시) 1-3 또는 1, 2, 3"
          />
        </div>
      </div>
    </div>

    <div class="py-[2.4rem] border-b-gray-gray-ddd border-b-[1px]">
      <div class="flex items-center gap-x-[2rem]">
        <p class="min-w-[10rem] py-[0.6rem] text-fz-m font-bold">파일 명</p>
        <p class="text-fz-m">10월 테마 X 배너.pdf</p>
      </div>
      <div class="flex items-center gap-x-[2rem]">
        <p class="min-w-[10rem] py-[0.6rem] text-fz-m font-bold">파일 구분</p>
        <p class="text-fz-m">1920mm X 1230mm</p>
      </div>
    </div>

    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <UIButton
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        >취소</UIButton
      >
      <UIButton component="button" color-type="primary" size="small"
        >다운로드</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import { ref } from 'vue';

import CheckBox from '@/components/CheckBox/CheckBox.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import Radio from '@/components/Radio/Radio.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const dummyRangeValue = ref('');
const emit = defineEmits(['close-button', 'open-faq-popup']);

const handleClose = () => {
  emit('close-button', false);
};

const handleOpenFaqPopup = () => {
  emit('open-faq-popup');
};
</script>

<style scoped>
.download__wrap {
  border-radius: 1.2rem;
  background-color: #fef1f2;
  text-align: center;
  padding: 2.4rem 0;
  margin-bottom: 2.4rem;
}

.download__desc {
  margin-bottom: 1.4rem;
  font-size: var(--fz-m);
  color: var(--color-gray-444);
}
</style>
