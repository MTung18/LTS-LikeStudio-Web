<template>
  <div class="manage_list-wrap">
    <div class="manage_table-wrap">
      <table>
        <thead>
          <tr>
            <th width="40px">NO</th>
            <th width="100px">이름</th>
            <th width="100px">소속</th>
            <th width="160px">권한</th>
            <th width="134px">삭제</th>
          </tr>
        </thead>
        <tbody v-if="tableData && tableData.length > 0">
          <tr v-for="item in tableData" :key="item.id">
            <td class="num">{{ item.no }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.department }}</td>
            <td>
              <DropdownSelect
                :select-list="item.access.listData"
                :default-select="item.access.defaultSelect"
                class="!min-w-[16rem]"
              />
            </td>
            <td>
              <RoundButton
                component="button"
                color-type="lightOutlined"
                size="small"
                isIcon
              >
                <Icons icon-name="delete" :width="1.4" :height="1.4" />
                삭제</RoundButton
              >
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Pagination />
</template>

<script setup>
import DropdownSelect from '@/components/DropdownSelect/DropdownSelect.vue';
import Icons from '@/components/Icons/Icons.vue';
import Pagination from '@/components/Pagination/Pagination.vue';
import RoundButton from '@/components/RoundButton/RoundButton.vue';

const tableData = [
  {
    id: 1,
    no: 100,
    name: '홍길동',
    department: '판매역량강화팀',
    access: {
      id: 101,
      cate: '소유',
      defaultSelect: '소유',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 2,
    no: 99,
    name: '김길동',
    department: '판매역량강화팀',
    access: {
      id: 102,
      cate: '편집',
      defaultSelect: '편집',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 3,
    no: 98,
    name: '박길동',
    department: '판매역량강화팀',
    access: {
      id: 103,
      cate: '열람',
      defaultSelect: '열람',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 4,
    no: 97,
    name: '이길동',
    department: '판매역량강화팀',
    access: {
      id: 101,
      cate: '소유',
      defaultSelect: '소유',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 5,
    no: 96,
    name: '정길동',
    department: '판매역량강화팀',
    access: {
      id: 102,
      cate: '편집',
      defaultSelect: '편집',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 6,
    no: 95,
    name: '홍길동',
    department: '판매역량강화팀',
    access: {
      id: 103,
      cate: '열람',
      defaultSelect: '열람',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 7,
    no: 94,
    name: '김길동',
    department: '판매역량강화팀',
    access: {
      id: 101,
      cate: '소유',
      defaultSelect: '소유',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 8,
    no: 93,
    name: '박길동',
    department: '판매역량강화팀',
    access: {
      id: 102,
      cate: '편집',
      defaultSelect: '편집',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 9,
    no: 92,
    name: '이길동',
    department: '판매역량강화팀',
    access: {
      id: 103,
      cate: '열람',
      defaultSelect: '열람',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
  {
    id: 10,
    no: 91,
    name: '정길동',
    department: '판매역량강화팀',
    access: {
      id: 101,
      cate: '소유',
      defaultSelect: '소유',
      listData: [
        {
          id: 101,
          listName: '소유',
        },
        {
          id: 102,
          listName: '편집',
        },
        {
          id: 103,
          listName: '열람',
        },
      ],
    },
  },
];
</script>

<style scoped>
.manage_list-wrap {
  overflow: unset !important;
}

.manage_table-wrap {
  margin-top: 2.4rem;
  border-top: 1px solid var(--color-neutrals-black);
}
</style>
