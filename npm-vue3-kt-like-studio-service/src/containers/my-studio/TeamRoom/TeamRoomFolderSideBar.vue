<template>
  <aside class="sidebar">
    <div class="sidebar__wrap">
      <div class="sidebar__head">
        <div class="sidebar__filter">
          <DropdownSelect
            :select-list="dummyDropdown.listData"
            :default-select="dummyDropdown.defaultSelect"
            class="flex-1 !min-w-[auto]"
          />
          <button
            @click="popupCreatedTeamRoomIsOpen = true"
            type="button"
            class="sidebar__team-add-btn exception"
          >
            <Icons icon-name="add" icon-color="var(--color-gray-777)" />
          </button>
        </div>
        <div class="sidebar__text-box">
          <span class="sidebar__desc">권한</span>
          <span class="sidebar__project-length">
            {{ access ? '열람' : '소유' }}
          </span>
        </div>
        <div class="sidebar__text-box">
          <span class="sidebar__desc">총 프로젝트 수</span>
          <span class="sidebar__project-length">12,850</span>
        </div>
        <div class="sidebar__action">
          <button type="button" class="sidebar__team-btn">팀원</button>
          <button
            v-if="!access"
            @click="popupSettingTeamRoomIsOpen = true"
            type="button"
            class="sidebar__setting-btn exception"
          >
            설정
          </button>
          <button v-else type="button" class="sidebar__exit-btn">탈퇴</button>
        </div>
      </div>
      <div class="sidebar__body">
        <RoundButton
          v-if="!access"
          class="sidebar__add-btn"
          component="button"
          color-type="lightOutlined"
          size="small"
          isIcon
        >
          <Icons icon-name="add" :width="1.4" :height="1.4" />
          추가
        </RoundButton>
        <ul ref="folderListRef" class="folder__list custom-scrollbar">
          <li class="folder__item is-selected">
            <Icons icon-name="folder" class="folder__icon" />
            <span class="folder__name">기본폴더 (0)</span>
          </li>
          <li
            v-for="item in dummyList"
            :key="item.id"
            class="folder__item"
            :class="item.id === 0 && 'is-selected'"
          >
            <Icons icon-name="folder" class="folder__icon" />
            <span class="folder__name"
              >{{ item.name }} ({{
                item.length > 999 ? '999+' : item.length
              }})</span
            >
            <button
              v-if="!access"
              @click="
                handleFileModalOpen($event, item.id + item.uuid, 'folder')
              "
              type="button"
              class="folder__setting"
            >
              <span class="folder__circle"></span>
              <span class="folder__circle"></span>
              <span class="folder__circle"></span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';

const route = useRoute();
const { access } = route.query;

const folderListRef = ref(null);
const dummyDropdown = {
  id: 1,
  cate: '팀룸1',
  defaultSelect: '팀룸1',
  listData: [
    {
      id: 1,
      listName: '팀룸1',
    },
    {
      id: 2,
      listName: '팀룸2',
    },
    {
      id: 3,
      listName: '팀룸3',
    },
  ],
};
const dummyList = ref([
  {
    id: 1,
    uuid: 124125,
    name: '관악/동작 매장 작업물 관악/동작 매장 작업물',
    length: 123456,
  },
  {
    id: 2,
    uuid: 1241,
    name: '삼성중앙역점 작업물',
    length: 100,
  },
  {
    id: 3,
    uuid: 112525,
    name: 'SNS 홍보용',
    length: 62,
  },
  {
    id: 4,
    uuid: 1242525,
    name: 'X 배너 모음',
    length: 0,
  },
  {
    id: 5,
    uuid: 1764125,
    name: '강남 매장 책받침 작업물',
    length: 53,
  },
  {
    id: 6,
    uuid: 1264125,
    name: '관악/동작 매장 작업물 관악/동작 매장 작업물',
    length: 12345,
  },
  {
    id: 7,
    uuid: 1289125,
    name: '삼성중앙역점 작업물',
    length: 100,
  },
  {
    id: 8,
    uuid: 1124125,
    name: 'SNS 홍보용',
    length: 62,
  },
  {
    id: 9,
    uuid: 4125,
    name: 'X 배너 모음',
    length: 3,
  },
  {
    id: 10,
    uuid: 125,
    name: '강남 매장 책받침 작업물',
    length: 53,
  },
  {
    id: 11,
    uuid: 145615,
    name: '기타',
    length: 0,
  },
]);

const emit = defineEmits(['onFolderModalToggle', 'onFolderScrollEvent']);
const handleFileModalOpen = async (e, id, type) => {
  emit('onFolderModalToggle', e, id, type);
};

const handleFolderScrollEvent = () => {
  emit('onFolderScrollEvent');
};

onMounted(() => {
  folderListRef.value.addEventListener('scroll', handleFolderScrollEvent);
});

onUnmounted(() => {
  if (folderListRef.value) {
    folderListRef.value.removeEventListener('scroll', handleFolderScrollEvent);
  }
});
</script>

<style scoped>
.sidebar {
  width: 26rem;
}

.sidebar__wrap {
  position: sticky;
  top: 8rem;
}

.sidebar__head {
  padding: 2.4rem 2rem;
  border-radius: 1.2rem;
  border: 1px solid var(--color-gray-ddd);
}

.sidebar__filter {
  display: flex;
  gap: 0 1.4rem;
  margin-bottom: 2rem;
}

.sidebar__team-add-btn {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 4.8rem;
  height: 4.8rem;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 0.4rem;
}

.sidebar__team-add-btn:hover {
  border-color: var(--color-neutrals-black);
}

.sidebar__text-box {
  display: flex;
  gap: 0 1rem;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.sidebar__desc {
  font-size: var(--fz-m);
  font-weight: 700;
}

.sidebar__project-length {
  font-size: var(--fz-m);
  text-align: right;
}

.sidebar__head + .sidebar__body {
  margin-top: 4rem;
}

.sidebar__action {
  display: flex;
  gap: 0 2.8rem;
  margin-top: 2rem;
}

.sidebar__action button {
  position: relative;
  font-size: var(--fz-s);
  color: var(--color-gray-777);
}

.sidebar__action button:not(:last-child)::after {
  position: absolute;
  top: 0;
  right: -1.4rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.folder__list {
  height: 50.6rem;
  margin-top: 1.6rem;
  border-top: 1px solid var(--color-gray-ddd);
  border-bottom: 1px solid var(--color-gray-ddd);
  overflow-y: auto;
}

.folder__item {
  display: flex;
  align-items: center;
  height: 4.6rem;
}

.folder__item.is-selected {
  background-color: #f6f6f6;
}

.folder__icon {
  margin-right: 0.8rem;
}

.folder__name {
  min-width: 0;
  flex: 1;
  margin-right: 1.2rem;
  font-size: var(--fz-m);
  color: var(--color-gray-444);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.folder__setting {
  margin-left: auto;
  width: 2.4rem;
  height: 2.4rem;
}

.folder__circle {
  display: block;
  width: 0.3rem;
  height: 0.3rem;
  margin: 0 auto;
  border-radius: 9999px;
  background-color: var(--color-gray-777);
}

.folder__circle + .folder__circle {
  margin-top: 0.2rem;
}

.setting__modal {
  position: absolute;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 0.4rem;
  background-color: var(--color-neutrals-white-100);
  text-align: right;
}

.setting__modal-btn {
  height: 3.1rem;
  padding: 0 1.4rem;
  font-size: var(--fz-s);
  color: var(--color-gray-444);
}
</style>
