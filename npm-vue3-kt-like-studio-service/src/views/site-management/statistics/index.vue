<template>
  <TemplateBoardWrap title="통계">
    <div class="tab-list">
      <div v-for="tab in dummyTabs" :key="tab.id">
        <RoundTabs
          @tabSelected="handleSelectedTab(tab.id)"
          :is-selected="tab.isSelected"
          >{{ tab.tabName }}</RoundTabs
        >
      </div>
    </div>
    <div class="filter">
      <CalenderGroup />
      <div class="filter__action">
        <RoundButton component="button" color-type="outlined" size="medium"
          >오늘</RoundButton
        >
        <RoundButton component="button" color-type="outlined" size="medium"
          >1주일</RoundButton
        >
        <RoundButton component="button" color-type="outlined" size="medium"
          >1개월</RoundButton
        >
        <RoundButton component="button" color-type="outlined" size="medium"
          >3개월</RoundButton
        >
        <RoundButton component="button" color-type="outlined" size="medium"
          >1년</RoundButton
        >
      </div>
    </div>
    <div class="mt-[7.2rem]">
      <StatisticsTemplate v-if="dummyTabs[0].isSelected" />
      <StatisticsGallery v-if="dummyTabs[1].isSelected" />
      <StatisticsSite v-if="dummyTabs[2].isSelected" />
    </div>
  </TemplateBoardWrap>
</template>

<script setup>
import { ref } from 'vue';

import CalenderGroup from '@/components/CalenderGroup/CalenderGroup.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import RoundTabs from '@/components/RoundTabs/RoundTabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import StatisticsGallery from '@/containers/site-management/statistics/StatisticsGallery.vue';
import StatisticsSite from '@/containers/site-management/statistics/StatisticsSite.vue';
import StatisticsTemplate from '@/containers/site-management/statistics/StatisticsTemplate.vue';

const dummyTabs = ref([
  {
    id: 0,
    tabName: '템플릿',
    isSelected: true,
  },
  {
    id: 1,
    tabName: '갤러리',
    isSelected: false,
  },
  {
    id: 2,
    tabName: '사이트',
    isSelected: false,
  },
]);

function handleSelectedTab(selectedId) {
  dummyTabs.value = dummyTabs.value.map((tab) => ({
    ...tab,
    isSelected: tab.id === selectedId,
  }));
}
</script>

<style scoped>
.tab-list {
  display: flex;
  margin-bottom: 4rem;
  margin-top: 7.2rem;
}
.tab-list > * {
  flex: 1;
  width: 100%;
}
:deep(.round-tabs) {
  width: 100%;
}

.filter {
  display: flex;
  gap: 0 5.2rem;
  padding: 2.6rem;
  margin-top: 4rem;
  background-color: #f6f6f6;
}

.filter__action {
  position: relative;
  display: flex;
  gap: 0 1.4rem;
}

.filter__action::after {
  position: absolute;
  top: 0;
  left: -2.6rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}
</style>
