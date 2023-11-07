<template>
  <PopupMedium
    :is-open="props.isOpen"
    :useCloseButton="true"
    popupTitle="사용자 선택"
    @close-button="handleClose"
  >
    <div class="setting-head">
      <ManageHeadForm
        :only-search="true"
        :no-calender="true"
        :no-reset="true"
      />
    </div>
    <div class="setting-body">
      <div class="manage_list-wrap">
        <div class="manage_table-wrap">
          <table>
            <thead>
              <tr>
                <th width="110px">사번</th>
                <th width="90px">이름</th>
                <th>소속</th>
              </tr>
            </thead>
            <tbody v-if="tableData1 && tableData1.length > 0">
              <tr v-for="item in tableData1" :key="item.id">
                <td>{{ item.fileNumber }}</td>
                <td class="title">
                  <RouterLink to="/site-management/vmd/create">{{
                    item.author
                  }}</RouterLink>
                </td>
                <td>
                  <ul class="depth-list">
                    <li v-if="item.depth1">{{ item.depth1 }}</li>
                    <li v-if="item.depth2">
                      <Icons
                        :width="1.4"
                        :height="1.4"
                        icon-name="chevron_r"
                      />{{ item.depth2 }}
                    </li>
                    <li v-if="item.depth3">
                      <Icons
                        :width="1.4"
                        :height="1.4"
                        icon-name="chevron_r"
                      />{{ item.depth3 }}
                    </li>
                    <li v-if="item.depth4">
                      <Icons
                        :width="1.4"
                        :height="1.4"
                        icon-name="chevron_r"
                      />{{ item.depth4 }}
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
      <Pagination v-if="tableData1 && tableData1.length > 0" :page-number="5" />
      <div class="radio-area">
        <p class="cate">형태</p>
        <div class="radio-list">
          <Radio
            :check-list="'제작'"
            :id="'agree1'"
            :name="'agree'"
            checked="checked"
          />
          <Radio :check-list="'열람'" :id="'agree2'" :name="'agree'" />
        </div>
      </div>
    </div>

    <div
      class="flex gap-x-[1rem] justify-center mt-[3.2rem]"
      v-if="tableData1 && tableData1.length > 0"
    >
      <Button
        @click="handleClose"
        component="button"
        color-type="outlined"
        size="small"
        >취소</Button
      >
      <Button component="button" color-type="primary" size="small"
        >업로드</Button
      >
    </div>
  </PopupMedium>
</template>

<script setup>
import Button from '@/components/Button/Button.vue';
import Icons from '@/components/Icons/Icons.vue';
import ManageHeadForm from '@/components/ManageHeadForm/ManageHeadForm.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import PopupMedium from '@/components/PopupMedium/PopupMedium.vue';
import Radio from '@/components/Radio/Radio.vue';
import TemplateDataNone from '@/components/TemplateDataNone/TemplateDataNone.vue';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const tableData1 = [
  {
    id: 1,
    no: 100,
    cate: '공식 VMD',
    title:
      '2023년 10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월10월',
    fileNumber: '1234',
    depth1: '상위 2뎁스',
    depth2: '팀 명',
    show: 'N',
    author: '홍길동',
  },
  {
    id: 2,
    no: 99,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    depth1: '동부유통 담당',
    depth2: '광진마케팅부',
    depth3: '소매영업팀',
    show: 'N',
    author: '홍길동',
  },
  {
    id: 3,
    no: 98,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',
    depth1: '동부유통 담당',
    depth2: '광진마케팅부',
    depth3: '소매영업팀',
    show: 'N',
    author: '홍길동',
  },
  {
    id: 4,
    no: 97,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',

    depth1: '동부유통 담당',
    depth2: '광진마케팅부',
    depth3: '소매영업팀',
    show: 'N',
    author: '홍길동',
  },
  {
    id: 5,
    no: 95,
    cate: '공식 VMD',
    title: '2023년 10월',
    fileNumber: '1234',

    depth1: '동부유통 담당',
    depth2: '광진마케팅부',
    depth3: '소매영업팀',
    show: 'N',
    author: '홍길동',
  },
];

const emit = defineEmits(['close-button']);

const handleClose = () => {
  emit('close-button', false);
};
</script>

<style scoped>
.manage_list-wrap table tbody td {
  font-weight: 400;
}
.setting-head {
  padding-bottom: 2.4rem;
}

.setting-body {
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
.radio-area {
  display: flex;
  align-items: center;
  padding: 2.5rem 0;
  border-top: 1px solid var(--color-gray-ddd);
  border-bottom: 1px solid var(--color-gray-ddd);
  margin-top: 2.4rem;
}
.radio-area .cate {
  font-size: 1.4rem;
  font-weight: bold;
  flex-basis: 10rem;
}
.radio-list {
  display: flex;
  align-items: center;
  gap: 3rem;
}
:deep(.manage_head-form) {
  margin-bottom: 0;
}
</style>
