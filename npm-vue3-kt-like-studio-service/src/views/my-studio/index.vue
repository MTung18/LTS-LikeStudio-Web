<!--
  231109
  - 나의 프로젝트: setting__modal 모달 로직이 변경 될 수 있음(팀룸에서도 동일)
  - 팀룸: 팀룸 초대 팝업에 테이블이 마크업이나 로직이 변경 될 수 있음, 이메일 템플릿은 추후에 제작 완료 예정
  - 갤러리 공유: sidebar 마크업이나 로직이 변경 될 수 있음, 테이블 마크업이나 로직이 변경 될 수 있음
  - 즐겨찾기 템플릿: sidebar 마크업이나 로직이 변경 될 수 있음
-->
<template>
  <TemplateBoardWrap title="나의 스튜디오" container-size="full">
    <div class="tab-list" :class="notPossession && '!mx-auto !mt-[7.2rem]'">
      <div v-for="tab in dummyTabs" :key="tab.id" class="tab-item">
        <RoundTabs
          class="tab-item-btn"
          @tabSelected="handleSelectedTab(tab.id)"
          :is-selected="tab.isSelected"
          >{{ tab.tabName }}</RoundTabs
        >
      </div>
    </div>
    <MyProject v-if="dummyTabs[0].isSelected" />
    <TeamRoom v-else-if="dummyTabs[1].isSelected" />
    <SharingGallery v-else-if="dummyTabs[2].isSelected" />
    <FavoriteTemplate v-else-if="dummyTabs[3].isSelected" />
  </TemplateBoardWrap>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

import RoundTabs from '@/components/RoundTabs/RoundTabs.vue';
import TemplateBoardWrap from '@/components/TemplateBoardWrap/TemplateBoardWrap.vue';
import FavoriteTemplate from '@/containers/my-studio/FavoriteTemplate/FavoriteTemplate.vue';
import MyProject from '@/containers/my-studio/MyProject/MyProject.vue';
import SharingGallery from '@/containers/my-studio/SharingGallery/SharingGallery.vue';
import TeamRoom from '@/containers/my-studio/TeamRoom/TeamRoom.vue';

const route = useRoute();
const { notPossession } = route.query;

const dummyTabs = ref([
  {
    id: 0,
    tabName: '나의 프로젝트',
    isSelected: true,
  },
  {
    id: 1,
    tabName: '팀룸',
    isSelected: false,
  },
  {
    id: 2,
    tabName: '갤러리 공유',
    isSelected: false,
  },
  {
    id: 3,
    tabName: '즐겨찾기 템플릿',
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
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1200px;
  margin: 7.2rem auto 0 30rem;
}

.tab-item-btn {
  width: 100%;
}
</style>
