<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="업로드"
    @close-button="handleClose"
  >
    <div
      class="flex items-center gap-x-[1.4rem] pb-[2.4rem] border-b-[1px] border-b-gray-gray-ddd"
    >
      <p class="py-[0.6rem] text-fz-m font-bold">나눔스퀘어.otf</p>
      <RoundButton
        component="button"
        color-type="lightOutlined"
        size="small"
        isIcon
        class="ml-auto"
      >
        <Icons icon-name="download" :width="1.4" :height="1.4" />
        다운로드</RoundButton
      >
    </div>

    <div class="pt-[2.4rem]">
      <TemplateEditTextFields
        size="small"
        label="제목"
        required
        class="items-center"
      >
        <TextFields v-model="dummyTitle" size="medium" class="w-full" />
      </TemplateEditTextFields>
      <TemplateEditTextFields
        size="small"
        label="Font family"
        class="items-center"
      >
        <TextFields v-model="dummyFontFamily" size="medium" class="w-full" />
      </TemplateEditTextFields>
      <TemplateEditTextFields
        size="small"
        label="Font weight"
        class="items-center !pb-[2.4rem]"
      >
        <TextFields
          v-model="dummyFontWeight"
          size="medium"
          class="w-full text-right"
        />
      </TemplateEditTextFields>
    </div>

    <div
      class="fields pt-[2.4rem] pb-[2.4rem] border-b-[1px] border-gray-gray-ddd"
    >
      <p class="fields__title">사용구분</p>
      <div class="fields__option">
        <Radio :check-list="'본문용'" :id="'use1'" :name="'use'" />
        <Radio :check-list="'제목용'" :id="'use2'" :name="'use'" />
        <Radio :check-list="'기타'" :id="'use3'" :name="'use'" />
      </div>
    </div>

    <div
      class="fields pt-[2.4rem] pb-[2.4rem] border-b-[1px] border-gray-gray-ddd"
    >
      <p class="fields__title">형태</p>
      <div class="fields__option">
        <Radio :check-list="'본문용'" :id="'fontType1'" :name="'fontType'" />
        <Radio :check-list="'제목용'" :id="'fontType2'" :name="'fontType'" />
        <Radio :check-list="'기타'" :id="'fontType3'" :name="'fontType'" />
        <Radio :check-list="'기타'" :id="'fontType4'" :name="'fontType'" />
        <Radio :check-list="'기타'" :id="'fontType5'" :name="'fontType'" />
      </div>
    </div>

    <div
      class="fields pt-[2.4rem] pb-[2.4rem] border-b-[1px] border-gray-gray-ddd"
    >
      <p class="fields__title">포함언어</p>
      <div class="fields__option">
        <CheckBox
          :check-list="'국문'"
          :id="'language1'"
          :name="'language'"
          :shape-type="'square'"
        />
        <CheckBox
          :check-list="'영문'"
          :id="'language2'"
          :name="'language'"
          :shape-type="'square'"
        />
        <CheckBox
          :check-list="'일어'"
          :id="'language3'"
          :name="'language'"
          :shape-type="'square'"
        />
        <CheckBox
          :check-list="'중문'"
          :id="'language4'"
          :name="'language'"
          :shape-type="'square'"
        />
      </div>
    </div>

    <div
      class="fields pt-[2.4rem] pb-[2.4rem] border-b-[1px] border-gray-gray-ddd"
    >
      <p class="fields__title">라이선스 기간</p>
      <div class="flex items-center">
        <div class="w-[10rem] mr-[2rem]">
          <CheckBox
            :check-list="'사용'"
            :id="'licenses1'"
            :name="'licenses'"
            :shape-type="'square'"
          />
        </div>
        <CalenderGroup
          :start-date="startDate"
          :end-date="endDate"
          @update:startDate="startDate = $event"
          @update:endDate="endDate = $event"
          is-disabled
        />
      </div>
    </div>

    <div class="pt-[2.4rem]">
      <TemplateEditTextFields size="small" label="노출" class="!pb-[2.4rem]">
        <Switch />
      </TemplateEditTextFields>
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
        >업로드</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import { ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import Icons from '@/components/Icons/Icons.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import Radio from '@/components/Radio/Radio.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import Switch from '@/components/Switch/Switch.vue';
import TemplateEditTextFields from '@/components/TemplateEditTextFields/TemplateEditTextFields.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const dummyTitle = ref('');
const dummyFontFamily = ref('');
const dummyFontWeight = ref('400');
const startDate = ref('');
const endDate = ref('');
const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped>
.sub-txt {
  font-size: 1.4rem;
  color: var(--color-gray-777);
  margin-top: 1rem;
}

.file-upload-list {
  color: var(--color-gray-444);
  font-size: 1.4rem;
  margin-top: 2rem;
}

.file-upload-list > li .down-btn {
  display: flex;
  align-items: center;
}

.down-btn span {
  width: 2rem;
  height: 2rem;
  display: inline-flex;
  border: 1px solid var(--color-gray-ddd);
  align-items: center;
  justify-content: center;
  margin-right: 1.2rem;
}

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
