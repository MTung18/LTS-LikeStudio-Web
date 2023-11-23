<template>
  <div class="project">
    <CategorySideBar
      :data="dummyCategory"
      @category-selected="handleCategorySelected"
    />
    <div class="project__wrap">
      <div class="studio__head">
        <h3 class="studio__head__title">전체 탬플릿</h3>
        <div class="studio__head__length">2,850</div>
      </div>
      <div class="flex items-center">
        <div
          class="relative flex items-center gap-x-[1.4rem] ml-auto mr-[4rem] before:absolute before:content-[''] before:right-[-2rem] before:top-0 before:w-[1px] before:h-full before:bg-gray-gray-ddd"
        >
          <SearchInput
            v-model="dummyInputValue"
            placeholder="검색어를 입력해주세요"
            size="medium"
            style-type="square"
            color-type="gray"
            class="flex-1"
          />
          <RoundButton component="button" color-type="filed" size="medium"
            >검색</RoundButton
          >
        </div>
        <div>
          <ul class="list__order">
            <li class="list__order-item is-selected">
              <button type="button">최신순</button>
            </li>
            <li class="list__order-item">
              <button type="button">인기순</button>
            </li>
          </ul>
        </div>
      </div>
      <MasonryLayout @gallery-click="handleOpenPopup" />
      <Loading class="mt-[8rem]" />
    </div>
  </div>
  <PopupSliderLayout
    :is-open="popupSliderLayoutIsOpen"
    @close-button="popupSliderLayoutIsOpen = false"
  />
</template>

<script setup>
import { ref } from 'vue';

import CategorySideBar from '@/components/CategorySideBar/CategorySideBar.vue';
import Loading from '@/components/Loading/Loading.vue';
import MasonryLayout from '@/components/MasonryLayout/MasonryLayout.vue';
import PopupSliderLayout from '@/components/PopupSliderLayout/PopupSliderLayout.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';

const dummyInputValue = ref('');
const popupSliderLayoutIsOpen = ref(false);
const dummyCategory = ref([
  {
    id: 1,
    name: '용도별',
    subcategories: [
      {
        id: 101,
        name: '포스터',
        isSelected: true,
      },
      {
        id: 102,
        name: '브로셔',
        isSelected: true,
      },
      {
        id: 103,
        name: '책받침',
        isSelected: false,
      },
      {
        id: 104,
        name: 'X배너',
        isSelected: false,
      },
      {
        id: 105,
        name: 'SNS용',
        isSelected: false,
      },
      {
        id: 106,
        name: 'PPT',
        isSelected: false,
      },
      {
        id: 107,
        name: '기타',
        isSelected: false,
      },
    ],
  },
  {
    id: 2,
    name: '상품/서비스별',
    subcategories: [
      {
        id: 201,
        name: '무선',
        isSelected: false,
      },
      {
        id: 202,
        name: '유선',
        isSelected: false,
      },
      {
        id: 203,
        name: '결합',
        isSelected: true,
      },
      {
        id: 204,
        name: '가족',
        isSelected: false,
      },
      {
        id: 205,
        name: '외국인',
        isSelected: false,
      },
      {
        id: 206,
        name: '멤버십',
        isSelected: true,
      },
      {
        id: 207,
        name: '제휴카드',
        isSelected: false,
      },
      {
        id: 208,
        name: '기타1',
        isSelected: false,
      },
      {
        id: 209,
        name: '기타2',
        isSelected: false,
      },
    ],
  },
]);

const handleOpenPopup = (id) => {
  console.log('id', id);
  popupSliderLayoutIsOpen.value = true;
};
const handleCategorySelected = (categoryId, subcategoryId) => {
  const category = dummyCategory.value.find((cat) => cat.id === categoryId);
  if (category) {
    const subcategory = category.subcategories.find(
      (subcat) => subcat.id === subcategoryId,
    );
    if (subcategory) {
      subcategory.isSelected = !subcategory.isSelected;
    }
  }
};
</script>

<style scoped>
.project {
  position: relative;
  display: flex;
  gap: 0 4rem;
  padding-top: 7.2rem;
}

.project__wrap {
  flex: 1;
  min-width: 0;
}

.studio__head {
  display: flex;
  align-items: center;
  gap: 0 1rem;
  margin-bottom: 6rem;
}

.studio__head__title {
  font-size: var(--ttl-m);
  font-weight: 700;
}

.studio__head__length {
  height: 3.4rem;
  line-height: 3.4rem;
  padding: 0 1.3rem;
  border-radius: 3.4rem;
  border: 1px solid var(--color-gray-ddd);
  font-size: var(--fz-l);
  font-weight: 700;
  background-color: #f6f6f6;
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
</style>
