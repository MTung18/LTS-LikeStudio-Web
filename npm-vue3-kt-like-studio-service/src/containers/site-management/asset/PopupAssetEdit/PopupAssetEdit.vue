<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="에셋 설정"
    @close-button="handleClose"
  >
    <div class="setting-head">
      <div class="setting-head__area">
        <figure class="setting-head__img-wrap">
          <img
            class="setting-head__img"
            src="./img/thu.png"
            alt="예시 이미지"
          />
        </figure>
        <ul class="setting-head__info">
          <li class="setting-head__info-item">
            <b class="setting-head__info-title">제목</b>
            <p class="setting-head__info-desc">10월 테마 X 배너</p>
          </li>
          <li class="setting-head__info-item">
            <b class="setting-head__info-title">파일 구분</b>
            <p class="setting-head__info-desc">비트맵</p>
          </li>
          <li class="setting-head__info-item">
            <b class="setting-head__info-title">에셋 ID</b>
            <p class="setting-head__info-desc">p99</p>
          </li>
          <li class="setting-head__info-item">
            <b class="setting-head__info-title">사이즈</b>
            <p class="setting-head__info-desc">가로 680px X 세로 460px</p>
          </li>
        </ul>
      </div>
      <div class="text-center mt-[2.8rem]">
        <RoundButton
          component="button"
          color-type="lightOutlined"
          size="small"
          isIcon
        >
          <Icons icon-name="download" :width="1.4" :height="1.4" />
          다운로드</RoundButton
        >드
      </div>
    </div>
    <div class="setting-body">
      <TemplateEditTextFields size="small" label="1차 카테고리">
        <DropdownSelect
          :select-list="primaryCategory"
          :size="'large'"
          :default-select="'없음'"
          class-bind="!min-w-[auto] !w-full"
        ></DropdownSelect>
      </TemplateEditTextFields>
      <TemplateEditTextFields size="small" label="2차 카테고리">
        <DropdownSelect
          :select-list="secondaryCategory"
          :size="'large'"
          :default-select="'없음'"
          class-bind="!min-w-[auto] !w-full"
        ></DropdownSelect>
      </TemplateEditTextFields>
      <TemplateEditTextFields
        size="small"
        label="태그"
        class-bind="!pb-[2.8rem] border-b-[1px] border-b-gray-gray-ddd"
      >
        <TextArea
          size="medium"
          :textarea-id="textareaId"
          v-model="textareaRef"
          placeholder="태그를 ,(쉼표) 구분해주세요."
        />
      </TemplateEditTextFields>
      <TemplateEditTextFields
        size="small"
        label="노출"
        class-bind="pt-[1rem] !pb-[1rem]"
      >
        <Switch />
      </TemplateEditTextFields>
    </div>

    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <UIButton component="button" color-type="standard" size="small"
        >삭제</UIButton
      >
      <UIButton
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        class-bind="ml-auto"
        >취소</UIButton
      >
      <UIButton component="button" color-type="primary" size="small"
        >수정</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { ref } from 'vue';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextArea from '@/components/TextArea/TextArea.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const textareaId = uuid();
const textareaRef = ref('');

const primaryCategory = [
  {
    id: 0,
    listName: '그래픽',
  },
  {
    id: 1,
    listName: '배경',
  },
  {
    id: 2,
    listName: '로고',
  },
  {
    id: 3,
    listName: '텍스트',
  },
  {
    id: 4,
    listName: '제품',
  },
];

const secondaryCategory = [
  {
    id: 0,
    listName: '사진 / 도형  / 일러스트 / 선',
  },
  {
    id: 1,
    listName: '사진배경 / 패턴배경',
  },
  {
    id: 2,
    listName: 'KT CI / KT BI / 협력사 로고',
  },
  {
    id: 3,
    listName: '텍스트 프리셋',
  },
  {
    id: 4,
    listName: '무선 / 유선 /사은품 / 카드',
  },
];

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped>
.setting-head {
  padding-bottom: 2.4rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.setting-head__area {
  display: flex;
  gap: 0 2rem;
}

.setting-head__img-wrap {
  position: relative;
  width: 12.8rem;
  height: 12.8rem;
  background-color: #f4f4f4;
  overflow: hidden;
}

.setting-head__img {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.setting-head__info-item {
  display: flex;
  gap: 0 2rem;
  padding: 0.6rem 0;
}

.setting-head__info-title {
  width: 8rem;
  font-size: var(--fz-m);
  font-weight: 700;
}

.setting-head__info-desc {
  font-size: var(--fz-m);
}

.setting-body {
  padding-top: 2.4rem;
}
</style>
