<template>
  <PopupLarge
    :is-open="props.isOpen"
    @close-button="handleClose"
    :use-close-button="true"
  >
    <button type="button" class="popup-slide__navigation-slide--prev">
      <Icons
        icon-name="chevron_prev"
        icon-color="var(--color-neutrals-white-100)"
        :width="3"
        :height="5.8"
      />
    </button>
    <button type="button" class="popup-slide__navigation-slide--next">
      <Icons
        icon-name="chevron_next"
        icon-color="var(--color-neutrals-white-100)"
        :width="3"
        :height="5.8"
      />
    </button>
    <swiper
      class="popup-slide__wrap"
      :modules="modules"
      :navigation="moduleConfig.navigationConfig"
      :speed="0"
      :allowTouchMove="false"
    >
      <swiper-slide
        class="popup-slide__item"
        v-for="item in [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
        :key="item"
      >
        <div class="preview-container">
          <div class="preview custom-scrollbar">
            <div class="like-btn-wrap">
              <button
                type="button"
                class="like-btn"
                :class="[dummyStateLike && 'is-selected']"
                @click="handleToggleLike"
              >
                <Icons icon-name="like" :width="2" :height="2" />
                <span class="like-number">3,508</span>
              </button>
            </div>

            <figure class="preview__img">
              <img src="./img/poster.png" alt="예시 이미지" />
            </figure>
            <figure class="preview__img">
              <img src="./img/poster.png" alt="예시 이미지" />
            </figure>
          </div>
          <div class="info custom-scrollbar">
            <div class="info__caption">
              <span class="info__id">템플릿 ID {{ item }}</span>
              <span>김동욱 (전략기횜팀)</span>
            </div>
            <p class="info__title">Y는 친구끼리</p>
            <ul class="info__spec-list">
              <li class="info__spec-item">슬라이드 장수 2장</li>
              <li class="info__spec-item">규격 1080x1920</li>
              <li class="info__spec-item info__spec-date">
                등록 2023.08.05 (수정 2023.08.24)
              </li>
            </ul>
            <p class="info__desc">
              템플릿 설명이 출력됩니다. 템플릿 설명이 출력됩니다. 템플릿 설명이
              출력됩니다. 템플릿 설명이 출력됩니다. 템플릿 설명이 출력됩니다.
              템플릿 설명이 출력됩니다.
            </p>
            <div class="info__category-wrap">
              <ul
                class="info__category-list custom-scrollbar scrollbar--lightgray"
              >
                <li class="info__category-item">KT</li>
                <li class="info__category-item">포스터</li>
                <li class="info__category-item">매장</li>
                <li class="info__category-item">무선결합</li>
                <li class="info__category-item">요금제</li>
                <li class="info__category-item">그림</li>
                <li class="info__category-item">브로셔</li>
                <li class="info__category-item">프로모션</li>
                <li class="info__category-item">혜택</li>
                <li class="info__category-item">포스터</li>
                <li class="info__category-item">일러스트</li>
                <li class="info__category-item">매장</li>
                <li class="info__category-item">매력적인</li>
                <li class="info__category-item">특징</li>
                <li class="info__category-item">입력</li>
                <li class="info__category-item">내용</li>
                <li class="info__category-item">책받침</li>
                <li class="info__category-item">인쇄물</li>
                <li class="info__category-item">기타1</li>
                <li class="info__category-item">기타2</li>
                <li class="info__category-item">기타3</li>
                <li class="info__category-item">기타4</li>
                <li class="info__category-item">기타5</li>
                <li class="info__category-item">기타6</li>
              </ul>
            </div>

            <div class="info__action">
              <UIButton
                component="button"
                color-type="primary"
                size="large"
                class="action-edit"
              >
                템플릿 편집하기
              </UIButton>
              <IconButton
                class="action-bookmark"
                :class="[dummyStateBookmark && 'is-selected']"
                icon-name="bookmark"
                size="large"
                type="outlined"
                component="button"
                @click="handleToggleBookmark"
              />
              <IconButton
                class="action-link"
                icon-name="link"
                size="large"
                type="outlined"
                component="a"
                href=""
              />
            </div>
            <div class="info__form">
              <TextFields
                class="form__input"
                size="medium"
                placeholder="프로젝트에 대한 의견을 남겨보세요."
              />
              <RoundButton
                component="button"
                color-type="filed"
                size="medium"
                class="form__submit"
                >등록</RoundButton
              >
            </div>
            <div class="comment">
              <div class="comment__item">
                <div class="comment__info">
                  <span class="comment__info__writer">윤지연 (마케팅팀)</span>
                  <span class="comment__info__date">2023.08.14 10:56</span>
                </div>
                <div class="comment__body">
                  <p class="comment__body__text">
                    저도 잘 쓰겠습니다. 감사해요!
                  </p>
                  <RoundButton
                    class="comment__body__remove-btn"
                    component="button"
                    color-type="lightOutlined"
                    size="small"
                    isIcon
                  >
                    <Icons icon-name="delete" :width="1.4" :height="1.4" />
                    삭제</RoundButton
                  >
                </div>
              </div>
              <div class="comment__item">
                <div class="comment__info">
                  <span class="comment__info__writer"
                    >선우혜민 (상품전략팀)</span
                  >
                  <span class="comment__info__date">2023.08.13 17:01</span>
                </div>
                <div class="comment__body">
                  <p class="comment__body__text">
                    필요했던 스타일인데 요긴하게 사용했습니다 감사합니다~!
                    필요했던 스타일인데 요긴하게 사용했습니다 감사합니다~!
                    필요했던 스타일인데 요긴하게 사용했습니다 감사합니다~!
                    필요했던 스타일인데 요긴하게 사용했습니다 감사합니다~!
                    필요했던 스타일인데 요긴하게 사용했습니다 감사합니다~!
                    필요했던 스타일인데 요긴하게 사용했습니다 감사합니다~!
                  </p>
                  <RoundButton
                    class="comment__body__remove-btn"
                    component="button"
                    color-type="lightOutlined"
                    size="small"
                    isIcon
                  >
                    <Icons icon-name="delete" :width="1.4" :height="1.4" />
                    삭제</RoundButton
                  >
                </div>
              </div>
              <div class="comment__item">
                <div class="comment__info">
                  <span class="comment__info__writer"
                    >김유정 (대구 동성로점)</span
                  >
                  <span class="comment__info__date">2023.08.06 09:37</span>
                </div>
                <div class="comment__body">
                  <p class="comment__body__text">
                    우와! 템플릿 정말 멋집니다 🤩 👍
                  </p>
                  <RoundButton
                    class="comment__body__remove-btn"
                    component="button"
                    color-type="lightOutlined"
                    size="small"
                    isIcon
                  >
                    <Icons icon-name="delete" :width="1.4" :height="1.4" />
                    삭제</RoundButton
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </swiper-slide>
    </swiper>
  </PopupLarge>
</template>

<script setup>
import { Navigation } from 'swiper/modules';
// eslint-disable-next-line import/no-unresolved
import { Swiper, SwiperSlide } from 'swiper/vue';
import { ref } from 'vue';

import IconButton from '@/components/IconButton/IconButton.vue';
import Icons from '@/components/Icons/Icons.vue';
import PopupLarge from '@/components/PopupLarge/PopupLarge.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import customToast from '@/untils/custom_toast';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const dummyStateBookmark = ref(false);
const dummyStateLike = ref(false);
const modules = [Navigation];
const moduleConfig = {
  navigationConfig: {
    nextEl: '.popup-slide__navigation-slide--next',
    prevEl: '.popup-slide__navigation-slide--prev',
  },
};
const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
const handleToggleBookmark = () => {
  dummyStateBookmark.value = !dummyStateBookmark.value;
  if (dummyStateBookmark.value) {
    customToast.success('글을 즐겨찾기 템플릿 메뉴에 추가했습니다.', {
      containerClassName: 'custom-toast-bottom',
    });
  } else {
    customToast.success('글을 즐겨찾기 템플릿 메뉴에 삭제했습니다.', {
      containerClassName: 'custom-toast-bottom',
    });
  }
};

const handleToggleLike = () => {
  dummyStateLike.value = !dummyStateLike.value;
};
</script>

<style scoped>
.popup-slide__navigation-slide--prev,
.popup-slide__navigation-slide--next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
}

.popup-slide__navigation-slide--prev {
  right: calc(100% + 5.6rem);
}

.popup-slide__navigation-slide--next {
  left: calc(100% + 5.6rem);
}

.popup-slide__navigation-slide--prev:disabled,
.popup-slide__navigation-slide--next:disabled {
  opacity: 0.6;
}

.preview-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0 2rem;
  padding: 4rem 0;
}

.preview {
  position: relative;
  padding: 0 6rem;
  max-height: 75rem;
  overflow-y: auto;
}

.preview__img + .preview__img {
  margin-top: 3.6rem;
}

.like-btn-wrap {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
}

.like-btn {
  position: sticky;
  top: 0;
  margin-left: auto;
  border-radius: 5.6rem;
  display: flex;
  align-items: center;
  gap: 0 0.6rem;
  padding: 0.6rem 1.4rem;
  border: 1px solid var(--color-gray-ddd);
  background-color: var(--color-neutrals-white-100);
  line-height: 1;
}

.like-btn :deep(.icon-wrap) path {
  stroke: var(--color-neutrals-black);
  fill: var(--color-neutrals-white-100);
}

.like-btn.is-selected :deep(.icon-wrap) path {
  stroke: var(--color-primary);
  fill: var(--color-primary);
}

.like-number {
  font-size: var(--fz-m);
  font-weight: 500;
}

.info {
  max-height: 75rem;
  margin-left: 2rem;
  margin-right: 4rem;
  padding-right: 1.5rem;
  overflow-y: auto;
}

.info__caption {
  display: flex;
  align-items: center;
  gap: 0 2.4rem;
  margin-bottom: 0.4rem;
}

.info__caption span {
  position: relative;
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.info__caption span:not(:last-child)::after {
  position: absolute;
  top: 0;
  right: -1.2rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.info__id {
  font-weight: 500;
}

.info__title {
  font-size: var(--ttl-l);
  font-weight: 700;
}

.info__spec-list {
  display: flex;
  gap: 0 2.4rem;
  margin: 1.4rem 0;
  font-size: var(--fz-m);
  font-weight: 700;
}

.info__spec-item {
  position: relative;
}

.info__spec-item:not(:last-child)::after {
  position: absolute;
  top: 0;
  right: -1.2rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.info__spec-item.info__spec-date {
  font-weight: 400;
  color: var(--color-gray-777);
}

.info__desc {
  font-size: var(--fz-m);
  color: var(--color-gray-777);
}

.info__category-wrap {
  margin-top: 2rem;
  padding: 1.6rem 0.8rem 1.6rem 1.6rem;
  background-color: #f4f4f4;
}

.info__category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  max-height: 11rem;
  padding-right: 1.5rem;
  overflow-y: auto;
}

.info__category-item {
  height: 3rem;
  line-height: 3rem;
  padding: 0 1.6rem;
  border-radius: 50.9rem;
  background-color: var(--color-neutrals-white-100);
  font-size: var(--fz-s);
  font-weight: 500;
  color: var(--color-gray-777);
}

.info__action {
  display: flex;
  align-items: center;
  gap: 0 1.2rem;
  margin-top: 4rem;
}

.action-bookmark.is-selected :deep(.icon-wrap) path {
  stroke: var(--color-primary);
  fill: var(--color-primary);
}

.action-edit {
  flex: 1;
}

.info__form {
  display: flex;
  gap: 0 1.4rem;
  margin-top: 4rem;
}

.form__input {
  flex: 1;
  line-height: 1;
}

.comment {
  margin-top: 1.6rem;
}

.comment__item {
  padding-bottom: 1.6rem;
  border-bottom: 1px solid #e5e5e5;
}

.comment__item + .comment__item {
  margin-top: 1.6rem;
}

.comment__info {
  font-size: var(--fz-m);
}

.comment__info__writer {
  position: relative;
  margin-right: 2.4rem;
  font-weight: 700;
}

.comment__info__writer::after {
  position: absolute;
  top: 0;
  right: -1.2rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.comment__info__date {
  color: var(--color-gray-777);
}

.comment__body {
  position: relative;
  display: flex;
  margin-top: 1rem;
  padding: 0.8rem 0;
}

.comment__body__text {
  flex: 1;
  min-width: 0;
  padding-right: 9.8rem;
  font-size: var(--fz-m);
}

.comment__body__remove-btn {
  position: absolute;
  top: 0;
  right: 0;
}
</style>
