<template>
  <PopupLarge :is-open="props.isOpen" @close-button="handleClose">
    <div class="invite">
      <h6 class="invite__title">팀룸 초대</h6>
      <div class="invite__area">
        <div class="total-member">
          <span class="total-member__length">99명</span>
          <div class="total-member__search-wrap">
            <SearchInput
              placeholder="검색어를 입력해주세요"
              size="medium"
              style-type="square"
              color-type="gray"
              class="flex-1 mr-[1.4rem]"
              v-model="dummyInputValue"
            />
            <RoundButton component="button" color-type="filed" size="medium"
              >검색</RoundButton
            >
          </div>
          <div class="total-member__table">
            <div class="manage_list-wrap">
              <div class="manage_table-wrap custom-scrollbar">
                <table>
                  <thead>
                    <tr>
                      <th width="40px">
                        <CheckBox
                          :check-list="''"
                          :id="'allCheck2'"
                          :shape-type="'square'"
                          :name="'choice'"
                          v-model="allCheck"
                          @change="handleAllCheck"
                        ></CheckBox>
                      </th>
                      <th width="100px">이름</th>
                      <th>소속</th>
                    </tr>
                  </thead>
                  <tbody v-if="tableData1 && tableData1.length > 0">
                    <tr v-for="item in tableData1" :key="item.id">
                      <td>
                        <CheckBox
                          :check-list="''"
                          :id="`check1_${item.id}`"
                          :shape-type="'square'"
                          :name="'choice'"
                          v-model="item.isChecked"
                        ></CheckBox>
                      </td>
                      <td class="title">
                        {{ item.author }}
                      </td>
                      <td>
                        <ul class="depth-list">
                          <li
                            v-for="(department, idx) in item.department"
                            :key="item.id + idx"
                          >
                            <Icons
                              v-if="idx !== 0"
                              :width="1.4"
                              :height="1.4"
                              icon-name="chevron_r"
                            />{{ department }}
                          </li>
                        </ul>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div v-if="tableData1 && tableData1.length <= 0">
                <TemplateDataNone />
              </div>
            </div>
            <Pagination
              v-if="tableData1 && tableData1.length > 0"
              :page-number="5"
            />
          </div>
        </div>
        <IconButton
          icon-name="arrow_next_bold"
          size="large"
          type="outlined"
          component="button"
          class="invite__add-btn"
        />
        <div class="invite-member">
          <span class="invite-member__length">3명</span>
          <ul class="invite-member__list">
            <li
              v-for="item in tableData2"
              :key="item.id"
              class="invite-member__item"
            >
              <span class="item-title">{{ item.author }}</span>
              <div class="depth-list">
                <div class="depth-item">
                  <template
                    v-for="(department, idx) in item.department"
                    :key="`dept-${item.id}-${idx}`"
                  >
                    <Icons
                      v-if="idx !== 0"
                      :width="1.4"
                      :height="1.4"
                      icon-name="chevron_r"
                    />
                    {{ department }}
                  </template>
                </div>
              </div>
              <IconButton
                class="item-remove-btn"
                icon-name="delete"
                size="small"
                type="outlined"
                component="button"
              />
            </li>
          </ul>
        </div>
      </div>
      <!--      <TemplateDataNone />-->
      <div
        class="pt-[2.4rem] py-[2.5rem] border-t-[1px] border-b-[1px] border-gray-gray-ddd"
      >
        <div class="flex items-center gap-x-[2rem] leading-none">
          <p class="min-w-[10rem] py-[0.6rem] text-fz-m font-bold">권한</p>
          <div class="flex gap-x-[3rem]">
            <Radio :check-list="'제작'" :id="'create'" :name="'access'" />
            <Radio :check-list="'열람'" :id="'read'" :name="'access'" />
          </div>
        </div>
      </div>
      <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
        <UIButton
          @click="handleClose"
          component="button"
          color-type="outlined"
          size="small"
          >취소</UIButton
        >
        <UIButton component="button" color-type="primary" size="small"
          >확인</UIButton
        >
      </div>
    </div>
  </PopupLarge>
</template>

<script setup>
import { ref } from 'vue';

import CheckBox from '@/components/CheckBox/CheckBox.vue';
import IconButton from '@/components/IconButton/IconButton.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PopupLarge from '@/components/PopupLarge/PopupLarge.vue';
import Radio from '@/components/Radio/Radio.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import SearchInput from '@/components/SearchInput/SearchInput.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const allCheck = ref(false);
const dummyInputValue = ref('');

const tableData1 = ref([
  {
    id: 1,
    author: '홍길동',
    department: ['상위 2뎁스', '팀 명'],
    isChecked: false,
  },
  {
    id: 2,
    author: '김길동',
    department: ['대구유통담당', '광진마케팅부', '소매영업팀'],
    isChecked: false,
  },
  {
    id: 3,
    author: '홍길동',
    department: ['소매영업팀'],
    isChecked: false,
  },
  {
    id: 4,
    author: '홍길동',
    department: ['대구유통담당', '광진마케팅부', '소매영업팀'],
    isChecked: false,
  },
  {
    id: 5,
    author: '박길동',
    department: ['대구유통담당', '광진마케팅부', '소매영업팀'],
    isChecked: false,
  },
]);

const tableData2 = ref([
  {
    id: 1,
    author: '홍길동',
    department: ['상위 2뎁스', '팀 명'],
  },
  {
    id: 2,
    author: '홍길동',
    department: ['소매영업팀'],
  },
  {
    id: 3,
    author: '홍길동',
    department: [
      '대구유통담당',
      '광진마케팅부',
      '소매영업팀',
      '소매영업팀',
      '소매영업팀',
    ],
  },
]);

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};

const handleAllCheck = () => {
  tableData1.value = tableData1.value.map((content) => ({
    ...content,
    isChecked: allCheck.value,
  }));
};
</script>

<style scoped>
.invite {
  padding: 3.2rem 4rem;
}

.invite__title {
  margin-bottom: 2.4rem;
  font-size: var(--ttl-m);
  font-weight: 700;
}

.total-member__length,
.invite-member__length {
  display: block;
  margin-bottom: 1.8rem;
  font-size: var(--fz-xl);
  font-weight: 700;
}

.invite__area {
  display: flex;
  gap: 0 3.2rem;
  margin-bottom: 3.2rem;
}

.total-member,
.invite-member {
  min-width: 0;
  flex: 1;
}

.invite__add-btn {
  align-self: center;
}

.total-member__search-wrap {
  display: flex;
  align-items: center;
  margin-bottom: 2.4rem;
  padding: 2.6rem;
  background-color: #f6f6f6;
  border-radius: 1.2rem;
}

.total-member__table {
  border-top: 1px solid var(--color-neutrals-black);
}

.manage_table-wrap {
  max-height: 40.8rem;
}

.manage_table-wrap :deep(th) {
  position: sticky;
  top: 0;
  background-color: var(--color-neutrals-white-100);
  z-index: 1;
}

.depth-list {
  display: flex;
  gap: 0.6rem;
}
.depth-list > li {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.invite-member__item .depth-list {
  align-items: center;
  min-width: 0;
  flex: 1;
  overflow: hidden;
}

.invite-member__item .depth-item {
  display: -webkit-box;
  min-width: 0;
  white-space: normal;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.invite-member__item .depth-item :deep(.icon-wrap) {
  display: inline-block;
  transform: translateY(2px);
  margin: 0 0.6rem;
}

.invite-member {
  padding: 2rem;
  border: 1px solid var(--color-gray-ddd);
  border-radius: 1.2rem;
}

.invite-member__item {
  display: flex;
  align-items: center;
  padding: 1.1rem 2rem;
  border-radius: 0.6rem;
  border: 1px solid var(--color-gray-ddd);
  background-color: #f6f6f6;
  font-size: var(--fz-m);
  line-height: 1;
}

.invite-member__item + .invite-member__item {
  margin-top: 1.2rem;
}

.item-title {
  position: relative;
  margin-right: 4rem;
}

.item-title:after {
  position: absolute;
  top: 0;
  right: -2rem;
  content: '';
  width: 1px;
  height: 100%;
  background-color: var(--color-gray-ddd);
}

.item-remove-btn {
  margin-left: auto;
}
</style>
