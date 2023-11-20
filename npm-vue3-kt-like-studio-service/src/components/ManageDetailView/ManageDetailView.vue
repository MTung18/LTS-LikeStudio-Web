<template>
  <div class="detail__cnt-wrap">
    <div class="detail__img-area">
      <ul class="detail__img-list">
        <li
          class="detail__img_node"
          v-for="item in props.imgData"
          :key="item.id"
        >
          <img :src="item.name" alt="" />
        </li>
      </ul>
    </div>
    <div class="detail__edit-area">
      <ul class="detail__info-list">
        <li
          class="detail__info-node"
          v-for="item in props.infoData"
          :key="item.id"
        >
          <div class="detail__info-title">
            {{ item.cate }}
          </div>
          <div class="detail__info-detail">
            {{ item.detail }}
          </div>
        </li>
      </ul>
      <ul class="detail__edit-list">
        <li
          class="detail__edit-node"
          v-for="item in props.editCate"
          :key="item.id"
        >
          <p class="detail__edit-title">
            {{ item.cate }}<b class="red" v-if="item.import">*</b>
          </p>
          <div class="detail__edit-setting">
            <Switch v-if="item.type === 'switch'" />
            <TextFields
              v-if="item.type === 'text'"
              :placeholder="item.placeholder"
              :input-id="inputId"
            />
            <TextArea
              v-if="item.type === 'textarea'"
              v-bind="$attrs"
              :textarea-id="textareaId"
              class-bind="w-full !min-w-[auto] !h-[14.4rem]"
              :placeholder="item.placeholder"
            ></TextArea>
            <DropdownSelect
              v-if="item.type === 'dropDown'"
              :default-select="item.cate"
              :select-list="item.usage"
            />
            <p></p>
          </div>
        </li>
      </ul>
      <div class="detail__comment-area">
        <div class="detail__comment-head">
          <p class="comment">댓글 <b class="num">100</b>개</p>
        </div>
        <div class="detail__comment-body">
          <ul class="detail__comment-list custom-scrollbar">
            <li
              class="detail__comment-node"
              v-for="item in props.commentData"
              :key="item.id"
            >
              <div class="write-area">
                <p class="author">{{ item.author }} ({{ item.position }})</p>
                <span class="date">{{ item.time }}</span>
              </div>
              <div class="cmt-area">
                <p>{{ item.comment }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="detail__record-data">
        <ul class="detail__record-data-list">
          <li
            class="detail__record-data-node"
            v-for="item in props.recordCateData"
            :key="item.id"
          >
            <p class="title">{{ item.cate }}</p>
            <div class="detail" :class="item.link ? 'has-btn' : ''">
              <ul>
                <li>
                  <div>{{ item.detail }}</div>
                  <div class="btn-area" v-if="item.link">
                    <RoundButton
                      component="button"
                      color-type="outlined"
                      size="small"
                      :isIcon="true"
                      class-bind="!border-[#ddd] !font-normal"
                    >
                      링크 복사</RoundButton
                    >
                    <RoundButton
                      component="button"
                      color-type="outlined"
                      size="small"
                      :isIcon="true"
                      class-bind="!border-[#ddd] !font-normal"
                    >
                      슬라이드 쇼</RoundButton
                    >
                  </div>
                </li>
                <li v-if="item.detail1">{{ item.detail1 }}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="detail__btn-area">
        <div>
          <UIButton
            component="button"
            class="delete-btn"
            color-type="standard"
            size="large"
            >삭제</UIButton
          >
        </div>
        <div>
          <UIButton
            component="button"
            class="cancel-btn"
            color-type="outlined"
            size="large"
            >취소</UIButton
          >
          <UIButton
            component="button"
            class="edit-btn"
            color-type="primary"
            size="large"
            @click="handlerEditOpenPopup"
            >수정</UIButton
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { v4 as uuid } from 'uuid';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import Switch from '@/components/Switch/Switch.vue';
import TextArea from '@/components/TextArea/TextArea.vue';
import TextFields from '@/components/TextFields/TextFields.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const inputId = uuid();
const textareaId = uuid();
const props = defineProps({
  infoData: {
    type: Array,
    default: () => [],
  },
  editCate: {
    type: Array,
    default: () => [],
  },
  commentData: {
    type: Array,
    default: () => [],
  },
  recordCateData: {
    type: Array,
    default: () => [],
  },
  imgData: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['edit-button']);

const handlerEditOpenPopup = () => {
  emit('edit-button');
};
</script>
<style scoped>
.detail__cnt-wrap {
  display: flex;
  justify-content: space-between;
  gap: 4rem;
  margin-top: 2.8rem;
}
.detail__img-area {
  flex-basis: 40.6%;
  flex-shrink: 0;
}
.detail__img-list {
  max-height: 115.3rem;
  overflow: auto;
}

.detail__img_node + .detail__img_node {
  margin-top: 2.8rem;
}
.detail__info-list + .detail__edit-list {
  margin-top: 2.8rem;
  padding-top: 2.8rem;
  border-top: 1px solid var(--color-gray-ddd);
}
.detail__edit-area {
  flex-basis: 56%;
  flex-shrink: 0;
}
.detail__info-node,
.detail__edit-node,
.detail__comment-node {
  display: flex;

  font-size: 1.4rem;
  line-height: 1.4;
}
.detail__info-node + .detail__info-node,
.detail__edit-node + .detail__edit-node {
  margin-top: 1.8rem;
}

.detail__info-title,
.detail__edit-title {
  flex-basis: 12rem;
  font-weight: bold;
  flex-shrink: 0;
  padding: 0.6rem 0;
}

.detail__info-detail {
  padding: 0.6rem 0;
}

.detail__edit-setting {
  flex-basis: calc(100% - 12rem);
}
.detail__edit-setting :deep(.select-area),
.detail__edit-setting :deep(.text-fields.large),
.detail__edit-setting :deep(.text-area.large .text-area__input) {
  min-width: auto;
  width: 100%;
}

.detail__comment-head {
  font-size: 1.4rem;
  font-weight: bold;
  padding-bottom: 1.4rem;
  border-bottom: 1px solid #000;
  margin-bottom: 1.6rem;
  line-height: 1;
}
.detail__comment-head .num {
  color: var(--color-primary);
}
.detail__comment-node {
  flex-flow: column;
  padding-bottom: 1.6rem;
  margin-bottom: 1.6rem;
  border-bottom: 1px solid var(--color-gray-ddd);
}

.detail__comment-node .author {
  font-weight: bold;
  display: inline-block;
}
.detail__comment-node .date {
  color: var(--color-gray-777);
  margin-left: 1.2rem;
  padding-left: 1.2rem;
  position: relative;
}
.detail__comment-node .date:after {
  content: '';
  display: block;
  width: 1px;
  height: 100%;
  background: var(--color-gray-ddd);
  position: absolute;
  left: 0;
  top: 0;
}

.detail__comment-node .cmt-area {
  margin-top: 1rem;
}
.detail__edit-list + .detail__comment-area {
  margin-top: 2.8rem;
  padding-top: 2.8rem;
  border-top: 1px solid var(--color-gray-ddd);
}
.detail__record-data {
  margin-top: 2.8rem;
  padding-top: 2.8rem;
  border-top: 1px solid var(--color-gray-ddd);
  padding-bottom: 2.8rem;
  border-bottom: 1px solid #000;
}
.detail__record-data .detail__record-data-node,
.detail__record-data .detail__record-data-node .detail > ul li,
.detail__record-data .detail__record-data-node .detail > ul {
  display: flex;
  align-items: center;
}
.detail__record-data .detail__record-data-node .detail > ul li {
  justify-content: space-between;
  align-items: center;
  min-height: 3.6rem;
  position: relative;
}
.detail__record-data .detail__record-data-node .detail.has-btn {
  flex: 1;
}
.detail__record-data .detail__record-data-node .detail.has-btn > ul li {
  width: 100%;
}
.detail__record-data .detail__record-data-node .detail > ul li .btn-area {
  display: flex;
  gap: 0.8rem;
}
.detail__record-data .detail__record-data-node .detail > ul li + li {
  margin-left: 1.2rem;
  padding-left: 1.2rem;
}
.detail__record-data .detail__record-data-node .detail > ul li + li:after {
  content: '';
  display: block;
  width: 1px;
  height: 1.8rem;
  background: var(--color-gray-ddd);
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.detail__record-data .detail__record-data-node {
  font-size: 1.4rem;
}
.detail__record-data-node + .detail__record-data-node {
  margin-top: 0.8rem;
}
.detail__record-data .detail__record-data-node .title {
  flex-basis: 12rem;
  font-weight: bold;
}
:deep(.button.large) {
  min-width: 14rem;
}
.detail__btn-area {
  display: flex;
  justify-content: space-between;
  margin-top: 6rem;
}
.detail__btn-area > div {
  display: flex;
  gap: 1rem;
}
.red {
  color: var(--color-primary);
}

.detail__comment-list {
  max-height: 32rem;
  overflow-y: auto;
}
</style>
