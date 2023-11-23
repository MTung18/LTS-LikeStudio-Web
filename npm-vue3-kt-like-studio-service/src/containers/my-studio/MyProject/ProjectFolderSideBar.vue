<template>
  <aside class="sidebar">
    <div class="sidebar__wrap">
      <div class="sidebar__head">
        <div class="sidebar__icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 46 46"
            fill="none"
          >
            <path
              d="M45.4 23C45.4 35.3712 35.3712 45.4 23 45.4C10.6288 45.4 0.6 35.3712 0.6 23C0.6 10.6288 10.6288 0.6 23 0.6C35.3712 0.6 45.4 10.6288 45.4 23Z"
              fill="#FFC737"
              stroke="black"
              stroke-width="1.2"
            />
            <path
              d="M28.7507 20.7006C30.021 20.7006 31.0508 19.6708 31.0508 18.4005C31.0508 17.1302 30.021 16.1004 28.7507 16.1004C27.4805 16.1004 26.4507 17.1302 26.4507 18.4005C26.4507 19.6708 27.4805 20.7006 28.7507 20.7006Z"
              fill="black"
            />
            <path
              d="M17.2505 20.7006C18.5208 20.7006 19.5506 19.6708 19.5506 18.4005C19.5506 17.1302 18.5208 16.1004 17.2505 16.1004C15.9802 16.1004 14.9504 17.1302 14.9504 18.4005C14.9504 19.6708 15.9802 20.7006 17.2505 20.7006Z"
              fill="black"
            />
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M15.8597 25.3265C16.4808 25.1934 17.0921 25.5889 17.2252 26.21C17.4572 27.2926 18.8889 29.9011 23.0009 29.9011C27.1129 29.9011 28.5446 27.2926 28.7766 26.21C28.9097 25.5889 29.521 25.1934 30.142 25.3265C30.7631 25.4595 31.1587 26.0709 31.0256 26.6919C30.6004 28.6761 28.352 32.2011 23.0009 32.2011C17.6497 32.2011 15.4014 28.6761 14.9762 26.6919C14.8431 26.0709 15.2387 25.4595 15.8597 25.3265Z"
              fill="black"
            />
          </svg>
        </div>
        <b class="sidebar__title">나의 프로젝트</b>
        <div class="sidebar__text-box">
          <span class="sidebar__desc">총 프로젝트 수</span>
          <span class="sidebar__project-length">12,850</span>
        </div>
      </div>
      <div class="sidebar__body">
        <RoundButton
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
          <li class="folder__item">
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

import Icons from '@/components/Icons/Icons.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';

const folderListRef = ref(null);
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

.sidebar__icon {
  width: 4.6rem;
  height: 4.6rem;
}

.sidebar__title {
  display: block;
  margin-top: 2rem;
  font-size: var(--fz-l);
  font-weight: 700;
}

.sidebar__text-box {
  display: flex;
  gap: 0 1rem;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.8rem;
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
