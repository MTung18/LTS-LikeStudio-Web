<template>
  <div class="article">
    <CIBITitle id="ktSpaceCategory" class="pt-[8rem]"
      >KT 공간표기 카테고리 조합</CIBITitle
    >
    <CIBIDesc>
      KT 서비스 카테고리의 조합은 제시된 조합규정을 준수하여 사용한다. 서비스
      카테고리명은 KT서체 Medium, 색상은 KT D. Gray(K 85)를 기준으로 적용한다.
    </CIBIDesc>
    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">영문 조합</h4>
      <div class="grid grid-cols-2 mt-[2rem]">
        <figure>
          <img src="./img/img_list-01.webp" alt="kt submarine complex" />
        </figure>
        <figure>
          <img src="./img/img_list-02.webp" alt="kt submarine complex" />
        </figure>
      </div>
    </div>

    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">국문 조합</h4>
      <div class="grid grid-cols-2 mt-[2rem]">
        <figure>
          <img src="./img/img_list-03.webp" alt="kt 국제해저케이블 컴플렉스" />
        </figure>
        <figure>
          <img src="./img/img_list-04.webp" alt="kt 국제해저케이블 컴플렉스" />
        </figure>
      </div>
    </div>

    <div class="mt-[4rem]">
      <h4 class="text-ttl-s font-bold">예외 규정</h4>
      <p class="mt-[1rem] text-fz-m text-gray-gray-777">
        KT 애비뉴, KT 플라자의 경우 매장 경쟁력 특화를 위해 예외규정을 따른다.
        이외의 예외사항 필요시 담당부서와 협의한다.
      </p>
      <div class="grid grid-cols-2 mt-[2rem]">
        <figure>
          <img src="./img/img_list-05.webp" alt="kt avenue" />
        </figure>
        <figure>
          <img src="./img/img_list-06.webp" alt="kt plaza" />
        </figure>
      </div>
    </div>
  </div>
</template>
<script setup>
import CIBIDesc from '@/containers/ci-bi/CIBIDesc.vue';
import CIBITitle from '@/containers/ci-bi/CIBITitle.vue';
</script>

<style scoped></style>
<script setup></script>
