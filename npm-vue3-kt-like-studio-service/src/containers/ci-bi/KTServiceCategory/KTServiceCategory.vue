<template>
  <div class="article">
    <CIBITitle id="ktServiceCategory" class="pt-[8rem]"
      >KT 서비스 카테고리 조합</CIBITitle
    >
    <CIBIDesc>
      KT 워드마크는 KT의 시각적 이미지를 형성하는 매우 중요한 요소로서 정확한
      관리가 필요하며, 변형된 사용은 브랜드의 이미지를 왜곡시키거나
      커뮤니케이션의 효과를 악화시킬 우려가 있으므로 활용시 반드시 규정을
      지키도록 한다.
    </CIBIDesc>
    <div class="grid grid-cols-6 gap-[4rem] mt-[4rem]">
      <figure class="col-span-3 mr-[-2rem]">
        <img src="./img/img_list-01.png" alt="kt internet" />
      </figure>
      <figure class="col-span-3 ml-[-2rem]">
        <img src="./img/img_list-02.png" alt="kt internet" />
      </figure>
      <figure class="col-span-2">
        <img src="./img/img_list-03.png" alt="kt internet" />
      </figure>
      <figure class="col-span-2">
        <img src="./img/img_list-04.png" alt="kt wifi" />
      </figure>
      <figure class="col-span-2">
        <img src="./img/img_list-05.png" alt="kt mvno" />
      </figure>
      <figure class="col-span-2">
        <img src="./img/img_list-06.png" alt="kt membership" />
      </figure>
      <figure class="col-span-2">
        <img src="./img/img_list-07.png" alt="kt roaming" />
      </figure>
      <figure class="col-span-2">
        <img src="./img/img_list-08.png" alt="kt bizmeka" />
      </figure>
    </div>
  </div>
</template>

<script setup>
import CIBIDesc from '@/containers/ci-bi/CIBIDesc.vue';
import CIBITitle from '@/containers/ci-bi/CIBITitle.vue';
</script>

<style scoped></style>
