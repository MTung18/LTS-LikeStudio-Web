<template>
  <ManageDetailWrap title="템플릿 관리">
    <ManageDetailView
      :comment-data="commentData"
      :info-data="infoData"
      :edit-cate="editCate"
      :record-cate-data="recordCateData"
      :img-data="generateImageData(imgData)"
    />
  </ManageDetailWrap>
</template>

<script setup>
import ManageDetailView from '@/components/ManageDetailView/ManageDetailView.vue';
import ManageDetailWrap from '@/components/ManageDetailWrap/ManageDetailWrap.vue';

const imgData = [
  {
    id: 1,
    name: 'img_poster_01.png',
  },
  {
    id: 2,
    name: 'img_poster_02.png',
  },
];

const infoData = [
  {
    id: 1,
    cate: '프로젝트 ID',
    detail: 'P99',
  },
  {
    id: 2,
    cate: '슬라이드 장수',
    detail: '2장',
  },
  {
    id: 3,
    cate: '규격',
    detail: '1080X1920',
  },
];
const editCate = [
  {
    id: 1,
    cate: '노출',
    type: 'switch',
  },
  {
    id: 2,
    cate: '용도',
    type: 'dropDown',
    usage: [
      {
        id: 1,
        listName: '브로셔',
      },
      {
        id: 2,
        listName: '브로셔',
      },
      {
        id: 3,
        listName: '브로셔',
      },
      {
        id: 4,
        listName: '브로셔',
      },
    ],
  },
  {
    id: 3,
    cate: '상품 서비스',
    type: 'dropDown',
    usage: [
      {
        id: 1,
        listName: '브로셔',
      },
      {
        id: 2,
        listName: '브로셔',
      },
      {
        id: 3,
        listName: '브로셔',
      },
      {
        id: 4,
        listName: '브로셔',
      },
    ],
  },
  {
    id: 4,
    cate: '제목',
    import: true,
    type: 'text',
    placeholder: '템플릿 제목',
  },
  {
    id: 5,
    cate: '프로젝트 실명',
    type: 'textarea',
    placeholder: '실명 입력',
  },
  {
    id: 6,
    cate: '태그',
    type: 'textarea',
    placeholder: '태그를 ,(쉼표) 구분해주세요.',
  },
];
const commentData = [
  {
    id: 1,
    author: '윤지연',
    position: '마케팅팀',
    time: '2023.08.14 10:56',
    comment: '저도 잘 쓰겠습니다. 감사해요!',
  },
  {
    id: 2,
    author: '윤지연',
    position: '마케팅팀',
    time: '2023.08.14 10:56',
    comment: '저도 잘 쓰겠습니다. 감사해요!',
  },
  {
    id: 3,
    author: '윤지연',
    position: '마케팅팀',
    time: '2023.08.14 10:56',
    comment: '저도 잘 쓰겠습니다. 감사해요!',
  },
];
const recordCateData = [
  {
    id: 1,
    cate: '슬라이드',
    detail: 'P99https://www.figma.com/file/=design',
    link: true,
  },
  {
    id: 2,
    cate: '추천 수',
    detail: '212,140',
  },
  {
    id: 3,
    cate: '사용 수',
    detail: '56,000',
  },
  {
    id: 4,
    cate: '수정일시/수정자',
    detail: '2023.02.12 15:34',
    detail1: '박미래 (판매역량강화팀)',
  },
  {
    id: 4,
    cate: '등록일시/등록자',
    detail: '2023.02.12 15:34',
    detail1: '박미래 (판매역량강화팀)',
  },
];
const generateImageData = (i) => {
  const currentFilePath = import.meta.url;
  const currentFolderPath = currentFilePath.substring(
    0,
    currentFilePath.lastIndexOf('/'),
  );

  return i.map((item) => ({
    id: item.id,
    name: `${currentFolderPath}/img/${item.name}`,
  }));
};
</script>
