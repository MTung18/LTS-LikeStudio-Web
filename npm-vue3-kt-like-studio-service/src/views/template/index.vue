<!--
  231109 : sidebar 마크업이나 로직이 변경 될 수 있음
-->
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
          :data="dummyCategory"
          @category-selected="handleCategorySelected"
        />
        <div class="content">
          <!--        <TemplateDataNone class="!mt-[19rem]" />-->
          <div class="content__section">
            <div class="content__head">
              <h3 class="content__head-title">베스트 템플릿</h3>
            </div>
            <SliderLayout @slide-click="handleOpenPopup" />
          </div>

          <div class="content__section">
            <div class="content__head">
              <h3 class="content__head-title">전체 템플릿</h3>
              <div class="head-info">
                <div class="head-info__length">
                  <span class="head-info__length-text"
                    >총
                    <span class="head-info__length-point">2,850</span>개</span
                  >
                </div>
                <div class="head-info__category">
                  <button
                    type="button"
                    class="head-info__category-btn is-selected"
                  >
                    최신순
                  </button>
                  <button type="button" class="head-info__category-btn">
                    인기순
                  </button>
                </div>
              </div>
            </div>
            <MasonryLayout @gallery-click="handleOpenPopup" />
            <Loading class="mt-[8rem]" />
          </div>
        </div>
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
import Loading from '@/components/Loading/Loading.vue';
import MasonryLayout from '@/components/MasonryLayout/MasonryLayout.vue';
import PopupSliderLayout from '@/components/PopupSliderLayout/PopupSliderLayout.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import SliderLayout from '@/components/SliderLayout/SliderLayout.vue';

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
      {
        id: 210,
        name: '기타2',
        isSelected: false,
      },
      {
        id: 211,
        name: '기타3',
        isSelected: false,
      },
      {
        id: 212,
        name: '기타4',
        isSelected: false,
      },
      {
        id: 213,
        name: '기타5',
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

.content {
  min-width: 0;
  flex: 1;
}

.content__section + .content__section {
  margin-top: 8rem;
}

.content__head-title {
  margin-bottom: 1rem;
  font-size: var(--ttl-l);
  font-weight: 700;
}

.head-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.head-info__length {
  font-size: var(--fz-l);
  color: var(--color-gray-444);
}

.head-info__length-point {
  font-weight: 700;
  color: var(--color-primary);
}

.head-info__category-btn {
  position: relative;
  margin-right: 3.2rem;
  font-size: var(--fz-m);
  color: var(--color-gray-444);
}

.head-info__category-btn.is-selected {
  font-weight: 700;
  color: var(--color-neutrals-black);
}

.head-info__category-btn:not(:last-child)::after {
  position: absolute;
  top: 0;
  right: -1.6rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}
</style>
