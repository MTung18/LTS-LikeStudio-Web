<template>
  <div class="project">
    <TeamRoomFolderSideBar
      @on-folder-modal-toggle="handleModalToggle"
      @on-folder-scroll-event="handleScrollEvent"
    />
    <div class="project__wrap">
      <div class="studio__head">
        <h3 class="studio__head__title">관악/동작 매장 작업물</h3>
        <div class="studio__head__length">2,850</div>
      </div>
      <div class="flex">
        <div v-if="!access && !teamMember" class="flex items-center mr-[1rem]">
          <CheckBox
            :check-list="'전체 선택'"
            :id="'no'"
            :shape-type="'square'"
            :name="'all'"
            v-model="allCheck"
            @change="handleAllCheck"
            class="mr-[1.4rem]"
          ></CheckBox>
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="medium"
            class="mr-[0.8rem]"
            >삭제</RoundButton
          >
          <RoundButton
            component="button"
            color-type="lightOutlined"
            size="medium"
            >이동</RoundButton
          >
        </div>
        <div
          class="relative flex flex-1 items-center gap-x-[1.4rem] ml-auto mr-[4rem] before:absolute before:content-[''] before:right-[-2rem] before:top-0 before:w-[1px] before:h-full before:bg-gray-gray-ddd"
        >
          <SearchInput
            v-model="dummyInputValue"
            placeholder="검색어를 입력해주세요"
            size="medium"
            style-type="square"
            color-type="gray"
            class="flex-1 !max-w-[46rem] ml-auto"
          />
          <RoundButton component="button" color-type="filed" size="medium"
            >검색</RoundButton
          >
        </div>
        <div class="flex items-center">
          <DropdownSelect
            v-if="!teamMember"
            :select-list="dummyDropdown.listData"
            :default-select="dummyDropdown.defaultSelect"
            class="!min-w-[13rem]"
            :class="access ? 'mr-0' : 'mr-[1.4rem]'"
          ></DropdownSelect>
          <RoundButton
            v-if="!access && !teamMember"
            @click="popupNewProjectIsOpen = true"
            component="button"
            color-type="filed"
            size="medium"
            class="exception"
            >새 프로젝트</RoundButton
          >
          <RoundButton
            v-if="teamMember"
            component="button"
            color-type="filed"
            size="medium"
            class="exception"
            @click="popupTeamMemberInviteIsOpen = true"
            >초대</RoundButton
          >
        </div>
      </div>
      <template v-if="nodata"> <TemplateDataNone />대 </template>
      <template v-else-if="teamMember">
        <TeamMemberList />
      </template>
      <template v-else>
        <ul class="studio__content-list">
          <li
            v-for="item in dummyContent"
            :key="item.id"
            class="studio__content-item"
          >
            <CheckBox
              :id="`no${item.id}`"
              :shape-type="'square'"
              :name="'content'"
              :model-value="item.isChecked"
              class="studio__content-item__check-box"
            ></CheckBox>
            <div
              v-if="item.length && item.length > 0"
              class="studio__content-item__length"
            >
              <Icons icon-name="user" :width="1.8" :height="1.8" />
              {{ item.length }}
            </div>
            <figure class="studio__content-item__img">
              <img :src="getImageUrl(item.thumbnail)" alt="예시 이미지" />
            </figure>
            <div class="studio__content-item__text-box">
              <p class="studio__content-item__title">{{ item.title }}</p>
              <span class="studio__content-item__date">{{ item.date }}</span>
              <button
                @click="
                  handleModalToggle($event, item.id + item.uuid, 'project')
                "
                type="button"
                class="studio__content-item__btn"
              >
                <span class="circle"></span>
                <span class="circle"></span>
                <span class="circle"></span>
              </button>
            </div>
          </li>
        </ul>
        <Pagination />
      </template>
    </div>
  </div>
  <Teleport to="#popup">
    <div
      v-show="settingFolderModalToggle"
      ref="settingFolderModalRef"
      class="setting__modal"
    >
      <button
        @click="popupRenameTitleIsOpen = true"
        type="button"
        class="setting__modal-btn"
      >
        제목 변경
      </button>
      <button type="button" class="setting__modal-btn">삭제</button>
    </div>
  </Teleport>
  <Teleport to="#popup">
    <div
      v-show="settingProjectModalToggle"
      ref="settingProjectModalRef"
      class="setting__modal"
    >
      <button
        type="button"
        class="setting__modal-btn"
        @click="popupRenameTitleIsOpen = true"
      >
        제목 변경
      </button>
      <button type="button" class="setting__modal-btn">복제</button>
      <button
        type="button"
        class="setting__modal-btn"
        @click="popupChooseFolderIsOpen = true"
      >
        위치 이동
      </button>
      <button
        type="button"
        class="setting__modal-btn"
        @click="popupSelectTeamRoomIsOpen = true"
      >
        내 프로젝트로 복제
      </button>
      <button
        type="button"
        class="setting__modal-btn"
        @click="popupProjectDownloadIsOpen = true"
      >
        다운로드
      </button>
      <button type="button" class="setting__modal-btn">슬라이드 쇼</button>
      <div
        class="border-t-[1px] border-solid border-gray-gray-ddd my-[1rem]"
      ></div>
      <button type="button" class="setting__modal-btn">삭제</button>
    </div>
  </Teleport>
  <PopupRenameTitle
    :is-open="popupRenameTitleIsOpen"
    @close-button="popupRenameTitleIsOpen = false"
  />
  <PopupChooseFolder
    :is-open="popupChooseFolderIsOpen"
    @close-button="popupChooseFolderIsOpen = false"
  />
  <PopupProjectDownload
    :is-open="popupProjectDownloadIsOpen"
    @close-button="popupProjectDownloadIsOpen = false"
    @open-faq-popup="popupFAQIsOpen = true"
  />
  <PopupFAQ :is-open="popupFAQIsOpen" @close-button="popupFAQIsOpen = false" />
  <PopupTeamMemberInvite
    :is-open="popupTeamMemberInviteIsOpen"
    @close-button="popupTeamMemberInviteIsOpen = false"
  />
  <PopupCreatedTeamRoom
    :is-open="popupCreatedTeamRoomIsOpen"
    @close-button="popupCreatedTeamRoomIsOpen = false"
  />
  <PopupSettingTeamRoom
    :is-open="popupSettingTeamRoomIsOpen"
    @close-button="popupSettingTeamRoomIsOpen = false"
  />
</template>

<script setup>
import { nextTick, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

import CheckBox from '@/components/CheckBox/CheckBox.vue';
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import PopupChooseFolder from '@/containers/my-studio/MyProject/PopupChooseFolder.vue';
import PopupFAQ from '@/containers/my-studio/MyProject/PopupFAQ.vue';
import PopupProjectDownload from '@/containers/my-studio/MyProject/PopupProjectDownload.vue';
import PopupRenameTitle from '@/containers/my-studio/MyProject/PopupRenameTitle.vue';
import PopupCreatedTeamRoom from '@/containers/my-studio/TeamRoom/PopupCreatedTeamRoom.vue';
import PopupSettingTeamRoom from '@/containers/my-studio/TeamRoom/PopupSettingTeamRoom.vue';
import PopupTeamMemberInvite from '@/containers/my-studio/TeamRoom/PopupTeamMemberInvite.vue';
import TeamMemberList from '@/containers/my-studio/TeamRoom/TeamMemberList.vue';
import TeamRoomFolderSideBar from '@/containers/my-studio/TeamRoom/TeamRoomFolderSideBar.vue';

const route = useRoute();
const { nodata, access, teamMember } = route.query;

const settingProjectModalRef = ref(null);
const settingFolderModalRef = ref(null);
const settingProjectModalToggle = ref(false);
const settingFolderModalToggle = ref(false);
const currentClickProjectId = ref(null);
const currentClickFolderId = ref(null);

const popupNewProjectIsOpen = ref(false);
const popupRenameTitleIsOpen = ref(false);
const popupSelectTeamRoomIsOpen = ref(false);
const popupChooseFolderIsOpen = ref(false);
const popupProjectDownloadIsOpen = ref(false);
const popupFAQIsOpen = ref(false);
const popupTeamMemberInviteIsOpen = ref(false);
const popupCreatedTeamRoomIsOpen = ref(false);
const popupSettingTeamRoomIsOpen = ref(false);

const allCheck = ref(false);
const dummyInputValue = ref('');
const dummyDropdown = {
  id: 1,
  cate: '등록순',
  defaultSelect: '등록순',
  listData: [
    {
      id: 1,
      listName: '등록순',
    },
    {
      id: 2,
      listName: '최근 수정순',
    },
    {
      id: 3,
      listName: '이름순',
    },
  ],
};
const dummyContent = ref([
  {
    id: 1,
    uuid: 3461,
    title: 'AI 보이스 대나무 숲',
    date: '2023.08.14',
    isChecked: true,
    thumbnail: 'img_project_1',
    length: 12,
  },
  {
    id: 2,
    uuid: 34672,
    title: '청년 예술 지원 사업 프로젝트',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_2',
  },
  {
    id: 3,
    uuid: 6784,
    title: '무이자 할부 혜택받고 구매하세요',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_3',
    length: 5,
  },
  {
    id: 4,
    uuid: 3496,
    title: 'Y는 친구끼리 간편하게 결합! 실속있게 할인!',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_4',
    length: 3,
  },
  {
    id: 5,
    uuid: 4382,
    title: '원하는 콘텐츠를 알아서, 딱',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_5',
  },
  {
    id: 6,
    uuid: 2480,
    title: 'KT만의 강인한 혜택',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_6',
  },
  {
    id: 7,
    uuid: 385633,
    title: '시월구일 한글날 에이 아이 백일장',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_7',
  },
  {
    id: 8,
    uuid: 346632,
    title: '2만원대 5G 무제한 데이터로 데이터나 유튜브 마음껏',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_8',
  },
  {
    id: 9,
    uuid: 274575,
    title: 'AI 보이스 대나무 숲',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_1',
    length: 12,
  },
  {
    id: 10,
    uuid: 524822,
    title: '청년 예술 지원 사업 프로젝트',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_2',
  },
  {
    id: 11,
    uuid: 5248999,
    title: '무이자 할부 혜택받고 구매하세요',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_3',
    length: 5,
  },
  {
    id: 12,
    uuid: 48565,
    title: 'Y는 친구끼리 간편하게 결합! 실속있게 할인!',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_4',
    length: 3,
  },
  {
    id: 13,
    uuid: 4285993,
    title: '원하는 콘텐츠를 알아서, 딱',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_5',
  },
  {
    id: 14,
    uuid: 27374328,
    title: 'KT만의 강인한 혜택',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_6',
  },
  {
    id: 15,
    uuid: 384589,
    title: '시월구일 한글날 에이 아이 백일장',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_7',
  },
  {
    id: 16,
    uuid: 100854,
    title: '2만원대 5G 무제한 데이터로 데이터나 유튜브 마음껏',
    date: '2023.08.14',
    isChecked: false,
    thumbnail: 'img_project_8',
  },
]);

const handleAllCheck = () => {
  dummyContent.value = dummyContent.value.map((content) => ({
    ...content,
    isChecked: allCheck.value,
  }));
};

const getImageUrl = (name) => {
  return new URL(`./img/${name}.png`, import.meta.url).href;
};

const setModalPosition = (e, type) => {
  const isModal =
    type === 'project'
      ? settingProjectModalRef.value
      : settingFolderModalRef.value;
  const scrollY = window.pageYOffset;
  const scrollX = window.pageXOffset;
  const windowH = window.innerHeight;
  const viewPortBottom = scrollY + windowH;
  const { currentTarget } = e;
  const positionLeftGap = 12;
  const targetHeight = currentTarget.offsetHeight;
  const targetTop = currentTarget.getBoundingClientRect().top;
  const ModalWidth = isModal.offsetWidth - positionLeftGap;
  const ModalHeight = isModal.offsetHeight;
  const targetBottom = targetTop + targetHeight;
  const targetRight = currentTarget.getBoundingClientRect().left - ModalWidth;
  if (viewPortBottom < targetBottom + scrollY + ModalHeight) {
    const result = scrollY + targetBottom - ModalHeight - targetHeight;
    isModal.style.top = `${result}px`;
  } else {
    const result = scrollY + targetBottom;
    isModal.style.top = `${result}px`;
  }
  isModal.style.left = `${scrollX + targetRight}px`;
};

const handleModalToggle = async (e, id, type) => {
  console.log('id', id);

  if (type === 'project') {
    console.log('project');
    settingFolderModalToggle.value = false;
    currentClickFolderId.value = null;
    if (currentClickProjectId.value === id) {
      settingProjectModalToggle.value = false;
      currentClickProjectId.value = null;
      return;
    }

    settingProjectModalToggle.value = true;
    currentClickProjectId.value = id;
  } else if (type === 'folder') {
    settingProjectModalToggle.value = false;
    currentClickProjectId.value = null;
    if (currentClickFolderId.value === id) {
      settingFolderModalToggle.value = false;
      currentClickFolderId.value = null;
      return;
    }

    settingFolderModalToggle.value = true;
    currentClickFolderId.value = id;
  }
  await nextTick();
  setModalPosition(e, type);
};

const handleModalClose = (e) => {
  const modalButton = [
    ...document.querySelectorAll(
      '.studio__content-item__btn, .folder__setting',
    ),
  ];

  const clickedOnSettingButton = modalButton.some((button) =>
    button.contains(e.target),
  );

  if (clickedOnSettingButton) {
    return;
  }

  currentClickProjectId.value = null;
  currentClickFolderId.value = null;
  settingProjectModalToggle.value = false;
  settingFolderModalToggle.value = false;
};

const handleScrollEvent = () => {
  if (!settingProjectModalToggle.value && !settingFolderModalToggle.value)
    return;
  currentClickProjectId.value = null;
  currentClickFolderId.value = null;
  settingProjectModalToggle.value = false;
  settingFolderModalToggle.value = false;
};

const handlerResize = () => {
  currentClickProjectId.value = null;
  currentClickFolderId.value = null;
  settingProjectModalToggle.value = false;
  settingFolderModalToggle.value = false;
};

onMounted(() => {
  document.addEventListener('click', handleModalClose);
  window.addEventListener('scroll', handleScrollEvent);
  window.addEventListener('resize', handlerResize);
});

onUnmounted(() => {
  document.removeEventListener('click', handleModalClose);
  window.removeEventListener('scroll', handleScrollEvent);
  window.removeEventListener('resize', handlerResize);
});
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

.studio__content-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3rem;
  margin-top: 2.4rem;
  margin-bottom: 6rem;
}

.studio__content-item {
  position: relative;
  border-radius: 1.2rem;
  border: 1px solid var(--color-gray-ddd);
  overflow: hidden;
}

.studio__content-item__check-box {
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: var(--color-neutrals-white-100);
  border-radius: 0.4rem;
  overflow: hidden;
  z-index: 1;
}

.studio__content-item__length {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0 0.6rem;
  min-width: 6.5rem;
  height: 3.2rem;
  border-radius: 5.6rem;
  background-color: rgba(0, 0, 0, 0.5);
  font-size: var(--fz-m);
  font-weight: 500;
  color: var(--color-neutrals-white-100);
  line-height: 1;
  z-index: 1;
}

.studio__content-item__img {
  position: relative;
  height: 0;
  padding-bottom: 67.05539%;
  background-color: #f6f6f6;
  overflow: hidden;
}

.studio__content-item__img img {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.studio__content-item__text-box {
  position: relative;
  padding: 1.8rem 3.6rem 1.8rem 2rem;
}

.studio__content-item__title {
  margin-bottom: 0.8rem;
  font-size: var(--fz-l);
  font-weight: 700;
  display: -webkit-box;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.studio__content-item__date {
  font-size: var(--fz-s);
  color: var(--color-gray-777);
}

.studio__content-item__btn {
  position: absolute;
  top: 1.8rem;
  right: 1.4rem;
  width: 1.6rem;
  height: 1.6rem;
}

.studio__content-item__btn .circle {
  display: block;
  width: 0.3rem;
  height: 0.3rem;
  margin: 0 auto;
  border-radius: 9999px;
  background-color: var(--color-gray-777);
}

.studio__content-item__btn .circle + .circle {
  margin-top: 0.2rem;
}

.setting__modal {
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 1.4rem;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 0.4rem;
  background-color: var(--color-neutrals-white-100);
  z-index: 1;
}

.setting__modal-btn {
  font-size: var(--fz-s);
  color: var(--color-gray-444);
  text-align: right;
}

.setting__modal-btn + .setting__modal-btn {
  margin-top: 1rem;
}
</style>
