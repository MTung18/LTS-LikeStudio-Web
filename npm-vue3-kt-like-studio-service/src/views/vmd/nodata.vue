<template>
  <TemplateBoardWrap title="매장 VMD" container-size="full">
    <ul class="category__list">
      <li
        v-for="category in categories"
        :key="category.id"
        class="category__item"
      >
        <Tabs
          type="underbar"
          :is-selected="category.isSelected"
          @tab-selected="updateSelectedCategory(category.id)"
        >
          {{ category.category }}
          <span v-show="category.dummyLength && category.dummyLength > 0">
            {{ category.dummyLength }}
          </span>
        </Tabs>
      </li>
    </ul>
    <div class="search-wrap">
      <SearchInput
        v-model="dummyInputValue"
        placeholder="검색어를 입력해주세요"
        size="large"
        style-type="rounded"
        color-type="black"
      />
    </div>

    <div
      v-if="dummyContent && dummyContent.length > 0"
      ref="templateBodyRef"
      class="template__body"
    >
      <CategoryPaginationSideBar
        ref="categorySidebarRef"
        :data="sideCategories"
      />
      <div class="content">
        <div class="content__head">
          <h3 class="content__head-title">2023년 10월</h3>
          <div class="content__head__action">
            <CheckBox
              :check-list="'전체 선택'"
              :id="'no'"
              :shape-type="'square'"
              :name="'all'"
              v-model="allCheck"
              @change="handleAllCheck"
            ></CheckBox>
            <RoundButton component="button" color-type="filed" size="medium"
              >다운로드</RoundButton
            >
          </div>
        </div>
        <div class="content__list">
          <div v-for="item in dummyContent" :key="item" class="content__item">
            <CheckBox
              :id="`no${item.id}`"
              :shape-type="'square'"
              :name="'content'"
              :model-value="item.isChecked"
              class="content__check-box"
            ></CheckBox>
            <figure class="content__item-img">
              <img
                v-if="item.thumbnail"
                :src="getImageUrl(item.thumbnail)"
                alt="예시 이미지"
              />
              <Icons
                v-else-if="item.fileType === 'psd'"
                icon-name="psd"
                icon-color="transparent"
                :width="7.4"
                :height="7.4"
                class="content__item-icon"
              />
              <Icons
                v-else-if="item.fileType === 'ai'"
                icon-name="ai"
                icon-color="transparent"
                :width="7.4"
                :height="7.4"
                class="content__item-icon"
              />
              <Icons
                v-else-if="item.fileType === 'pdf'"
                icon-name="pdf"
                icon-color="transparent"
                :width="7.4"
                :height="7.4"
                class="content__item-icon"
              />
              <Icons
                v-else-if="item.fileType === 'pptx'"
                icon-name="etc"
                icon-color="transparent"
                :width="7.4"
                :height="7.4"
                class="content__item-icon"
              />
              <Icons
                v-else-if="item.fileType === 'zip'"
                icon-name="zip"
                icon-color="transparent"
                :width="7.4"
                :height="7.4"
                class="content__item-icon"
              />
              <Icons
                v-else-if="item.fileType === 'xls'"
                icon-name="text"
                icon-color="transparent"
                :width="7.4"
                :height="7.4"
                class="content__item-icon"
              />
              <Icons
                v-else-if="item.fileType === 'mp4' || item.fileType === 'mp3'"
                icon-name="audio"
                icon-color="transparent"
                :width="7.4"
                :height="7.4"
                class="content__item-icon"
              />
              <Icons
                v-else-if="item.fileType === 'video'"
                icon-name="video"
                icon-color="transparent"
                :width="7.4"
                :height="7.4"
                class="content__item-icon"
              />
            </figure>
            <div class="content__item-text-box">
              <p class="content__item-file-name">{{ item.fileName }}</p>
              <span class="content__item-date">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <TemplateDataNone v-else />
  </TemplateBoardWrap>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';

import CategoryPaginationSideBar from '@/components/CategoryPaginationSideBar/CategoryPaginationSideBar.vue';
import CheckBox from '@/components/CheckBox/CheckBox.vue';
import Icons from '@/components/Icons/Icons.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import Tabs from '@/components/Tabs/Tabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const templateBodyRef = ref(null);
const categorySidebarRef = ref(null);
const startStickyPosition = ref(0);
const allCheck = ref(false);
const dummyInputValue = ref('');
const categories = ref([
  {
    id: 0,
    category: '공식 VMD',
    isSelected: true,
  },
  {
    id: 1,
    category: '세일즈 VMD',
    isSelected: false,
  },
  {
    id: 2,
    category: '가이드북',
    isSelected: false,
  },
  {
    id: 3,
    category: '카테고리04',
    isSelected: false,
  },
  {
    id: 4,
    category: '카테고리05',
    isSelected: false,
  },
  {
    id: 5,
    category: '카테고리06',
    isSelected: false,
  },
]);
const sideCategories = ref([
  {
    id: 1,
    name: '2023년 10월',
    isSelected: true,
  },
  {
    id: 2,
    name: '2023년 9월',
    isSelected: false,
  },
  {
    id: 3,
    name: '2023년 8월',
    isSelected: false,
  },
  {
    id: 4,
    name: '2023년 7월',
    isSelected: false,
  },
  {
    id: 5,
    name: '2023년 6월',
    isSelected: false,
  },
  {
    id: 6,
    name: '2023년 5월',
    isSelected: false,
  },
  {
    id: 7,
    name: '2023년 4월',
    isSelected: false,
  },
  {
    id: 8,
    name: '2023년 3월',
    isSelected: false,
  },
  {
    id: 9,
    name: '2023년 2월',
    isSelected: false,
  },
  {
    id: 10,
    name: '2023년 1월',
    isSelected: false,
  },
]);
const dummyContent = ref([]);

const handleScroll = () => {
  if (!templateBodyRef.value) return;
  const currentScroll = window.pageYOffset;
  const currentTopValue = 60;
  if (currentScroll >= startStickyPosition.value) {
    const diff = currentScroll - startStickyPosition.value;
    categorySidebarRef.value.$el.style.top = `${diff + currentTopValue}px`;
  } else {
    categorySidebarRef.value.$el.style.top = `${currentTopValue}px`;
  }
};

const handleAllCheck = () => {
  dummyContent.value = dummyContent.value.map((content) => ({
    ...content,
    isChecked: allCheck.value,
  }));
};

const updateSelectedCategory = (selectedId) => {
  categories.value = categories.value.map((category) => ({
    ...category,
    isSelected: category.id === selectedId,
  }));
};

const getImageUrl = (name) => {
  return new URL(`./img/${name}.png`, import.meta.url).href;
};

onMounted(() => {
  if (templateBodyRef.value) {
    startStickyPosition.value = templateBodyRef.value.offsetTop;
  }

  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
.category__list {
  display: flex;
  justify-content: center;
  gap: 0 4rem;
  margin: 4rem 0;
}

.search-wrap {
  text-align: center;
}

.template__body {
  position: relative;
  padding-left: 30rem;
  padding-top: 6rem;
  padding-bottom: 6rem;
}

.content {
  min-width: 0;
  flex: 1;
}

.content__head-title {
  margin-bottom: 2.4rem;
  font-size: var(--ttl-l);
  font-weight: 700;
}

.content__head__action {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content__list {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 5rem 3rem;
  margin-top: 2.4rem;
}

.content__item {
  position: relative;
}

.content__check-box {
  position: absolute;
  left: 1rem;
  top: 1rem;
  z-index: 1;
}

.content__item-img {
  position: relative;
  background-color: #f4f4f4;
  height: 0;
  padding-bottom: 67.16417%;
  overflow: hidden;
}

.content__item-img > img {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 100%;
  height: 100%;
  transform: translate(-50%, -50%);
}

.content__item .content__item-text-box {
  margin-top: 1.8rem;
  word-break: break-all;
}

.content__item-icon {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.content__item-file-name {
  font-size: var(--fz-m);
  font-weight: 500;
}

.content__item-date {
  display: inline-block;
  margin-top: 0.8rem;
  font-size: var(--fz-s);
  color: var(--color-gray-777);
}
</style>
