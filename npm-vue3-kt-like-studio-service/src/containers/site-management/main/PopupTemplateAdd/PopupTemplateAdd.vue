<template>
  <PopupLarge
    :is-open="props.isOpen"
    @close-button="handleClose"
    useCloseButton
  >
    <div class="px-[4rem] py-[3.2rem]">
      <div class="template-add">
        <div class="template-add__head">
          <p class="template-add__title">템플릿 추가</p>
          <UIButton
            component="button"
            color-type="primary"
            size="medium"
            class-bind="!min-w-[11rem] ml-auto"
            @click="handleSaveClick"
            >저장</UIButton
          >
        </div>
        <div class="preview">
          <div class="preview__head">
            <div class="preview__action">
              <DropdownSelect
                :select-list="dummyCategories"
                default-select="카테고리 선택"
                class-bind="!min-w-[auto]"
              />
              <p class="preview__desc">
                카테고리를 선택하고 템플릿 5개를 고른 후, 저장 버튼을
                눌러주세요.
              </p>
            </div>
            <div class="preview__container">
              <ul class="preview__list">
                <li
                  v-for="item in [1, 2, 3, 4, 5]"
                  :key="item"
                  class="preview__item"
                >
                  <figure class="preview__img-wrap">
                    <img
                      class="preview__img"
                      :src="getImageUrl(item)"
                      alt="예시 이미지"
                    />
                  </figure>
                  <button type="button" class="preview__remove-btn">
                    <Icons
                      icon-name="delete"
                      icon-color="var(--color-neutrals-white-100)"
                      :width="1.4"
                      :height="1.4"
                    />
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <!-- dev: 검색어 바 -->
          <div class="preview__search-wrap">
            <div class="preview__search-area">
              <SearchInput
                v-model="dummyInputValue"
                placeholder="검색어를 입력해주세요"
                size="medium"
                style-type="square"
                color-type="gray"
                class-bind="flex-1"
              />
              <RoundButton component="button" color-type="filed" size="medium"
                >검색</RoundButton
              >
            </div>
          </div>
        </div>
      </div>

      <!-- dev: 템플릿 리스트 -->
      <div class="list">
        <div class="list__head">
          <div class="list__total">
            총 <span class="list__total-length">252</span>개
          </div>
          <ul class="list__order">
            <li
              v-for="order in orderType"
              :key="order.id"
              class="list__order-item"
              :class="order.isSelected && 'is-selected'"
            >
              <button type="button" @click="handlerSelectOrder(order.id)">
                {{ order.orderName }}
              </button>
            </li>
          </ul>
        </div>

        <ul class="list__group custom-scrollbar">
          <li v-for="item in dummyTemplate" :key="item.id" class="list__item">
            <figure>
              <img :src="getImageUrl(`thu_${item.id}`)" alt="예시 이미지" />
            </figure>
            <CheckBox
              v-model="item.isChecked"
              :id="`${item.id}`"
              :shape-type="'round'"
              class-bind="list__checkbox"
            />
          </li>
        </ul>
        <Loading class-bind="mt-[3.2rem]" />
      </div>
      <!-- dev: 데이터 없을 시 -->
      <!--    <TemplateDataNone />-->
    </div>
  </PopupLarge>
</template>

<script setup>
import { ref } from 'vue';

import CheckBox from '@/components/CheckBox/CheckBox.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import Loading from '@/components/Loading/Loading.vue';
import PopupLarge from '@/components/PopupLarge/PopupLarge.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import UIButton from '@/components/UIButton/UIButton.vue';
import customToast from '@/untils/custom_toast';

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

const dummyCategories = [
  {
    id: 0,
    listName: '포스터',
  },
  {
    id: 1,
    listName: '브로셔',
  },
  {
    id: 2,
    listName: '책받침',
  },
  {
    id: 3,
    listName: '전단지',
  },
  {
    id: 4,
    listName: 'X배너',
  },
  {
    id: 5,
    listName: 'SNS용',
  },
  {
    id: 6,
    listName: '기타',
  },
  {
    id: 7,
    listName: '무선',
  },
  {
    id: 8,
    listName: '유선',
  },
  {
    id: 9,
    listName: '결합',
  },
  {
    id: 10,
    listName: '가족',
  },
  {
    id: 11,
    listName: '외국인',
  },
  {
    id: 12,
    listName: '멤버쉽',
  },
  {
    id: 13,
    listName: '제휴카드',
  },
  {
    id: 14,
    listName: '포스터',
  },
];

const dummyInputValue = ref('');
const orderType = ref([
  {
    id: 0,
    orderName: '최신순',
    isSelected: true,
  },
  {
    id: 1,
    orderName: '인기순',
    isSelected: false,
  },
]);

const dummyTemplate = ref([
  {
    id: 1,
    isChecked: false,
  },
  {
    id: 2,
    isChecked: false,
  },
  {
    id: 3,
    isChecked: false,
  },
  {
    id: 4,
    isChecked: false,
  },
  {
    id: 5,
    isChecked: false,
  },
  {
    id: 6,
    isChecked: false,
  },
  {
    id: 7,
    isChecked: false,
  },
  {
    id: 8,
    isChecked: false,
  },
  {
    id: 9,
    isChecked: false,
  },
  {
    id: 10,
    isChecked: false,
  },
  {
    id: 11,
    isChecked: false,
  },
  {
    id: 12,
    isChecked: false,
  },
  {
    id: 13,
    isChecked: false,
  },
  {
    id: 14,
    isChecked: false,
  },
  {
    id: 15,
    isChecked: false,
  },
]);
const getImageUrl = (name) => {
  return new URL(`./img/${name}.png`, import.meta.url).href;
};

const handlerSelectOrder = (selectedId) => {
  orderType.value = orderType.value.map((order) => ({
    ...order,
    isSelected: order.id === selectedId,
  }));
};

const handleSaveClick = () => {
  customToast.success('저장했습니다.', {
    containerClassName: 'custom-toast-bottom',
  });
};
</script>

<style scoped>
.template-add__head {
  display: flex;
  align-items: center;
}

.template-add__head .template-add__title {
  font-size: var(--ttl-m);
  font-weight: 700;
}

.preview {
  margin: 3.2rem 0;
}

.preview__action {
  flex: 1;
}

.preview__desc {
  margin-top: 2rem;
  font-size: var(--fz-m);
  color: var(--color-gray-444);
}

.preview__head {
  display: flex;
  gap: 0 2rem;
  padding-bottom: 2.8rem;
}

.preview__container {
  width: 85.5rem;
  height: 25.2rem;
  padding: 1.4rem;
  background-color: #f4f4f4;
  border-radius: 0.6rem;
}

.preview__list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0 2rem;
  height: 100%;
  border-radius: 1.2rem;
}

.preview__item {
  position: relative;
  overflow: hidden;
}

.preview__img-wrap {
  width: 100%;
  height: 100%;
}

.preview__img {
  height: 100%;
  object-fit: cover;
}

.preview__remove-btn {
  position: absolute;
  top: 0.8rem;
  right: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 9999px;
  background-color: rgba(0, 0, 0, 0.5);
}

.preview__remove-btn:hover {
  background-color: #000;
}

.preview__search-wrap {
  padding-top: 3.2rem;
  border-top: 1px solid var(--color-gray-ddd);
}

.preview__search-area {
  display: flex;
  gap: 0 1.4rem;
  padding: 2.6rem;
  border-radius: 1.2rem;
  background-color: #f6f6f6;
}

.list__head {
  display: flex;
}

.list__total {
  font-size: var(--fz-l);
  color: var(--color-gray-444);
}

.list__total-length {
  font-size: var(--fz-l);
  font-weight: 700;
  color: var(--color-primary);
}

.list__order {
  display: flex;
  align-items: center;
  gap: 0 3.2rem;
  margin-left: auto;
}

.list__order-item {
  position: relative;
  font-size: var(--fz-m);
  color: var(--color-gray-444);
}

.list__order-item.is-selected {
  font-weight: 700;
  color: var(--color-neutrals-black);
}

.list__order-item:not(:last-child)::after {
  position: absolute;
  top: 0;
  right: -1.6rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.list__group {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-auto-rows: 31.2rem;
  gap: 2rem;
  height: 97.7rem;
  margin-top: 2rem;
  overflow-y: auto;
}

.list__item {
  position: relative;
}

.list__checkbox {
  position: absolute;
  top: 0.8rem;
  left: 0.8rem;
}

.list__checkbox :deep(.input-check__box) {
  background-color: #fff;
}
</style>
