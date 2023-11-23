<template>
  <div class="template">
    <div class="template__head">
      <h2 class="template__head-title">템플릿</h2>
      <SearchInput
        v-model="dummyInputValue"
        placeholder="검색어를 입력해주세요"
        size="large"
        style-type="rounded"
        color-type="black"
      />
    </div>
    <div class="container-full">
      <div ref="templateBodyRef" class="template__body">
        <CategorySideBar
          ref="categorySidebarRef"
          :data="dummyCategory"
          @category-selected="handleCategorySelected"
        />
        <TemplateDataNone class="!mt-[19rem] flex-1 min-w-0" />
      </div>
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
import PopupSliderLayout from '@/components/PopupSliderLayout/PopupSliderLayout.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const popupSliderLayoutIsOpen = ref(false);
const dummyInputValue = ref('');
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
.template__head {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 36rem;
  padding: 9rem 0;
  background-color: #f0e7fd;
  background-image: url('@/assets/img/img_template_banner.png');
  background-position: center center;
  background-size: cover;
}

.template__head-title {
  margin-bottom: 4rem;
  font-size: var(--ttl-xl);
  font-weight: 700;
  text-align: center;
}

.template__body {
  position: relative;
  display: flex;
  gap: 0 4rem;
  padding-top: 6rem;
  padding-bottom: 19rem;
}
</style>
