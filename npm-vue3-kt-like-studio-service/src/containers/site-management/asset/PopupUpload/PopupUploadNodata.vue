<template>
  <PopupMedium
    :is-open="props.isOpen"
    popupTitle="업로드"
    @close-button="handleClose"
    ><div class="select-wrap flex justify-between mb-[2rem] items-end">
      <div class="flex gap-[0.8rem] items-center">
        <ul class="upload-list">
          <li class="upload-list-node">
            <p class="waiting">대기중 <span class="num">0</span></p>
          </li>
          <li class="upload-list-node">
            <p class="complete">완료 <span class="num">0</span></p>
          </li>
          <li class="upload-list-node">
            <p class="fail">실패 <span class="num">0</span></p>
          </li>
        </ul>
      </div>
      <RoundButton component="button" color-type="filed" size="small"
        >파일 선택</RoundButton
      >
    </div>
    <div class="manage_list-wrap">
      <div class="manage_table-wrap">
        <table>
          <thead>
            <tr>
              <th width="40px">NO</th>
              <th>파일</th>
              <th>상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody v-if="tableData1 && tableData1.length > 0">
            <tr v-for="item in tableData1" :key="item.id">
              <td class="num">{{ item.no }}</td>
              <td class="title !text-left">
                <RouterLink to="/site-management/vmd/create">{{
                  item.file
                }}</RouterLink>
              </td>
              <td
                :class="
                  item.state === 'waiting'
                    ? 'waiting'
                    : item.state === 'complete'
                    ? 'complete'
                    : 'fail'
                "
              >
                {{
                  item.state === 'waiting'
                    ? '대기중'
                    : item.state === 'complete'
                    ? '완료'
                    : '실패'
                }}
              </td>
              <td
                :class="
                  item.state === 'waiting'
                    ? 'waiting'
                    : item.state === 'complete'
                    ? 'complete'
                    : 'fail'
                "
              >
                <button type="button" class="delete-btn">
                  <Icons
                    icon-name="trash"
                    icon-color="var(--color-neutrals-white-100)"
                  />
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="flex gap-x-[1rem] justify-center mt-[3.2rem]">
      <UIButton
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        >닫기</UIButton
      >
      <UIButton
        component="button"
        v-if="tableData1 && tableData1.length > 0"
        color-type="primary"
        size="small"
        >업로드</UIButton
      >
      <UIButton
        component="button"
        v-if="tableData1 && tableData1.length <= 0"
        disabled
        color-type="primary"
        size="small"
        >업로드</UIButton
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import Icons from '@/components/Icons/Icons.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';
import UIButton from '@/components/UIButton/UIButton.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};

const tableData1 = [];
</script>

<style scoped>
.manage_list-wrap {
  border-bottom: 1px solid var(--color-gray-ddd);
}
.manage_list-wrap table thead th {
  padding: 1.6rem 0;
}
.manage_list-wrap table tbody td {
  font-weight: 400;
  padding: 1.8rem 1rem;
  line-height: 1.4;
}
.manage_list-wrap table tbody td.title a {
  border-bottom: 0;
  padding-top: 0;
}
.upload-list {
  display: flex;
  gap: 1.2rem;
  font-size: 1.4rem;
}
.upload-list li {
  position: relative;
}
.upload-list li + li {
  padding-left: 1.2rem;
}
.upload-list li + li:after {
  content: '';
  display: block;
  width: 1px;
  height: 1.8rem;
  background: var(--color-gray-ddd);
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
}
.manage_table-wrap {
  max-height: 33.2rem;
  height: 33.2rem;
}
.manage_table-wrap .complete,
.complete .num {
  color: #27a53b;
}
.manage_table-wrap .fail,
.fail .num {
  color: var(--color-primary);
}
.manage_table-wrap .waiting,
.waiting .num {
  color: var(--color-neutrals-black);
}
.delete-btn {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
