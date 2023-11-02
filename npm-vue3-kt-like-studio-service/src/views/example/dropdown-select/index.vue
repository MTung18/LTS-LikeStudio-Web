<template>
  <article class="article">
    <h2 class="article__title">Dropdown Select</h2>
    <div class="article__group">
      <div class="article__inner">
        <DropdownSelect
          :select-list="dummyData"
          :size="'large'"
          :default-select="'선택'"
        ></DropdownSelect>
      </div>
      <p class="article__select-desc">large, unselected+completed</p>
      <div class="article__inner">
        <DropdownSelect
          :select-list="dummyData"
          :disabled="true"
          :size="'large'"
          :default-select="'선택'"
        ></DropdownSelect>
      </div>
      <p class="article__select-desc">large, disabled</p>
      <div class="article__inner">
        <DropdownSelect
          :select-list="dummyData"
          :size="'medium'"
          :default-select="'선택'"
        ></DropdownSelect>
      </div>
      <p class="article__select-desc">medium, unselected+completed</p>
      <div class="article__inner">
        <DropdownSelect
          :select-list="dummyData"
          :disabled="true"
          :size="'medium'"
          :default-select="'선택'"
        ></DropdownSelect>
      </div>
      <p class="article__select-desc">medium, disabled</p>
    </div>
  </article>
</template>

<script setup>
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';

const dummyData = [
  {
    id: 0,
    listName: '로그인',
  },
  {
    id: 1,
    listName: '사용법',
  },
  {
    id: 2,
    listName: '저작권',
  },
  {
    id: 3,
    listName: '팀룸',
  },
  {
    id: 4,
    listName: '서비스 오류',
  },
];
</script>

<style scoped>
.article {
  padding: 4rem;
}

.article + .article {
  margin-top: 2rem;
}

.article__group {
  display: flex;
  flex-flow: column;
  border: 1px dashed #9747ff;
  border-radius: 2rem;
  padding: 50px;
  min-height: 800px;
}

.article__title {
  margin-bottom: 2rem;
  font-size: var(--ttl-l);
}

.article__select-desc {
  margin-top: 1.5rem;
  font-size: var(--fz-m);
}
.article__select-desc + .article__inner {
  margin-top: 30px;
}
</style>
